import type { Job } from "./job.types";
import type { Profile } from "./profile.types";
import type { Resume } from "./resume.types";

export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "interview"
  | "offered"
  | "hired"
  | "rejected";

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  resumeId: string | null;
  coverMessage: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationAnswer {
  id: string;
  applicationId: string;
  questionId: string;
  answerText: string | null;
}

export interface ApplicationWithDetails extends Application {
  job: Job;
  applicant: Profile;
  resume: Resume | null;
  answers: ApplicationAnswer[];
}
