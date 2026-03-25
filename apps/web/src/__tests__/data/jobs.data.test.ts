import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSupabaseMock, createQueryMock } from "@/test/mocks/supabase";

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from "@/lib/supabase/server";
import { getJobs, getJobById, getJobsByCompany } from "@/lib/data/jobs";

const mockCreateServerClient = vi.mocked(createServerClient);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeRawJob(overrides: Record<string, unknown> = {}) {
  return {
    id: "job-uuid-1",
    company_id: "company-1",
    title: "Frontend Developer",
    description: "Build React UIs.",
    spec: null,
    qualifications: ["React", "TypeScript"],
    location: "Bangkok",
    job_type: "full_time",
    level: "mid",
    salary: "60,000 THB",
    status: "open",
    created_by: "user-1",
    created_at: new Date().toISOString(),
    company: { id: "company-1", name: "Acme Corp", logo_url: null, industry: "Tech" },
    tags: [{ tag: { id: "tag-1", name: "React", type: "skill" } }],
    prescreen_questions: [],
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── getJobs ─────────────────────────────────────────────────────────────────

describe("getJobs", () => {
  it("returns normalized jobs array when Supabase returns rows", async () => {
    const rawJob = makeRawJob();
    const supabase = createSupabaseMock({});
    const chain = createQueryMock({ data: [rawJob], error: null, count: 1 });
    supabase.from = vi.fn(() => chain as never);
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getJobs();

    expect(result.total).toBe(1);
    expect(result.jobs).toHaveLength(1);
    expect(result.jobs[0].id).toBe("job-uuid-1");
    expect(result.jobs[0].title).toBe("Frontend Developer");
  });

  it("unwraps nested tag join into flat Tag array", async () => {
    const rawJob = makeRawJob({
      tags: [
        { tag: { id: "tag-1", name: "React", type: "skill" } },
        { tag: { id: "tag-2", name: "TypeScript", type: "skill" } },
        { tag: null },
      ],
    });
    const supabase = createSupabaseMock({});
    const chain = createQueryMock({ data: [rawJob], error: null, count: 1 });
    supabase.from = vi.fn(() => chain as never);
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getJobs();

    // null tags should be filtered out
    expect(result.jobs[0].tags).toHaveLength(2);
    expect(result.jobs[0].tags[0].name).toBe("React");
    expect(result.jobs[0].tags[1].name).toBe("TypeScript");
  });

  it("returns empty array and total 0 when Supabase returns no rows", async () => {
    const supabase = createSupabaseMock({});
    const chain = createQueryMock({ data: [], error: null, count: 0 });
    supabase.from = vi.fn(() => chain as never);
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getJobs();

    expect(result.jobs).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it("returns empty array when Supabase returns a query error", async () => {
    const supabase = createSupabaseMock({});
    const chain = createQueryMock({
      data: null,
      error: { message: "database error" },
      count: null,
    });
    supabase.from = vi.fn(() => chain as never);
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getJobs();

    expect(result.jobs).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it("filters jobs post-query by tagIds when provided", async () => {
    const matching = makeRawJob({
      id: "job-1",
      tags: [{ tag: { id: "tag-skill-react", name: "React", type: "skill" } }],
    });
    const nonMatching = makeRawJob({
      id: "job-2",
      tags: [{ tag: { id: "tag-skill-vue", name: "Vue", type: "skill" } }],
    });
    const supabase = createSupabaseMock({});
    const chain = createQueryMock({
      data: [matching, nonMatching],
      error: null,
      count: 2,
    });
    supabase.from = vi.fn(() => chain as never);
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getJobs({ tagIds: ["tag-skill-react"] });

    expect(result.jobs).toHaveLength(1);
    expect(result.jobs[0].id).toBe("job-1");
  });

  it("returns empty array and zero total when createServerClient throws", async () => {
    mockCreateServerClient.mockRejectedValue(new Error("connection refused"));

    const result = await getJobs();

    expect(result.jobs).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});

// ─── getJobById ───────────────────────────────────────────────────────────────

describe("getJobById", () => {
  it("returns a normalized job when a matching row exists", async () => {
    const rawJob = makeRawJob({ id: "job-abc" });
    const supabase = createSupabaseMock({});
    const chain = createQueryMock({ data: rawJob, error: null });
    supabase.from = vi.fn(() => chain as never);
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getJobById("job-abc");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("job-abc");
    expect(result?.title).toBe("Frontend Developer");
  });

  it("returns null when no job exists for the given id", async () => {
    const supabase = createSupabaseMock({});
    const chain = createQueryMock({ data: null, error: { code: "PGRST116" } });
    supabase.from = vi.fn(() => chain as never);
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getJobById("non-existent-id");

    expect(result).toBeNull();
  });

  it("returns null when createServerClient throws", async () => {
    mockCreateServerClient.mockRejectedValue(new Error("network error"));

    const result = await getJobById("job-1");

    expect(result).toBeNull();
  });
});

// ─── getJobsByCompany ─────────────────────────────────────────────────────────

describe("getJobsByCompany", () => {
  it("returns jobs with applicant_count derived from applications array", async () => {
    const rawJob = makeRawJob({
      id: "job-1",
      applications: [{ id: "app-1" }, { id: "app-2" }],
    });
    const supabase = createSupabaseMock({});
    const chain = createQueryMock({ data: [rawJob], error: null });
    supabase.from = vi.fn(() => chain as never);
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getJobsByCompany("company-1");

    expect(result).toHaveLength(1);
    expect(result[0].applicant_count).toBe(2);
    expect(result[0].id).toBe("job-1");
  });

  it("returns applicant_count of 0 when applications field is missing", async () => {
    const rawJob = makeRawJob({ applications: undefined });
    const supabase = createSupabaseMock({});
    const chain = createQueryMock({ data: [rawJob], error: null });
    supabase.from = vi.fn(() => chain as never);
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getJobsByCompany("company-1");

    expect(result[0].applicant_count).toBe(0);
  });

  it("returns empty array on Supabase error", async () => {
    const supabase = createSupabaseMock({});
    const chain = createQueryMock({ data: null, error: { message: "rls denied" } });
    supabase.from = vi.fn(() => chain as never);
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getJobsByCompany("company-1");

    expect(result).toHaveLength(0);
  });
});
