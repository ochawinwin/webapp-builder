import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSupabaseMock } from "@/test/mocks/supabase";

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(),
}));

vi.mock("@/lib/data/companies", () => ({
  getCompanyByMembership: vi.fn(),
}));

vi.mock("@/lib/storage", () => ({
  uploadFile: vi.fn(),
  BUCKETS: { LOGOS: "logos", POSTS: "posts", RESUMES: "resumes", AVATARS: "avatars" },
}));

import { createServerClient } from "@/lib/supabase/server";
import { getCompanyByMembership } from "@/lib/data/companies";
import { updateCompanyAction } from "@/app/actions/company.actions";

const mockCreateServerClient = vi.mocked(createServerClient);
const mockGetCompanyByMembership = vi.mocked(getCompanyByMembership);

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const adminMembership = {
  company: { id: "company-1", name: "Acme Corp", logo_url: null, industry: null },
  role: "admin" as const,
};

const recruiterMembership = {
  company: { id: "company-1", name: "Acme Corp", logo_url: null, industry: null },
  role: "recruiter" as const,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateCompanyAction", () => {
  it("succeeds for an admin user with valid data", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "admin-1", email: "admin@corp.com" },
    });
    const updateChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    };
    supabase.from = vi.fn(() => updateChain as never);

    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetCompanyByMembership.mockResolvedValue(adminMembership);

    const fd = makeFormData({
      name: "Acme Technologies",
      contact_email: "hr@acme.com",
      website: "https://acme.com",
    });
    const result = await updateCompanyAction(fd);

    expect(result.success).toBe(true);
  });

  it("returns a permission error when a recruiter attempts to update company data", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "recruiter-1", email: "recruiter@corp.com" },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetCompanyByMembership.mockResolvedValue(recruiterMembership);

    const fd = makeFormData({ name: "Changed Name" });
    const result = await updateCompanyAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns a validation error when the company name is too short", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "admin-1", email: "admin@corp.com" },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetCompanyByMembership.mockResolvedValue(adminMembership);

    const fd = makeFormData({ name: "A" });
    const result = await updateCompanyAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns a validation error for an invalid contact_email", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "admin-1", email: "admin@corp.com" },
    });
    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetCompanyByMembership.mockResolvedValue(adminMembership);

    const fd = makeFormData({ name: "Acme Corp", contact_email: "not-valid-email" });
    const result = await updateCompanyAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns an auth error when no user is logged in", async () => {
    const supabase = createSupabaseMock({ authUser: null });
    mockCreateServerClient.mockResolvedValue(supabase as never);

    const fd = makeFormData({ name: "Acme Corp" });
    const result = await updateCompanyAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("returns an error when the DB update fails", async () => {
    const supabase = createSupabaseMock({
      authUser: { id: "admin-1", email: "admin@corp.com" },
    });
    const failChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: { message: "DB error" } }),
    };
    supabase.from = vi.fn(() => failChain as never);

    mockCreateServerClient.mockResolvedValue(supabase as never);
    mockGetCompanyByMembership.mockResolvedValue(adminMembership);

    const fd = makeFormData({ name: "Valid Name" });
    const result = await updateCompanyAction(fd);

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
