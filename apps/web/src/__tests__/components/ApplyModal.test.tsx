import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/app/actions/application.actions", () => ({
  submitApplicationAction: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@futurecareer/ui", () => ({
  Dialog: ({
    open,
    children,
    title,
  }: {
    open: boolean;
    onOpenChange?: (v: boolean) => void;
    title?: string;
    children: React.ReactNode;
  }) =>
    open ? (
      <div role="dialog" aria-label={title}>
        {children}
      </div>
    ) : null,
  Button: ({
    children,
    disabled,
    type,
    onClick,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    variant?: string;
    size?: string;
  }) => (
    <button type={type} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  ),
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

import { submitApplicationAction } from "@/app/actions/application.actions";
import { ApplyModal } from "@/components/ApplyModal";

const mockSubmitApplicationAction = vi.mocked(submitApplicationAction);
const mockOnClose = vi.fn();
const mockOnSuccess = vi.fn();

const defaultProps = {
  jobId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  jobTitle: "Frontend Developer",
  companyName: "Acme Corp",
  companyLogoUrl: null,
  prescreenQuestions: [],
  resumeFileName: "my-resume.pdf",
  resumeSignedUrl: "https://storage.example.com/resume.pdf",
  isOpen: true,
  onClose: mockOnClose,
  onSuccess: mockOnSuccess,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ApplyModal", () => {
  it("does not render when isOpen is false", () => {
    render(<ApplyModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the modal when isOpen is true", () => {
    render(<ApplyModal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders the job title and company name", () => {
    render(<ApplyModal {...defaultProps} />);
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
  });

  it("renders the resume filename when provided", () => {
    render(<ApplyModal {...defaultProps} />);
    expect(screen.getByText("my-resume.pdf")).toBeInTheDocument();
  });

  it("shows an upload prompt when no resume is provided", () => {
    render(
      <ApplyModal
        {...defaultProps}
        resumeFileName={null}
        resumeSignedUrl={null}
      />
    );
    expect(
      screen.getByText(/คุณยังไม่มี Resume ในระบบ/)
    ).toBeInTheDocument();
  });

  it("renders prescreen questions when provided", () => {
    const questions = [
      {
        id: "q-1",
        question: "Do you have 3 years of React experience?",
        type: "text" as const,
      },
    ];
    render(<ApplyModal {...defaultProps} prescreenQuestions={questions} />);
    expect(
      screen.getByText(/Do you have 3 years of React experience/)
    ).toBeInTheDocument();
  });

  it("calls submitApplicationAction and onSuccess when the form is submitted successfully", async () => {
    mockSubmitApplicationAction.mockResolvedValue({ success: true });

    render(<ApplyModal {...defaultProps} />);
    const user = userEvent.setup();

    const introArea = screen.getByPlaceholderText(/เขียนแนะนำตัว/);
    await user.type(
      introArea,
      "I am highly motivated and have excellent skills for this role in React."
    );

    await user.click(screen.getByRole("button", { name: /ส่งใบสมัคร/i }));

    await waitFor(() => {
      expect(mockSubmitApplicationAction).toHaveBeenCalledOnce();
      expect(mockOnSuccess).toHaveBeenCalledOnce();
      expect(mockOnClose).toHaveBeenCalledOnce();
    });
  });

  it("shows an error message when the action returns an error", async () => {
    mockSubmitApplicationAction.mockResolvedValue({
      success: false,
      error: "กรุณาอัปโหลด Resume ก่อนสมัครงาน",
    });

    render(<ApplyModal {...defaultProps} />);
    const user = userEvent.setup();

    const introArea = screen.getByPlaceholderText(/เขียนแนะนำตัว/);
    await user.type(introArea, "Some intro message that is long enough to pass validation.");

    await user.click(screen.getByRole("button", { name: /ส่งใบสมัคร/i }));

    await waitFor(() => {
      expect(
        screen.getByText("กรุณาอัปโหลด Resume ก่อนสมัครงาน")
      ).toBeInTheDocument();
    });
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("calls onClose when the cancel button is clicked", async () => {
    render(<ApplyModal {...defaultProps} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /ยกเลิก/i }));

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it("disables submit and cancel buttons while action is pending", async () => {
    mockSubmitApplicationAction.mockImplementation(
      () => new Promise(() => {})
    );

    render(<ApplyModal {...defaultProps} />);
    const user = userEvent.setup();

    const introArea = screen.getByPlaceholderText(/เขียนแนะนำตัว/);
    await user.type(introArea, "I am very interested in this position.");

    const submitBtn = screen.getByRole("button", { name: /ส่งใบสมัคร/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });
    expect(screen.getByRole("button", { name: /ยกเลิก/i })).toBeDisabled();
  });
});
