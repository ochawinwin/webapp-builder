import { describe, it, expect, vi, beforeEach } from "vitest";
import { getProfile, getProfileWithTags } from "@/lib/data/profiles";

const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

function makeProfileRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "user-1",
    user_type: "seeker",
    full_name: "สมชาย ใจดี",
    bio: "Developer",
    avatar_url: null,
    phone: null,
    email: "user@example.com",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("getProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns profile when found", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: makeProfileRow(), error: null }),
    };
    mockFrom.mockReturnValue(chain);

    const profile = await getProfile("user-1");

    expect(profile).not.toBeNull();
    expect(profile?.id).toBe("user-1");
    expect(profile?.fullName).toBe("สมชาย ใจดี");
    expect(profile?.userType).toBe("seeker");
  });

  it("returns null when profile is not found", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } }),
    };
    mockFrom.mockReturnValue(chain);

    const profile = await getProfile("nonexistent-user");
    expect(profile).toBeNull();
  });
});

describe("getProfileWithTags", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns profile with tags joined correctly", async () => {
    const profileRow = {
      ...makeProfileRow(),
      profile_tags: [
        {
          tag: {
            id: "tag-1",
            name: "React",
            category: "skill",
            created_at: "2024-01-01T00:00:00Z",
          },
        },
        {
          tag: {
            id: "tag-2",
            name: "TypeScript",
            category: "skill",
            created_at: "2024-01-01T00:00:00Z",
          },
        },
      ],
    };

    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: profileRow, error: null }),
    };
    mockFrom.mockReturnValue(chain);

    const profile = await getProfileWithTags("user-1");

    expect(profile).not.toBeNull();
    expect(profile?.tags).toHaveLength(2);
    expect(profile?.tags[0].id).toBe("tag-1");
    expect(profile?.tags[1].name).toBe("TypeScript");
  });

  it("returns profile with empty tags array when no tags", async () => {
    const profileRow = {
      ...makeProfileRow(),
      profile_tags: [],
    };

    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: profileRow, error: null }),
    };
    mockFrom.mockReturnValue(chain);

    const profile = await getProfileWithTags("user-1");

    expect(profile?.tags).toHaveLength(0);
  });

  it("returns null when profile not found", async () => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } }),
    };
    mockFrom.mockReturnValue(chain);

    const profile = await getProfileWithTags("nonexistent");
    expect(profile).toBeNull();
  });
});
