import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock server action
vi.mock("@/app/actions/auth.actions", () => ({
  loginAction: vi.fn(),
}));

// Mock framer-motion to avoid animation issues in test env
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<object>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// Stub next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Stub useSearchParams to avoid Suspense boundary requirement
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  })),
  useSearchParams: vi.fn(() => ({ get: vi.fn(() => null) })),
  usePathname: vi.fn(() => "/login"),
  redirect: vi.fn(),
}));

// Stub UI components
vi.mock("@futurecareer/ui", () => ({
  Button: ({
    children,
    disabled,
    type,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    size?: string;
  }) => (
    <button type={type} disabled={disabled} {...props}>
      {children}
    </button>
  ),
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

import { loginAction } from "@/app/actions/auth.actions";
import { useRouter } from "next/navigation";
import { CandidateLoginForm } from "@/components/auth/CandidateLoginForm";

const mockLoginAction = vi.mocked(loginAction);
const mockPush = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useRouter).mockReturnValue({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  });
});

describe("CandidateLoginForm", () => {
  it("renders the email and password inputs", () => {
    render(<CandidateLoginForm />);
    // The email input has no associated label (no htmlFor/id), so query by placeholder
    expect(screen.getByPlaceholderText("example@mail.com")).toBeInTheDocument();
    // password input — not a textbox role by default, find by placeholder
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<CandidateLoginForm />);
    expect(screen.getByRole("button", { name: /เข้าสู่ระบบ/i })).toBeInTheDocument();
  });

  it("calls loginAction with form data on submit", async () => {
    mockLoginAction.mockResolvedValue({
      success: true,
      data: { redirectTo: "/search" },
    });

    render(<CandidateLoginForm />);
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText("example@mail.com"),
      "jane@example.com"
    );
    await user.type(screen.getByPlaceholderText("••••••••"), "Secret123");
    await user.click(screen.getByRole("button", { name: /เข้าสู่ระบบ/i }));

    await waitFor(() => {
      expect(mockLoginAction).toHaveBeenCalledOnce();
    });
  });

  it("redirects to /search after successful seeker login", async () => {
    mockLoginAction.mockResolvedValue({
      success: true,
      data: { redirectTo: "/search" },
    });

    render(<CandidateLoginForm />);
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText("example@mail.com"),
      "jane@example.com"
    );
    await user.type(screen.getByPlaceholderText("••••••••"), "Secret123");
    await user.click(screen.getByRole("button", { name: /เข้าสู่ระบบ/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/search");
    });
  });

  it("displays an error message when login fails", async () => {
    mockLoginAction.mockResolvedValue({
      success: false,
      error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    });

    render(<CandidateLoginForm />);
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText("example@mail.com"),
      "jane@example.com"
    );
    await user.type(screen.getByPlaceholderText("••••••••"), "WrongPass1");
    await user.click(screen.getByRole("button", { name: /เข้าสู่ระบบ/i }));

    await waitFor(() => {
      expect(
        screen.getByText("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
      ).toBeInTheDocument();
    });
  });

  it("disables the submit button while the action is pending", async () => {
    // loginAction that never resolves — simulates pending state
    mockLoginAction.mockImplementation(
      () => new Promise(() => {})
    );

    render(<CandidateLoginForm />);
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText("example@mail.com"),
      "jane@example.com"
    );
    await user.type(screen.getByPlaceholderText("••••••••"), "Secret123");

    const submitBtn = screen.getByRole("button", { name: /เข้าสู่ระบบ/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });
  });

  it("toggles password visibility when the eye button is clicked", async () => {
    render(<CandidateLoginForm />);
    const user = userEvent.setup();

    const passwordInput = screen.getByPlaceholderText("••••••••");
    expect(passwordInput).toHaveAttribute("type", "password");

    // The eye toggle is the last button with type="button" in the form
    // (the first one is the "ลืมรหัสผ่าน?" button)
    const typeButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.getAttribute("type") === "button");
    const eyeButton = typeButtons[typeButtons.length - 1];
    expect(eyeButton).toBeDefined();
    await user.click(eyeButton!);

    expect(passwordInput).toHaveAttribute("type", "text");
  });
});
