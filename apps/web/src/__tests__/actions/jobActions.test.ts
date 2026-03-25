import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createJobAction,
  updateJobAction,
  deleteJobAction,
} from "@/app/actions/jobActions";

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

const authedUser = { data: { user: { id: "user-1" } } };

function makeFromChain(overrides: Record<string, unknown> = {}) {
  const chain: Record<string, unknown> = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: "job-1" }, error: null }),
    ...overrides,
  };
  return chain;
}

describe("createJobAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error for invalid input (missing title)", async () => {
    const result = await createJobAction({ description: "No title" });
    expect(result.success).toBe(false);
  });

  it("returns error when user is not authenticated", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const result = await createJobAction({ title: "Software Engineer" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("ไม่ได้เข้าสู่ระบบ");
    }
  });

  it("returns error when user has no company membership", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const membershipChain = makeFromChain({
      single: vi.fn().mockResolvedValueOnce({ data: null, error: null }),
    });
    mockFrom.mockReturnValue(membershipChain);

    const result = await createJobAction({ title: "Software Engineer" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("ไม่พบข้อมูลบริษัท");
    }
  });

  it("returns success when job is created", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const membershipChain = makeFromChain({
      single: vi.fn().mockResolvedValueOnce({ data: { company_id: "company-1" }, error: null }),
    });
    const jobChain = makeFromChain({
      single: vi.fn().mockResolvedValueOnce({ data: { id: "job-1" }, error: null }),
    });

    mockFrom
      .mockReturnValueOnce(membershipChain)
      .mockReturnValueOnce(jobChain);

    const result = await createJobAction({
      title: "Software Engineer",
      status: "draft",
      tagIds: [],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.jobId).toBe("job-1");
    }
  });

  it("inserts job_tags when tagIds are provided", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const membershipChain = makeFromChain({
      single: vi.fn().mockResolvedValueOnce({ data: { company_id: "company-1" }, error: null }),
    });
    const jobChain = makeFromChain({
      single: vi.fn().mockResolvedValueOnce({ data: { id: "job-1" }, error: null }),
    });
    const tagInsertChain = { insert: vi.fn().mockResolvedValueOnce({ error: null }) };

    mockFrom
      .mockReturnValueOnce(membershipChain)
      .mockReturnValueOnce(jobChain)
      .mockReturnValueOnce(tagInsertChain);

    const result = await createJobAction({
      title: "Software Engineer",
      tagIds: ["00000000-0000-0000-0000-000000000001"],
    });

    expect(result.success).toBe(true);
    expect(tagInsertChain.insert).toHaveBeenCalled();
  });
});

describe("updateJobAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error for invalid input", async () => {
    const result = await updateJobAction("job-1", { status: "invalid_status" });
    expect(result.success).toBe(false);
  });

  it("returns error when not authenticated", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const result = await updateJobAction("job-1", { title: "New Title" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("ไม่ได้เข้าสู่ระบบ");
    }
  });

  it("returns success when job is updated", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const updateChain = makeFromChain({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValueOnce({ error: null }),
    });
    mockFrom.mockReturnValue(updateChain);

    const result = await updateJobAction("job-1", { title: "Updated Title" });
    expect(result.success).toBe(true);
  });
});

describe("deleteJobAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when not authenticated", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const result = await deleteJobAction("job-1");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("ไม่ได้เข้าสู่ระบบ");
    }
  });

  it("returns success when job is soft-deleted (status set to closed)", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const updateChain = makeFromChain({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValueOnce({ error: null }),
    });
    mockFrom.mockReturnValue(updateChain);

    const result = await deleteJobAction("job-1");
    expect(result.success).toBe(true);
  });
});
