import type { Tag } from "./tag.types";
import type { Company } from "./company.types";

export type JobStatus = "draft" | "active" | "paused" | "closed";

export interface Job {
  id: string;
  companyId: string;
  createdBy: string;
  title: string;
  description: string | null;
  qualifications: string | null;
  benefits: string | null;
  status: JobStatus;
  location: string | null;
  jobType: string | null;
  level: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobWithTags extends Job {
  tags: Tag[];
}

export interface JobWithCompany extends JobWithTags {
  company: Company;
}
