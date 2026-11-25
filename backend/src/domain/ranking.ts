import type { Product } from "./product.js";

export function compareByRating(a: Product, b: Product): number {
  if (b.rating.rate !== a.rating.rate) {
    return b.rating.rate - a.rating.rate;
  }
  return b.rating.count - a.rating.count;
}

export function rankProducts(products: Product[]): Product[] {
  return [...products].sort(compareByRating);
}

export function takeTopRated(products: Product[], count: number): Product[] {
  return rankProducts(products).slice(0, count);
}

export function splitTopRated(
  products: Product[],
  topCount: number
): { topRated: Product[]; additional: Product[] } {
  const ranked = rankProducts(products);
  return {
    topRated: ranked.slice(0, topCount),
    additional: ranked.slice(topCount)
  };
}
