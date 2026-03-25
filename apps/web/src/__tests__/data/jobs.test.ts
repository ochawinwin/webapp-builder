import { describe, it, expect, vi, beforeEach } from "vitest";
import { getJobs, getJobById } from "@/lib/data/jobs";

const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

function makeJobRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "job-1",
    company_id: "company-1",
    created_by: "user-1",
    title: "Software Engineer",
    description: "Build things",
    qualifications: null,
    benefits: null,
    status: "active",
    location: "Bangkok",
    job_type: "full-time",
    level: "mid",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    job_tags: [],
    company: {
      id: "company-1",
      name: "Test Company",
      logo_url: null,
      cover_url: null,
      short_bio: null,
      full_bio: null,
      industry: "Technology",
      size: "50-100",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    ...overrides,
  };
}

function makeQueryChain(resolvedData: unknown, resolvedError: unknown = null) {
  const chain: Record<string, unknown> = {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: resolvedData, error: resolvedError }),
  };
  // Make the chain thenable (for await) returning as the final call
  (chain as unknown as Promise<unknown>).then = vi.fn().mockImplementation((resolve: (v: unknown) => unknown) =>
    Promise.resolve({ data: resolvedData, error: resolvedError }).then(resolve)
  );
  return chain;
}

describe("getJobs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns mapped jobs array", async () => {
    const jobRow = makeJobRow();
    const chain = makeQueryChain([jobRow]);
    mockFrom.mockReturnValue(chain);

    const jobs = await getJobs();

    expect(jobs).toHaveLength(1);
    expect(jobs[0].id).toBe("job-1");
    expect(jobs[0].title).toBe("Software Engineer");
    expect(jobs[0].company.name).toBe("Test Company");
  });

  it("returns empty array when no jobs exist", async () => {
    const chain = makeQueryChain([]);
    mockFrom.mockReturnValue(chain);

    const jobs = await getJobs();
    expect(jobs).toHaveLength(0);
  });

  it("applies status filter", async () => {
    const chain = makeQueryChain([]);
    mockFrom.mockReturnValue(chain);

    await getJobs({ status: "active" });

    expect(chain.eq).toHaveBeenCalledWith("status", "active");
  });

  it("applies companyId filter", async () => {
    const chain = makeQueryChain([]);
    mockFrom.mockReturnValue(chain);

    await getJobs({ companyId: "company-1" });

    expect(chain.eq).toHaveBeenCalledWith("company_id", "company-1");
  });

  it("applies search filter", async () => {
    const chain = makeQueryChain([]);
    mockFrom.mockReturnValue(chain);

    await getJobs({ search: "engineer" });

    expect(chain.ilike).toHaveBeenCalledWith("title", "%engineer%");
  });

  it("applies limit filter", async () => {
    const chain = makeQueryChain([]);
    mockFrom.mockReturnValue(chain);

    await getJobs({ limit: 5 });

    expect(chain.limit).toHaveBeenCalledWith(5);
  });

  it("maps job_tags correctly", async () => {
    const jobRow = makeJobRow({
      job_tags: [
        {
          tag: {
            id: "tag-1",
            name: "TypeScript",
            category: "skill",
            created_at: "2024-01-01T00:00:00Z",
          },
        },
      ],
    });
    const chain = makeQueryChain([jobRow]);
    mockFrom.mockReturnValue(chain);

    const jobs = await getJobs();

    expect(jobs[0].tags).toHaveLength(1);
    expect(jobs[0].tags[0].id).toBe("tag-1");
    expect(jobs[0].tags[0].name).toBe("TypeScript");
  });

  it("throws when Supabase returns an error", async () => {
    const chain = makeQueryChain(null, { message: "DB error" });
    mockFrom.mockReturnValue(chain);

    await expect(getJobs()).rejects.toThrow("DB error");
  });
});

describe("getJobById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns job when found", async () => {
    const jobRow = makeJobRow();
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: jobRow, error: null }),
    };
    mockFrom.mockReturnValue(chain);

    const job = await getJobById("job-1");
    expect(job).not.toBeNull();
    expect(job?.id).toBe("job-1");
  });

  it("returns null when job is not found", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } }),
    };
    mockFrom.mockReturnValue(chain);

    const job = await getJobById("nonexistent-id");
    expect(job).toBeNull();
  });
});
