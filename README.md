This is a Next.js project using the App Router.

## Setup

1. Copy `.env.example` to `.env.local` and fill in all values
2. Run `npm install`
3. Run `npm run db:push` to create the database tables
4. Run `npm run dev` to start development

## Docker (Full Stack)

```bash
# Copy and fill environment variables
cp .env.example .env

# Start all services (Postgres, Redis, Next.js, Nginx)
docker-compose up --build

# App available at: http://localhost
```

## Environment Variables

See `.env.example` for all required variables with documentation.

Key variables:
- `GEMINI_API_KEY` — Google AI Studio (free)
- `GOOGLE_CLIENT_ID/SECRET` — Google Cloud Console OAuth 2.0
- `CLOUDINARY_*` — Cloudinary free tier (25GB storage)
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Deploy migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed demo data |
