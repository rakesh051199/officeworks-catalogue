import type { CategorySummary, Product } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  const body = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new Error(body.error ?? `Request failed (${response.status})`);
  }
  return body;
}

export const api = {
  featured: () => request<{ products: Product[] }>("/products/featured"),
  categories: () => request<{ categories: CategorySummary[] }>("/categories"),
  category: (slug: string) =>
    request<{
      category: CategorySummary;
      topRated: Product[];
      additional: Product[];
    }>(`/categories/${slug}`),
  search: (q: string) =>
    request<{ products: Product[]; query: string }>(
      `/products?q=${encodeURIComponent(q)}`
    ),
  product: (id: string) => request<{ product: Product }>(`/products/${id}`),
  enquire: (payload: {
    productId: number;
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) => request<{ ok: boolean }>("/enquiries", {
    method: "POST",
    body: JSON.stringify(payload)
  })
};
