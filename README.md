# FutureCareer

FutureCareer is a smart job matching platform that connects job seekers with companies hiring through recruiters. Job seekers discover roles via Smart Tags; companies post jobs and review matched candidates.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo + pnpm workspaces |
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, Shadcn/ui |
| Backend | Next.js Server Actions, Supabase |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth |
| Realtime | Supabase Realtime |
| Storage | Supabase Storage |
| Validation | Zod |

## Project Structure

```
apps/
  web/              — Next.js 15 app (main product)
packages/
  ui/               — Shared UI components (Shadcn/ui + custom)
  supabase/         — Supabase client utilities (createClient, createServerClient)
  types/            — TypeScript types + Zod schemas
  config/           — Shared ESLint, TypeScript, Tailwind config
prototype/          — Approved UI prototypes (reference only)
specs/              — Product specs and design guide
brand/              — Logo and brand identity assets
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd FutureCareer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example apps/web/.env
   # Fill in your Supabase project URL, anon key, and service role key
   ```

4. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Copy your project URL and API keys into `.env`
   - Enable Row Level Security on all tables

5. **Start development**
   ```bash
   pnpm dev
   ```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all packages and apps |
| `pnpm type-check` | Run TypeScript checks across the monorepo |
| `pnpm test` | Run tests |
| `pnpm lint` | Lint all packages |

## Deployment

**Frontend** — Deploy `apps/web` to [Vercel](https://vercel.com). Set the following environment variables in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Database** — Supabase is fully managed. Ensure RLS is enabled on all tables before going to production. Never expose the `service_role` key to the client.
