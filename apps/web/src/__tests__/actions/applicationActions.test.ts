import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  applyJobAction,
  updateApplicationStatusAction,
} from "@/app/actions/applicationActions";

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

const authedUser = { data: { user: { id: "user-1" } } };

describe("applyJobAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error for invalid input (non-UUID resumeId)", async () => {
    const result = await applyJobAction("job-1", {
      resumeId: "not-a-uuid",
      contactEmail: "test@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("returns error for invalid contactEmail", async () => {
    const result = await applyJobAction("job-1", {
      resumeId: "00000000-0000-0000-0000-000000000001",
      contactEmail: "bad-email",
    });
    expect(result.success).toBe(false);
  });

  it("returns error when not authenticated", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const result = await applyJobAction("job-1", {
      resumeId: "00000000-0000-0000-0000-000000000001",
      contactEmail: "test@example.com",
      answers: [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("ไม่ได้เข้าสู่ระบบ");
    }
  });

  it("returns success when application is submitted", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const insertChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: { id: "app-1" }, error: null }),
    };
    mockFrom.mockReturnValue(insertChain);

    const result = await applyJobAction("job-1", {
      resumeId: "00000000-0000-0000-0000-000000000001",
      contactEmail: "test@example.com",
      answers: [],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.applicationId).toBe("app-1");
    }
  });

  it("inserts answers when provided", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const applicationInsertChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: { id: "app-1" }, error: null }),
    };
    const answerInsertChain = {
      insert: vi.fn().mockResolvedValueOnce({ error: null }),
    };

    mockFrom
      .mockReturnValueOnce(applicationInsertChain)
      .mockReturnValueOnce(answerInsertChain);

    const result = await applyJobAction("job-1", {
      resumeId: "00000000-0000-0000-0000-000000000001",
      contactEmail: "test@example.com",
      answers: [
        {
          questionId: "00000000-0000-0000-0000-000000000002",
          answerText: "My answer",
        },
      ],
    });

    expect(result.success).toBe(true);
    expect(answerInsertChain.insert).toHaveBeenCalled();
  });
});

describe("updateApplicationStatusAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error for invalid status", async () => {
    const result = await updateApplicationStatusAction({
      applicationId: "00000000-0000-0000-0000-000000000001",
      status: "invalid_status",
    });
    expect(result.success).toBe(false);
  });

  it("returns error when not authenticated", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const result = await updateApplicationStatusAction({
      applicationId: "00000000-0000-0000-0000-000000000001",
      status: "reviewing",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("ไม่ได้เข้าสู่ระบบ");
    }
  });

  it("returns success when status is updated", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const updateChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValueOnce({ error: null }),
    };
    mockFrom.mockReturnValue(updateChain);

    const result = await updateApplicationStatusAction({
      applicationId: "00000000-0000-0000-0000-000000000001",
      status: "hired",
    });

    expect(result.success).toBe(true);
  });
});
