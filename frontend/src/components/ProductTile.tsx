import { Link } from "react-router-dom";
import type { Product } from "../types";

export function ProductTile({ product }: { product: Product }) {
  return (
    <Link className="tile" to={`/products/${product.id}`} data-testid="product-tile">
      <img src={product.image} alt={product.title} />
      <div className="tile-body">
        <h3>{product.title}</h3>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="rating">
          {product.rating.rate.toFixed(1)} · {product.rating.count} reviews
        </p>
      </div>
    </Link>
  );
}
