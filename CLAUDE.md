# Project: FutureCareer

FutureCareer is a **job matching platform** that connects job seekers with companies hiring through recruiters.

--

## Context
Read these files before any implementation:
- specs/app-overview.md — Product vision and feature scope
- specs/app-architecture.md — Tech stack and monorepo structure
- specs/design-guide.md — Visual design system
- prototype/**/*.tsx (or *.html) — Approved UI prototypes
- brand/** — logo and futureskill_brand_identity for brand identity reference

--

## Tech Stack
- Monorepo: Turborepo + pnpm workspaces
- Frontend: Next.js 15 (App Router) + React 19 + TypeScript
- Styling: Tailwind CSS v4 + Shadcn/ui
- Backend: Next.js Server Actions + Supabase Client
- Database: Supabase (PostgreSQL + RLS)
- Auth: Supabase Auth
- Realtime: Supabase Realtime
- Storage: Supabase Storage
- Validation: Zod (all inputs, form data, server action params)

--

## Coding Standards
- TypeScript strict mode everywhere
- Named exports only (no default exports except pages/layouts)
- Zod schemas co-located with types in packages/types/
- Server Components by default, 'use client' only when needed
- Server Actions for mutations, Supabase client for queries
- All Supabase tables must have RLS policies

## Implementation Rules — No Dead UI
- Every button, form, and interactive element MUST be wired to a server action or navigation — no placeholder or no-op handlers
- Never use hardcoded IDs (e.g., `COMPANY_ID = "company-1"`) — always derive from auth session or server-fetched data
- Pages behind auth MUST fetch real user/membership data server-side and pass as props to client components
- After building any page, verify all of the following:
  - Every interactive element has a working handler
  - Every handler calls a real server action (not a stub)
  - Every action result is handled: loading state, success feedback, and error display
  - Form initial values come from database, not hardcoded strings
- When converting prototypes to production code, the wiring (actions, data fetching, error handling) is just as required as the visual output

--

## File Conventions
- Components: PascalCase (UserCard.tsx)
- Server Actions: camelCase with 'Action' suffix (createUserAction.ts)
- Zod Schemas: camelCase with 'Schema' suffix (createUserSchema.ts)
- Types: PascalCase in .types.ts files
- Supabase: database.types.ts auto-generated via supabase gen types

--

## Next.js + Supabase Patterns
- Server Actions have a 1MB body limit by default. If any action accepts file uploads (FormData with files), set `experimental.serverActions.bodySizeLimit` in `next.config.ts` to match the max file size (e.g., "30mb")
- File uploads in Server Actions: convert File to Buffer via `arrayBuffer()` before uploading to Supabase Storage
- Storage bucket RLS policies must have explicit `WITH CHECK` for INSERT — a single `ALL` policy with only `USING` will block inserts
- When creating resources during signup (e.g., company + member), the user has no session yet — use a service_role admin client for those specific operations
- Database triggers must use `SET search_path = public` and schema-qualify custom enum casts (e.g., `'seeker'::public.user_type`)
- RLS policies that reference the same table (self-join) must use the fully qualified outer table name, not the alias (e.g., `cm.company_id = company_members.company_id`, NOT `cm.company_id = cm.company_id`)
- RLS WITH CHECK must NEVER query the same table it's defined on — causes "infinite recursion detected in policy". Enforce column-level update restrictions in Server Action code instead
- Supabase package must export from separate subpaths (./client, ./server, ./middleware) so client components don't pull in next/headers
- Header component must accept a `user` prop to show logged-in state on all pages
- Add `@source` directive in globals.css to include packages/ui/ in Tailwind v4 content scanning

--

## Prototype Handling
### If prototype is .tsx:
- Refactor prototype components into production code
- Extract hardcoded data into props/server data
- Split large prototype files into proper component hierarchy
- Keep the visual output identical to the prototype

### If prototype is .html:
- Convert HTML structure to React/Next.js components
- Map CSS classes to Tailwind utilities
- Extract inline styles to Tailwind config / CSS variables
- Keep the visual output identical to the prototype

--

## Supabase Patterns
- Use @supabase/ssr for server-side auth in Next.js
- Create Supabase client via utility functions:
  - createClient() for Client Components
  - createServerClient() for Server Components / Server Actions
  - createMiddlewareClient() for middleware.ts
- Always use Row Level Security (RLS) — never expose service_role key to client
- Use Supabase Realtime subscriptions in Client Components only
- Storage: use signed URLs for private files, public URLs for public assets

--

## Sub-Agent Routing Rules

### Parallel dispatch (ALL conditions must be met):
- 3+ unrelated tasks or independent domains
- No shared state between tasks
- Clear file boundaries with no overlap

### Sequential dispatch (ANY condition triggers):
- Tasks have dependencies (B needs output from A)
- Shared files or state (merge conflict risk)
- Unclear scope (need to understand before proceeding)

--

## Domain Parallel Patterns
When implementing features across domains, spawn parallel agents:
- **Frontend agent**: Pages, components, layouts — owns `apps/web/app/(pages)/`, `packages/ui/`
- **Backend agent**: Server Actions, business logic, data access, auth — owns `apps/web/app/actions/`, `apps/web/lib/`, `apps/web/app/auth/`, `apps/web/middleware.ts`
- **Supabase agent**: Schema, RLS, migrations, seed, client setup — owns `packages/supabase/`
- **UI Library agent**: Shared components — owns `packages/ui/`
- **Config agent**: Shared configs, types, Zod schemas — owns `packages/config/`, `packages/types/`

Each agent owns their domain. No file overlap.

--

## Agent Team Configuration
When working with multiple agents, use these role definitions:
- **Architect Lead**: Reads all specs, creates implementation plan, coordinates
- **Frontend Dev**: Uses @frontend-developer, @frontend-design, @react-patterns
- **Backend Dev**: Uses @typescript-expert, @cc-skill-security-review, @auth-implementation-patterns
- **Supabase Dev**: Uses @typescript-expert, @cc-skill-security-review
- **QA Engineer**: Uses @test-driven-development

--

## How to Operate

### 1. Check for Skills First

Before starting any task, check `.claude/skills/` for a relevant skill:
- **If found** → Follow the skill's instructions (they're self-contained)
- **If not found** → Complete the task, then ask: "Should we create a skill for this?"

### 2. Quick Commands

- More commands can be added in `.claude/commands/`

--

## Git & GitHub

**Never push to GitHub unless explicitly asked.** Commit locally as needed, but do not run `git push` until the user says so. After changes committed locally, make sure the dev server restarted.

--

## MCP Servers

- MCPs should be installed in project scope, unless the user explicitly define another scope.
- Hard code token/keys into .mcp.json (.gitignore), don't use ${VAR}

### Documentation

Always use **Context7** to fetch the latest, version-accurate documentation before implementing or debugging anything library-specific. Never rely on training-data knowledge for library APIs — docs drift fast.

```
# Resolve a library's Context7 ID, then fetch its docs:
mcp__context7__resolve-library-id  →  mcp__context7__get-library-docs
```

Use Context7 for: Next.js, Supabase, TanStack Query, Zustand, Tailwind CSS, pg-boss, shadcn/ui, Radix UI, and any other dependency in this project.


### Supabase MCP

- Supabase MCP is connected — use it for ALL database operations during development
- Use MCP tools for: creating tables, altering schema, managing RLS, storage buckets, seed data
- Schema changes go through MCP (not .sql files) — then generate types locally
- After MCP schema changes, always run: `supabase gen types typescript` to update database.types.ts
- ⚠️ NEVER connect MCP to production — development only
- ⚠️ Use read_only mode by default, disable only when making schema changes
- ⚠️ Scope MCP to specific project via project_ref


### Environment Variables

Use `.env` for environment variables, copy from `.env.example`


### Testing

For all browser/UI/visual/e2e testing, use the `agent-browser` CLI via the Bash tool.

```bash
agent-browser --help            # see all commands
agent-browser open <url>        # navigate to URL
agent-browser screenshot [path] # take screenshot
agent-browser snapshot          # accessibility tree (for AI navigation)
```


### Stock Images — Stock Photo Search

Use `stock-images-mcp` to search for stock photos from Unsplash, Pexels, and Pixabay. Always use this MCP when looking for stock images or photos for any marketing material.


### Resend — Email

Use Resend to send emails.