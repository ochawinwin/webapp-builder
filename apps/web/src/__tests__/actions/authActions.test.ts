import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  registerSeekerAction,
  loginAction,
  logoutAction,
  registerCompanyAction,
  forgotPasswordAction,
  resetPasswordAction,
} from "@/app/actions/authActions";

const mockSignUp = vi.fn();
const mockSignIn = vi.fn();
const mockSignOut = vi.fn();
const mockResetPassword = vi.fn();
const mockUpdateUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      signUp: mockSignUp,
      signInWithPassword: mockSignIn,
      signOut: mockSignOut,
      resetPasswordForEmail: mockResetPassword,
      updateUser: mockUpdateUser,
    },
    from: mockFrom,
  })),
}));

describe("registerSeekerAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error for invalid input (missing fields)", async () => {
    const result = await registerSeekerAction({});
    expect(result.success).toBe(false);
  });

  it("returns error when password is too short", async () => {
    const result = await registerSeekerAction({
      fullName: "สมชาย",
      email: "test@example.com",
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
  });

  it("returns error when passwords do not match", async () => {
    const result = await registerSeekerAction({
      fullName: "สมชาย",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "mismatch123",
    });
    expect(result.success).toBe(false);
  });

  it("returns success when signUp succeeds", async () => {
    mockSignUp.mockResolvedValueOnce({ error: null });

    const result = await registerSeekerAction({
      fullName: "สมชาย ใจดี",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(true);
    expect(mockSignUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      options: { data: { full_name: "สมชาย ใจดี", user_type: "seeker" } },
    });
  });

  it("returns error when Supabase signUp fails", async () => {
    mockSignUp.mockResolvedValueOnce({ error: { message: "Email already registered" } });

    const result = await registerSeekerAction({
      fullName: "สมชาย ใจดี",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Email already registered");
    }
  });
});

describe("registerCompanyAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error for invalid input", async () => {
    const result = await registerCompanyAction({});
    expect(result.success).toBe(false);
  });

  it("returns success when all steps succeed", async () => {
    mockSignUp.mockResolvedValueOnce({
      data: { user: { id: "user-123" } },
      error: null,
    });

    const mockSelectChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: { id: "company-456" }, error: null }),
    };
    const mockMemberInsert = {
      insert: vi.fn().mockResolvedValueOnce({ error: null }),
    };

    mockFrom
      .mockReturnValueOnce(mockSelectChain)
      .mockReturnValueOnce(mockMemberInsert);

    const result = await registerCompanyAction({
      fullName: "สมชาย ใจดี",
      workEmail: "work@company.com",
      companyName: "บริษัท ทดสอบ จำกัด",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("returns error when signUp fails", async () => {
    mockSignUp.mockResolvedValueOnce({
      data: { user: null },
      error: { message: "Signup failed" },
    });

    const result = await registerCompanyAction({
      fullName: "สมชาย ใจดี",
      workEmail: "work@company.com",
      companyName: "บริษัท ทดสอบ จำกัด",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(false);
  });
});

describe("loginAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error for invalid input", async () => {
    const result = await loginAction({ email: "bad-email", password: "pass" });
    expect(result.success).toBe(false);
  });

  it("returns success when sign in succeeds", async () => {
    mockSignIn.mockResolvedValueOnce({ error: null });

    const result = await loginAction({
      email: "user@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
    expect(mockSignIn).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
  });

  it("returns error when credentials are wrong", async () => {
    mockSignIn.mockResolvedValueOnce({ error: { message: "Invalid login credentials" } });

    const result = await loginAction({
      email: "user@example.com",
      password: "wrongpassword",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Invalid login credentials");
    }
  });
});

describe("logoutAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success when sign out succeeds", async () => {
    mockSignOut.mockResolvedValueOnce({ error: null });

    const result = await logoutAction();
    expect(result.success).toBe(true);
  });

  it("returns error when sign out fails", async () => {
    mockSignOut.mockResolvedValueOnce({ error: { message: "Sign out error" } });

    const result = await logoutAction();
    expect(result.success).toBe(false);
  });
});

describe("forgotPasswordAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error for invalid email", async () => {
    const result = await forgotPasswordAction({ email: "not-email" });
    expect(result.success).toBe(false);
  });

  it("returns success when reset email is sent", async () => {
    mockResetPassword.mockResolvedValueOnce({ error: null });

    const result = await forgotPasswordAction({ email: "user@example.com" });
    expect(result.success).toBe(true);
  });
});

describe("resetPasswordAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when passwords do not match", async () => {
    const result = await resetPasswordAction({
      password: "newpassword1",
      confirmPassword: "different99",
    });
    expect(result.success).toBe(false);
  });

  it("returns success when password update succeeds", async () => {
    mockUpdateUser.mockResolvedValueOnce({ error: null });

    const result = await resetPasswordAction({
      password: "newpassword1",
      confirmPassword: "newpassword1",
    });

    expect(result.success).toBe(true);
    expect(mockUpdateUser).toHaveBeenCalledWith({ password: "newpassword1" });
  });
});
