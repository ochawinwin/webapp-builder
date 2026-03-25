import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(),
}));

vi.mock("@/lib/storage", () => ({
  getSignedUrl: vi.fn(),
  BUCKETS: { RESUMES: "resumes", LOGOS: "logos", POSTS: "posts", AVATARS: "avatars" },
}));

import { createServerClient } from "@/lib/supabase/server";
import { getApplicationsByJob } from "@/lib/data/applications";

const mockCreateServerClient = vi.mocked(createServerClient);

const jobId = "job-uuid-111";
const companyId = "company-uuid-222";

function makeRawApplication(overrides: Record<string, unknown> = {}) {
  return {
    id: "app-1",
    job_id: jobId,
    candidate_id: "seeker-1",
    intro_message: "I am a great fit for this role.",
    prescreen_answers: { "q-1": "Yes" },
    resume_url: "seekers/seeker-1/resume.pdf",
    status: "new",
    applied_at: new Date().toISOString(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getApplicationsByJob", () => {
  it("returns applications with merged candidate info", async () => {
    const app = makeRawApplication();
    const profile = {
      id: "seeker-1",
      first_name: "Jane",
      last_name: "Doe",
      avatar_url: null,
      phone: "+66 81 234 5678",
    };

    const jobVerifyChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: jobId }, error: null }),
    };

    const applicationsChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [app], error: null }),
    };

    const profilesChain = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ data: [profile], error: null }),
    };

    let jobCallCount = 0;
    let appCallCount = 0;
    const supabase = {
      from: vi.fn((table: string) => {
        if (table === "jobs") {
          jobCallCount++;
          return jobVerifyChain;
        }
        if (table === "applications") {
          appCallCount++;
          return applicationsChain;
        }
        if (table === "profiles") return profilesChain;
        return {};
      }),
    };

    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getApplicationsByJob(jobId, companyId);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("app-1");
    expect(result[0].candidate.first_name).toBe("Jane");
    expect(result[0].candidate.last_name).toBe("Doe");
    expect(result[0].candidate.phone).toBe("+66 81 234 5678");
    // email is intentionally empty — it is never bulk-exposed
    expect(result[0].candidate.email).toBe("");
  });

  it("returns an empty array when the job does not belong to the company", async () => {
    const jobVerifyChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: { code: "PGRST116" },
      }),
    };

    const supabase = {
      from: vi.fn(() => jobVerifyChain),
    };
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getApplicationsByJob(jobId, "wrong-company-id");

    expect(result).toHaveLength(0);
  });

  it("returns an empty array when there are no applications for the job", async () => {
    const jobVerifyChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: jobId }, error: null }),
    };

    const applicationsChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    };

    const profilesChain = {
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({ data: [], error: null }),
    };

    const supabase = {
      from: vi.fn((table: string) => {
        if (table === "jobs") return jobVerifyChain;
        if (table === "applications") return applicationsChain;
        return profilesChain;
      }),
    };
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getApplicationsByJob(jobId, companyId);

    expect(result).toHaveLength(0);
  });

  it("gracefully handles a missing profile by using fallback values", async () => {
    const app = makeRawApplication({ candidate_id: "unknown-seeker" });

    const jobVerifyChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: jobId }, error: null }),
    };
    const applicationsChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [app], error: null }),
    };
    const profilesChain = {
      select: vi.fn().mockReturnThis(),
      // no profile found for this candidate
      in: vi.fn().mockResolvedValue({ data: [], error: null }),
    };

    const supabase = {
      from: vi.fn((table: string) => {
        if (table === "jobs") return jobVerifyChain;
        if (table === "applications") return applicationsChain;
        return profilesChain;
      }),
    };
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getApplicationsByJob(jobId, companyId);

    expect(result).toHaveLength(1);
    expect(result[0].candidate.id).toBe("unknown-seeker");
    expect(result[0].candidate.first_name).toBeNull();
  });

  it("returns an empty array when createServerClient throws", async () => {
    mockCreateServerClient.mockRejectedValue(new Error("env vars missing"));

    const result = await getApplicationsByJob(jobId, companyId);

    expect(result).toHaveLength(0);
  });
});
