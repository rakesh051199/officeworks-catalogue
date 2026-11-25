# Product catalogue PoC

A small catalogue for browsing products, searching, and sending a sales enquiry. Built as a foundation that can outgrow Fake Store and Mailpit.

## Stack choice

- **Client:** React + TypeScript (Vite)
- **Backend:** Node.js + TypeScript (Express)

TypeScript is the brief’s preferred option on both sides. A web client plus Docker Compose keeps reviewer setup to one or two commands. Express stays thin: HTTP in, domain logic and adapters out.

## Run locally (Docker)

Requires Docker Desktop.

```bash
cp .env.example .env
docker compose up --build
```

Then open:

- App: http://localhost:8080
- API: http://localhost:3001/health
- Mailpit (enquiry emails): http://localhost:8025

Walk the flow: home featured products → category → search → product → Enquire. Submit the form, then confirm the sales email in Mailpit.

## Run locally without Docker

Terminal 1: Mailpit (`brew install mailpit && mailpit`, or another SMTP listener on port 1025).

```bash
cp .env.example .env
# For local Vite, point SMTP at localhost and CORS at the Vite origin:
# SMTP_HOST=localhost
# CORS_ORIGIN=http://localhost:5173
```

```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

Frontend: http://localhost:5173 (Vite proxies `/api` to the backend).

## Tests

```bash
cd backend && npm test
cd frontend && npm test
```

## Time spent

Fill this in before you submit (planning / building / testing / reviewing).

Planning: ~20 minutes  
Building: ~2 hours  
Testing and review: ~40 minutes  
**Total: ~3 hours**
