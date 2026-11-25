import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { ProductTile } from "../components/ProductTile";
import type { Product } from "../types";

export function CategoryPage() {
  const { slug = "" } = useParams();
  const [name, setName] = useState("");
  const [topRated, setTopRated] = useState<Product[]>([]);
  const [additional, setAdditional] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .category(slug)
      .then((result) => {
        setName(result.category.name);
        setTopRated(result.topRated);
        setAdditional(result.additional);
      })
      .catch((err: Error) => setError(err.message));
  }, [slug]);

  if (error) {
    return <p className="banner">{error}</p>;
  }

  return (
    <section>
      <div className="hero">
        <h1>{name}</h1>
        <p>Top-rated products in this category, then the rest of the range.</p>
      </div>
      <h2>Top rated</h2>
      <div className="grid">
        {topRated.map((product) => (
          <ProductTile key={product.id} product={product} />
        ))}
      </div>
      <h2>More in this category</h2>
      {additional.length === 0 ? (
        <p className="muted">No additional products in this category.</p>
      ) : (
        <div className="grid">
          {additional.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
