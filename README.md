# FutureCareer

Job matching platform connecting job seekers with companies through smart AI-powered tag matching.

## Setup

### Prerequisites
- Node.js 20+
- pnpm 9+
- Supabase account

### 1. Clone & Install
```bash
git clone https://github.com/your-org/futurecareer.git
cd futurecareer
pnpm install
```

### 2. Environment Variables
Copy `.env.example` to `apps/web/.env.local` and fill in the values:
```bash
cp apps/web/.env.example apps/web/.env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 3. Database Setup
Run migrations in the Supabase dashboard or via the Supabase CLI:
```bash
supabase db push
```

Generate TypeScript types after any schema changes:
```bash
supabase gen types typescript --project-id YOUR_PROJECT_ID > packages/supabase/src/database.types.ts
```

### 4. Development
```bash
pnpm dev          # Start all apps
pnpm build        # Build all apps
pnpm lint         # Lint all packages
pnpm test         # Run tests
```

The web app runs at `http://localhost:3000`.

## Architecture

```
futurecareer/
├── apps/
│   └── web/               # Next.js 15 App Router — frontend + backend
│       └── src/app/
│           ├── (public)/  # Public pages: home, search, job detail
│           ├── (auth)/    # Auth pages: login, register
│           ├── (company)/ # HR portal: dashboard, jobs, ATS, team
│           └── (seeker)/  # Seeker portal: profile, applications
├── packages/
│   ├── ui/                # Shared React component library (Shadcn/ui)
│   ├── types/             # Shared TypeScript types + Zod schemas
│   └── supabase/          # Supabase client factories
└── turbo.json             # Turborepo pipeline config
```

### Key Technologies
- **Frontend**: Next.js 15 App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Shadcn/ui
- **Backend**: Next.js Server Actions, Supabase
- **Database**: Supabase (PostgreSQL + RLS)
- **Auth**: Supabase Auth
- **Realtime**: Supabase Realtime
- **Storage**: Supabase Storage
- **Validation**: Zod

## Deployment

Deploy to Vercel:
1. Connect the repository in the Vercel dashboard
2. Set the root directory to `apps/web`
3. Add environment variables (see `.env.example`)
4. Deploy

Or use the Vercel CLI:
```bash
cd apps/web
vercel --prod
```
