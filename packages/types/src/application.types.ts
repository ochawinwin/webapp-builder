export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "interview"
  | "hired"
  | "rejected";

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  intro_message: string;
  prescreen_answers: Record<string, string>;
  status: ApplicationStatus;
  resume_url: string;
  applied_at: string;
}

export interface ApplicationWithCandidate extends Application {
  candidate: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    email: string;
  };
}

export interface ContactViewLog {
  id: string;
  application_id: string;
  viewed_by: string;
  viewed_at: string;
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  interview: "Interview",
  hired: "Hired",
  rejected: "Rejected",
};

export const APPLICATION_STATUS_ORDER: ApplicationStatus[] = [
  "new",
  "reviewing",
  "interview",
  "hired",
  "rejected",
];
