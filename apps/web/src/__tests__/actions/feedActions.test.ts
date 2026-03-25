import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createFeedPostAction,
  updateFeedPostAction,
  deleteFeedPostAction,
} from "@/app/actions/feedActions";

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

const authedUser = { data: { user: { id: "user-1" } } };

describe("createFeedPostAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error for invalid input (empty title)", async () => {
    const result = await createFeedPostAction("company-1", { title: "" });
    expect(result.success).toBe(false);
  });

  it("returns error when not authenticated", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const result = await createFeedPostAction("company-1", { title: "Company News" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("ไม่ได้เข้าสู่ระบบ");
    }
  });

  it("returns success when post is created", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const insertChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: { id: "post-1" }, error: null }),
    };
    mockFrom.mockReturnValue(insertChain);

    const result = await createFeedPostAction("company-1", {
      title: "Company News",
      content: "We are hiring!",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.postId).toBe("post-1");
    }
  });

  it("returns error when DB insert fails", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const insertChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: null, error: { message: "DB error" } }),
    };
    mockFrom.mockReturnValue(insertChain);

    const result = await createFeedPostAction("company-1", { title: "News" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("DB error");
    }
  });
});

describe("updateFeedPostAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error for invalid input (missing postId)", async () => {
    const result = await updateFeedPostAction({ title: "Updated" });
    expect(result.success).toBe(false);
  });

  it("returns error when not authenticated", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const result = await updateFeedPostAction({
      postId: "00000000-0000-0000-0000-000000000001",
      title: "Updated",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("ไม่ได้เข้าสู่ระบบ");
    }
  });

  it("returns success when post is updated", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const updateChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValueOnce({ error: null }),
    };
    mockFrom.mockReturnValue(updateChain);

    const result = await updateFeedPostAction({
      postId: "00000000-0000-0000-0000-000000000001",
      title: "Updated Title",
    });

    expect(result.success).toBe(true);
  });
});

describe("deleteFeedPostAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when not authenticated", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const result = await deleteFeedPostAction("post-1");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("ไม่ได้เข้าสู่ระบบ");
    }
  });

  it("returns success when post is deleted", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const deleteChain = {
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValueOnce({ error: null }),
    };
    mockFrom.mockReturnValue(deleteChain);

    const result = await deleteFeedPostAction("post-1");
    expect(result.success).toBe(true);
  });
});
