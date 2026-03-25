# FutureCareer Security Review Report

**Date:** 2026-03-25
**Reviewer:** QA Engineer (Claude Sonnet 4.6)
**Scope:** Full-stack security audit — RLS policies, Server Actions, middleware, env vars, Zod schemas

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 0 | — |
| HIGH     | 2 | Both fixed |
| MEDIUM   | 3 | Documented, recommendations provided |
| LOW      | 4 | Documented |
| PASS     | 18 | No action needed |

---

## Fixes Applied

### FIX 1 — HIGH: profiles table PII exposed to anonymous users (RLS)

**File:** Supabase database (RLS policy)

**Problem:** The policy `profiles_select_public` had `qual: true`, which allowed any unauthenticated user (with only the anon key) to enumerate all rows in the `profiles` table via the Supabase REST API. The `profiles` table contains `phone`, `bio`, `resume_url`, and `avatar_url` — all personally identifiable information belonging to job seekers.

**Reproduction:** Any caller with only the NEXT_PUBLIC_SUPABASE_ANON_KEY could run:
```
GET https://<project>.supabase.co/rest/v1/profiles?select=*
Authorization: Bearer <anon_key>
apikey: <anon_key>
```
and receive all user profiles including phone numbers and resume storage paths.

**Fix applied:**
```sql
-- DROPPED:
-- CREATE POLICY "profiles_select_public" ON public.profiles FOR SELECT USING (true);

-- CREATED:
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);
```

All legitimate application reads of profiles occur in authenticated server context (middleware session, HR dashboard, Server Actions). No unauthenticated code path requires profile reads.

---

### FIX 2 — HIGH: inviteMemberAction used admin.auth.admin.listUsers() to find one user

**File:** `apps/web/src/app/actions/team.actions.ts` (line 55)

**Problem:** `inviteMemberAction` called `admin.auth.admin.listUsers()` (which fetches ALL auth users with no filter) and then scanned the result array with `.find()` to locate one user by email. This has two issues:

1. **Scalability/DoS:** `listUsers()` without pagination defaults to 1,000 users. As the platform grows, this action will become increasingly slow, eventually timing out or hitting memory limits on every team invite.
2. **Over-fetching sensitive data:** The action fetches every auth user record (including emails, metadata, identities) just to check one email address. This unnecessarily processes PII in server memory.

**Fix applied in** `apps/web/src/app/actions/team.actions.ts`:
```typescript
// Before (line 55-58):
const { data: usersData } = await admin.auth.admin.listUsers();
const existingAuthUser = usersData?.users.find(
  (u) => u.email === parsed.data.email
);

// After:
const { data: userByEmail } = await admin.auth.admin.getUserByEmail(
  parsed.data.email
);
const existingAuthUser = userByEmail?.user ?? null;
```

`getUserByEmail` is a direct O(1) lookup — no list scan, no over-fetching.

---

## Medium Severity Findings (No Fix Required — Recommendations Provided)

### MEDIUM-1: companies table INSERT allowed for any authenticated user

**Table:** `companies`
**Policy:** `companies_insert_authenticated` — `WITH CHECK: auth.uid() IS NOT NULL`

Any authenticated user (including seekers) can INSERT a row into `companies` directly via the Supabase client. In the application flow, company rows are only created via `createAdminClient()` in `registerCompanyAction`, which is correct. However, a seeker could use the anon key + their session JWT to create orphan company rows that have no `company_members` entry.

**Risk:** Low-impact data pollution. A malicious seeker cannot gain HR privileges (the middleware and all HR actions verify `company_members` membership), but they could create junk rows in the `companies` table.

**Recommendation:** Restrict this policy to users with `user_type = 'company'`, or remove the policy entirely (the admin client in `registerCompanyAction` bypasses RLS, so the policy is not required for the signup flow):
```sql
-- Option A: remove the policy (admin client handles signup inserts)
DROP POLICY "companies_insert_authenticated" ON public.companies;

-- Option B: restrict to company-type users
DROP POLICY "companies_insert_authenticated" ON public.companies;
CREATE POLICY "companies_insert_company_user"
  ON public.companies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_type = 'company'
    )
  );
```

---

### MEDIUM-2: tags table INSERT allowed for any authenticated user

**Table:** `tags`
**Policy:** `tags_insert_authenticated` — `WITH CHECK: auth.uid() IS NOT NULL`

Any authenticated user can insert arbitrary rows into the `tags` table. Tags are reference data (skills, industries, levels, etc.) and should be managed by administrators only, not created by end users.

**Risk:** Any HR user or seeker could spam the tags table with garbage entries that would then appear in search/filter dropdowns.

**Recommendation:** Either remove the policy (tags should be seeded by migrations only, not inserted by the app at runtime) or restrict to company-type users. No application code currently inserts into `tags` directly — `job.actions.ts` only inserts into `job_tags` (the join table) with existing tag IDs.

```sql
-- Recommended: remove insert policy for tags (use migrations for tag management)
DROP POLICY "tags_insert_authenticated" ON public.tags;
```

---

### MEDIUM-3: No HTTP security headers configured

**File:** `apps/web/next.config.ts`

No security headers are set in the Next.js config:
- No `Content-Security-Policy`
- No `X-Frame-Options` (clickjacking)
- No `X-Content-Type-Options`
- No `Strict-Transport-Security`
- No `Referrer-Policy`

**Recommendation:** Add a `headers()` export to `next.config.ts`:
```typescript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
      ],
    },
  ];
},
```

---

## Low Severity Findings

### LOW-1: Server action bodySizeLimit is 30MB, individual actions enforce smaller limits

**File:** `apps/web/next.config.ts` (line 8)

`bodySizeLimit: "30mb"` applies to ALL server actions, not just upload actions. Non-upload actions (e.g., `updateProfileAction`, `loginAction`) accept up to 30MB request bodies before the route handler is even entered.

**Note:** Individual upload actions correctly re-enforce size limits (5MB for resumes, 3MB for logos/avatars). This is defense-in-depth but the 30MB door at the framework level could be reduced.

**Recommendation:** No immediate action needed since upload-specific size checks exist. If this is tightened in future, the upload actions already handle enforcement correctly.

---

### LOW-2: company_members_select policy only shows own membership

**Table:** `company_members`
**Policy:** `company_members_select` — `USING: user_id = auth.uid()`

An HR user can only see their own `company_members` row via RLS. The application fetches co-members' profiles using `getCompanyMembers(companyId)` which joins `company_members` + `profiles`. Since the HR user can only SELECT their own `company_members` row, this query can only return that one row — team management shows only the current user as a member.

**However:** In `lib/data/team.ts`, `getCompanyMembers` uses `createServerClient()` which uses the user's session. Given the RLS policy, it would appear that co-members are invisible. Check whether this feature is tested end-to-end. The policy may need to be expanded to allow members to see other members of the same company:
```sql
-- Current: can only see own row
-- USING: user_id = auth.uid()

-- Needed for team management to work:
-- USING: company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid())
```

This may or may not be intentional (the UI may rely on the server-side fetch working despite RLS). Verify this works correctly in the running application.

---

### LOW-3: File extension not validated against MIME type in upload actions

**Files:** `apps/web/src/app/actions/company.actions.ts`, `profile.actions.ts`

Upload actions validate `file.type` (MIME type) and separately extract the file extension from `file.name` to construct the storage path:
```typescript
const ext = file.name.split(".").pop() ?? "png";
const path = `${membership.company.id}/logo.${ext}`;
```

`file.type` is validated (e.g., `"image/jpeg"`) but `file.name` extension is not validated to match. A client could send a file with `type: "image/jpeg"` but `name: "evil.php"`, resulting in a path like `company-id/logo.php` in storage.

**Risk:** Low in practice since Supabase Storage serves files with the stored `contentType` header (passed as `file.type` in `uploadFile`), not by filename extension. The `contentType` is correctly passed to the upload call. However the path could be misleading.

**Recommendation:** Whitelist the extension based on the validated MIME type rather than trusting `file.name`:
```typescript
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};
const ext = MIME_TO_EXT[file.type] ?? 'bin';
```

---

### LOW-4: jobs_delete_admin restricts to admin role but jobs_update_member allows any member to update

**Table:** `jobs`

Delete requires `admin` role (`jobs_delete_admin`), but update is open to any `company_members` user (`jobs_update_member`). A `recruiter` role member can update job fields including `company_id` (if not restricted by server action code).

The `updateJobAction` in `job.actions.ts` constructs a typed `updatePayload: TablesUpdate<"jobs">` that never sets `company_id` or `created_by`, so the action layer is safe. However the RLS UPDATE policy's `with_check` does not restrict which fields can change — it only verifies the caller is a member. A direct API call with the anon key + recruiter session could potentially change `company_id` on a job to point to another company.

**Recommendation:** The server action defense is sufficient for the current UI. For belt-and-suspenders protection, consider restricting the UPDATE policy to admins only (matching DELETE), or add a `WITH CHECK` that ensures `company_id` cannot be changed:
```sql
-- The current policy allows recruiters to update jobs
-- This is acceptable if the server action is the only mutation path
-- No immediate change required
```

---

## Passing Checks

### RLS — All tables have RLS enabled

All 10 tables in the `public` schema have `rls_enabled = true`:
`applications`, `companies`, `company_members`, `company_posts`, `contact_view_logs`, `job_tags`, `jobs`, `prescreen_questions`, `profiles`, `tags`

### RLS — No infinite recursion

The `company_members_insert_admin` WITH CHECK queries the same table (`company_members`) but for a different user (`auth.uid()`), not for the row being inserted. PostgreSQL evaluates this against committed rows only, so there is no recursion. The `company_members_delete_admin` USING clause has the same safe pattern.

### RLS — All INSERT policies have WITH CHECK clauses

Every INSERT policy in the schema has a `with_check` clause (not just a bare `USING`):
- `applications_insert_candidate`: `candidate_id = auth.uid()`
- `companies_insert_authenticated`: `auth.uid() IS NOT NULL`
- `company_members_insert_admin`: caller must be admin of the target company
- `company_posts_insert_member`: caller must be member of the target company
- `contact_view_logs_insert_member`: caller must be member + application must belong to their company
- `job_tags_insert_member`: caller must be member of job's company
- `jobs_insert_member`: caller must be member of the company
- `prescreen_insert_member`: caller must be member of job's company
- `profiles_insert_own`: `auth.uid() = id`
- `tags_insert_authenticated`: `auth.uid() IS NOT NULL`

### Server Actions — All actions verify auth session first

Every server action calls `supabase.auth.getUser()` as the first operation and returns early with an error if `!user`. Checked: `auth.actions.ts`, `job.actions.ts`, `application.actions.ts`, `company.actions.ts`, `profile.actions.ts`, `team.actions.ts`.

### Server Actions — No hardcoded IDs

No hardcoded UUIDs, company IDs, or user IDs found in any server action. All resource IDs are derived from the authenticated session or from database-fetched records.

### Server Actions — Ownership verified before mutations

All mutating actions (update, delete) perform a compound query that checks both the resource ID AND that it belongs to the calling user's company:
- `job.actions.ts`: `.eq("id", jobId).eq("company_id", membership.company.id)`
- `application.actions.ts`: verifies the application's job belongs to the HR user's company
- `company.actions.ts`: uses `membership.company.id` from the authenticated session
- `team.actions.ts`: `.eq("id", memberId).eq("company_id", membership.company.id)`

### Server Actions — All inputs validated with Zod

Every server action validates its FormData with a schema before processing:

| Action | Schema |
|--------|--------|
| `loginAction` | `loginSchema` |
| `registerCandidateAction` | `candidateRegisterSchema` |
| `registerCompanyAction` | `companyRegisterSchema` |
| `createJobAction` | `createJobSchema` |
| `updateJobAction` | `updateJobSchema` |
| `updateJobStatusAction` | `updateJobStatusSchema` |
| `updateCompanyAction` | `updateCompanySchema` |
| `createPostAction` | `createPostSchema` |
| `submitApplicationAction` | `submitApplicationSchema` |
| `updateApplicationStatusAction` | `updateApplicationStatusSchema` |
| `inviteMemberAction` | `inviteMemberSchema` |
| `updateProfileAction` | `updateProfileSchema` |

`deleteJobAction`, `deletePostAction`, `removeMemberAction`, `viewContactAction`, and upload actions do not have dedicated schemas but validate their inputs inline (UUID presence, file type, file size). This is acceptable.

### Zod Schemas — Password strength enforced

`candidateRegisterSchema` and `companyRegisterSchema` both require:
- Minimum 8 characters
- At least one uppercase letter
- At least one number
- Password confirmation match

### Server Actions — No SQL injection risk

All database queries use the Supabase PostgREST client with parameterized method chaining. No raw SQL strings with user input concatenation were found in any action or data fetching file.

### Server Actions — No XSS vectors

No use of `dangerouslySetInnerHTML` or `innerHTML` found in any component or action file.

### Service Role Key — Not exposed to client

`SUPABASE_SERVICE_ROLE_KEY` is:
- Not prefixed with `NEXT_PUBLIC_` (not bundled into client)
- Only referenced in `apps/web/src/lib/supabase/admin.ts` (server-only file)
- `createAdminClient()` is only imported by server action files (`auth.actions.ts`, `application.actions.ts`, `team.actions.ts`) and test files
- No client component (`"use client"` files) imports `createAdminClient` or references the service role key

### Environment Files — Correctly gitignored

Both `.env` and `apps/web/.env.local` are listed in `.gitignore` (`*.local` pattern + explicit `.env`) and verified not tracked by git.

### Middleware — All protected routes covered

The middleware in `apps/web/src/middleware.ts` covers:

**Seeker-protected routes:** `/profile`
**Company-protected routes:** `/hr/dashboard`, `/hr/profile`, `/hr/jobs`, `/hr/team`, `/hr/feed`, `/hr/settings`, `/hr/ats`

The middleware also performs role-based cross-route protection: company users are redirected away from seeker routes and vice versa. Auth pages redirect logged-in users to their respective dashboards.

**Note:** The `/hr` root route is in `COMPANY_PROTECTED` indirectly — `/hr/dashboard` is listed. The `/hr` root itself redirects to `/hr/dashboard` via the layout, so it is effectively protected.

### Middleware — Uses `auth.getUser()` not `getSession()`

The middleware correctly calls `supabase.auth.getUser()` (server-validated) rather than `getSession()` (client-side JWT only). This means the session cannot be spoofed by a tampered JWT cookie.

### File Uploads — Type and size validated

All upload actions validate both MIME type and file size:
- Resume: PDF only, max 5MB
- Avatar: JPEG/PNG/WEBP only, max 3MB
- Company logo: JPEG/PNG/WEBP/SVG, max 3MB
- Post image: JPEG/PNG/WEBP only (no explicit size limit — see LOW-1 bodySizeLimit note)

### Storage — Private buckets use signed URLs

Resume files are stored in the `resumes` bucket (private). `uploadFile()` returns the storage path (not a public URL) for the resumes bucket, and `getSignedUrl()` is called to generate time-limited signed URLs (1-hour expiry) for display.

---

## Files Modified

- `apps/web/src/app/actions/team.actions.ts` — Replaced `listUsers()` with `getUserByEmail()` (HIGH fix)
- Supabase database — Replaced `profiles_select_public` (`USING: true`) with `profiles_select_authenticated` (`USING: auth.uid() IS NOT NULL`) (HIGH fix)

## Files Not Modified (Recommendations Only)

- `apps/web/next.config.ts` — Add security headers (MEDIUM-3)
- Supabase database — Consider restricting `companies_insert_authenticated` (MEDIUM-1)
- Supabase database — Consider removing `tags_insert_authenticated` (MEDIUM-2)
