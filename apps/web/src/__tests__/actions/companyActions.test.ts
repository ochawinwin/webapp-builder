import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  updateCompanyAction,
  inviteRecruiterAction,
  removeTeamMemberAction,
} from "@/app/actions/companyActions";

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

const authedUser = { data: { user: { id: "user-1" } } };

describe("updateCompanyAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error for invalid input (invalid URL for logoUrl)", async () => {
    const result = await updateCompanyAction("company-1", { logoUrl: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("returns error when not authenticated", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const result = await updateCompanyAction("company-1", { name: "New Name" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("ไม่ได้เข้าสู่ระบบ");
    }
  });

  it("returns success when company is updated", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const updateChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValueOnce({ error: null }),
    };
    mockFrom.mockReturnValue(updateChain);

    const result = await updateCompanyAction("company-1", { name: "Updated Company" });
    expect(result.success).toBe(true);
  });

  it("passes partial updates correctly", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const eqFn = vi.fn().mockResolvedValueOnce({ error: null });
    const updateFn = vi.fn().mockReturnValue({ eq: eqFn });
    mockFrom.mockReturnValue({ update: updateFn });

    await updateCompanyAction("company-1", {
      shortBio: "We are awesome",
      industry: "Technology",
    });

    expect(updateFn).toHaveBeenCalledWith(
      expect.objectContaining({
        short_bio: "We are awesome",
        industry: "Technology",
      })
    );
  });
});

describe("inviteRecruiterAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error for invalid email", async () => {
    const result = await inviteRecruiterAction("company-1", { email: "bad-email" });
    expect(result.success).toBe(false);
  });

  it("returns error when not authenticated", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const result = await inviteRecruiterAction("company-1", { email: "recruiter@example.com" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("ไม่ได้เข้าสู่ระบบ");
    }
  });

  it("returns error when recruiter user is not found", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const profileChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: null, error: null }),
    };
    mockFrom.mockReturnValue(profileChain);

    const result = await inviteRecruiterAction("company-1", { email: "notfound@example.com" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("ไม่พบผู้ใช้งานที่มีอีเมลนี้");
    }
  });

  it("returns success when recruiter is invited", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const profileChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: { id: "recruiter-user-1" }, error: null }),
    };
    const memberChain = {
      insert: vi.fn().mockResolvedValueOnce({ error: null }),
    };

    mockFrom
      .mockReturnValueOnce(profileChain)
      .mockReturnValueOnce(memberChain);

    const result = await inviteRecruiterAction("company-1", { email: "recruiter@example.com" });
    expect(result.success).toBe(true);
  });
});

describe("removeTeamMemberAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when not authenticated", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const result = await removeTeamMemberAction("member-1");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("ไม่ได้เข้าสู่ระบบ");
    }
  });

  it("returns success when member is removed", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const deleteChain = {
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValueOnce({ error: null }),
    };
    mockFrom.mockReturnValue(deleteChain);

    const result = await removeTeamMemberAction("member-1");
    expect(result.success).toBe(true);
  });
});
