import { describe, it, expect } from "vitest";
import {
  loginSchema,
  candidateRegisterSchema,
  companyRegisterSchema,
} from "@futurecareer/types";

// ─── loginSchema ────────────────────────────────────────────────────────────

describe("loginSchema", () => {
  it("accepts a valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a malformed email address", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret123",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toBe("รูปแบบอีเมลไม่ถูกต้อง");
  });

  it("rejects an empty email", () => {
    const result = loginSchema.safeParse({ email: "", password: "secret123" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toBe("กรุณากรอกรหัสผ่าน");
  });
});

// ─── candidateRegisterSchema ─────────────────────────────────────────────────

describe("candidateRegisterSchema", () => {
  const validCandidate = {
    email: "jane@example.com",
    password: "Password1",
    confirmPassword: "Password1",
    first_name: "Jane",
    last_name: "Doe",
  };

  it("accepts a valid candidate registration", () => {
    const result = candidateRegisterSchema.safeParse(validCandidate);
    expect(result.success).toBe(true);
  });

  it("rejects when passwords do not match", () => {
    const result = candidateRegisterSchema.safeParse({
      ...validCandidate,
      confirmPassword: "WrongPassword1",
    });
    expect(result.success).toBe(false);
    const confirmError = result.error?.errors.find(
      (e) => e.path[0] === "confirmPassword"
    );
    expect(confirmError?.message).toBe("รหัสผ่านไม่ตรงกัน");
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = candidateRegisterSchema.safeParse({
      ...validCandidate,
      password: "Short1",
      confirmPassword: "Short1",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toMatch(/8 ตัว/);
  });

  it("rejects a password without an uppercase letter", () => {
    const result = candidateRegisterSchema.safeParse({
      ...validCandidate,
      password: "nouppercase1",
      confirmPassword: "nouppercase1",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toMatch(/ตัวพิมพ์ใหญ่/);
  });

  it("rejects a password without a number", () => {
    const result = candidateRegisterSchema.safeParse({
      ...validCandidate,
      password: "NoNumber!!",
      confirmPassword: "NoNumber!!",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toMatch(/ตัวเลข/);
  });

  it("rejects a missing first_name", () => {
    const result = candidateRegisterSchema.safeParse({
      ...validCandidate,
      first_name: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toMatch(/กรุณากรอกชื่อ/);
  });

  it("rejects a missing last_name", () => {
    const result = candidateRegisterSchema.safeParse({
      ...validCandidate,
      last_name: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toMatch(/กรุณากรอกนามสกุล/);
  });
});

// ─── companyRegisterSchema ───────────────────────────────────────────────────

describe("companyRegisterSchema", () => {
  const validCompany = {
    email: "hr@acme.com",
    password: "CompanyPass1",
    confirmPassword: "CompanyPass1",
    company_name: "Acme Corp",
    industry: "Technology",
    size: "51-200" as const,
  };

  it("accepts a valid company registration", () => {
    const result = companyRegisterSchema.safeParse(validCompany);
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = companyRegisterSchema.safeParse({
      ...validCompany,
      email: "bad-email",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toBe("รูปแบบอีเมลไม่ถูกต้อง");
  });

  it("rejects a company name shorter than 2 characters", () => {
    const result = companyRegisterSchema.safeParse({
      ...validCompany,
      company_name: "A",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toMatch(/กรุณากรอกชื่อบริษัท/);
  });

  it("rejects when passwords do not match", () => {
    const result = companyRegisterSchema.safeParse({
      ...validCompany,
      confirmPassword: "DifferentPass1",
    });
    expect(result.success).toBe(false);
    const confirmError = result.error?.errors.find(
      (e) => e.path[0] === "confirmPassword"
    );
    expect(confirmError?.message).toBe("รหัสผ่านไม่ตรงกัน");
  });

  it("rejects an invalid company size enum value", () => {
    const result = companyRegisterSchema.safeParse({
      ...validCompany,
      size: "999-employees",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing industry", () => {
    const result = companyRegisterSchema.safeParse({
      ...validCompany,
      industry: "",
    });
    expect(result.success).toBe(false);
  });
});
