import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSupabaseMock, createQueryMock } from "@/test/mocks/supabase";

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(),
}));

// Storage helper used inside getApplicationById
vi.mock("@/lib/storage", () => ({
  getSignedUrl: vi.fn(async () => "https://signed.url/resume.pdf"),
  BUCKETS: { RESUMES: "resumes" },
}));

import { createServerClient } from "@/lib/supabase/server";
import {
  getApplicationsByJob,
  getApplicationsByUser,
  getApplicationById,
} from "@/lib/data/applications";

const mockCreateServerClient = vi.mocked(createServerClient);

// ─── Helpers ─────────────────────────────────────────────────────────────────

const JOB_ID = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
const COMPANY_ID = "company-uuid-1";
const CANDIDATE_ID = "candidate-uuid-1";

function makeAppRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "app-uuid-1",
    job_id: JOB_ID,
    candidate_id: CANDIDATE_ID,
    intro_message: "I am very excited about this role.",
    prescreen_answers: {},
    status: "pending",
    resume_url: null,
    applied_at: new Date().toISOString(),
    ...overrides,
  };
}

function makeProfile(overrides: Record<string, unknown> = {}) {
  return {
    id: CANDIDATE_ID,
    first_name: "Jane",
    last_name: "Doe",
    avatar_url: null,
    phone: null,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── getApplicationsByJob ─────────────────────────────────────────────────────

describe("getApplicationsByJob", () => {
  it("returns applications merged with candidate profiles", async () => {
    const appRow = makeAppRow();
    const profile = makeProfile();

    const supabase = createSupabaseMock({});
    let callCount = 0;
    supabase.from = vi.fn((table: string) => {
      if (table === "jobs") {
        return createQueryMock({ data: { id: JOB_ID }, error: null }) as never;
      }
      if (table === "applications") {
        return createQueryMock({ data: [appRow], error: null }) as never;
      }
      if (table === "profiles") {
        callCount++;
        return createQueryMock({ data: [profile], error: null }) as never;
      }
      return createQueryMock({ data: null, error: null }) as never;
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getApplicationsByJob(JOB_ID, COMPANY_ID);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("app-uuid-1");
    expect(result[0].candidate.first_name).toBe("Jane");
    expect(result[0].candidate.last_name).toBe("Doe");
    // email is intentionally blank to avoid bulk exposure
    expect(result[0].candidate.email).toBe("");
  });

  it("returns empty array when the job does not belong to the company", async () => {
    const supabase = createSupabaseMock({});
    supabase.from = vi.fn((table: string) => {
      if (table === "jobs") {
        return createQueryMock({ data: null, error: { code: "PGRST116" } }) as never;
      }
      return createQueryMock({ data: [], error: null }) as never;
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getApplicationsByJob(JOB_ID, "wrong-company");

    expect(result).toHaveLength(0);
  });

  it("returns empty array when applications query fails", async () => {
    const supabase = createSupabaseMock({});
    supabase.from = vi.fn((table: string) => {
      if (table === "jobs") {
        return createQueryMock({ data: { id: JOB_ID }, error: null }) as never;
      }
      return createQueryMock({ data: null, error: { message: "db error" } }) as never;
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getApplicationsByJob(JOB_ID, COMPANY_ID);

    expect(result).toHaveLength(0);
  });

  it("fills candidate fields with fallbacks when profile is not found", async () => {
    const appRow = makeAppRow({ candidate_id: "unknown-candidate" });

    const supabase = createSupabaseMock({});
    supabase.from = vi.fn((table: string) => {
      if (table === "jobs") {
        return createQueryMock({ data: { id: JOB_ID }, error: null }) as never;
      }
      if (table === "applications") {
        return createQueryMock({ data: [appRow], error: null }) as never;
      }
      // profiles returns empty — no match for unknown-candidate
      return createQueryMock({ data: [], error: null }) as never;
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getApplicationsByJob(JOB_ID, COMPANY_ID);

    expect(result[0].candidate.id).toBe("unknown-candidate");
    expect(result[0].candidate.first_name).toBeNull();
    expect(result[0].candidate.last_name).toBeNull();
  });
});

// ─── getApplicationsByUser ────────────────────────────────────────────────────

describe("getApplicationsByUser", () => {
  it("returns all applications for a given user", async () => {
    const app1 = makeAppRow({ id: "app-1" });
    const app2 = makeAppRow({ id: "app-2", prescreen_answers: { q1: "yes" } });

    const supabase = createSupabaseMock({});
    supabase.from = vi.fn(() =>
      createQueryMock({ data: [app1, app2], error: null }) as never
    );
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getApplicationsByUser(CANDIDATE_ID);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("app-1");
    expect(result[1].prescreen_answers).toEqual({ q1: "yes" });
  });

  it("returns empty array when user has no applications", async () => {
    const supabase = createSupabaseMock({});
    supabase.from = vi.fn(() =>
      createQueryMock({ data: [], error: null }) as never
    );
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getApplicationsByUser(CANDIDATE_ID);

    expect(result).toHaveLength(0);
  });

  it("returns empty array on query error", async () => {
    const supabase = createSupabaseMock({});
    supabase.from = vi.fn(() =>
      createQueryMock({ data: null, error: { message: "permission denied" } }) as never
    );
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getApplicationsByUser(CANDIDATE_ID);

    expect(result).toHaveLength(0);
  });

  it("defaults null prescreen_answers to empty object", async () => {
    const app = makeAppRow({ prescreen_answers: null });

    const supabase = createSupabaseMock({});
    supabase.from = vi.fn(() =>
      createQueryMock({ data: [app], error: null }) as never
    );
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getApplicationsByUser(CANDIDATE_ID);

    expect(result[0].prescreen_answers).toEqual({});
  });
});

// ─── getApplicationById ───────────────────────────────────────────────────────

describe("getApplicationById", () => {
  it("returns the application with candidate details when found", async () => {
    const appRow = makeAppRow();
    const profile = makeProfile();

    const supabase = createSupabaseMock({});
    supabase.from = vi.fn((table: string) => {
      if (table === "applications") {
        return createQueryMock({ data: appRow, error: null }) as never;
      }
      if (table === "profiles") {
        return createQueryMock({ data: profile, error: null }) as never;
      }
      return createQueryMock({ data: null, error: null }) as never;
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getApplicationById("app-uuid-1");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("app-uuid-1");
    expect(result?.candidate.first_name).toBe("Jane");
  });

  it("returns null when application is not found", async () => {
    const supabase = createSupabaseMock({});
    supabase.from = vi.fn(() =>
      createQueryMock({ data: null, error: { code: "PGRST116" } }) as never
    );
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getApplicationById("non-existent");

    expect(result).toBeNull();
  });

  it("returns null when createServerClient throws", async () => {
    mockCreateServerClient.mockRejectedValue(new Error("unavailable"));

    const result = await getApplicationById("app-1");

    expect(result).toBeNull();
  });
});
