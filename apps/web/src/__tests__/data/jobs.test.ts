import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from "@/lib/supabase/server";
import { getJobs, getJobById } from "@/lib/data/jobs";

const mockCreateServerClient = vi.mocked(createServerClient);

// A minimal raw job row as Supabase would return it
function makeRawJob(overrides: Record<string, unknown> = {}) {
  return {
    id: "job-1",
    company_id: "company-1",
    title: "Frontend Developer",
    description: "Build great UIs",
    spec: null,
    qualifications: ["React", "TypeScript"],
    location: "Bangkok",
    job_type: "full_time",
    level: "mid",
    salary: "80,000 THB",
    status: "open",
    created_by: "hr-1",
    created_at: new Date().toISOString(),
    company: { id: "company-1", name: "Acme Corp", logo_url: null, industry: "Tech" },
    tags: [],
    prescreen_questions: [],
    ...overrides,
  };
}

function makeSupabaseChain(result: {
  data: unknown;
  error: unknown;
  count?: number | null;
}) {
  const chain: Record<string, unknown> = {};
  const self = () => chain;
  chain.select = vi.fn(self);
  chain.eq = vi.fn(self);
  chain.in = vi.fn(self);
  chain.ilike = vi.fn(self);
  chain.order = vi.fn(self);
  chain.range = vi.fn(self);
  chain.single = vi.fn(async () => result);
  // Resolve as a promise when awaited directly (for getJobs)
  (chain as { then?: unknown }).then = (
    resolve: (v: typeof result) => void
  ) => resolve(result);

  return chain;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getJobs", () => {
  it("returns jobs and total count on success", async () => {
    const rawJob = makeRawJob();
    const chain = makeSupabaseChain({
      data: [rawJob],
      error: null,
      count: 1,
    });

    const supabase = { from: vi.fn(() => chain) };
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getJobs();

    expect(result.jobs).toHaveLength(1);
    expect(result.jobs[0].id).toBe("job-1");
    expect(result.jobs[0].tags).toEqual([]);
    expect(result.total).toBe(1);
  });

  it("returns empty result when Supabase returns an error", async () => {
    const chain = makeSupabaseChain({
      data: null,
      error: { message: "relation does not exist" },
      count: null,
    });
    const supabase = { from: vi.fn(() => chain) };
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getJobs();

    expect(result.jobs).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it("returns empty result when there are no matching jobs", async () => {
    const chain = makeSupabaseChain({ data: [], error: null, count: 0 });
    const supabase = { from: vi.fn(() => chain) };
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getJobs({ query: "nonexistent position xyz" });

    expect(result.jobs).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it("normalises job tags from nested join shape", async () => {
    const rawJob = makeRawJob({
      tags: [
        { tag: { id: "tag-1", name: "React", type: "skill" } },
        { tag: { id: "tag-2", name: "TypeScript", type: "skill" } },
        { tag: null }, // null tags should be filtered out
      ],
    });
    const chain = makeSupabaseChain({ data: [rawJob], error: null, count: 1 });
    const supabase = { from: vi.fn(() => chain) };
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getJobs();

    expect(result.jobs[0].tags).toHaveLength(2);
    expect(result.jobs[0].tags[0].name).toBe("React");
    expect(result.jobs[0].tags[1].name).toBe("TypeScript");
  });

  it("filters jobs by tagIds post-query", async () => {
    const rawJobs = [
      makeRawJob({
        id: "job-with-react",
        tags: [{ tag: { id: "tag-react", name: "React", type: "skill" } }],
      }),
      makeRawJob({
        id: "job-without-react",
        tags: [{ tag: { id: "tag-vue", name: "Vue", type: "skill" } }],
      }),
    ];
    const chain = makeSupabaseChain({ data: rawJobs, error: null, count: 2 });
    const supabase = { from: vi.fn(() => chain) };
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getJobs({ tagIds: ["tag-react"] });

    expect(result.jobs).toHaveLength(1);
    expect(result.jobs[0].id).toBe("job-with-react");
  });

  it("returns empty result when createServerClient throws", async () => {
    mockCreateServerClient.mockRejectedValue(new Error("Connection refused"));

    const result = await getJobs();

    expect(result.jobs).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});

describe("getJobById", () => {
  it("returns the job when the id exists", async () => {
    const rawJob = makeRawJob();
    const chain = makeSupabaseChain({ data: rawJob, error: null });
    const supabase = { from: vi.fn(() => chain) };
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getJobById("job-1");

    expect(result).not.toBeNull();
    expect(result?.id).toBe("job-1");
    expect(result?.title).toBe("Frontend Developer");
  });

  it("returns null when the job does not exist", async () => {
    const chain = makeSupabaseChain({
      data: null,
      error: { code: "PGRST116", message: "not found" },
    });
    const supabase = { from: vi.fn(() => chain) };
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getJobById("nonexistent-id");

    expect(result).toBeNull();
  });

  it("returns null when createServerClient throws", async () => {
    mockCreateServerClient.mockRejectedValue(new Error("Connection refused"));

    const result = await getJobById("job-1");

    expect(result).toBeNull();
  });
});
