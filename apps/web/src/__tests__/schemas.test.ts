import { describe, it, expect } from "vitest";
import {
  registerSeekerSchema,
  registerCompanySchema,
  loginSchema,
  createJobSchema,
  applyJobSchema,
  updateCompanySchema,
  inviteRecruiterSchema,
  uploadResumeSchema,
  updateApplicationStatusSchema,
  createFeedPostSchema,
  updateJobSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@futurecareer/types";

describe("registerSeekerSchema", () => {
  it("passes with valid input", () => {
    const result = registerSeekerSchema.safeParse({
      fullName: "สมชาย ใจดี",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("fails when fullName is missing", () => {
    const result = registerSeekerSchema.safeParse({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("fails when email is invalid", () => {
    const result = registerSeekerSchema.safeParse({
      fullName: "สมชาย ใจดี",
      email: "not-an-email",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("fails when password is shorter than 8 characters", () => {
    const result = registerSeekerSchema.safeParse({
      fullName: "สมชาย ใจดี",
      email: "test@example.com",
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });

  it("fails when passwords do not match", () => {
    const result = registerSeekerSchema.safeParse({
      fullName: "สมชาย ใจดี",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "different123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword).toBeDefined();
    }
  });
});

describe("registerCompanySchema", () => {
  it("passes with valid input", () => {
    const result = registerCompanySchema.safeParse({
      fullName: "สมชาย ใจดี",
      workEmail: "work@company.com",
      companyName: "บริษัท ทดสอบ จำกัด",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("fails when companyName is missing", () => {
    const result = registerCompanySchema.safeParse({
      fullName: "สมชาย ใจดี",
      workEmail: "work@company.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("fails when workEmail is invalid", () => {
    const result = registerCompanySchema.safeParse({
      fullName: "สมชาย ใจดี",
      workEmail: "invalid-email",
      companyName: "บริษัท ทดสอบ จำกัด",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("fails when passwords do not match", () => {
    const result = registerCompanySchema.safeParse({
      fullName: "สมชาย ใจดี",
      workEmail: "work@company.com",
      companyName: "บริษัท ทดสอบ จำกัด",
      password: "password123",
      confirmPassword: "mismatch123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword).toBeDefined();
    }
  });

  it("fails when password is too short", () => {
    const result = registerCompanySchema.safeParse({
      fullName: "สมชาย ใจดี",
      workEmail: "work@company.com",
      companyName: "บริษัท ทดสอบ จำกัด",
      password: "1234567",
      confirmPassword: "1234567",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("passes with valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "mypassword",
    });
    expect(result.success).toBe(true);
  });

  it("fails with invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-email",
      password: "mypassword",
    });
    expect(result.success).toBe(false);
  });

  it("fails with empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("passes with valid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "user@example.com" });
    expect(result.success).toBe(true);
  });

  it("fails with invalid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "bad-email" });
    expect(result.success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("passes with matching passwords", () => {
    const result = resetPasswordSchema.safeParse({
      password: "newpassword1",
      confirmPassword: "newpassword1",
    });
    expect(result.success).toBe(true);
  });

  it("fails when passwords do not match", () => {
    const result = resetPasswordSchema.safeParse({
      password: "newpassword1",
      confirmPassword: "different99",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword).toBeDefined();
    }
  });

  it("fails when password is too short", () => {
    const result = resetPasswordSchema.safeParse({
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
  });
});

describe("createJobSchema", () => {
  it("passes with only required title", () => {
    const result = createJobSchema.safeParse({ title: "Software Engineer" });
    expect(result.success).toBe(true);
  });

  it("passes with all fields", () => {
    const result = createJobSchema.safeParse({
      title: "Software Engineer",
      description: "Build cool stuff",
      qualifications: "3+ years experience",
      benefits: "Health insurance",
      location: "Bangkok",
      jobType: "full-time",
      level: "mid",
      status: "active",
      tagIds: ["00000000-0000-0000-0000-000000000001"],
    });
    expect(result.success).toBe(true);
  });

  it("fails when title is missing", () => {
    const result = createJobSchema.safeParse({ description: "No title here" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title).toBeDefined();
    }
  });

  it("fails with invalid status value", () => {
    const result = createJobSchema.safeParse({
      title: "Engineer",
      status: "unknown_status",
    });
    expect(result.success).toBe(false);
  });

  it("defaults tagIds to empty array", () => {
    const result = createJobSchema.safeParse({ title: "Engineer" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tagIds).toEqual([]);
    }
  });
});

describe("updateJobSchema", () => {
  it("passes with partial input", () => {
    const result = updateJobSchema.safeParse({ title: "Updated Title" });
    expect(result.success).toBe(true);
  });

  it("passes with empty object", () => {
    const result = updateJobSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe("applyJobSchema", () => {
  it("passes with valid input", () => {
    const result = applyJobSchema.safeParse({
      resumeId: "00000000-0000-0000-0000-000000000001",
      contactEmail: "applicant@example.com",
      answers: [],
    });
    expect(result.success).toBe(true);
  });

  it("fails with invalid resumeId (not UUID)", () => {
    const result = applyJobSchema.safeParse({
      resumeId: "not-a-uuid",
      contactEmail: "applicant@example.com",
      answers: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.resumeId).toBeDefined();
    }
  });

  it("fails with invalid contactEmail", () => {
    const result = applyJobSchema.safeParse({
      resumeId: "00000000-0000-0000-0000-000000000001",
      contactEmail: "bad-email",
      answers: [],
    });
    expect(result.success).toBe(false);
  });

  it("defaults answers to empty array", () => {
    const result = applyJobSchema.safeParse({
      resumeId: "00000000-0000-0000-0000-000000000001",
      contactEmail: "applicant@example.com",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.answers).toEqual([]);
    }
  });
});

describe("updateCompanySchema", () => {
  it("passes with partial input", () => {
    const result = updateCompanySchema.safeParse({ name: "New Company Name" });
    expect(result.success).toBe(true);
  });

  it("passes with empty object", () => {
    const result = updateCompanySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("fails when name is empty string", () => {
    const result = updateCompanySchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("fails when logoUrl is not a valid URL", () => {
    const result = updateCompanySchema.safeParse({ logoUrl: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("passes when logoUrl is null", () => {
    const result = updateCompanySchema.safeParse({ logoUrl: null });
    expect(result.success).toBe(true);
  });
});

describe("inviteRecruiterSchema", () => {
  it("passes with valid email", () => {
    const result = inviteRecruiterSchema.safeParse({ email: "recruiter@company.com" });
    expect(result.success).toBe(true);
  });

  it("fails with invalid email", () => {
    const result = inviteRecruiterSchema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
  });
});

describe("uploadResumeSchema", () => {
  it("passes with valid PDF file metadata", () => {
    const result = uploadResumeSchema.safeParse({
      fileName: "my-resume.pdf",
      fileSize: 1 * 1024 * 1024, // 1MB
      fileType: "application/pdf",
    });
    expect(result.success).toBe(true);
  });

  it("fails when fileSize exceeds 10MB", () => {
    const result = uploadResumeSchema.safeParse({
      fileName: "large-resume.pdf",
      fileSize: 11 * 1024 * 1024, // 11MB
      fileType: "application/pdf",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.fileSize).toBeDefined();
    }
  });

  it("fails when fileType is not PDF", () => {
    const result = uploadResumeSchema.safeParse({
      fileName: "resume.docx",
      fileSize: 1024,
      fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.fileType).toBeDefined();
    }
  });

  it("fails when fileName is empty", () => {
    const result = uploadResumeSchema.safeParse({
      fileName: "",
      fileSize: 1024,
      fileType: "application/pdf",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateApplicationStatusSchema", () => {
  it("passes with valid status values", () => {
    const statuses = ["new", "reviewing", "interview", "offered", "hired", "rejected"] as const;
    for (const status of statuses) {
      const result = updateApplicationStatusSchema.safeParse({
        applicationId: "00000000-0000-0000-0000-000000000001",
        status,
      });
      expect(result.success).toBe(true);
    }
  });

  it("fails with invalid status", () => {
    const result = updateApplicationStatusSchema.safeParse({
      applicationId: "00000000-0000-0000-0000-000000000001",
      status: "pending",
    });
    expect(result.success).toBe(false);
  });

  it("fails with non-UUID applicationId", () => {
    const result = updateApplicationStatusSchema.safeParse({
      applicationId: "not-uuid",
      status: "reviewing",
    });
    expect(result.success).toBe(false);
  });
});

describe("createFeedPostSchema", () => {
  it("passes with required title", () => {
    const result = createFeedPostSchema.safeParse({ title: "Company Update" });
    expect(result.success).toBe(true);
  });

  it("fails when title is empty", () => {
    const result = createFeedPostSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("fails when imageUrl is not a valid URL", () => {
    const result = createFeedPostSchema.safeParse({
      title: "Post",
      imageUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("passes when imageUrl is null", () => {
    const result = createFeedPostSchema.safeParse({ title: "Post", imageUrl: null });
    expect(result.success).toBe(true);
  });
});
