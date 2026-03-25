import { describe, it, expect } from "vitest";
import { updateProfileSchema } from "@futurecareer/types";

const validProfile = {
  first_name: "Jane",
  last_name: "Doe",
};

describe("updateProfileSchema", () => {
  it("accepts valid first and last name", () => {
    const result = updateProfileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it("accepts optional bio and phone", () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      bio: "Software engineer with 5 years experience",
      phone: "+66 81 234 5678",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty phone string", () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      phone: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a bio longer than 1000 characters", () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      bio: "a".repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty first_name", () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      first_name: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toMatch(/First name/i);
  });

  it("rejects an empty last_name", () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      last_name: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toMatch(/Last name/i);
  });

  it("rejects an invalid phone format", () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      phone: "not-a-phone!!",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toMatch(/phone/i);
  });

  it("rejects a first_name over 100 characters", () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      first_name: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });
});
