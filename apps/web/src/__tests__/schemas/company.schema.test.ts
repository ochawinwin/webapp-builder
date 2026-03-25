import { describe, it, expect } from "vitest";
import { updateCompanySchema } from "@futurecareer/types";

const validCompany = {
  name: "Acme Technologies",
};

describe("updateCompanySchema", () => {
  it("accepts a valid company update with only name", () => {
    const result = updateCompanySchema.safeParse(validCompany);
    expect(result.success).toBe(true);
  });

  it("accepts a full valid company update", () => {
    const result = updateCompanySchema.safeParse({
      name: "Acme Technologies",
      short_bio: "Building the future",
      full_bio: "Acme is a technology company focused on innovation.",
      industry: "Software",
      size: "51-200" as const,
      website: "https://acme.com",
      contact_email: "hr@acme.com",
      contact_phone: "+66 2 123 4567",
      location: "Bangkok, Thailand",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a company name shorter than 2 characters", () => {
    const result = updateCompanySchema.safeParse({ name: "A" });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toMatch(/Company name/i);
  });

  it("rejects an invalid contact_email", () => {
    const result = updateCompanySchema.safeParse({
      ...validCompany,
      contact_email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty contact_email string", () => {
    const result = updateCompanySchema.safeParse({
      ...validCompany,
      contact_email: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a short_bio longer than 300 characters", () => {
    const result = updateCompanySchema.safeParse({
      ...validCompany,
      short_bio: "a".repeat(301),
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid size enum value", () => {
    const result = updateCompanySchema.safeParse({
      ...validCompany,
      size: "10000+",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid size enum values", () => {
    const sizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"] as const;
    for (const size of sizes) {
      const result = updateCompanySchema.safeParse({ ...validCompany, size });
      expect(result.success).toBe(true);
    }
  });
});
