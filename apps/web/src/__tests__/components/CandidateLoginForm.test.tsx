import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";

// Mock server action BEFORE importing the component
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

// Stub navigation hooks — must be vi.mock'd before importing the component
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
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

function fillAndSubmitForm(email = "jane@example.com", password = "Secret123") {
  fireEvent.change(screen.getByPlaceholderText("example@mail.com"), {
    target: { value: email },
  });
  fireEvent.change(screen.getByPlaceholderText("••••••••"), {
    target: { value: password },
  });
  fireEvent.submit(screen.getByRole("button", { name: /เข้าสู่ระบบ/i }).closest("form")!);
}

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
    // The email input has no accessible label linked via htmlFor/id
    expect(screen.getByPlaceholderText("example@mail.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<CandidateLoginForm />);
    expect(
      screen.getByRole("button", { name: /เข้าสู่ระบบ/i })
    ).toBeInTheDocument();
  });

  it("calls loginAction with form data on submit", async () => {
    mockLoginAction.mockResolvedValue({
      success: true,
      data: { redirectTo: "/search" },
    });

    render(<CandidateLoginForm />);

    await act(async () => {
      fillAndSubmitForm();
    });

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

    await act(async () => {
      fillAndSubmitForm();
    });

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

    await act(async () => {
      fillAndSubmitForm();
    });

    await waitFor(() => {
      expect(
        screen.getByText("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
      ).toBeInTheDocument();
    });
  });

  it("shows loading text on the submit button while action is pending", async () => {
    // Never resolves — simulates a perpetually pending action
    mockLoginAction.mockImplementation(() => new Promise(() => {}));

    render(<CandidateLoginForm />);

    await act(async () => {
      fillAndSubmitForm();
    });

    // After submit, the button should show the loading label and be disabled
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /กำลังเข้าสู่ระบบ/i })
      ).toBeDisabled();
    });
  });

  it("toggles password visibility when the eye button is clicked", () => {
    render(<CandidateLoginForm />);

    const passwordInput = screen.getByPlaceholderText("••••••••");
    expect(passwordInput).toHaveAttribute("type", "password");

    // The eye toggle is the last type="button" in the form.
    // There are two type="button" elements: "ลืมรหัสผ่าน?" and the eye icon.
    const typeButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.getAttribute("type") === "button");
    const eyeButton = typeButtons[typeButtons.length - 1];
    expect(eyeButton).toBeDefined();

    fireEvent.click(eyeButton);

    expect(passwordInput).toHaveAttribute("type", "text");
  });
});
