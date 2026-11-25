import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { ProductTile } from "../components/ProductTile";
import type { Product } from "../types";

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q.trim()) {
      setError("Enter a search term");
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .search(q)
      .then((result) => {
        setProducts(result.products);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <section>
      <div className="hero">
        <h1>Search results</h1>
        <p>Showing products matching “{q}”.</p>
      </div>
      {error ? <p className="banner">{error}</p> : null}
      {loading ? (
        <p className="muted">Searching…</p>
      ) : !error && products.length === 0 ? (
        <p className="muted">No products matched that search.</p>
      ) : (
        <div className="grid">
          {products.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
