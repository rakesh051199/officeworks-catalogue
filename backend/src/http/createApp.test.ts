import request from "supertest";
import { describe, expect, it } from "vitest";
import { loadConfig } from "../config.js";
import type { Product } from "../domain/product.js";
import type { EmailProvider, EnquiryEmail } from "../ports/EmailProvider.js";
import type { ProductSource } from "../ports/ProductSource.js";
import { createApp } from "./createApp.js";

const products: Product[] = [
  {
    id: 1,
    title: "High rated backpack",
    price: 100,
    description: "Everyday backpack",
    category: "men's clothing",
    image: "https://example.com/1.png",
    rating: { rate: 4.9, count: 200 }
  },
  {
    id: 2,
    title: "SSD drive",
    price: 80,
    description: "Fast storage",
    category: "electronics",
    image: "https://example.com/2.png",
    rating: { rate: 4.7, count: 50 }
  },
  {
    id: 3,
    title: "USB cable",
    price: 10,
    description: "Cable",
    category: "electronics",
    image: "https://example.com/3.png",
    rating: { rate: 3.1, count: 10 }
  }
];

class MemoryProductSource implements ProductSource {
  constructor(private readonly items: Product[]) {}

  async listProducts() {
    return this.items;
  }

  async getProduct(id: number) {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async listCategories() {
    return [...new Set(this.items.map((item) => item.category))];
  }

  async listByCategory(category: string) {
    return this.items.filter((item) => item.category === category);
  }
}

class MemoryEmail implements EmailProvider {
  sent: EnquiryEmail[] = [];

  async send(email: EnquiryEmail) {
    this.sent.push(email);
  }
}

function buildApp() {
  const email = new MemoryEmail();
  const app = createApp({
    config: loadConfig({
      FEATURED_COUNT: "2",
      CATEGORY_TOP_RATED_COUNT: "1",
      SALES_INBOX: "sales@example.com",
      MAIL_FROM: "catalogue@example.com",
      CORS_ORIGIN: "http://localhost:8080"
    }),
    products: new MemoryProductSource(products),
    email
  });
  return { app, email };
}

describe("catalogue API", () => {
  it("returns featured products by rating", async () => {
    const { app } = buildApp();
    const response = await request(app).get("/api/products/featured");
    expect(response.status).toBe(200);
    expect(response.body.products.map((item: Product) => item.id)).toEqual([1, 2]);
  });

  it("splits category products into top rated and additional", async () => {
    const { app } = buildApp();
    const response = await request(app).get(
      `/api/categories/${encodeURIComponent("electronics")}`
    );
    expect(response.status).toBe(200);
    expect(response.body.topRated.map((item: Product) => item.id)).toEqual([2]);
    expect(response.body.additional.map((item: Product) => item.id)).toEqual([3]);
  });

  it("searches product text", async () => {
    const { app } = buildApp();
    const response = await request(app).get("/api/products").query({ q: "backpack" });
    expect(response.status).toBe(200);
    expect(response.body.products).toHaveLength(1);
    expect(response.body.products[0].id).toBe(1);
  });

  it("rejects an empty search term", async () => {
    const { app } = buildApp();
    const response = await request(app).get("/api/products").query({ q: "  " });
    expect(response.status).toBe(400);
  });

  it("returns a product by id", async () => {
    const { app } = buildApp();
    const response = await request(app).get("/api/products/2");
    expect(response.status).toBe(200);
    expect(response.body.product.title).toBe("SSD drive");
  });

  it("sends an enquiry email for a known product", async () => {
    const { app, email } = buildApp();
    const response = await request(app).post("/api/enquiries").send({
      productId: 2,
      name: "Ada",
      email: "ada@example.com",
      message: "Please contact me"
    });
    expect(response.status).toBe(201);
    expect(email.sent).toHaveLength(1);
    expect(email.sent[0]?.subject).toContain("SSD drive");
    expect(email.sent[0]?.to).toBe("sales@example.com");
  });

  it("rejects an enquiry with an invalid email", async () => {
    const { app, email } = buildApp();
    const response = await request(app).post("/api/enquiries").send({
      productId: 2,
      name: "Ada",
      email: "nope",
      message: "Hello"
    });
    expect(response.status).toBe(400);
    expect(email.sent).toHaveLength(0);
  });
});
