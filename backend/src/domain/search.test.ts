import { describe, expect, it } from "vitest";
import type { Product } from "./product.js";
import { searchProducts } from "./search.js";

const backpack: Product = {
  id: 1,
  title: "Fjallraven Backpack",
  price: 109,
  description: "Your perfect pack for everyday use",
  category: "men's clothing",
  image: "https://example.com/p.png",
  rating: { rate: 3.9, count: 120 }
};

describe("searchProducts", () => {
  it("matches title case-insensitively", () => {
    expect(searchProducts([backpack], "BACKPACK")).toEqual([backpack]);
  });

  it("matches description text", () => {
    expect(searchProducts([backpack], "everyday")).toEqual([backpack]);
  });

  it("returns only matching products", () => {
    const other: Product = { ...backpack, id: 2, title: "Gold ring", description: "jewellery" };
    expect(searchProducts([backpack, other], "pack")).toEqual([backpack]);
  });
});
