import { describe, it, expect } from "vitest";
import { submitApplicationSchema } from "@futurecareer/types";

const validApplication = {
  job_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  intro_message: "I am very interested in this position and believe my skills match.",
  prescreen_answers: {},
  use_profile_resume: true,
};

describe("submitApplicationSchema", () => {
  it("accepts a valid application", () => {
    const result = submitApplicationSchema.safeParse(validApplication);
    expect(result.success).toBe(true);
  });

  it("accepts an application with prescreen answers", () => {
    const result = submitApplicationSchema.safeParse({
      ...validApplication,
      prescreen_answers: {
        "q-uuid-1": "Yes, I have 5 years experience",
        "q-uuid-2": "Full-time",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing job_id", () => {
    const result = submitApplicationSchema.safeParse({
      ...validApplication,
      job_id: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-uuid job_id", () => {
    const result = submitApplicationSchema.safeParse({
      ...validApplication,
      job_id: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an intro_message shorter than 10 characters", () => {
    const result = submitApplicationSchema.safeParse({
      ...validApplication,
      intro_message: "Hi",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toMatch(/10 characters/);
  });

  it("rejects an intro_message longer than 2000 characters", () => {
    const result = submitApplicationSchema.safeParse({
      ...validApplication,
      intro_message: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects when use_profile_resume is not a boolean", () => {
    const result = submitApplicationSchema.safeParse({
      ...validApplication,
      use_profile_resume: "yes",
    });
    expect(result.success).toBe(false);
  });
});
