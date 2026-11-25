import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { ProductTile } from "../components/ProductTile";
import type { CategorySummary, Product } from "../types";

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.featured(), api.categories()])
      .then(([featuredResult, categoryResult]) => {
        setFeatured(featuredResult.products);
        setCategories(categoryResult.categories);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return <p className="banner">{error}</p>;
  }

  return (
    <section>
      <div className="hero">
        <h1>Featured products</h1>
        <p>Five top-rated products from the catalogue.</p>
      </div>
      <nav className="categories" aria-label="Categories">
        {categories.map((category) => (
          <Link className="chip" key={category.slug} to={`/categories/${category.slug}`}>
            {category.name}
          </Link>
        ))}
      </nav>
      <div className="grid">
        {featured.map((product) => (
          <ProductTile key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
