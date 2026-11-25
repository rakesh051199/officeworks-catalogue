import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { backpack } from "./test/fixtures";

function jsonResponse(data: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" }
    })
  );
}

describe("catalogue UI", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith("/products/featured")) {
          return jsonResponse({ products: [backpack] });
        }
        if (url.endsWith("/categories")) {
          return jsonResponse({
            categories: [{ name: "men's clothing", slug: encodeURIComponent("men's clothing") }]
          });
        }
        if (url.includes("/products?q=")) {
          return jsonResponse({ products: [backpack], query: "backpack" });
        }
        if (url.endsWith("/products/1")) {
          return jsonResponse({ product: backpack });
        }
        if (url.endsWith("/enquiries") && init?.method === "POST") {
          return jsonResponse({ ok: true }, 201);
        }
        return jsonResponse({ error: "not mocked" }, 404);
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("navigates from a product tile to the product page", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole("link", { name: /fjallraven backpack/i }));
    expect(await screen.findByRole("heading", { name: /fjallraven backpack/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enquire/i })).toBeInTheDocument();
  });

  it("submits a search from the search bar", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/search products/i), "backpack");
    await user.click(screen.getByRole("button", { name: /search/i }));
    expect(await screen.findByText(/showing products matching/i)).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: /fjallraven backpack/i })).toBeInTheDocument();
  });

  it("shows a thank you message after an enquiry", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/products/1"]}>
        <App />
      </MemoryRouter>
    );

    await screen.findByRole("heading", { name: /fjallraven backpack/i });
    await user.type(screen.getByLabelText(/^name$/i), "Ada");
    await user.type(screen.getByLabelText(/^email$/i), "ada@example.com");
    await user.type(screen.getByLabelText(/^message$/i), "Please call me");
    await user.click(screen.getByRole("button", { name: /enquire/i }));

    expect(await screen.findByRole("heading", { name: /thank you/i })).toBeInTheDocument();
  });
});
