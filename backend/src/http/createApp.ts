import cors from "cors";
import express, { type Express } from "express";
import type { AppConfig } from "../config.js";
import {
  fromCategorySlug,
  toCategorySlug,
  type CategorySummary
} from "../domain/product.js";
import { splitTopRated, takeTopRated } from "../domain/ranking.js";
import { parseEnquiry } from "../domain/enquiry.js";
import { searchProducts } from "../domain/search.js";
import type { EmailProvider } from "../ports/EmailProvider.js";
import type { ProductSource } from "../ports/ProductSource.js";
import { errorHandler, HttpError } from "./errors.js";

export type AppDeps = {
  config: AppConfig;
  products: ProductSource;
  email: EmailProvider;
};

export function createApp(deps: AppDeps): Express {
  const app = express();
  app.use(cors({ origin: deps.config.corsOrigin }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/categories", async (_req, res, next) => {
    try {
      const names = await deps.products.listCategories();
      const categories: CategorySummary[] = names.map((name) => ({
        name,
        slug: toCategorySlug(name)
      }));
      res.json({ categories });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/categories/:slug", async (req, res, next) => {
    try {
      const name = fromCategorySlug(req.params.slug);
      const products = await deps.products.listByCategory(name);
      if (products.length === 0) {
        throw new HttpError(404, "Category not found");
      }
      const { topRated, additional } = splitTopRated(
        products,
        deps.config.categoryTopRatedCount
      );
      res.json({
        category: { name, slug: toCategorySlug(name) },
        topRated,
        additional
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products/featured", async (_req, res, next) => {
    try {
      const products = await deps.products.listProducts();
      res.json({ products: takeTopRated(products, deps.config.featuredCount) });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products", async (req, res, next) => {
    try {
      const q = typeof req.query.q === "string" ? req.query.q : "";
      if (!q.trim()) {
        throw new HttpError(400, "Search term is required");
      }
      const products = await deps.products.listProducts();
      res.json({ products: searchProducts(products, q), query: q.trim() });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        throw new HttpError(400, "Invalid product id");
      }
      const product = await deps.products.getProduct(id);
      if (!product) {
        throw new HttpError(404, "Product not found");
      }
      res.json({ product });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/enquiries", async (req, res, next) => {
    try {
      const enquiry = parseEnquiry(req.body);
      const product = await deps.products.getProduct(enquiry.productId);
      if (!product) {
        throw new HttpError(404, "Product not found");
      }

      const phoneLine = enquiry.phone
        ? `Phone: ${enquiry.phone}`
        : "Phone: (not provided)";

      await deps.email.send({
        to: deps.config.salesInbox,
        from: deps.config.mailFrom,
        subject: `Product enquiry: ${product.title}`,
        text: [
          `A customer has enquired about product #${product.id}: ${product.title}`,
          "",
          `Name: ${enquiry.name}`,
          `Email: ${enquiry.email}`,
          phoneLine,
          "",
          "Message:",
          enquiry.message
        ].join("\n")
      });

      res.status(201).json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  app.use(errorHandler);
  return app;
}
