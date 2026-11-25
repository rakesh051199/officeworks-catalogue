import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { toCategorySlug } from "../lib/category";
import type { Product } from "../types";

export function ProductPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .product(id)
      .then((result) => setProduct(result.product))
      .catch((err: Error) => setError(err.message));
  }, [id]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!product) {
      return;
    }
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setFormError(null);
    try {
      await api.enquire({
        productId: product.id,
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? "") || undefined,
        message: String(form.get("message") ?? "")
      });
      navigate(`/products/${product.id}/thank-you`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not send enquiry");
    } finally {
      setSubmitting(false);
    }
  }

  if (error) {
    return <p className="banner">{error}</p>;
  }
  if (!product) {
    return <p className="muted">Loading product…</p>;
  }

  return (
    <article className="product-layout">
      <img src={product.image} alt={product.title} />
      <div>
        <p className="muted">
          <Link to={`/categories/${toCategorySlug(product.category)}`}>
            {product.category}
          </Link>
        </p>
        <h1>{product.title}</h1>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="rating">
          Rated {product.rating.rate.toFixed(1)} from {product.rating.count} reviews
        </p>
        <p>{product.description}</p>

        <form className="enquiry" onSubmit={onSubmit}>
          <h2>Enquire</h2>
          {formError ? <p className="banner">{formError}</p> : null}
          <label>
            Name
            <input name="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Phone
            <input name="phone" />
          </label>
          <label>
            Message
            <textarea name="message" rows={4} required />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Enquire"}
          </button>
        </form>
      </div>
    </article>
  );
}
