import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { JobCard } from "@/components/JobCard";
import type { JobWithDetails } from "@futurecareer/types";

// Mock next/link to render as a plain anchor
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Stub out heavy UI library components to avoid CSS import issues
vi.mock("@futurecareer/ui", () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="badge">{children}</span>
  ),
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

function makeJob(overrides: Partial<JobWithDetails> = {}): JobWithDetails {
  return {
    id: "job-1",
    company_id: "company-1",
    title: "Senior React Developer",
    description: "Build great UIs",
    spec: null,
    qualifications: ["React", "TypeScript"],
    location: "Bangkok, Thailand",
    job_type: "full_time",
    level: "senior",
    salary: "100,000 - 150,000 THB",
    status: "open",
    created_by: "hr-1",
    created_at: new Date("2020-01-01").toISOString(),
    company: {
      id: "company-1",
      name: "Acme Corp",
      logo_url: null,
      industry: "Technology",
    },
    tags: [],
    prescreen_questions: [],
    ...overrides,
  };
}

describe("JobCard", () => {
  it("renders the job title", () => {
    render(<JobCard job={makeJob()} />);
    expect(screen.getByText("Senior React Developer")).toBeInTheDocument();
  });

  it("renders the company name", () => {
    render(<JobCard job={makeJob()} />);
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
  });

  it("renders the salary when provided", () => {
    render(<JobCard job={makeJob()} />);
    expect(screen.getByText("100,000 - 150,000 THB")).toBeInTheDocument();
  });

  it("renders a fallback text when salary is null", () => {
    render(<JobCard job={makeJob({ salary: null })} />);
    expect(screen.getByText("ไม่ระบุเงินเดือน")).toBeInTheDocument();
  });

  it("renders the job location when provided", () => {
    render(<JobCard job={makeJob()} />);
    expect(screen.getByText(/Bangkok, Thailand/)).toBeInTheDocument();
  });

  it("does not render location when it is null", () => {
    render(<JobCard job={makeJob({ location: null })} />);
    expect(screen.queryByText(/Bangkok/)).not.toBeInTheDocument();
  });

  it("links to the correct job detail URL", () => {
    render(<JobCard job={makeJob({ id: "job-abc-123" })} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/jobs/job-abc-123");
  });

  it("renders job type badge", () => {
    render(<JobCard job={makeJob({ job_type: "full_time" })} />);
    expect(screen.getByText(/full.time/i)).toBeInTheDocument();
  });

  it("renders job level badge", () => {
    render(<JobCard job={makeJob({ level: "senior" })} />);
    // Use exact match to avoid collision with the title which also contains "Senior"
    expect(screen.getByText("senior")).toBeInTheDocument();
  });

  it("renders up to 4 tags", () => {
    const job = makeJob({
      tags: [
        { id: "t1", name: "React", type: "skill" },
        { id: "t2", name: "TypeScript", type: "skill" },
        { id: "t3", name: "Node.js", type: "skill" },
        { id: "t4", name: "PostgreSQL", type: "skill" },
        { id: "t5", name: "Docker", type: "skill" },
      ],
    });
    render(<JobCard job={job} />);

    expect(screen.getByText("#React")).toBeInTheDocument();
    expect(screen.getByText("#TypeScript")).toBeInTheDocument();
    expect(screen.getByText("#Node.js")).toBeInTheDocument();
    expect(screen.getByText("#PostgreSQL")).toBeInTheDocument();
    // 5th tag should be hidden behind +1 counter
    expect(screen.queryByText("#Docker")).not.toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("shows the recommended badge when userTagIds match job tags", () => {
    const job = makeJob({
      tags: [{ id: "tag-react", name: "React", type: "skill" }],
    });
    render(<JobCard job={job} userTagIds={["tag-react"]} />);
    expect(screen.getByText(/แนะนำ/)).toBeInTheDocument();
  });

  it("does not show the recommended badge when tags do not match", () => {
    const job = makeJob({
      tags: [{ id: "tag-react", name: "React", type: "skill" }],
    });
    render(<JobCard job={job} userTagIds={["tag-python"]} />);
    expect(screen.queryByText(/แนะนำ/)).not.toBeInTheDocument();
  });

  it("renders company logo when logo_url is provided", () => {
    const job = makeJob({
      company: {
        id: "c1",
        name: "Acme",
        logo_url: "https://example.com/logo.png",
        industry: null,
      },
    });
    render(<JobCard job={job} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/logo.png");
    expect(img).toHaveAttribute("alt", "Acme");
  });

  it("shows the 'ใหม่' badge for a job created within the last 24 hours", () => {
    const recentDate = new Date(Date.now() - 1000 * 60 * 30).toISOString(); // 30 min ago
    render(<JobCard job={makeJob({ created_at: recentDate })} />);
    expect(screen.getByText("ใหม่")).toBeInTheDocument();
  });

  it("does not show the 'ใหม่' badge for a job older than 24 hours", () => {
    const oldDate = new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(); // 48 hours ago
    render(<JobCard job={makeJob({ created_at: oldDate })} />);
    expect(screen.queryByText("ใหม่")).not.toBeInTheDocument();
  });
});
