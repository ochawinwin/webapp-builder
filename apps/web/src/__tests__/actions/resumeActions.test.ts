import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  uploadResumeAction,
  deleteResumeAction,
  setPrimaryResumeAction,
} from "@/app/actions/resumeActions";

const mockGetUser = vi.fn();
const mockFrom = vi.fn();
const mockStorageFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
    storage: { from: mockStorageFrom },
  })),
}));

const authedUser = { data: { user: { id: "user-1" } } };

function makePdfFile(name = "resume.pdf", size = 1024 * 1024): File {
  return new File(["content"], name, { type: "application/pdf" });
}

describe("uploadResumeAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when not authenticated", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const formData = new FormData();
    formData.append("resume", makePdfFile());

    const result = await uploadResumeAction(formData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("ไม่ได้เข้าสู่ระบบ");
    }
  });

  it("returns error when no file is in FormData", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const formData = new FormData();
    const result = await uploadResumeAction(formData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("ไม่พบไฟล์");
    }
  });

  it("returns error when file type is not PDF", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const wordFile = new File(["content"], "resume.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const formData = new FormData();
    formData.append("resume", wordFile);

    const result = await uploadResumeAction(formData);
    expect(result.success).toBe(false);
  });

  it("returns success when upload completes", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const storageChain = {
      upload: vi.fn().mockResolvedValueOnce({ error: null }),
      createSignedUrl: vi.fn().mockResolvedValueOnce({
        data: { signedUrl: "https://example.com/signed-url" },
      }),
    };
    mockStorageFrom.mockReturnValue(storageChain);

    const dbChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: { id: "resume-1" }, error: null }),
    };
    mockFrom.mockReturnValue(dbChain);

    const formData = new FormData();
    formData.append("resume", makePdfFile());

    const result = await uploadResumeAction(formData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.resumeId).toBe("resume-1");
    }
  });
});

describe("deleteResumeAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when not authenticated", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const result = await deleteResumeAction("resume-1");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("ไม่ได้เข้าสู่ระบบ");
    }
  });

  it("returns error when resume is not found", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const selectChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: null, error: null }),
    };
    mockFrom.mockReturnValue(selectChain);

    const result = await deleteResumeAction("resume-1");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("ไม่พบไฟล์ Resume");
    }
  });

  it("returns success when resume is deleted", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const selectChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({
        data: { file_url: "https://example.com/file", file_name: "resume.pdf" },
        error: null,
      }),
    };
    const storageChain = {
      remove: vi.fn().mockResolvedValueOnce({ error: null }),
    };
    // deleteResumeAction calls .delete().eq(id).eq(user_id) — chain must resolve on last eq
    const finalEq = vi.fn().mockResolvedValueOnce({ error: null });
    const firstEq = vi.fn().mockReturnValue({ eq: finalEq });
    const deleteChain = {
      delete: vi.fn().mockReturnValue({ eq: firstEq }),
    };

    mockFrom
      .mockReturnValueOnce(selectChain)
      .mockReturnValueOnce(deleteChain);
    mockStorageFrom.mockReturnValue(storageChain);

    const result = await deleteResumeAction("resume-1");
    expect(result.success).toBe(true);
  });
});

describe("setPrimaryResumeAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when not authenticated", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const result = await setPrimaryResumeAction("resume-1");
    expect(result.success).toBe(false);
  });

  it("returns success when primary is set", async () => {
    mockGetUser.mockResolvedValueOnce(authedUser);

    const unsetChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValueOnce({ error: null }),
    };
    const setChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    };
    // last eq for the set chain needs to resolve
    const finalEqFn = vi.fn().mockResolvedValueOnce({ error: null });
    setChain.eq = vi.fn().mockReturnValue({ eq: finalEqFn });

    mockFrom
      .mockReturnValueOnce(unsetChain)
      .mockReturnValueOnce(setChain);

    const result = await setPrimaryResumeAction("resume-1");
    expect(result.success).toBe(true);
  });
});
