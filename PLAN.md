# FutureCareer — Monorepo Scaffold Plan

> Generated from brainstorming session. Every file listed. Agents can execute any phase cold.

---

## Decision Log

| # | Decision | Alternatives Considered | Rationale |
|---|----------|------------------------|-----------|
| 1 | Core schema (tables + columns + RLS + seed, no triggers) | Full schema; Skeleton | Working DB for dev without over-engineering |
| 2 | Shadcn/ui primitives + prototype visual styling | Replace all with Shadcn; Prototype only | Accessible Radix primitives + custom design |
| 3 | One Zod schema per form/action (~12 schemas) | Layered schemas; Full CRUD | YAGNI — validate only what specs require |
| 4 | user_type on profiles + company_members table | Single role column; Hybrid | Supports invite flow, multi-company, clean RLS |
| 5 | Single tags table with category enum | Separate table per category | Simpler queries, matches prototype's uniform handling |
| 6 | Scaffold everything in one pass, verify build | Skeleton first; Bottom-up | Specs are detailed, agents can parallelize by package |
| 7 | Next.js 15 (not 16) for production | Next.js 16 (prototype uses it) | CLAUDE.md specifies Next.js 15; 16 is pre-release |
| 8 | `database.types.ts` auto-generated via MCP, `@futurecareer/types` is manual | Single source of truth | Keep both — manual types for app logic, generated types for Supabase client. Re-run `mcp__supabase__generate_typescript_types` after any schema change. |
| 10 | Schema managed via Supabase MCP (no .sql migration files) | Local .sql migrations | MCP gives direct execution, live verification, and type generation in one workflow. Schema is the live DB — no drift between files and actual state. |
| 9 | Design tokens source: `specs/design-system.md` | `specs/design-guide.md` (CLAUDE.md reference) | Files are the same — CLAUDE.md says `design-guide.md` but the file is named `design-system.md`. Update CLAUDE.md reference. |

---

## Architecture Overview

```
futurecareer/
├── apps/
│   └── web/                    # Next.js 15 App Router
├── packages/
│   ├── config/                 # Shared tsconfig, eslint, tailwind tokens
│   ├── types/                  # TypeScript types + Zod schemas
│   ├── supabase/               # Migrations, RLS, client utilities, types
│   └── ui/                     # Shadcn/ui + custom components
├── prototype/                  # Existing prototype (reference only)
├── specs/                      # Existing specs (reference only)
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── PLAN.md
```

---

## Phase 1: Root Monorepo Setup

**Context**: Initialize Turborepo + pnpm workspaces. No packages exist yet.

### Files to Create

| File | Purpose |
|------|---------|
| `package.json` | Root package — workspaces, scripts (build, dev, lint, type-check), devDependencies (turbo, typescript) |
| `pnpm-workspace.yaml` | Defines `apps/*` and `packages/*` |
| `turbo.json` | Pipeline: build → lint → type-check. Dev runs parallel. |
| `.npmrc` | `shamefully-hoist=true`, `strict-peer-dependencies=false` |
| `.env.example` | Template with all required env vars (SUPABASE_URL, SUPABASE_ANON_KEY, etc.) |
| `.gitignore` | Update existing — add `apps/`, `packages/`, turbo cache (`.turbo/`) |

### Verification
```bash
pnpm install  # should succeed with empty workspaces
```

---

## Phase 2: packages/config/

**Context**: Shared configuration consumed by all other packages. Must be created first.

### Files to Create

| File | Purpose |
|------|---------|
| `packages/config/package.json` | `@futurecareer/config`, exports tsconfig + tailwind |
| `packages/config/tsconfig/base.json` | Strict mode, ES2022 target, moduleResolution bundler, paths |
| `packages/config/tsconfig/nextjs.json` | Extends base, adds Next.js plugin + JSX preserve |
| `packages/config/tsconfig/react-library.json` | Extends base, JSX react-jsx, declaration emit |
| `packages/config/eslint/base.js` | typescript-eslint, import rules, no-default-export |
| `packages/config/tailwind/globals.css` | Full design-system tokens via `@theme inline {}` — colors, fonts, spacing (ported from prototype's globals.css) |
| `packages/config/tailwind/preset.css` | Shared `@import` file that packages/ui and apps/web can import (re-exports globals.css) |

### Design Tokens to Map (from specs/design-system.md)

**Colors**: primary (#2563EB), primary-hover (#1D4ED8), primary-light (#DBEAFE), primary-subtle (#EFF6FF), secondary (#0F172A), secondary-light (#334155), accent (#10B981), accent-hover (#059669), accent-light (#D1FAE5), bg-primary (#FFF), bg-secondary (#F8FAFC), bg-tertiary (#F1F5F9), bg-dark (#0F172A), bg-overlay (rgba), text-primary (#0F172A), text-secondary (#475569), text-tertiary (#94A3B8), text-inverse (#FFF), text-link (#2563EB), success/error/warning/info + bg variants, border-default (#E2E8F0), border-strong (#CBD5E1), focus-ring (#93C5FD)

**Fonts**: `--font-sans: 'Inter', system-ui, sans-serif`, `--font-mono: 'JetBrains Mono', monospace`

### Verification
```bash
# Config package has no build step — just exports files
```

---

## Phase 3: packages/types/

**Context**: All TypeScript types and Zod schemas. No runtime dependencies except `zod`.

### Files to Create — Entity Types

| File | Types Defined |
|------|---------------|
| `packages/types/package.json` | `@futurecareer/types`, dependency: zod |
| `packages/types/tsconfig.json` | Extends `@futurecareer/config/tsconfig/react-library.json` |
| `packages/types/eslint.config.js` | Extends `@futurecareer/config/eslint/base.js` |
| `packages/types/src/auth.types.ts` | `UserType` enum (`seeker` \| `company`), `AuthUser`, `Session` |
| `packages/types/src/profile.types.ts` | `Profile`, `ProfilePreferences`, `ProfileWithTags` |
| `packages/types/src/company.types.ts` | `Company`, `CompanyMember`, `CompanyRole` enum (`admin` \| `recruiter`), `CompanyWithMembers` |
| `packages/types/src/job.types.ts` | `Job`, `JobStatus` enum (`draft` \| `active` \| `paused` \| `closed`), `JobWithTags`, `JobWithCompany` |
| `packages/types/src/tag.types.ts` | `Tag`, `TagCategory` enum (`skill` \| `industry` \| `level` \| `location` \| `type`) |
| `packages/types/src/application.types.ts` | `Application`, `ApplicationStatus` enum (`new` \| `reviewing` \| `interview` \| `offered` \| `hired` \| `rejected`), `ApplicationAnswer`, `ApplicationWithDetails` |
| `packages/types/src/prescreen.types.ts` | `PrescreenQuestion`, `QuestionType` enum (`open_ended` \| `multiple_choice`), `QuestionOption` |
| `packages/types/src/resume.types.ts` | `Resume` |
| `packages/types/src/feed.types.ts` | `CompanyFeedPost` |

### Files to Create — Zod Schemas

| File | Schema | Fields |
|------|--------|--------|
| `packages/types/src/schemas/registerSeekerSchema.ts` | `registerSeekerSchema` | fullName, email, password, confirmPassword |
| `packages/types/src/schemas/registerCompanySchema.ts` | `registerCompanySchema` | fullName, workEmail, companyName, password, confirmPassword |
| `packages/types/src/schemas/loginSchema.ts` | `loginSchema` | email, password |
| `packages/types/src/schemas/updateProfileSchema.ts` | `updateProfileSchema` | fullName, bio, phone, avatarUrl, tagIds (array), preferences |
| `packages/types/src/schemas/createJobSchema.ts` | `createJobSchema` | title, description, qualifications, benefits, location, jobType, level, status, tagIds |
| `packages/types/src/schemas/updateJobSchema.ts` | `updateJobSchema` | Partial of createJobSchema |
| `packages/types/src/schemas/applyJobSchema.ts` | `applyJobSchema` | resumeId, coverMessage, contactEmail, contactPhone, answers (array of {questionId, answerText}) |
| `packages/types/src/schemas/updateCompanySchema.ts` | `updateCompanySchema` | name, shortBio, fullBio, industry, size, logoUrl, coverUrl |
| `packages/types/src/schemas/inviteRecruiterSchema.ts` | `inviteRecruiterSchema` | email |
| `packages/types/src/schemas/createFeedPostSchema.ts` | `createFeedPostSchema` | title, content, imageUrl (optional) |
| `packages/types/src/schemas/createPrescreenQuestionSchema.ts` | `createPrescreenQuestionSchema` | questionText, questionType, options (array, required if MC), sortOrder |
| `packages/types/src/schemas/uploadResumeSchema.ts` | `uploadResumeSchema` | fileName, fileSize (max 10MB), fileType (application/pdf) |
| `packages/types/src/schemas/updateApplicationStatusSchema.ts` | `updateApplicationStatusSchema` | applicationId, status (ApplicationStatus enum) |
| `packages/types/src/schemas/updateFeedPostSchema.ts` | `updateFeedPostSchema` | Partial of createFeedPostSchema + postId |
| `packages/types/src/schemas/forgotPasswordSchema.ts` | `forgotPasswordSchema` | email |
| `packages/types/src/schemas/resetPasswordSchema.ts` | `resetPasswordSchema` | password, confirmPassword |

### Barrel Export

| File | Purpose |
|------|---------|
| `packages/types/src/index.ts` | Re-exports all types and schemas |

### Verification
```bash
cd packages/types && pnpm tsc --noEmit
```

---

## Phase 4: Supabase Database Setup + packages/supabase/

**Context**: Two-part phase. Part A uses Supabase MCP tools to set up the live database directly (no .sql migration files). Part B creates the TypeScript client package. Depends on `@futurecareer/types`.

### Part A: Database Schema via Supabase MCP

> **Tool**: `mcp__supabase__execute_sql` for all operations.
> **No .sql files are written** — schema lives in Supabase directly.

#### Step 1: Enums

Create all custom enums via `execute_sql`:

| Enum | Values |
|------|--------|
| `user_type` | `seeker`, `company` |
| `tag_category` | `skill`, `industry`, `level`, `location`, `type` |
| `company_role` | `admin`, `recruiter` |
| `job_status` | `draft`, `active`, `paused`, `closed` |
| `question_type` | `open_ended`, `multiple_choice` |
| `application_status` | `new`, `reviewing`, `interview`, `offered`, `hired`, `rejected` |

#### Step 2: Tables

Create tables in dependency order via `execute_sql`:

| Table | Columns | Notes |
|-------|---------|-------|
| `profiles` | id (uuid PK FK→auth.users ON DELETE CASCADE), user_type, full_name, bio text, avatar_url text, phone text, email text, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now() | Auto-create trigger on auth.users insert |
| `tags` | id (uuid PK DEFAULT gen_random_uuid()), name text NOT NULL, category tag_category NOT NULL, created_at timestamptz DEFAULT now() | UNIQUE(name, category) |
| `profile_tags` | profile_id (uuid FK→profiles ON DELETE CASCADE), tag_id (uuid FK→tags ON DELETE CASCADE), PRIMARY KEY (profile_id, tag_id) | Seeker preference matching |
| `companies` | id (uuid PK DEFAULT gen_random_uuid()), name text NOT NULL, logo_url text, cover_url text, short_bio text, full_bio text, industry text, size text, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now() | |
| `company_members` | id (uuid PK DEFAULT gen_random_uuid()), company_id (uuid FK→companies ON DELETE CASCADE), user_id (uuid FK→profiles ON DELETE CASCADE), role company_role NOT NULL DEFAULT 'recruiter', invited_by uuid FK→profiles, created_at timestamptz DEFAULT now() | UNIQUE(company_id, user_id) |
| `jobs` | id (uuid PK DEFAULT gen_random_uuid()), company_id (uuid FK→companies ON DELETE CASCADE), created_by (uuid FK→profiles), title text NOT NULL, description text, qualifications text, benefits text, status job_status DEFAULT 'draft', location text, job_type text, level text, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now() | |
| `job_tags` | job_id (uuid FK→jobs ON DELETE CASCADE), tag_id (uuid FK→tags ON DELETE CASCADE), PRIMARY KEY (job_id, tag_id) | Junction table |
| `prescreen_questions` | id (uuid PK DEFAULT gen_random_uuid()), job_id (uuid FK→jobs ON DELETE CASCADE), question_text text NOT NULL, question_type question_type NOT NULL, options jsonb, sort_order int DEFAULT 0, created_at timestamptz DEFAULT now() | options required if MC |
| `resumes` | id (uuid PK DEFAULT gen_random_uuid()), user_id (uuid FK→profiles ON DELETE CASCADE), file_url text NOT NULL, file_name text NOT NULL, file_size int, is_primary boolean DEFAULT false, created_at timestamptz DEFAULT now() | |
| `applications` | id (uuid PK DEFAULT gen_random_uuid()), job_id (uuid FK→jobs ON DELETE CASCADE), applicant_id (uuid FK→profiles ON DELETE CASCADE), resume_id (uuid FK→resumes ON DELETE SET NULL), cover_message text, contact_email text, contact_phone text, status application_status DEFAULT 'new', created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now() | UNIQUE(job_id, applicant_id) |
| `application_answers` | id (uuid PK DEFAULT gen_random_uuid()), application_id (uuid FK→applications ON DELETE CASCADE), question_id (uuid FK→prescreen_questions ON DELETE CASCADE), answer_text text | |
| `company_feed_posts` | id (uuid PK DEFAULT gen_random_uuid()), company_id (uuid FK→companies ON DELETE CASCADE), author_id (uuid FK→profiles), title text NOT NULL, content text, image_url text, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now() | |

#### Step 3: Views

| View | Definition |
|------|-----------|
| `profiles_public` | `SELECT id, full_name, avatar_url, bio FROM profiles` — hides email/phone from non-owners |

#### Step 4: Indexes

Create via `execute_sql`:

| Index | Table | Columns |
|-------|-------|---------|
| `idx_jobs_status_company` | jobs | (status, company_id) |
| `idx_applications_job` | applications | (job_id) |
| `idx_applications_applicant` | applications | (applicant_id) |
| `idx_tags_category` | tags | (category) |
| `idx_job_tags_job` | job_tags | (job_id) |
| `idx_company_members_user` | company_members | (user_id) |
| `idx_profile_tags_profile` | profile_tags | (profile_id) |

#### Step 5: RLS Policies

Enable RLS on ALL tables, then create policies via `execute_sql`:

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `profiles` | Own row: full. Others: use `profiles_public` VIEW. | Auto (trigger on auth.users insert). | Own row only. | None. |
| `tags` | All (public). | None (admin seed). | None. | None. |
| `profile_tags` | Own profile's tags. | Own profile only. | None (delete + re-insert). | Own profile only. |
| `companies` | All (public). | Authenticated users WHERE `user_type = 'company'`. | Company admin only. | None. |
| `company_members` | Same company members. | Company admin only. | Company admin only (cannot change own role). | Company admin only (cannot delete self if last admin). |
| `jobs` | Public: active only. Company members: all for own company. | Company members (admin/recruiter). | Company members own company. | Company admin only. |
| `job_tags` | Same as jobs. | Company member. | None (delete + re-insert). | Company member. |
| `prescreen_questions` | Public (via active job). Company members: all own. | Company members. | Company members. | Company members. |
| `applications` | Applicant: own. Company members: for their company's jobs. | Authenticated seekers (user_type = 'seeker'). | Applicant: cover_message only while status='new'. Company members: status only. | None. |
| `application_answers` | Same as applications. | Applicant (with application). | None. | None. |
| `resumes` | Owner only. | Owner only. | Owner only. | Owner only. |
| `company_feed_posts` | All (public). | Company members. | Author or admin. | Author or admin. |

#### Step 6: Storage Buckets

Create via Supabase MCP:

| Bucket | Public | Purpose | Allowed MIME |
|--------|--------|---------|-------------|
| `avatars` | Yes | Profile photos | image/jpeg, image/png, image/webp |
| `company-assets` | Yes | Company logos, covers, feed images | image/jpeg, image/png, image/webp |
| `resumes` | No (private) | PDF resumes — signed URLs for access | application/pdf |

#### Step 7: Realtime

Enable realtime replication via MCP for:

| Table | Reason |
|-------|--------|
| `applications` | Live status updates on seeker dashboard |
| `company_feed_posts` | Live feed on company profile |

#### Step 8: Seed Data

Insert via `execute_sql`:
- ~30 tags across 5 categories (skills: React, TypeScript, Node.js, Python, Go, etc.; industries: Technology, Finance, Healthcare, etc.; levels: Junior, Mid-level, Senior, Lead; locations: กรุงเทพฯ, เชียงใหม่, Remote; types: Full-time, Contract, Freelance)
- 1 company (TechCorp)
- 3 job postings with tags and prescreen questions
- 2 sample applications with answers
- 2 feed posts

> Note: Auth users and profiles cannot be seeded via SQL — use Supabase Auth API or create manually in dashboard for dev.

#### Step 9: Generate Types

Use `mcp__supabase__generate_typescript_types` to generate `database.types.ts` after all schema is in place.

### Part B: packages/supabase/ (Code Only)

| File | Purpose |
|------|---------|
| `packages/supabase/package.json` | `@futurecareer/supabase`, deps: `@supabase/supabase-js`, `@supabase/ssr` |
| `packages/supabase/tsconfig.json` | Extends react-library preset |
| `packages/supabase/eslint.config.js` | Extends `@futurecareer/config/eslint/base.js` |
| `packages/supabase/src/client.ts` | `createBrowserClient()` — uses `@supabase/ssr`, reads env NEXT_PUBLIC_SUPABASE_URL + ANON_KEY |
| `packages/supabase/src/server.ts` | `createServerClient()` — uses `@supabase/ssr` with cookies() from `next/headers` |
| `packages/supabase/src/middleware.ts` | `createMiddlewareClient()` — for Next.js middleware auth refresh |
| `packages/supabase/src/database.types.ts` | Generated via `mcp__supabase__generate_typescript_types` (Step 9) |
| `packages/supabase/src/index.ts` | Barrel export: all client utilities + database types |

### Verification
```bash
cd packages/supabase && pnpm tsc --noEmit
# Also: verify tables exist via mcp__supabase__list_tables
```

---

## Phase 5: packages/ui/

**Context**: Shadcn/ui primitives + prototype's visual design. Depends on `@futurecareer/config` for tokens.

### Setup Files

| File | Purpose |
|------|---------|
| `packages/ui/package.json` | `@futurecareer/ui`, deps: react, @radix-ui/* primitives, class-variance-authority, clsx, tailwind-merge |
| `packages/ui/tsconfig.json` | Extends react-library preset |
| `packages/ui/eslint.config.js` | Extends `@futurecareer/config/eslint/base.js` |
| `packages/ui/src/lib/utils.ts` | `cn()` utility (clsx + tailwind-merge) |
| `packages/ui/postcss.config.mjs` | PostCSS with `@tailwindcss/postcss` (v4 plugin) |

### UI Primitive Components (Shadcn-based)

| File | Wraps | Prototype Reference |
|------|-------|-------------------|
| `packages/ui/src/components/Button.tsx` | Shadcn Button (CVA) | 6 variants, 3 sizes, loading state, polymorphic (button/a) |
| `packages/ui/src/components/Input.tsx` | Shadcn Input | label + error + helper pattern, 4 variants (text/email/password/search) |
| `packages/ui/src/components/Textarea.tsx` | Shadcn Textarea | label + helper + char counter |
| `packages/ui/src/components/Select.tsx` | Shadcn Select (Radix) | native-style with chevron, label + error |
| `packages/ui/src/components/Card.tsx` | Shadcn Card | default + interactive variants |
| `packages/ui/src/components/Badge.tsx` | Custom (CVA) | success/error/warning/info/default/violet, sm/md sizes |
| `packages/ui/src/components/Dialog.tsx` | Shadcn Dialog (Radix) | title + body + footer slots, focus trap |
| `packages/ui/src/components/Tabs.tsx` | Shadcn Tabs (Radix) | Full ARIA, keyboard navigation |
| `packages/ui/src/components/Toast.tsx` | Sonner | 4 types, auto-dismiss, Thai labels |
| `packages/ui/src/components/Avatar.tsx` | Shadcn Avatar (Radix) | Image + initials fallback, 3 sizes |
| `packages/ui/src/components/FileUpload.tsx` | Custom | Drag-drop, PDF filter, max size, progress bar |
| `packages/ui/src/components/Skeleton.tsx` | Shadcn Skeleton | Loading placeholders |

### Domain Components

| File | Purpose |
|------|---------|
| `packages/ui/src/components/Tag.tsx` | Color-by-category chips (skill=blue, industry=violet, level=amber, location=emerald, type=gray) |
| `packages/ui/src/components/TagAutocomplete.tsx` | Multi-select combobox with filtered dropdown, keyboard nav, ARIA |
| `packages/ui/src/components/JobCard.tsx` | Job listing card: logo, title, company, location, type, tags, match %, date |
| `packages/ui/src/components/CandidateCard.tsx` | ATS kanban card: avatar, name, date, tags, kebab menu, drag styling |
| `packages/ui/src/components/StatusBadge.tsx` | Maps status enums → colors + Thai labels (11 statuses) |
| `packages/ui/src/components/PasswordStrength.tsx` | 4-bar strength indicator with Thai labels |

### Barrel Export

| File | Purpose |
|------|---------|
| `packages/ui/src/index.ts` | Re-exports all components + their prop types |

### Verification
```bash
cd packages/ui && pnpm tsc --noEmit
```

---

## Phase 6: apps/web/

**Context**: Next.js 15 App Router. Depends on all packages. Route stubs only (no page implementations).

### Setup Files

| File | Purpose |
|------|---------|
| `apps/web/package.json` | `@futurecareer/web`, deps: next@15, react@19, all internal packages |
| `apps/web/tsconfig.json` | Extends nextjs preset, paths for `@/*` → `./src/*` |
| `apps/web/eslint.config.js` | Extends `@futurecareer/config/eslint/base.js` + next/core-web-vitals |
| `apps/web/next.config.ts` | transpilePackages: all @futurecareer/* packages |
| `apps/web/postcss.config.mjs` | PostCSS with `@tailwindcss/postcss` (v4 plugin) |
| `apps/web/src/app/globals.css` | Imports `@futurecareer/config/tailwind/globals.css`, adds app-specific styles |
| `apps/web/src/app/layout.tsx` | Root layout: html lang="th", Inter font, metadata, skip-link |
| `apps/web/src/app/error.tsx` | Global error boundary — "เกิดข้อผิดพลาด" with retry button |
| `apps/web/src/app/not-found.tsx` | 404 page — "ไม่พบหน้าที่ต้องการ" with link to home |
| `apps/web/src/app/loading.tsx` | Global loading fallback — skeleton/spinner |
| `apps/web/src/app/dashboard/loading.tsx` | Dashboard loading fallback |
| `apps/web/src/app/company/loading.tsx` | Company dashboard loading fallback |
| `apps/web/src/middleware.ts` | Supabase auth session refresh, route protection rules |
| `apps/web/src/lib/supabase/client.ts` | Re-exports `createBrowserClient` from `@futurecareer/supabase` |
| `apps/web/src/lib/supabase/server.ts` | Re-exports `createServerClient` from `@futurecareer/supabase` |

### Route Stubs (20 pages — empty components with heading + breadcrumb)

| File | Route | Heading |
|------|-------|---------|
| `apps/web/src/app/page.tsx` | `/` | Landing Page |
| `apps/web/src/app/jobs/page.tsx` | `/jobs` | ค้นหางาน |
| `apps/web/src/app/jobs/[id]/page.tsx` | `/jobs/:id` | รายละเอียดงาน |
| `apps/web/src/app/companies/[id]/page.tsx` | `/companies/:id` | โปรไฟล์บริษัท |
| `apps/web/src/app/auth/register/page.tsx` | `/auth/register` | สมัครสมาชิก |
| `apps/web/src/app/auth/register-company/page.tsx` | `/auth/register-company` | ลงทะเบียนบริษัท |
| `apps/web/src/app/auth/login/page.tsx` | `/auth/login` | เข้าสู่ระบบ |
| `apps/web/src/app/auth/login-company/page.tsx` | `/auth/login-company` | เข้าสู่ระบบบริษัท |
| `apps/web/src/app/auth/verify-email/page.tsx` | `/auth/verify-email` | ยืนยันอีเมล |
| `apps/web/src/app/auth/callback/route.ts` | `/auth/callback` | Supabase auth callback — exchanges code for session cookie (required for email verify + OAuth) |
| `apps/web/src/app/dashboard/layout.tsx` | `/dashboard/*` | Dashboard layout (seeker) |
| `apps/web/src/app/dashboard/profile/page.tsx` | `/dashboard/profile` | โปรไฟล์ |
| `apps/web/src/app/dashboard/resumes/page.tsx` | `/dashboard/resumes` | จัดการ Resume |
| `apps/web/src/app/dashboard/applications/page.tsx` | `/dashboard/applications` | ใบสมัครของฉัน |
| `apps/web/src/app/dashboard/apply/[id]/page.tsx` | `/dashboard/apply/:id` | สมัครงาน |
| `apps/web/src/app/company/layout.tsx` | `/company/*` | Dashboard layout (company) |
| `apps/web/src/app/company/profile/page.tsx` | `/company/profile` | โปรไฟล์บริษัท |
| `apps/web/src/app/company/feed/page.tsx` | `/company/feed` | Company Feed |
| `apps/web/src/app/company/team/page.tsx` | `/company/team` | จัดการทีม |
| `apps/web/src/app/company/jobs/page.tsx` | `/company/jobs` | ตำแหน่งงาน |
| `apps/web/src/app/company/jobs/new/page.tsx` | `/company/jobs/new` | สร้างตำแหน่งงานใหม่ |
| `apps/web/src/app/company/jobs/[id]/edit/page.tsx` | `/company/jobs/:id/edit` | แก้ไขตำแหน่งงาน |
| `apps/web/src/app/company/candidates/page.tsx` | `/company/candidates` | จัดการผู้สมัคร |
| `apps/web/src/app/company/candidates/[id]/page.tsx` | `/company/candidates/:id` | รายละเอียดผู้สมัคร |

### Verification
```bash
cd apps/web && pnpm next build
```

---

## Phase 7: Full Build Verification

```bash
# From root
pnpm install
pnpm build        # turbo runs all packages
pnpm type-check   # turbo runs tsc --noEmit across all packages
```

### Success Criteria
- [ ] `pnpm install` — zero errors
- [ ] `pnpm build` — all packages compile
- [ ] `pnpm type-check` — zero type errors
- [ ] All 20 routes accessible in dev mode
- [ ] SQL migrations are valid (parseable, no syntax errors)

---

## Parallelization Map

Phases that can run in parallel (per CLAUDE.md agent routing):

```
Phase 1 (Root)          → sequential (everything depends on this)
Phase 2 (Config)        → sequential (packages depend on config)
Phase 3 (Types)         → after Phase 2
Phase 4A (Supabase MCP)  → can start after Phase 1 (MCP operations are independent of TS packages)
Phase 4B (supabase pkg)  → after Phase 3 + 4A (needs types + generated database.types.ts)
Phase 5 (UI)            → after Phase 2 + 3 (ui needs config + types)
Phase 6 (Web)           → after Phase 2 + 3 + 4 + 5 (web needs everything)
Phase 7 (Verify)        → after all phases

NOTE: Phase 4A (MCP database setup) has ZERO TS dependency — it can run fully
in parallel with Phase 3 (types). Phase 4B (supabase TS package) needs both
Phase 3 output (types) and Phase 4A output (generated database.types.ts).
Phase 5 can start once Phase 3 completes (doesn't need Phase 4).
```

### Agent Assignment

| Agent | Owns | Phase |
|-------|------|-------|
| **Config agent** | `packages/config/` | Phase 2 |
| **Types agent** | `packages/types/` | Phase 3 |
| **DB Engineer** | Supabase MCP setup + `packages/supabase/` | Phase 4A + 4B |
| **UI Library agent** | `packages/ui/` | Phase 5 |
| **Frontend agent** | `apps/web/` | Phase 6 |
| **QA Engineer** | Verification | Phase 7 |

---

## File Count Summary

| Package | Files |
|---------|-------|
| Root | 5 |
| packages/config | 7 |
| packages/types | 28 (11 type files + 16 schema files + barrel index.ts + package.json + tsconfig + eslint) |
| packages/supabase | 8 (4 client files + barrel index.ts + package.json + tsconfig + eslint). Schema via MCP — no .sql files. |
| packages/ui | 22 (18 components + utils + barrel + package.json + tsconfig + eslint + postcss) |
| apps/web | 37 (24 route/page files + auth callback route + 2 layouts + 3 loading/error/not-found + middleware + globals.css + next.config + package.json + tsconfig + eslint + postcss + 2 lib files) |
| **Total** | **~107 files** (+ Supabase schema managed via MCP) |
