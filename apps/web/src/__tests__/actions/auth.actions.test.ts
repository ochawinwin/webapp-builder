import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSupabaseMock } from "@/test/mocks/supabase";

// Mock the Supabase server client and admin client modules
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
  loginAction,
  registerCandidateAction,
  registerCompanyAction,
  logoutAction,
} from "@/app/actions/auth.actions";

const mockCreateServerClient = vi.mocked(createServerClient);
const mockCreateAdminClient = vi.mocked(createAdminClient);
const mockGetAuthUser = vi.mocked(getAuthUser);

// Helper to build a FormData from a plain object
function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── loginAction ─────────────────────────────────────────────────────────────

describe("loginAction", () => {
  it("returns success and redirectTo when credentials are valid for a seeker", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "user-1", email: "jane@example.com" },
      signInResult: { error: null },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetAuthUser.mockResolvedValue({
      user: { id: "user-1", email: "jane@example.com" },
      profile: {
        id: "user-1",
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

    const fd = makeFormData({ email: "jane@example.com", password: "Secret123" });
    const result = await loginAction(fd);

    expect(result.success).toBe(true);
    expect(result.data?.redirectTo).toBe("/search");
  });

  it("returns success and redirects to hr/dashboard for a company user", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "hr-1", email: "hr@corp.com" },
      signInResult: { error: null },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetAuthUser.mockResolvedValue({
      user: { id: "hr-1", email: "hr@corp.com" },
      profile: {
        id: "hr-1",
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

    const fd = makeFormData({ email: "hr@corp.com", password: "Secret123" });
    const result = await loginAction(fd);

    expect(result.success).toBe(true);
    expect(result.data?.redirectTo).toBe("/hr/dashboard");
  });

  it("returns a validation error when email format is invalid", async () => {
    const supabase = createSupabaseMock({});
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({ email: "not-an-email", password: "Secret123" });
    const result = await loginAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBe("รูปแบบอีเมลไม่ถูกต้อง");
  });

  it("returns a validation error when password is empty", async () => {
    const supabase = createSupabaseMock({});
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({ email: "jane@example.com", password: "" });
    const result = await loginAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBe("กรุณากรอกรหัสผ่าน");
  });

  it("returns an auth error when Supabase rejects the credentials", async () => {
    const supabase = createSupabaseMock({
      signInResult: { error: { message: "Invalid login credentials" } },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({ email: "jane@example.com", password: "WrongPass1" });
    const result = await loginAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

// ─── registerCandidateAction ─────────────────────────────────────────────────

describe("registerCandidateAction", () => {
  it("returns success with confirmation message on valid registration", async () => {
    const supabase = createSupabaseMock({
      signUpResult: {
        data: { user: { id: "new-user-1" } },
        error: null,
      },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({
      email: "newuser@example.com",
      password: "ValidPass1",
      confirm_password: "ValidPass1",
      first_name: "John",
      last_name: "Smith",
    });
    const result = await registerCandidateAction(fd);

    expect(result.success).toBe(true);
    expect(result.data?.message).toBeTruthy();
  });

  it("returns a validation error when passwords do not match", async () => {
    const supabase = createSupabaseMock({});
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({
      email: "newuser@example.com",
      password: "ValidPass1",
      confirm_password: "DifferentPass1",
      first_name: "John",
      last_name: "Smith",
    });
    const result = await registerCandidateAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBe("รหัสผ่านไม่ตรงกัน");
  });

  it("returns an error when the email is already registered", async () => {
    const supabase = createSupabaseMock({
      signUpResult: {
        data: { user: null },
        error: { message: "User already registered" },
      },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({
      email: "existing@example.com",
      password: "ValidPass1",
      confirm_password: "ValidPass1",
      first_name: "John",
      last_name: "Smith",
    });
    const result = await registerCandidateAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

// ─── registerCompanyAction ───────────────────────────────────────────────────

describe("registerCompanyAction", () => {
  it("returns success on valid company registration", async () => {
    const serverSupabase = createSupabaseMock({
      signUpResult: {
        data: { user: { id: "company-user-1" } },
        error: null,
      },
    });
    // Admin client mock must return company id on insert
    const adminMock = {
      from: vi.fn((table: string) => {
        if (table === "companies") {
          return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { id: "company-id-1" },
              error: null,
            }),
          };
        }
        // company_members insert — resolve with no error
        return {
          insert: vi.fn().mockResolvedValue({ error: null }),
        };
      }),
    };

    mockCreateServerClient.mockResolvedValue(serverSupabase as never);
    mockCreateAdminClient.mockReturnValue(adminMock as never);

    const fd = makeFormData({
      email: "founder@startup.com",
      password: "CompanyPass1",
      confirm_password: "CompanyPass1",
      company_name: "Startup Inc",
      industry: "Technology",
      size: "1-10",
    });
    const result = await registerCompanyAction(fd);

    expect(result.success).toBe(true);
  });

  it("returns a validation error for an invalid company registration", async () => {
    const supabase = createSupabaseMock({});
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({
      email: "bad-email",
      password: "CompanyPass1",
      confirm_password: "CompanyPass1",
      company_name: "X",
      industry: "Tech",
      size: "1-10",
    });
    const result = await registerCompanyAction(fd);

    expect(result.success).toBe(false);
  });
});

// ─── logoutAction ────────────────────────────────────────────────────────────

describe("logoutAction", () => {
  it("calls signOut and then redirects", async () => {
    const supabase = createSupabaseMock({ signOutResult: { error: null } });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    // logoutAction calls redirect() which throws a NEXT_REDIRECT error
    await expect(logoutAction()).rejects.toThrow("NEXT_REDIRECT:/");
    expect(supabase.auth.signOut).toHaveBeenCalledOnce();
  });
});
