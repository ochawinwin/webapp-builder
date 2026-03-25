import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSupabaseMock } from "@/test/mocks/supabase";

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(),
}));

vi.mock("@/lib/storage", () => ({
  uploadFile: vi.fn(),
  BUCKETS: { LOGOS: "logos", POSTS: "posts", RESUMES: "resumes", AVATARS: "avatars" },
}));

import { createServerClient } from "@/lib/supabase/server";
import { updateProfileAction } from "@/app/actions/profile.actions";

const mockCreateServerClient = vi.mocked(createServerClient);

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const validProfile = {
  first_name: "Jane",
  last_name: "Doe",
  bio: "Software engineer",
  phone: "+66 81 234 5678",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateProfileAction", () => {
  it("updates profile successfully for an authenticated user", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "user-1", email: "jane@example.com" },
    });
    const updateChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    };
    supabase.from = vi.fn(() => updateChain as never);
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData(validProfile);
    const result = await updateProfileAction(fd);

    expect(result.success).toBe(true);
  });

  it("returns an auth error when the user is not logged in", async () => {
    const supabase = createSupabaseMock({ authUser: null });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData(validProfile);
    const result = await updateProfileAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns a validation error when first_name is empty", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "user-1", email: "jane@example.com" },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({ ...validProfile, first_name: "" });
    const result = await updateProfileAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns a validation error when bio exceeds 1000 characters", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "user-1", email: "jane@example.com" },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({ ...validProfile, bio: "a".repeat(1001) });
    const result = await updateProfileAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns a DB error when the Supabase update fails", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "user-1", email: "jane@example.com" },
    });
    const failChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: { message: "DB error" } }),
    };
    supabase.from = vi.fn(() => failChain as never);
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData(validProfile);
    const result = await updateProfileAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
