import { describe, expect, it } from "vitest";
import { FakeStoreProductSource, mapProduct } from "./FakeStoreProductSource.js";

const raw = {
  id: 1,
  title: "Test product",
  price: 12.5,
  description: "A product",
  category: "electronics",
  image: "https://example.com/p.png",
  rating: { rate: 4.2, count: 88 }
};

describe("mapProduct", () => {
  it("maps Fake Store fields onto the domain product", () => {
    expect(mapProduct(raw)).toEqual({
      id: 1,
      title: "Test product",
      price: 12.5,
      description: "A product",
      category: "electronics",
      image: "https://example.com/p.png",
      rating: { rate: 4.2, count: 88 }
    });
  });
});

describe("FakeStoreProductSource", () => {
  it("lists products through the HTTP client", async () => {
    const fetchFn: typeof fetch = async (input) => {
      expect(String(input)).toBe("https://fakestoreapi.com/products");
      return new Response(JSON.stringify([raw]), { status: 200 });
    };
    const source = new FakeStoreProductSource("https://fakestoreapi.com", fetchFn);
    const products = await source.listProducts();
    expect(products).toHaveLength(1);
    expect(products[0]?.title).toBe("Test product");
  });

  it("returns null for a 404 product", async () => {
    const fetchFn: typeof fetch = async () => new Response("Not found", { status: 404 });
    const source = new FakeStoreProductSource("https://fakestoreapi.com", fetchFn);
    await expect(source.getProduct(99)).resolves.toBeNull();
  });
});
