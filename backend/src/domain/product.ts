export type ProductRating = {
  rate: number;
  count: number;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
};

export type CategorySummary = {
  name: string;
  slug: string;
};

export function toCategorySlug(name: string): string {
  return encodeURIComponent(name);
}

export function fromCategorySlug(slug: string): string {
  return decodeURIComponent(slug);
}
