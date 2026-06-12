<div align="center">

# 🪨 Briefing — AI Tile Visualiser

**Let your customers see it before they buy it.**

Upload a room photo. Upload a tile. Watch the room transform — instantly, realistically, powered by Gemini AI.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docs.docker.com/compose/)
[![License](https://img.shields.io/badge/License-Apache%202.0-green)](./LICENSE)

</div>

---

## The Problem

Tile retailers lose sales every day because customers can't visualise. They pick a tile from a showroom floor, take it home, hold it against the wall, and say "I'm not sure." Then they don't buy.

Briefing fixes that. Two uploads. One click. The room transforms.

---

## Demo Flow

```
1. Upload room photo      →  your bathroom, kitchen, living room
2. Upload tile image      →  from catalogue, phone camera, or URL
3. Click "Generate"       →  Gemini AI applies the tile to your room
4. Compare               →  before/after slider, share with client
```

No design skills required. No guessing. No returns.

---

## Features

- **AI-powered visualisation** — Gemini 2.0 Flash intelligently applies tile textures to room surfaces with realistic lighting and perspective
- **Before/After slider** — `react-compare-slider` lets customers drag between original and visualised result
- **Drag-and-drop uploads** — smooth UX with `react-dropzone` for both room and tile images
- **Cloud image storage** — Cloudinary handles uploads, optimisation, and CDN delivery
- **Authentication** — NextAuth.js with Google OAuth and credentials provider
- **Rate limiting** — per-user generation limits via Redis (Upstash-compatible)
- **Database history** — every visualisation saved and retrievable via Prisma + PostgreSQL
- **Zero-friction local setup** — SQLite mode for dev (no Docker needed), PostgreSQL for production
- **Production-ready Docker stack** — Next.js + PostgreSQL + Redis + Nginx, one command

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.7 |
| AI | Google Gemini 2.0 Flash (`@google/genai`) |
| Auth | NextAuth.js v4 + Google OAuth |
| ORM | Prisma 5 |
| Database | PostgreSQL 16 (prod) / SQLite (dev) |
| Cache / Rate Limiting | Redis 7 / Upstash |
| Storage | Cloudinary |
| UI | Tailwind CSS + Radix UI + Framer Motion |
| Image Comparison | react-compare-slider |
| Reverse Proxy | Nginx 1.25 |
| Containerisation | Docker + Docker Compose |

---

## Getting Started

### Option A — Local Dev (Fastest, SQLite)

```bash
# 1. Clone
git clone https://github.com/SGSShaurya5497/Briefing.git
cd Briefing

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local — only NEXTAUTH_SECRET and GEMINI_API_KEY required for local

# 4. Push DB schema
npm run db:push

# 5. Start
npm run dev
```

App live at `http://localhost:3000`

### Option B — Full Docker Stack (Production-parity)

```bash
# 1. Clone
git clone https://github.com/SGSShaurya5497/Briefing.git
cd Briefing

# 2. Configure environment
cp .env.example .env
# Fill in all values (see Environment Variables section below)

# 3. Launch everything
docker-compose up --build
```

Spins up: **Nginx** (port 80/443) → **Next.js** (port 3000) → **PostgreSQL** (port 5432) + **Redis** (port 6379)

App live at `http://localhost`

---

## Environment Variables

Copy `.env.example` and fill in the values:

```env
# Next Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=                    # openssl rand -base64 32

# Database
DATABASE_URL=file:./dev.db          # SQLite for dev
# DATABASE_URL=postgresql://...     # PostgreSQL for prod

# Gemini — get free key at aistudio.google.com
GEMINI_API_KEY=

# Google OAuth (optional for dev, required for prod)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cloudinary (optional for dev, required for prod)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Rate Limiting (optional — defaults apply)
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW_HOURS=1

# Redis (Docker uses local; prod can use Upstash)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

> **Minimum for local dev:** `NEXTAUTH_SECRET` + `GEMINI_API_KEY`. Everything else has safe defaults.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:push` | Push schema to DB (dev / SQLite) |
| `npm run db:migrate` | Deploy Prisma migrations (prod) |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:seed` | Seed demo data |

---

## Project Structure

```
Briefing/
├── app/                  # Next.js App Router — pages & API routes
├── components/           # Reusable UI components
├── lib/                  # Auth, DB client, Gemini helper, storage, rate-limit
├── prisma/               # Schema + migrations + seed
├── public/               # Static assets
├── nginx/                # nginx.conf + SSL cert mount point
├── Dockerfile            # Multi-stage Next.js build
└── docker-compose.yml    # Full stack orchestration
```

---

## Architecture

```
                    ┌─────────────┐
     Browser  ───▶  │    Nginx    │  (reverse proxy, SSL termination)
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Next.js 14 │  (SSR + API Routes)
                    └──┬──────┬───┘
                       │      │
           ┌───────────▼─┐  ┌─▼──────────┐
           │  PostgreSQL  │  │   Redis    │  (rate limiting)
           │  (Prisma)    │  └─▬──────────┘
           └─────────────┘
                       │
              ┌────────▼────────┐
              │   Gemini API    │  (image generation)
              └─────────────────┘
                       │
              ┌────────▼────────┐
              │   Cloudinary    │  (image storage + CDN)
              └─────────────────┘
```

---

## Production Deployment

**Upgrade checklist before going live:**

- [ ] Switch `DATABASE_URL` from SQLite to PostgreSQL in `.env` and `prisma/schema.prisma` (`provider = "postgresql"`)
- [ ] Run `npm run db:migrate` instead of `db:push`
- [ ] Set `NEXTAUTH_URL` to your actual domain
- [ ] Mount SSL certs at `nginx/ssl/` and uncomment HTTPS block in `nginx/nginx.conf`
- [ ] Set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` for OAuth
- [ ] Configure Cloudinary for production image storage
- [ ] Set `UPSTASH_REDIS_REST_URL` / `TOKEN` if using Upstash instead of local Redis
- [ ] Tighten `RATE_LIMIT_MAX` to prevent API cost overruns

---

## Roadmap

- [ ] QR code on physical tiles → auto-load tile image on in-store tablet
- [ ] Multi-surface selection (floor + walls separately)
- [ ] Tile catalogue with SKU search
- [ ] Shareable visualisation links for customers
- [ ] Batch generation for sales reps
- [ ] White-label per store branding

---

## License

Apache 2.0 — see [LICENSE](./LICENSE)

---

<div align="center">

Built with 🔥 by [Shaurya](https://github.com/SGSShaurya5497) · Tessella · Delhi, India

*Actively piloting in Gurgaon tile stores — ₹2,000/store/month*

</div>
