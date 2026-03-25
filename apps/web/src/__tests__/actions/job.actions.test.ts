import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSupabaseMock } from "@/test/mocks/supabase";

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(),
}));

vi.mock("@/lib/data/companies", () => ({
  getCompanyByMembership: vi.fn(),
}));

import { createServerClient } from "@/lib/supabase/server";
import { getCompanyByMembership } from "@/lib/data/companies";
import {
  createJobAction,
  updateJobStatusAction,
} from "@/app/actions/job.actions";

const mockCreateServerClient = vi.mocked(createServerClient);
const mockGetCompanyByMembership = vi.mocked(getCompanyByMembership);

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const validJobFields = {
  title: "Frontend Developer",
  description: "Build user interfaces with React and TypeScript.",
  qualifications: JSON.stringify(["React", "TypeScript"]),
  job_type: "full_time",
  level: "mid",
};

const mockMembership = {
  company: { id: "company-1", name: "Acme Corp", logo_url: null, industry: null },
  role: "admin" as const,
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── createJobAction ─────────────────────────────────────────────────────────

describe("createJobAction", () => {
  it("creates a job and returns jobId when authenticated company user provides valid data", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "hr-1", email: "hr@corp.com" },
    });
    // Override the jobs table response to return a job id
    const jobInsertChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: "job-uuid-1" }, error: null }),
    };
    supabase.from = vi.fn((table: string) => {
      if (table === "jobs") return jobInsertChain as never;
      return { insert: vi.fn().mockResolvedValue({ error: null }) } as never;
    });

    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetCompanyByMembership.mockResolvedValue(mockMembership);

    const fd = makeFormData(validJobFields);
    const result = await createJobAction(fd);

    expect(result.success).toBe(true);
    expect(result.data?.jobId).toBe("job-uuid-1");
  });

  it("returns an auth error when the user is not logged in", async () => {
    const supabase = createSupabaseMock({ authUser: null });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData(validJobFields);
    const result = await createJobAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns a permission error when the user has no company membership", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "seeker-1", email: "seeker@test.com" },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetCompanyByMembership.mockResolvedValue(null);

    const fd = makeFormData(validJobFields);
    const result = await createJobAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns a validation error when the title is missing", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "hr-1", email: "hr@corp.com" },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetCompanyByMembership.mockResolvedValue(mockMembership);

    const fd = makeFormData({ ...validJobFields, title: "" });
    const result = await createJobAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

// ─── updateJobStatusAction ───────────────────────────────────────────────────

describe("updateJobStatusAction", () => {
  const jobId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

  it("allows a company member to close their own job", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "hr-1", email: "hr@corp.com" },
    });
    // jobs from() — first call ownership check, second call update
    const ownershipChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: jobId }, error: null }),
    };
    const updateChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    };
    let callCount = 0;
    supabase.from = vi.fn((table: string) => {
      if (table === "jobs") {
        callCount++;
        return callCount === 1 ? ownershipChain : updateChain;
      }
      return {} as never;
    });

    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetCompanyByMembership.mockResolvedValue(mockMembership);

    const fd = makeFormData({ id: jobId, status: "closed" });
    const result = await updateJobStatusAction(fd);

    expect(result.success).toBe(true);
  });

  it("returns an auth error when the user is not authenticated", async () => {
    const supabase = createSupabaseMock({ authUser: null });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({ id: jobId, status: "closed" });
    const result = await updateJobStatusAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns a permission error when membership is missing", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "seeker-1", email: "seeker@test.com" },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetCompanyByMembership.mockResolvedValue(null);

    const fd = makeFormData({ id: jobId, status: "closed" });
    const result = await updateJobStatusAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns an ownership error when the job belongs to a different company", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "hr-1", email: "hr@corp.com" },
    });
    const ownershipChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
    };
    supabase.from = vi.fn(() => ownershipChain as never);

    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetCompanyByMembership.mockResolvedValue(mockMembership);

    const fd = makeFormData({ id: jobId, status: "closed" });
    const result = await updateJobStatusAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns a validation error for an invalid status value", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "hr-1", email: "hr@corp.com" },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetCompanyByMembership.mockResolvedValue(mockMembership);

    const fd = makeFormData({ id: jobId, status: "archived" });
    const result = await updateJobStatusAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
