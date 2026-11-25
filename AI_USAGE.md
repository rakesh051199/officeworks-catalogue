# AI usage

## Tools and models

- **Cursor** (Agent) with **Grok 4.6** for planning and implementation.
- The take-home PDF was read in-session and turned into an implementation plan before code was written.

## Agent instruction files

- [`AGENTS.md`](AGENTS.md) — constraints for later edits (no direct Fake Store calls from the client, ports for product/email, no secrets).

## Plan / spec

- Product catalogue PoC plan: React + Node, Docker Compose + Mailpit, `ProductSource` / `EmailProvider` ports, documented assumptions, tests on ranking/search/enquiry.

## Prompts or moments that shaped the solution

1. **“Review the PDF and prepare a plan”** — forced stack choice, time-box, and “foundation not throwaway” before any scaffolding.
2. **Stack confirmation** — React (TypeScript) + Node (TypeScript), local files only (no GitHub/PR in this pass).
3. **“Implement the plan as specified”** — build adapters, API, UI, tests, and docs without expanding into auth/cart/AWS.
4. **Ports over frameworks** — ranking/search live in domain functions so Fake Store can be deleted later.
5. **Mailpit instead of a SaaS mailer** — meets “no paid accounts” while still proving the sales-inbox acceptance criterion.

## Where the AI got something wrong (and how that was caught)

- The first search page treated “no products yet” as “no matches”, so reviewers would flash an empty state while Fake Store was still loading. Caught in a browser walkthrough; the page now shows “Searching…” until the API returns.
- Calling Fake Store from the browser would fail the brief. The frontend only uses `/api`; Docker nginx proxies to the API.
- Treating featured products as “first five in the API list” would ignore ratings. Ranking is an explicit, tested function.
- Using a real email API would force reviewers to create accounts. SMTP + Mailpit avoids that.
