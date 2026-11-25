import { describe, expect, it } from "vitest";
import type { Product } from "./product.js";
import { splitTopRated, takeTopRated } from "./ranking.js";

function product(partial: Partial<Product> & { id: number }): Product {
  return {
    title: `Product ${partial.id}`,
    price: 10,
    description: "desc",
    category: "electronics",
    image: "https://example.com/p.png",
    rating: { rate: 0, count: 0 },
    ...partial
  };
}

describe("ranking", () => {
  it("orders by rating then by review count", () => {
    const products = [
      product({ id: 1, rating: { rate: 4.1, count: 10 } }),
      product({ id: 2, rating: { rate: 4.8, count: 2 } }),
      product({ id: 3, rating: { rate: 4.8, count: 50 } })
    ];

    expect(takeTopRated(products, 2).map((item) => item.id)).toEqual([3, 2]);
  });

  it("splits top rated from remaining products", () => {
    const products = [
      product({ id: 1, rating: { rate: 5, count: 1 } }),
      product({ id: 2, rating: { rate: 4, count: 1 } }),
      product({ id: 3, rating: { rate: 3, count: 1 } }),
      product({ id: 4, rating: { rate: 2, count: 1 } })
    ];

    const result = splitTopRated(products, 3);
    expect(result.topRated.map((item) => item.id)).toEqual([1, 2, 3]);
    expect(result.additional.map((item) => item.id)).toEqual([4]);
  });
});
