# Security Review — FutureCareer

**Date:** 2026-03-25
**Reviewer:** QA Engineer (automated review)
**Scope:** Full monorepo — `apps/web/`, `packages/`

---

## Summary

| Check | Result |
|---|---|
| 1. RLS Enabled on All Tables | PASS |
| 2. RLS Policy Coverage (per table) | PARTIAL FAIL — 4 issues |
| 3. Service Role Key (client-side exposure) | PASS |
| 4. Service Role Key in .env.example | PASS |
| 5. Service Role Key in .env (real value present) | WARN |
| 6. Server Action Input Validation (Zod safeParse) | PARTIAL FAIL — 4 actions |
| 7. Server Action Auth Checks | PASS |
| 8. Middleware Route Protection | PARTIAL FAIL — 1 issue |
| 9. Console Logs with Sensitive Data | PASS |
| 10. dangerouslySetInnerHTML | PASS |
| 11. Hardcoded API Keys in Client Code | PASS |
| 12. Auth Token / Cookie Handling | PASS |

---

## Check 1 — RLS Enabled on All Tables

**Result: PASS**

All 12 public tables have `rowsecurity = true`:

- application_answers, applications, companies, company_feed_posts, company_members, job_tags, jobs, prescreen_questions, profile_tags, profiles, resumes, tags

---

## Check 2 — RLS Policy Coverage Per Table

**Result: PARTIAL FAIL**

### CRITICAL — company_members: self-referencing bug in all 4 policies

All four `company_members` policies (SELECT, INSERT, UPDATE, DELETE) contain a self-join bug. The subquery joins `company_members cm` but checks `cm.company_id = cm.company_id` instead of `cm.company_id = company_members.company_id`. This means the WHERE clause always compares a column to itself and is always true — the policies do **not** correctly restrict access to members of the same company.

Affected policies:
- `company_members_select_same_company`
- `company_members_insert_by_admin`
- `company_members_update_by_admin`
- `company_members_delete_by_admin`

**Severity: Critical**

The correct `qual` / `with_check` should be:
```sql
EXISTS (
  SELECT 1 FROM company_members cm
  WHERE cm.company_id = company_members.company_id   -- reference outer table
    AND cm.user_id = auth.uid()
    [AND cm.role = 'admin']
)
```

### HIGH — companies: INSERT policy self-referencing bug

The `companies_insert_by_member` policy has the same self-referencing issue:
```sql
company_members.company_id = company_members.id  -- wrong: company_members.id != companies.id
```
It should reference the outer `companies` table:
```sql
company_members.company_id = companies.id
```

Similarly, `companies_update_by_admin` has the same bug.

**Severity: High** — Any authenticated user can insert or update a company record.

### MEDIUM — profiles: INSERT policy missing

The `profiles` table has SELECT and UPDATE policies but no INSERT policy. Because RLS is enabled, inserts are blocked by default unless a policy permits them. Confirm whether inserts happen via a Postgres trigger (e.g., `on auth.users insert`) with `SECURITY DEFINER`. If so, this is acceptable. If application code inserts into `profiles` directly, it will silently fail.

**Severity: Medium**

### LOW — tags: write policies missing

The `tags` table has only a `tags_select_all` policy. There are no INSERT/UPDATE/DELETE policies. This means no authenticated user can manage tags through the application. Confirm whether tags are managed exclusively via migrations/seed scripts. If so this is by design. If any UI allows tag management, inserts will fail silently.

**Severity: Low**

### LOW — resumes: INSERT with_check missing

`resumes_all_by_owner` uses `cmd = ALL` with `qual = (auth.uid() = user_id)` but `with_check` is null. The `with_check` clause is needed to prevent inserts/updates that set `user_id` to another user's ID. The `qual` alone only filters rows on SELECT/UPDATE/DELETE; for INSERT the `with_check` must enforce ownership.

**Severity: Low** — Supabase applies `qual` as `with_check` when `with_check` is null for ALL policies in some versions, but this should be explicit.

---

## Check 3 — Service Role Key (Client-Side Exposure)

**Result: PASS**

No files under `apps/web/src/` or `packages/` reference `SUPABASE_SERVICE_ROLE_KEY` or `service_role`. The browser and server clients use only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## Check 4 — .env.example Key Values

**Result: PASS**

`.env.example` contains only empty placeholder values (e.g., `SUPABASE_SERVICE_ROLE_KEY=`). No real credentials committed.

---

## Check 5 — .env Contains Real Service Role Key

**Result: WARN**

`.env` contains a real `SUPABASE_SERVICE_ROLE_KEY` JWT. This is expected for local development. Confirm:
- `.env` is in `.gitignore` (verify before any push)
- The key is for the development project only, never production

**Severity: Medium** if `.env` is ever committed or if this project key is shared with production.

---

## Check 6 — Server Action Input Validation

**Result: PARTIAL FAIL**

### Actions with complete Zod validation (PASS):
- `authActions.ts` — all 6 functions use `safeParse` before any operation
- `applicationActions.ts` — `applyJobAction`, `updateApplicationStatusAction`
- `companyActions.ts` — `updateCompanyAction`, `inviteRecruiterAction`
- `jobActions.ts` — `createJobAction`, `updateJobAction`
- `profileActions.ts` — `updateProfileAction`
- `resumeActions.ts` — `uploadResumeAction` (validates file metadata)
- `feedActions.ts` — `createFeedPostAction`, `updateFeedPostAction`

### Actions WITHOUT Zod validation (FAIL):

| Action | File | Risk |
|---|---|---|
| `removeTeamMemberAction(memberId: string)` | `companyActions.ts:79` | `memberId` is a raw string parameter with no format/UUID validation |
| `deleteJobAction(jobId: string)` | `jobActions.ts:108` | `jobId` is a raw string parameter with no format/UUID validation |
| `deleteFeedPostAction(postId: string)` | `feedActions.ts:72` | `postId` is a raw string parameter with no format/UUID validation |
| `uploadAvatarAction(formData: FormData)` | `profileActions.ts:57` | File type, size, and extension are not validated before upload |
| `deleteResumeAction(resumeId: string)` | `resumeActions.ts:60` | `resumeId` is a raw string with no format validation |
| `setPrimaryResumeAction(resumeId: string)` | `resumeActions.ts:95` | `resumeId` is a raw string with no format validation |

**Severity for ID parameters: Low** — Supabase parameterized queries prevent SQL injection. However, validating UUID format prevents unexpected errors and potential enumeration abuse.

**Severity for `uploadAvatarAction`: Medium** — No file type or size validation. A malicious user could upload very large files or unexpected file types (e.g., executable content). The `resumeActions.ts:uploadResumeAction` correctly validates file metadata — `uploadAvatarAction` should do the same.

---

## Check 7 — Server Action Auth Checks

**Result: PASS**

Every action that performs database mutations calls `supabase.auth.getUser()` and returns early if `user` is null before touching the database. Auth is checked on the server side (not relying on client-passed user IDs).

---

## Check 8 — Middleware Route Protection

**Result: PARTIAL FAIL**

`apps/web/src/middleware.ts` protects `/dashboard` and `/company` prefixes. The matcher regex covers all routes except static files and images.

### Issues:

**Medium — No redirect for authenticated users on `/auth/*` routes**

Authenticated users can revisit `/auth/login`, `/auth/register`, etc. These pages should redirect already-authenticated users to their dashboard. This is a UX issue and a minor security concern (a user with an active session can access registration flows).

**Low — No `next` parameter validation**

The login redirect uses `loginUrl.searchParams.set("next", pathname)`. The `next` parameter is set to the requested pathname, but there is no validation when consuming it post-login to ensure it is a relative path. If the login page reads `next` and does `router.push(next)` without validation, this can be an open redirect vulnerability. Verify the login page validates that `next` starts with `/`.

---

## Check 9 — Console Logs with Sensitive Data

**Result: PASS**

Only one `console.error(error)` found in `apps/web/src/app/error.tsx:12` — this is the Next.js error boundary and logs the error object in development. No user data, tokens, or credentials are logged.

---

## Check 10 — dangerouslySetInnerHTML

**Result: PASS**

Zero usages of `dangerouslySetInnerHTML` found across all `.ts` and `.tsx` files.

---

## Check 11 — Hardcoded API Keys / Credentials in Client Code

**Result: PASS**

No hardcoded API keys, secrets, or credentials found in `apps/web/src/`.

---

## Check 12 — Auth Token / Cookie Handling

**Result: PASS**

- `createServerClient` (`packages/supabase/src/server.ts`) uses `@supabase/ssr` which sets cookies as `HttpOnly` and `Secure` by default.
- `createMiddlewareClient` (`packages/supabase/src/middleware.ts`) correctly propagates `Set-Cookie` headers back onto the response so the browser session is refreshed on every request.
- `logoutAction` calls `supabase.auth.signOut()` which clears the session cookie server-side.
- `middleware.ts` uses `supabase.auth.getUser()` (not `getSession()`) for route protection — this is the correct, secure pattern as `getUser()` re-validates the JWT with the Supabase server.

---

## Vulnerabilities Summary

| # | Severity | Location | Description |
|---|---|---|---|
| 1 | **Critical** | `company_members` RLS policies | Self-referencing bug: policies never correctly scope to same-company members |
| 2 | **High** | `companies` RLS policies | INSERT/UPDATE policies reference wrong table — any authenticated user can insert/update companies |
| 3 | **Medium** | `profileActions.ts:57` `uploadAvatarAction` | No file type or size validation before uploading to Supabase Storage |
| 4 | **Medium** | `middleware.ts` | No redirect for authenticated users on `/auth/*` routes |
| 5 | **Medium** | `middleware.ts` + login page | Potential open redirect via unvalidated `next` query parameter |
| 6 | **Medium** | `.env` | Real service role key present — confirm it is gitignored |
| 7 | **Low** | 6 Server Actions | Raw string ID parameters not validated as UUID format |
| 8 | **Medium** | `profiles` table | No INSERT RLS policy — confirm trigger-based insert or add explicit policy |
| 9 | **Low** | `tags` table | No write policies — confirm tags are seed-only or add admin policies |
| 10 | **Low** | `resumes` RLS | `ALL` policy missing explicit `with_check` for INSERT ownership |

---

## Recommendations

### Immediate (Critical/High)

1. **Fix `company_members` RLS policies** — rewrite all 4 policies to use the correct cross-table join:
   ```sql
   EXISTS (SELECT 1 FROM company_members cm WHERE cm.company_id = company_members.company_id AND cm.user_id = auth.uid())
   ```

2. **Fix `companies` INSERT/UPDATE policies** — reference the outer `companies` table:
   ```sql
   EXISTS (SELECT 1 FROM company_members WHERE company_members.company_id = companies.id AND company_members.user_id = auth.uid())
   ```

3. **Add file validation to `uploadAvatarAction`** — validate MIME type (allow only `image/jpeg`, `image/png`, `image/webp`) and max file size (e.g., 5 MB) using a Zod schema, matching the pattern used in `uploadResumeAction`.

### Short-term (Medium)

4. **Redirect authenticated users away from `/auth/*`** — in `middleware.ts`, if `user` exists and the route starts with `/auth/`, redirect to `/dashboard`.

5. **Validate the `next` redirect parameter** — in the login page's post-auth redirect, confirm `next` starts with `/` and does not contain `//` or a protocol to prevent open redirect.

6. **Confirm `.env` is in `.gitignore`** — run `git check-ignore -v .env` before any first push.

7. **Add INSERT policy to `profiles`** — either document the SECURITY DEFINER trigger or add an explicit `profiles_insert_own` policy with `with_check = (auth.uid() = id)`.

### Low Priority

8. **Validate UUID format for ID parameters in Server Actions** — add a `z.string().uuid()` check for `memberId`, `jobId`, `postId`, `resumeId` parameters.

9. **Add explicit `with_check` to `resumes_all_by_owner`** — replace the `ALL` policy with explicit per-command policies to make INSERT ownership enforcement unambiguous.

10. **Clarify `tags` write access** — add a comment in migrations confirming tags are seed-only, or add admin-only write policies.
