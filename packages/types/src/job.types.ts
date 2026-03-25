export type JobType = "full_time" | "part_time" | "contract" | "internship";
export type JobLevel = "junior" | "mid" | "senior" | "lead";
export type JobStatus = "open" | "closed";
export type TagType = "skill" | "industry" | "level" | "location" | "position";
export type PrescreenType = "text" | "choice";

export interface Tag {
  id: string;
  name: string;
  type: TagType;
}

export interface PrescreenQuestion {
  id: string;
  job_id: string;
  order_index: number;
  type: PrescreenType;
  question: string;
  options: string[] | null;
  created_at: string;
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  spec: string | null;
  qualifications: string[];
  location: string | null;
  job_type: JobType;
  level: JobLevel;
  salary: string | null;
  status: JobStatus;
  created_by: string;
  created_at: string;
}

export interface JobWithDetails extends Job {
  tags: Tag[];
  prescreen_questions: PrescreenQuestion[];
  company: {
    id: string;
    name: string;
    logo_url: string | null;
    industry: string | null;
  };
}

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
};

export const JOB_LEVEL_LABELS: Record<JobLevel, string> = {
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
  lead: "Lead",
};
