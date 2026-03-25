import { describe, it, expect } from "vitest";
import { createJobSchema, updateJobStatusSchema } from "@futurecareer/types";

const validJob = {
  title: "Senior Frontend Engineer",
  description: "We are looking for a skilled frontend engineer to join our team.",
  qualifications: ["3+ years React experience", "TypeScript proficiency"],
  job_type: "full_time" as const,
  level: "senior" as const,
};

describe("createJobSchema", () => {
  it("accepts a valid job with all required fields", () => {
    const result = createJobSchema.safeParse(validJob);
    expect(result.success).toBe(true);
  });

  it("accepts a valid job with all optional fields", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      spec: "Remote-friendly team",
      location: "Bangkok, Thailand",
      salary: "80,000 - 120,000 THB",
      tag_ids: ["3fa85f64-5717-4562-b3fc-2c963f66afa6"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects when title is missing", () => {
    const result = createJobSchema.safeParse({ ...validJob, title: "" });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toMatch(/Job title/i);
  });

  it("rejects when description is too short", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      description: "Short",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toMatch(/Description/i);
  });

  it("rejects when qualifications array is empty", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      qualifications: [],
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toMatch(/qualification/i);
  });

  it("rejects an invalid job_type enum", () => {
    const result = createJobSchema.safeParse({
      ...validJob,
      job_type: "freelance",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid level enum", () => {
    const result = createJobSchema.safeParse({ ...validJob, level: "expert" });
    expect(result.success).toBe(false);
  });

  it("defaults tag_ids to an empty array when omitted", () => {
    const result = createJobSchema.safeParse(validJob);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tag_ids).toEqual([]);
    }
  });

  it("defaults prescreen_questions to an empty array when omitted", () => {
    const result = createJobSchema.safeParse(validJob);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.prescreen_questions).toEqual([]);
    }
  });
});

describe("updateJobStatusSchema", () => {
  it("accepts valid id and open status", () => {
    const result = updateJobStatusSchema.safeParse({
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      status: "open",
    });
    expect(result.success).toBe(true);
  });

  it("accepts closed status", () => {
    const result = updateJobStatusSchema.safeParse({
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      status: "closed",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a non-uuid id", () => {
    const result = updateJobStatusSchema.safeParse({
      id: "not-a-uuid",
      status: "open",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown status", () => {
    const result = updateJobStatusSchema.safeParse({
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      status: "archived",
    });
    expect(result.success).toBe(false);
  });
});
