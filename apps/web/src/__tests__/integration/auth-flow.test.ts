/**
 * Integration tests for the Auth flow.
 *
 * These tests exercise the full action chain from FormData input through Zod
 * validation, Supabase calls, and the returned ActionResult — all within a
 * single test process using mocked Supabase clients.
 *
 * Flow covered:
 *   signup (candidate) → login → redirect to /search → logout → redirect to /
 *   signup (company)   → login → redirect to /hr/dashboard
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSupabaseMock } from "@/test/mocks/supabase";

// ─── Module mocks ─────────────────────────────────────────────────────────────

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(),
}));

vi.mock("@/lib/data/auth", () => ({
  getAuthUser: vi.fn(),
}));

import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/data/auth";
import {
  registerCandidateAction,
  registerCompanyAction,
  loginAction,
  logoutAction,
} from "@/app/actions/auth.actions";

const mockCreateServerClient = vi.mocked(createServerClient);
const mockCreateAdminClient = vi.mocked(createAdminClient);
const mockGetAuthUser = vi.mocked(getAuthUser);

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const CANDIDATE_FIELDS = {
  email: "candidate@example.com",
  password: "SecurePass1",
  confirm_password: "SecurePass1",
  first_name: "Jane",
  last_name: "Doe",
};

const COMPANY_FIELDS = {
  email: "hr@company.com",
  password: "CompanyPass1",
  confirm_password: "CompanyPass1",
  company_name: "Startup Inc",
  industry: "Technology",
  size: "1-10",
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── Candidate signup → login → logout ───────────────────────────────────────

describe("Candidate auth flow", () => {
  it("signup succeeds and returns email confirmation message", async () => {
    const supabase = createSupabaseMock({
      signUpResult: { data: { user: { id: "user-seeker-1" } }, error: null },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await registerCandidateAction(makeFormData(CANDIDATE_FIELDS));

    expect(result.success).toBe(true);
    expect(result.data?.message).toBeTruthy();
  });

  it("login succeeds and redirects seeker to /search", async () => {
    const supabase = createSupabaseMock({
      signInResult: { error: null },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetAuthUser.mockResolvedValue({
      user: { id: "user-seeker-1", email: "candidate@example.com" },
      profile: {
        id: "user-seeker-1",
        user_type: "seeker",
        first_name: "Jane",
        last_name: "Doe",
        bio: null,
        phone: null,
        avatar_url: null,
        resume_url: null,
        created_at: new Date().toISOString(),
      },
    });

    const result = await loginAction(
      makeFormData({ email: "candidate@example.com", password: "SecurePass1" })
    );

    expect(result.success).toBe(true);
    expect(result.data?.redirectTo).toBe("/search");
  });

  it("logout calls signOut and redirects to /", async () => {
    const supabase = createSupabaseMock({ signOutResult: { error: null } });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    await expect(logoutAction()).rejects.toThrow("NEXT_REDIRECT:/");
    expect(supabase.auth.signOut).toHaveBeenCalledOnce();
  });

  it("signup fails with validation error when passwords do not match", async () => {
    const supabase = createSupabaseMock({});
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await registerCandidateAction(
      makeFormData({ ...CANDIDATE_FIELDS, confirm_password: "DifferentPass1" })
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("รหัสผ่านไม่ตรงกัน");
  });

  it("signup fails when the email is already registered", async () => {
    const supabase = createSupabaseMock({
      signUpResult: {
        data: { user: null },
        error: { message: "User already registered" },
      },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await registerCandidateAction(makeFormData(CANDIDATE_FIELDS));

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("login fails with auth error when credentials are wrong", async () => {
    const supabase = createSupabaseMock({
      signInResult: { error: { message: "Invalid login credentials" } },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await loginAction(
      makeFormData({ email: "candidate@example.com", password: "WrongPass1" })
    );

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

// ─── Company signup → login → logout ─────────────────────────────────────────

describe("Company (HR) auth flow", () => {
  it("signup succeeds and creates company + member records", async () => {
    const serverSupabase = createSupabaseMock({
      signUpResult: { data: { user: { id: "hr-user-1" } }, error: null },
    });
    const adminMock = {
      from: vi.fn((table: string) => {
        if (table === "companies") {
          return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { id: "company-uuid-1" },
              error: null,
            }),
          };
        }
        return { insert: vi.fn().mockResolvedValue({ error: null }) };
      }),
    };

    mockCreateServerClient.mockResolvedValue(serverSupabase as never);
    mockCreateAdminClient.mockReturnValue(adminMock as never);

    const result = await registerCompanyAction(makeFormData(COMPANY_FIELDS));

    expect(result.success).toBe(true);
    expect(result.data?.message).toBeTruthy();
    expect(adminMock.from).toHaveBeenCalledWith("companies");
    expect(adminMock.from).toHaveBeenCalledWith("company_members");
  });

  it("login succeeds and redirects company user to /hr/dashboard", async () => {
    const supabase = createSupabaseMock({ signInResult: { error: null } });
    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetAuthUser.mockResolvedValue({
      user: { id: "hr-user-1", email: "hr@company.com" },
      profile: {
        id: "hr-user-1",
        user_type: "company",
        first_name: "HR",
        last_name: "Admin",
        bio: null,
        phone: null,
        avatar_url: null,
        resume_url: null,
        created_at: new Date().toISOString(),
      },
    });

    const result = await loginAction(
      makeFormData({ email: "hr@company.com", password: "CompanyPass1" })
    );

    expect(result.success).toBe(true);
    expect(result.data?.redirectTo).toBe("/hr/dashboard");
  });

  it("signup fails when company insert returns an error", async () => {
    const serverSupabase = createSupabaseMock({
      signUpResult: { data: { user: { id: "hr-user-1" } }, error: null },
    });
    const adminMock = {
      from: vi.fn((table: string) => {
        if (table === "companies") {
          return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "unique constraint" },
            }),
          };
        }
        return { insert: vi.fn().mockResolvedValue({ error: null }) };
      }),
    };

    mockCreateServerClient.mockResolvedValue(serverSupabase as never);
    mockCreateAdminClient.mockReturnValue(adminMock as never);

    const result = await registerCompanyAction(makeFormData(COMPANY_FIELDS));

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("signup fails with validation error when company name is too short", async () => {
    const supabase = createSupabaseMock({});
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await registerCompanyAction(
      makeFormData({ ...COMPANY_FIELDS, company_name: "X" })
    );

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/กรุณากรอกชื่อบริษัท/);
  });

  it("logout clears session and redirects to /", async () => {
    const supabase = createSupabaseMock({ signOutResult: { error: null } });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    await expect(logoutAction()).rejects.toThrow("NEXT_REDIRECT:/");
    expect(supabase.auth.signOut).toHaveBeenCalledOnce();
  });
});

// ─── Input validation edge cases ─────────────────────────────────────────────

describe("Login input validation", () => {
  it("rejects malformed email before calling Supabase", async () => {
    const supabase = createSupabaseMock({});
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await loginAction(
      makeFormData({ email: "not-an-email", password: "Secret123" })
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("รูปแบบอีเมลไม่ถูกต้อง");
    // Supabase should never be called for invalid inputs
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("rejects empty password before calling Supabase", async () => {
    const supabase = createSupabaseMock({});
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await loginAction(
      makeFormData({ email: "user@test.com", password: "" })
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("กรุณากรอกรหัสผ่าน");
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });
});
