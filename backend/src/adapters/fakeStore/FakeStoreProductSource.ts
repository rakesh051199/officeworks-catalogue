import type { Product } from "../../domain/product.js";
import type { ProductSource } from "../../ports/ProductSource.js";

type FakeStoreProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
};

export class FakeStoreError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message);
    this.name = "FakeStoreError";
  }
}

export class FakeStoreProductSource implements ProductSource {
  constructor(
    private readonly baseUrl: string,
    private readonly fetchFn: typeof fetch = fetch
  ) {}

  async listProducts(): Promise<Product[]> {
    const payload = await this.getJson<FakeStoreProduct[]>("/products");
    return payload.map(mapProduct);
  }

  async getProduct(id: number): Promise<Product | null> {
    try {
      const payload = await this.getJson<FakeStoreProduct | "">(`/products/${id}`);
      if (!payload) {
        return null;
      }
      return mapProduct(payload);
    } catch (error) {
      if (error instanceof FakeStoreError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async listCategories(): Promise<string[]> {
    return this.getJson<string[]>("/products/categories");
  }

  async listByCategory(category: string): Promise<Product[]> {
    const encoded = encodeURIComponent(category);
    const payload = await this.getJson<FakeStoreProduct[]>(
      `/products/category/${encoded}`
    );
    return payload.map(mapProduct);
  }

  private async getJson<T>(path: string): Promise<T> {
    const response = await this.fetchFn(`${this.baseUrl}${path}`);
    if (!response.ok) {
      throw new FakeStoreError(
        `Fake Store request failed: ${response.status} ${path}`,
        response.status
      );
    }
    return (await response.json()) as T;
  }
}

export function mapProduct(raw: FakeStoreProduct): Product {
  return {
    id: raw.id,
    title: raw.title,
    price: raw.price,
    description: raw.description,
    category: raw.category,
    image: raw.image,
    rating: {
      rate: raw.rating?.rate ?? 0,
      count: raw.rating?.count ?? 0
    }
  };
}
