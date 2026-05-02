# ticktock — Timesheet management (Tentwenty front-end assessment)

A Next.js app with **dummy credential login**, **session-based auth (next-auth)**, and **in-memory mock APIs** for weekly timesheets and per-week task entries. The UI follows the provided dashboard flows: list view with filters + pagination, week detail with grouped tasks, and **add / edit / delete** tasks via modals.

## Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**
- **next-auth** (JWT session, Credentials provider)
- **TanStack Query** + **TanStack Table**
- **React Hook Form** + **Zod**
- **Vitest** + **Testing Library** (unit / component smoke tests)

## Getting started

### Prerequisites

- Node.js 20+ recommended
- npm (ships with Node)

### Install & run

```bash
npm install
cp .env.example .env.local   # set NEXTAUTH_SECRET (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You are redirected to `/login`.

### Environment variables

| Variable           | Purpose                                       |
| ------------------ | --------------------------------------------- |
| `NEXTAUTH_SECRET`  | Signing secret for JWT session cookies       |
| `NEXTAUTH_URL`     | Canonical site URL (e.g. `http://localhost:3000`) |

Example `.env.example` is included; generate a strong secret for production.

### Demo login (mock user)

| Email                       | Password       |
| --------------------------- | -------------- |
| `candidate@tentwenty.com`   | `password123` |

## Scripts

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `npm run dev`    | Dev server                     |
| `npm run build`  | Production build               |
| `npm run start`  | Start production server        |
| `npm run lint`   | ESLint                         |
| `npm run test`   | Vitest (watch)                 |
| `npm run test:run` | Vitest once (CI-friendly)    |

## Project structure (high level)

- `src/app/` — Routes (`/login`, `/dashboard`, `/dashboard/week/[weekId]`), layouts, providers
- `src/app/api/` — **Internal API routes** only (timesheets + next-auth); the browser never imports mock data directly
- `src/components/` — UI (header, tables, dialogs, shared shell/footer)
- `src/features/timesheets/` — Query keys, hooks, client fetch/mutations
- `src/lib/timesheets/` — Pure helpers (status rules, date copy, Zod schemas)
- `src/server/mock/` — Seed users/weeks/entries + in-memory store (dev/demo)
- `src/server/timesheets/` — Server-side query + mutation helpers used by route handlers

## Behaviour & assumptions

1. **Authentication** — Credentials are checked against mock users in memory (not a real database). Sessions use **next-auth** JWT strategy.
2. **Data** — Timesheet weeks and entries live in a **process-global in-memory store** so API routes behave like a backend during development. Refreshing the dev server resets data to seed values.
3. **Weekly status badges** — Derived from total logged hours vs a **40h target**:  
   `0h → Missing`, `>0 and <40 → Incomplete`, `≥40 → Completed`.
4. **Mutations** — Creating/updating/deleting entries goes through `POST`/`PUT`/`DELETE` under `/api/timesheets/...`; forms reuse the same Zod schema as the API for consistent validation.
5. **Deployment** — Set `NEXTAUTH_URL` and `NEXTAUTH_SECRET` in your host environment (e.g. Vercel). Use HTTPS in production.

## Testing

Tests live next to source (`*.test.ts`, `*.test.tsx`). They cover core domain helpers and a small UI smoke test for the status badge.

```bash
npm run test:run
```

## Time spent

_Approximate hours spent on this assessment: **\_\_\_** (fill before submitting)._

---

Good luck with the review.
