import type { Product } from "./product.js";

export function matchesSearchTerm(product: Product, term: string): boolean {
  const needle = term.trim().toLowerCase();
  if (!needle) {
    return false;
  }
  return (
    product.title.toLowerCase().includes(needle) ||
    product.description.toLowerCase().includes(needle)
  );
}

export function searchProducts(products: Product[], term: string): Product[] {
  return products.filter((product) => matchesSearchTerm(product, term));
}
