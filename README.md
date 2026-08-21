# Future Home Platform

A private digital residence experience for MJF Construction & Development —
built so a remote luxury homeowner can feel present during the construction
of their home. This is **Phase 1 (V1)**: the Kendall Hill pilot, built on an
architecture designed to support many homes and many builders later.

> "Even though I am thousands of miles away, I am still part of creating my
> dream home."

## Stack

- **Next.js 15** (App Router, React 19, Server Components + Server Actions)
- **TypeScript**, **Tailwind CSS** (custom MJF-inspired design tokens)
- **Prisma** + **SQLite** for a real, file-backed database with zero external
  setup. Every model is provider-agnostic — switch `datasource db.provider`
  to `postgresql` and set `DATABASE_URL` to point at Supabase/Neon/Vercel
  Postgres for production with no schema changes.
- **Custom auth**: bcrypt-hashed passwords + signed JWT session cookies
  (`jose`), verified in edge middleware. Two real, separate roles — `BUILDER`
  (MJF team) and `OWNER` (homeowner) — not a shared password or a client-side
  toggle.
- **Framer Motion** for the signature progress-bar reveal and the gold
  "complete" shimmer the founder specifically responded to.

## Why this stack

The brief's one hard constraint was "real, independent, deployable" — not a
specific vendor. Next.js + Prisma gets there without requiring provisioned
cloud credentials just to run: `npm install && npm run db:push && npm run
db:seed && npm run dev` gives you a fully working app with a real database on
disk. Swapping the Prisma datasource to hosted Postgres and deploying to
Vercel (or any Node host) is a config change, not a rewrite.

## Data model — home-centric, not project-centric

Per the brief's core architectural principle, **Home** is the central object
everything else attaches to — not a generic `project → tasks → documents`
tree. See `prisma/schema.prisma`:

```
Builder → Home → Trade → TradeSubcategory
                → Phase (construction timeline)
                → StoryUpdate → Media
                → PlanDocument
                → Decision → DecisionOption
                → Document (Home Bible)
                → TimeCapsuleEntry (Home Memory)
                → Message (Ask MJF)
```

Nothing is hard-coded to Kendall Hill in the application code — it's all seed
data (`prisma/seed.ts`). Adding a second home for a second builder is a new
row, not a new code path. `src/lib/current-home.ts` is the single place that
resolves "which home is this user looking at," so a future multi-project
switcher only touches one file.

## Screens (V1 scope)

Deliberately **not** a full construction ERP — this is Phase 1 of the
roadmap in the brief (Home Bible/AI, Digital Twin/AR, Maintenance, Community
are explicitly later phases). What's built:

1. **Residence** (`/`) — hero, overall progress, current phase, This Week
   teaser, trade snapshot, the Pool called out prominently because it's
   personally important to the owners, The Next Chapter.
2. **The Home Story** (`/story`) — weekly personal narrative updates with a
   "What We See" builder's-eye panel and curated media (photo/video/drone).
3. **Build Progress** (`/progress`) — every trade with plain-language
   explanations, subcategory breakdowns, and the signature gold-shimmer
   completion animation.
4. **Explore Your Home** (`/plans`) — plan switcher (Site/First Floor/Lower
   Floor/Pool Room/Architectural) with drag-to-pan, zoom controls.
5. **Design Studio** (`/design-studio`) — the Design Packet: pending
   approvals, and the real Kendall Hill retaining-wall bid comparison
   (Canepa vs. Green Vine) as a first-class side-by-side, not two file links.
6. **Timeline** (`/timeline`) — the 18-phase construction journey.
7. **Home Memory** (`/home-memory`) — the Digital Time Capsule foundation
   ("Before The Walls Close").
8. **Home Bible** (`/home-bible`) — permanent record foundation (Plans,
   Selections, Equipment, Warranty, Vendor, Maintenance categories).
9. **Ask MJF** (`/ask-mjf`) — two-way messaging kept with the home's
   permanent record instead of living in texts/email.

Every builder-editable field (trade %, story publishing, decision options,
plan drawings, phase status, timeline, Home Bible/Memory entries) updates
live for the homeowner — gated by the real `BUILDER` role, via Server
Actions in `src/lib/actions/`.

## Running it

```bash
npm install
npm run db:push     # creates prisma/dev.db from the schema
npm run db:seed      # loads the real Kendall Hill pilot data
npm run dev
```

Visit `http://localhost:3000`.

**Seeded logins:**

| Role    | Email                         | Password         |
|---------|--------------------------------|------------------|
| Builder | builder@mjfconstruction.net   | mjfbuilder2026   |
| Owner   | owner@kendallhill.com          | kendallhill2026  |

`npm run db:reset` wipes and reseeds from scratch.

## Environment variables

Copy `.env.example` to `.env` (already present with dev defaults):

- `DATABASE_URL` — `file:./dev.db` locally; a Postgres connection string in
  production.
- `SESSION_SECRET` — a long random string signing session cookies. **Replace
  the committed dev value before deploying anywhere real.**

## Honest gaps (by design, not oversight)

- No real photography, drone footage, or plan drawings are bundled — the
  brief was explicit about not inventing placeholder assets. Media and plan
  tiles render an elegant placeholder until a builder attaches a real
  `fileUrl`; file *storage* itself (S3/Supabase Storage/etc.) is not wired up
  yet — the `Media`/`Document`/`PlanDocument` models already have the
  `url`/`fileUrl` fields ready for it.
- Room-level plan navigation, AI, Digital Twin, AR, and Maintenance
  Intelligence are explicitly Phase 2/3 in the brief and are only
  represented here as "on the horizon" teasers so the UI sets the right
  expectation without faking functionality.
