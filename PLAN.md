# FutureCareer — Monorepo Scaffold Plan

**Objective:** Initialize Turborepo + pnpm monorepo, define all shared packages, wire Supabase schema, and verify the build compiles clean before any page implementation begins.

**Decision Log:**
- `user_type` enum = `seeker | company` (per CLAUDE.md trigger example)
- Supabase subpath exports (`./client`, `./server`, `./middleware`) to prevent `next/headers` pulling into client bundles
- Service role admin client isolated in `admin.ts` — only for signup resource creation (no session yet)
- `next.config.ts` sets `serverActions.bodySizeLimit = "30mb"` — default 1MB breaks resume/logo uploads
- Tags in dedicated `tags` table with `type` enum — enables autocomplete API without full-text search
- Prescreen answers stored as `jsonb` in `applications` — flexible, avoids EAV anti-pattern
- Realtime enabled only on `applications` — ATS Kanban board is the only live-update surface
- framer-motion kept in production (client-side dep, compatible with Next.js App Router via `'use client'`)
- RLS `WITH CHECK` explicit on every INSERT — silent failure without it
- No `.sql` migration files — MCP handles schema directly

---

## Phase 0 — Monorepo Root

| File | Purpose |
|------|---------|
| `package.json` | Root workspace config — scripts: dev, build, lint, type-check |
| `pnpm-workspace.yaml` | Declares `apps/*` and `packages/*` |
| `turbo.json` | Pipeline: build depends on `^build`; dev, lint, type-check defined |
| `.npmrc` | `shamefully-hoist=false`, `strict-peer-dependencies=false` |
| `.gitignore` additions | `node_modules`, `.turbo`, `.next`, `dist`, `*.tsbuildinfo` |

---

## Phase 1 — packages/config

| File | Purpose |
|------|---------|
| `packages/config/package.json` | Package manifest — no runtime deps |
| `packages/config/tsconfig/base.json` | Strict TS base — `strict: true`, `moduleResolution: bundler` |
| `packages/config/tsconfig/nextjs.json` | Extends base, adds Next.js plugin, JSX preserve |
| `packages/config/tsconfig/react-library.json` | Extends base, JSX react-jsx for UI packages |
| `packages/config/eslint/base.js` | Base ESLint — typescript-eslint, import rules |
| `packages/config/eslint/nextjs.js` | Extends base + next/core-web-vitals |
| `packages/config/eslint/react-internal.js` | Extends base for UI packages |
| `packages/config/tailwind/tailwind.config.ts` | Design tokens: colors, fonts, spacing, radius from design-system.md |

**Design tokens (from design-system.md + prototype theme.css):**
```
primary: #9A52E4   secondary: #F1CB46   accent: #E73A77
foreground: #442767   muted: #F8F9FA   muted-foreground: #6B7280
success: #46E08C   destructive: #ED536F   warning: #F08D5F   info: #276DC0
border: #E5E7EB   radius: 0.75rem
fonts: Poppins (heading-en), Kanit (heading-th), Sarabun (body)
```

---

## Phase 2 — packages/types

| File | Purpose |
|------|---------|
| `packages/types/package.json` | Manifest — depends on zod |
| `packages/types/tsconfig.json` | Extends react-library preset |
| `packages/types/src/user.types.ts` | `UserType`, `Profile`, `UserWithProfile` |
| `packages/types/src/company.types.ts` | `Company`, `CompanyMember`, `MemberRole`, `CompanyPost` |
| `packages/types/src/job.types.ts` | `Job`, `JobType`, `JobLevel`, `JobStatus`, `Tag`, `TagType`, `PrescreenQuestion`, `PrescreenType` |
| `packages/types/src/application.types.ts` | `Application`, `ApplicationStatus`, `ContactViewLog` |
| `packages/types/src/schemas/auth.schema.ts` | Zod: `candidateRegisterSchema`, `companyRegisterSchema`, `loginSchema` |
| `packages/types/src/schemas/profile.schema.ts` | Zod: `updateProfileSchema` |
| `packages/types/src/schemas/company.schema.ts` | Zod: `updateCompanySchema`, `createPostSchema`, `inviteMemberSchema` |
| `packages/types/src/schemas/job.schema.ts` | Zod: `createJobSchema`, `updateJobSchema`, `updateJobStatusSchema` |
| `packages/types/src/schemas/application.schema.ts` | Zod: `submitApplicationSchema`, `updateApplicationStatusSchema` |
| `packages/types/src/index.ts` | Re-exports all types and schemas |

---

## Phase 3 — Supabase Schema (via MCP — no .sql files)

### 3a. Enums
```sql
user_type:          seeker | company
member_role:        admin | recruiter
job_type:           full_time | part_time | contract | internship
job_level:          junior | mid | senior | lead
job_status:         open | closed
application_status: new | reviewing | interview | hired | rejected
prescreen_type:     text | choice
tag_type:           skill | industry | level | location | position
```

### 3b. Tables

| Table | Key Columns |
|-------|------------|
| `profiles` | `id` (uuid FK auth.users), `user_type`, `first_name`, `last_name`, `bio`, `phone`, `avatar_url`, `resume_url`, `created_at` |
| `companies` | `id` (uuid PK), `name`, `logo_url`, `short_bio`, `full_bio`, `industry`, `size`, `created_at` |
| `company_members` | `id`, `company_id` FK companies, `user_id` FK auth.users, `role` member_role, `invited_by`, `created_at` — UNIQUE(company_id, user_id) |
| `company_posts` | `id`, `company_id` FK, `content`, `image_url`, `created_by`, `created_at` |
| `tags` | `id`, `name`, `type` tag_type — UNIQUE(name, type) |
| `jobs` | `id`, `company_id` FK, `title`, `description`, `spec`, `qualifications` text[], `location`, `job_type`, `level` job_level, `salary`, `status` job_status DEFAULT open, `created_by` FK auth.users, `created_at` |
| `job_tags` | `job_id` FK, `tag_id` FK — PK(job_id, tag_id) |
| `prescreen_questions` | `id`, `job_id` FK, `order_index` int, `type` prescreen_type, `question`, `options` text[], `created_at` |
| `applications` | `id`, `job_id` FK, `candidate_id` FK auth.users, `intro_message`, `prescreen_answers` jsonb DEFAULT '{}', `status` application_status DEFAULT new, `resume_url`, `applied_at` — UNIQUE(job_id, candidate_id) |
| `contact_view_logs` | `id`, `application_id` FK, `viewed_by` FK auth.users, `viewed_at` |

### 3c. Indexes
```sql
jobs(company_id), jobs(status), jobs(created_at DESC)
job_tags(tag_id)
applications(job_id), applications(candidate_id), applications(status)
contact_view_logs(application_id)
tags(type), tags(name) -- for autocomplete
```

### 3d. Database Trigger
```sql
-- On auth.users INSERT → create profile row
-- MUST: SET search_path = public
-- MUST: schema-qualify enum cast → 'seeker'::public.user_type
CREATE FUNCTION handle_new_user() ...
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users ...
```

### 3e. RLS Policies (per table)

**profiles**
- SELECT: `auth.uid() = id` OR public for company profile pages
- INSERT: `auth.uid() = id` WITH CHECK `auth.uid() = id`
- UPDATE: `auth.uid() = id` WITH CHECK `auth.uid() = id`

**companies**
- SELECT: public (all can view)
- INSERT: authenticated WITH CHECK via company_members check in Server Action (not RLS — avoid recursion)
- UPDATE: `EXISTS (SELECT 1 FROM company_members WHERE company_id = companies.id AND user_id = auth.uid() AND role = 'admin')`

**company_members**
- SELECT: member of same company OR own row
- INSERT: admin of company WITH CHECK (checked in Server Action to avoid self-join recursion)
- DELETE: admin of company

**company_posts**
- SELECT: public
- INSERT/UPDATE/DELETE: member of company WITH CHECK

**tags**
- SELECT: public (all)
- INSERT: authenticated (any logged-in user can propose tags — controlled in Server Action)

**jobs**
- SELECT: public (status=open) OR company member
- INSERT: company member WITH CHECK
- UPDATE: company member WITH CHECK
- DELETE: company admin

**job_tags**
- SELECT: public
- INSERT/DELETE: company member

**prescreen_questions**
- SELECT: public
- INSERT/UPDATE/DELETE: company member WITH CHECK

**applications**
- SELECT: `candidate_id = auth.uid()` OR company member of job's company
- INSERT: `candidate_id = auth.uid()` WITH CHECK `candidate_id = auth.uid()`
- UPDATE: company member (status changes only — column restriction in Server Action)

**contact_view_logs**
- SELECT: company member
- INSERT: company member WITH CHECK

### 3f. Storage Buckets

| Bucket | Public? | Max Size | Allowed MIME |
|--------|---------|---------|-------------|
| `avatars` | yes | 5MB | image/* |
| `company-logos` | yes | 5MB | image/* |
| `company-posts` | yes | 10MB | image/* |
| `resumes` | no | 10MB | application/pdf |

Each bucket needs SELECT/INSERT/UPDATE/DELETE policies on `storage.objects`.

### 3g. Realtime
Enable replication for `applications` table (ATS Kanban live updates).

### 3h. Seed Data
```
- 3 seeker accounts (seeker1@test.com, seeker2@test.com, seeker3@test.com — pw: Test1234!)
- 2 company accounts (admin1@techcorp.com, admin2@datasolutions.com — pw: Test1234!)
- 2 companies: TechCorp (tech, 51-200), DataSolutions (data/analytics, 11-50)
- 1 recruiter per company (recruiter1@techcorp.com, recruiter2@datasolutions.com)
- 20 tags across skill/industry/level/location types
- 3 jobs for TechCorp, 2 jobs for DataSolutions (with prescreen questions)
- 5 applications (seekers applied to various jobs, spread across statuses)
```

---

## Phase 4 — packages/supabase

| File | Purpose |
|------|---------|
| `packages/supabase/package.json` | Manifest with `exports` subpaths: `./client`, `./server`, `./middleware` |
| `packages/supabase/tsconfig.json` | Extends react-library preset |
| `packages/supabase/src/types/database.types.ts` | Auto-generated via `supabase gen types typescript` |
| `packages/supabase/src/client.ts` | `createBrowserClient()` — uses `@supabase/ssr`, typed with Database |
| `packages/supabase/src/server.ts` | `createServerClient()` — uses `next/headers` cookies, typed |
| `packages/supabase/src/middleware.ts` | `createMiddlewareClient()` — for middleware.ts session refresh |
| `packages/supabase/src/index.ts` | Re-exports types only (no client functions — avoids barrel import issue) |

**Subpath export config in package.json:**
```json
"exports": {
  "./client":     { "types": "...", "default": "./dist/client.js" },
  "./server":     { "types": "...", "default": "./dist/server.js" },
  "./middleware":  { "types": "...", "default": "./dist/middleware.js" },
  ".":            { "types": "...", "default": "./dist/index.js" }
}
```

---

## Phase 5 — apps/web Base Setup

| File | Purpose |
|------|---------|
| `apps/web/package.json` | Next.js 15 app manifest — deps: next, react, react-dom, @supabase/ssr, tailwindcss, shadcn |
| `apps/web/tsconfig.json` | Extends nextjs preset from packages/config |
| `apps/web/next.config.ts` | `experimental.serverActions.bodySizeLimit = "30mb"` |
| `apps/web/.eslintrc.js` | Extends nextjs eslint from packages/config |
| `apps/web/app/globals.css` | Imports theme.css tokens, `@source` directive for packages/ui scanning, font imports |
| `apps/web/app/layout.tsx` | Root layout — font variables, metadata, `<html lang="th">` |
| `apps/web/middleware.ts` | Session refresh on every request using `createMiddlewareClient` |
| `apps/web/lib/supabase/browser.ts` | `createBrowserClient` re-export wrapper for client components |
| `apps/web/lib/supabase/server.ts` | `createServerClient` re-export wrapper for server components/actions |
| `apps/web/lib/supabase/admin.ts` | Service role client — for signup resource creation (company + member) |

---

## Phase 6 — packages/ui Stub

| File | Purpose |
|------|---------|
| `packages/ui/package.json` | Manifest — peer deps: react, tailwindcss |
| `packages/ui/tsconfig.json` | Extends react-library preset |
| `packages/ui/src/index.ts` | Stub export (populated when building pages) |

---

## Execution Order

```
Phase 0  →  Phase 1  →  Phase 2  →  Phase 4 stub
                                         ↓
                              Phase 3 (MCP schema)
                                         ↓
                              Phase 4 (gen types + complete)
                                         ↓
                              Phase 5 (apps/web)
                                         ↓
                              Phase 6 (packages/ui stub)
                                         ↓
                              Verify: pnpm install && pnpm build
```

---

## Verification Checklist

- [ ] `pnpm install` — no peer dep errors
- [ ] `pnpm build` — all packages compile clean
- [ ] `pnpm type-check` — no TypeScript errors
- [ ] Supabase tables visible in MCP `list_tables`
- [ ] RLS enabled on all tables
- [ ] Storage buckets created with policies
- [ ] `database.types.ts` reflects all tables
- [ ] Seed users can log in at `/login`

---

## Files Created (Summary Count)

| Phase | Files |
|-------|-------|
| Phase 0 — Root | 4 |
| Phase 1 — config | 7 |
| Phase 2 — types | 12 |
| Phase 3 — Supabase (MCP) | 0 files (MCP operations) |
| Phase 4 — supabase pkg | 7 |
| Phase 5 — apps/web | 10 |
| Phase 6 — ui stub | 3 |
| **Total** | **43 files** |
