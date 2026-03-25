import { createServerClient } from "@/lib/supabase/server";
import type { Job, JobWithTags, JobWithCompany, JobStatus } from "@futurecareer/types";

export interface GetJobsFilters {
  status?: JobStatus;
  companyId?: string;
  search?: string;
  tagIds?: string[];
  limit?: number;
  offset?: number;
}

export async function getJobs(filters: GetJobsFilters = {}): Promise<JobWithCompany[]> {
  const supabase = await createServerClient();

  let query = supabase
    .from("jobs")
    .select(
      `
      *,
      company:companies(*),
      job_tags(tag:tags(*))
    `
    )
    .order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.companyId) query = query.eq("company_id", filters.companyId);
  if (filters.search) query = query.ilike("title", `%${filters.search}%`);
  if (filters.limit) query = query.limit(filters.limit);
  if (filters.offset) query = query.range(filters.offset, filters.offset + (filters.limit ?? 20) - 1);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    id: row.id,
    companyId: row.company_id,
    createdBy: row.created_by,
    title: row.title,
    description: row.description,
    qualifications: row.qualifications,
    benefits: row.benefits,
    status: row.status,
    location: row.location,
    jobType: row.job_type,
    level: row.level,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    tags: (row.job_tags ?? []).map((jt: { tag: { id: string; name: string; category: string; created_at: string } }) => ({
      id: jt.tag.id,
      name: jt.tag.name,
      category: jt.tag.category,
      createdAt: jt.tag.created_at,
    })),
    company: {
      id: row.company.id,
      name: row.company.name,
      logoUrl: row.company.logo_url,
      coverUrl: row.company.cover_url,
      shortBio: row.company.short_bio,
      fullBio: row.company.full_bio,
      industry: row.company.industry,
      size: row.company.size,
      createdAt: row.company.created_at,
      updatedAt: row.company.updated_at,
    },
  }));
}

export async function getJobById(id: string): Promise<JobWithCompany | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      *,
      company:companies(*),
      job_tags(tag:tags(*))
    `
    )
    .eq("id", id)
    .single();

  if (error) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row: any = data;

  return {
    id: row.id,
    companyId: row.company_id,
    createdBy: row.created_by,
    title: row.title,
    description: row.description,
    qualifications: row.qualifications,
    benefits: row.benefits,
    status: row.status,
    location: row.location,
    jobType: row.job_type,
    level: row.level,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    tags: (row.job_tags ?? []).map((jt: { tag: { id: string; name: string; category: string; created_at: string } }) => ({
      id: jt.tag.id,
      name: jt.tag.name,
      category: jt.tag.category,
      createdAt: jt.tag.created_at,
    })),
    company: {
      id: row.company.id,
      name: row.company.name,
      logoUrl: row.company.logo_url,
      coverUrl: row.company.cover_url,
      shortBio: row.company.short_bio,
      fullBio: row.company.full_bio,
      industry: row.company.industry,
      size: row.company.size,
      createdAt: row.company.created_at,
      updatedAt: row.company.updated_at,
    },
  };
}

export async function getJobsByCompany(companyId: string): Promise<JobWithTags[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("jobs")
    .select(`*, job_tags(tag:tags(*))`)
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any): JobWithTags => ({
    id: row.id,
    companyId: row.company_id,
    createdBy: row.created_by,
    title: row.title,
    description: row.description,
    qualifications: row.qualifications,
    benefits: row.benefits,
    status: row.status,
    location: row.location,
    jobType: row.job_type,
    level: row.level,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    tags: (row.job_tags ?? []).map((jt: { tag: { id: string; name: string; category: string; created_at: string } }) => ({
      id: jt.tag.id,
      name: jt.tag.name,
      category: jt.tag.category,
      createdAt: jt.tag.created_at,
    })),
  }));
}

export async function getJobWithPrescreen(id: string): Promise<(Job & { prescreenQuestions: unknown[] }) | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("jobs")
    .select(`*, prescreen_questions(*)`)
    .eq("id", id)
    .single();

  if (error) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row: any = data;

  return {
    id: row.id,
    companyId: row.company_id,
    createdBy: row.created_by,
    title: row.title,
    description: row.description,
    qualifications: row.qualifications,
    benefits: row.benefits,
    status: row.status,
    location: row.location,
    jobType: row.job_type,
    level: row.level,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    prescreenQuestions: row.prescreen_questions ?? [],
  };
}
