import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/data/auth";

const mockCreateServerClient = vi.mocked(createServerClient);

const mockProfile = {
  id: "user-1",
  user_type: "seeker",
  first_name: "Jane",
  last_name: "Doe",
  bio: null,
  phone: null,
  avatar_url: null,
  resume_url: null,
  created_at: new Date().toISOString(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getAuthUser", () => {
  it("returns the authenticated user with profile when session exists", async () => {
    const profileChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
    };
    const supabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-1", email: "jane@example.com" } },
          error: null,
        }),
      },
      from: vi.fn(() => profileChain),
    };
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getAuthUser();

    expect(result).not.toBeNull();
    expect(result?.user.id).toBe("user-1");
    expect(result?.user.email).toBe("jane@example.com");
    expect(result?.profile.user_type).toBe("seeker");
  });

  it("returns null when no user session exists", async () => {
    const supabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
      from: vi.fn(),
    };
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getAuthUser();

    expect(result).toBeNull();
  });

  it("returns null when there is an auth error", async () => {
    const supabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: "JWT expired" },
        }),
      },
      from: vi.fn(),
    };
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getAuthUser();

    expect(result).toBeNull();
  });

  it("returns null when the profile does not exist", async () => {
    const profileChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: { code: "PGRST116" },
      }),
    };
    const supabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-1", email: "jane@example.com" } },
          error: null,
        }),
      },
      from: vi.fn(() => profileChain),
    };
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const result = await getAuthUser();

    expect(result).toBeNull();
  });

  it("returns null when createServerClient throws an exception", async () => {
    mockCreateServerClient.mockRejectedValue(new Error("env vars missing"));

    const result = await getAuthUser();

    expect(result).toBeNull();
  });
});
