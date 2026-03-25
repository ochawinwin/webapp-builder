import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSupabaseMock } from "@/test/mocks/supabase";

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(),
}));

vi.mock("@/lib/data/companies", () => ({
  getCompanyByMembership: vi.fn(),
}));

import { createServerClient } from "@/lib/supabase/server";
import { getCompanyByMembership } from "@/lib/data/companies";
import {
  submitApplicationAction,
  updateApplicationStatusAction,
} from "@/app/actions/application.actions";

const mockCreateServerClient = vi.mocked(createServerClient);
const mockGetCompanyByMembership = vi.mocked(getCompanyByMembership);

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const validJobId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── submitApplicationAction ─────────────────────────────────────────────────

describe("submitApplicationAction", () => {
  it("submits an application successfully for a seeker with a resume", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "seeker-1", email: "jane@example.com" },
    });

    // profiles query returns seeker with resume
    const profileChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { user_type: "seeker", resume_url: "seekers/seeker-1/resume.pdf" },
        error: null,
      }),
    };
    // applications duplicate check — none found
    const dupCheckChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    };
    // applications insert
    const insertChain = {
      insert: vi.fn().mockResolvedValue({ error: null }),
    };

    let profileCallCount = 0;
    let appCallCount = 0;
    supabase.from = vi.fn((table: string) => {
      if (table === "profiles") return profileChain as never;
      if (table === "applications") {
        appCallCount++;
        return appCallCount === 1 ? dupCheckChain : insertChain;
      }
      return {} as never;
    });

    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({
      job_id: validJobId,
      intro_message: "I am very excited about this opportunity and believe I am a great fit.",
      prescreen_answers: JSON.stringify({}),
      use_profile_resume: "true",
    });
    const result = await submitApplicationAction(fd);

    expect(result.success).toBe(true);
  });

  it("returns an auth error when the user is not logged in", async () => {
    const supabase = createSupabaseMock({ authUser: null });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({
      job_id: validJobId,
      intro_message: "I am very interested in this position.",
      prescreen_answers: "{}",
      use_profile_resume: "true",
    });
    const result = await submitApplicationAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns an error when the user is a company member, not a seeker", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "hr-1", email: "hr@corp.com" },
    });

    const profileChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { user_type: "company", resume_url: null },
        error: null,
      }),
    };
    supabase.from = vi.fn(() => profileChain as never);
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({
      job_id: validJobId,
      intro_message: "I am very interested in this position.",
      prescreen_answers: "{}",
      use_profile_resume: "true",
    });
    const result = await submitApplicationAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns an error when the seeker has no resume uploaded", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "seeker-1", email: "jane@example.com" },
    });

    const profileChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { user_type: "seeker", resume_url: null },
        error: null,
      }),
    };
    supabase.from = vi.fn(() => profileChain as never);
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({
      job_id: validJobId,
      intro_message: "I am very interested in this role and my skills match perfectly.",
      prescreen_answers: "{}",
      use_profile_resume: "true",
    });
    const result = await submitApplicationAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns a duplicate error when the seeker already applied for the job", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "seeker-1", email: "jane@example.com" },
    });

    const profileChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { user_type: "seeker", resume_url: "seekers/seeker-1/resume.pdf" },
        error: null,
      }),
    };
    const dupCheckChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      // existing application found
      maybeSingle: vi.fn().mockResolvedValue({
        data: { id: "existing-app-id" },
        error: null,
      }),
    };

    let appCallCount = 0;
    supabase.from = vi.fn((table: string) => {
      if (table === "profiles") return profileChain as never;
      if (table === "applications") {
        appCallCount++;
        return dupCheckChain as never;
      }
      return {} as never;
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({
      job_id: validJobId,
      intro_message: "I am very interested in this role and my skills match perfectly.",
      prescreen_answers: "{}",
      use_profile_resume: "true",
    });
    const result = await submitApplicationAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns a validation error when intro_message is too short", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "seeker-1", email: "jane@example.com" },
    });
    const profileChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { user_type: "seeker", resume_url: "seekers/seeker-1/resume.pdf" },
        error: null,
      }),
    };
    supabase.from = vi.fn(() => profileChain as never);
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({
      job_id: validJobId,
      intro_message: "Hi",
      prescreen_answers: "{}",
      use_profile_resume: "true",
    });
    const result = await submitApplicationAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

// ─── updateApplicationStatusAction ──────────────────────────────────────────

describe("updateApplicationStatusAction", () => {
  const appId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
  const jobId = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
  const mockMembership = {
    company: { id: "company-1", name: "Acme", logo_url: null, industry: null },
    role: "admin" as const,
  };

  it("updates status successfully for a company member who owns the job", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "hr-1", email: "hr@corp.com" },
    });

    const appFetchChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: appId, job_id: jobId },
        error: null,
      }),
    };
    const jobOwnerChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: jobId }, error: null }),
    };
    const updateChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    };

    let appCallCount = 0;
    let jobCallCount = 0;
    supabase.from = vi.fn((table: string) => {
      if (table === "applications") {
        appCallCount++;
        return appCallCount === 1 ? appFetchChain : updateChain;
      }
      if (table === "jobs") {
        jobCallCount++;
        return jobCallCount === 1 ? jobOwnerChain : updateChain;
      }
      return {} as never;
    });

    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetCompanyByMembership.mockResolvedValue(mockMembership);

    const fd = makeFormData({ id: appId, status: "interview" });
    const result = await updateApplicationStatusAction(fd);

    expect(result.success).toBe(true);
  });

  it("returns an auth error when user is not authenticated", async () => {
    const supabase = createSupabaseMock({ authUser: null });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({ id: appId, status: "hired" });
    const result = await updateApplicationStatusAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns a permission error when user is not a company member", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "seeker-1", email: "seeker@test.com" },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetCompanyByMembership.mockResolvedValue(null);

    const fd = makeFormData({ id: appId, status: "hired" });
    const result = await updateApplicationStatusAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
