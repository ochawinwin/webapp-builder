import { describe, it, expect, vi, beforeEach } from "vitest";
import { getApplicationsByUser, getApplicationById } from "@/lib/data/applications";

const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

function makeApplicationRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "app-1",
    job_id: "job-1",
    applicant_id: "user-1",
    resume_id: "resume-1",
    cover_message: "I am interested",
    contact_email: "applicant@example.com",
    contact_phone: null,
    status: "new",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    job: {
      id: "job-1",
      company_id: "company-1",
      created_by: "user-1",
      title: "Software Engineer",
      description: null,
      qualifications: null,
      benefits: null,
      status: "active",
      location: "Bangkok",
      job_type: "full-time",
      level: "mid",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    applicant: {
      id: "user-1",
      user_type: "seeker",
      full_name: "สมชาย ใจดี",
      bio: null,
      avatar_url: null,
      phone: null,
      email: "applicant@example.com",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    resume: {
      id: "resume-1",
      user_id: "user-1",
      file_url: "https://example.com/resume.pdf",
      file_name: "resume.pdf",
      file_size: 1024,
      is_primary: true,
      created_at: "2024-01-01T00:00:00Z",
    },
    answers: [],
    ...overrides,
  };
}

describe("getApplicationsByUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns applications filtered by user ID", async () => {
    const appRow = makeApplicationRow();
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [appRow], error: null }),
    };
    mockFrom.mockReturnValue(chain);

    const applications = await getApplicationsByUser("user-1");

    expect(applications).toHaveLength(1);
    expect(applications[0].id).toBe("app-1");
    expect(applications[0].applicantId).toBe("user-1");
    expect(chain.eq).toHaveBeenCalledWith("applicant_id", "user-1");
  });

  it("returns empty array when user has no applications", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    };
    mockFrom.mockReturnValue(chain);

    const applications = await getApplicationsByUser("user-1");
    expect(applications).toHaveLength(0);
  });

  it("maps resume correctly", async () => {
    const appRow = makeApplicationRow();
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [appRow], error: null }),
    };
    mockFrom.mockReturnValue(chain);

    const applications = await getApplicationsByUser("user-1");

    expect(applications[0].resume).not.toBeNull();
    expect(applications[0].resume?.fileName).toBe("resume.pdf");
    expect(applications[0].resume?.isPrimary).toBe(true);
  });

  it("maps resume as null when not present", async () => {
    const appRow = makeApplicationRow({ resume: null });
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [appRow], error: null }),
    };
    mockFrom.mockReturnValue(chain);

    const applications = await getApplicationsByUser("user-1");
    expect(applications[0].resume).toBeNull();
  });

  it("throws when Supabase returns an error", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: null, error: { message: "Query failed" } }),
    };
    mockFrom.mockReturnValue(chain);

    await expect(getApplicationsByUser("user-1")).rejects.toThrow("Query failed");
  });
});

describe("getApplicationById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns application when found", async () => {
    const appRow = makeApplicationRow();
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: appRow, error: null }),
    };
    mockFrom.mockReturnValue(chain);

    const application = await getApplicationById("app-1");

    expect(application).not.toBeNull();
    expect(application?.id).toBe("app-1");
    expect(application?.status).toBe("new");
  });

  it("returns null when application is not found", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } }),
    };
    mockFrom.mockReturnValue(chain);

    const application = await getApplicationById("nonexistent-id");
    expect(application).toBeNull();
  });
});
