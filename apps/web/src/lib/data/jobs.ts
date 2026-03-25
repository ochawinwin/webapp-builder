import { createServerClient } from "@/lib/supabase/server";
import type { JobWithDetails, Tag } from "@futurecareer/types";

export type JobSearchParams = {
  query?: string;
  types?: string[];
  levels?: string[];
  tagIds?: string[];
  companyId?: string;
  status?: string;
  page?: number;
  limit?: number;
};

export async function getJobs(
  params?: JobSearchParams
): Promise<{ jobs: JobWithDetails[]; total: number }> {
  try {
    const supabase = await createServerClient();

    const {
      query,
      types,
      levels,
      tagIds,
      companyId,
      status = "open",
      page = 1,
      limit = 10,
    } = params ?? {};

    const offset = (page - 1) * limit;

    let dbQuery = supabase.from("jobs").select(
      `
        *,
        company:companies!jobs_company_id_fkey(id, name, logo_url, industry),
        tags:job_tags(tag:tags(*)),
        prescreen_questions(*)
      `,
      { count: "exact" }
    );

    // Status filter — public pages always see only open jobs
    dbQuery = dbQuery.eq("status", status);

    if (query) {
      dbQuery = dbQuery.ilike("title", `%${query}%`);
    }

    if (types && types.length > 0) {
      dbQuery = dbQuery.in("job_type", types);
    }

    if (levels && levels.length > 0) {
      dbQuery = dbQuery.in("level", levels);
    }

    if (companyId) {
      dbQuery = dbQuery.eq("company_id", companyId);
    }

    dbQuery = dbQuery
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await dbQuery;

    if (error || !data) return { jobs: [], total: 0 };

    // Filter by tag IDs if provided (post-query since Supabase doesn't support
    // direct many-to-many filtering cleanly in this pattern)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let jobs = (data as any[]).map(normalizeJob);

    if (tagIds && tagIds.length > 0) {
      jobs = jobs.filter((job) =>
        tagIds.some((tagId) => job.tags.some((t) => t.id === tagId))
      );
    }

    return { jobs, total: count ?? 0 };
  } catch {
    return { jobs: [], total: 0 };
  }
}

export async function getJobById(id: string): Promise<JobWithDetails | null> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("jobs")
      .select(
        `
          *,
          company:companies!jobs_company_id_fkey(id, name, logo_url, industry),
          tags:job_tags(tag:tags(*)),
          prescreen_questions(*)
        `
      )
      .eq("id", id)
      .single();

    if (error || !data) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return normalizeJob(data as any);
  } catch {
    return null;
  }
}

export async function getJobsByCompany(
  companyId: string
): Promise<(JobWithDetails & { applicant_count: number })[]> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("jobs")
      .select(
        `
          *,
          company:companies!jobs_company_id_fkey(id, name, logo_url, industry),
          tags:job_tags(tag:tags(*)),
          prescreen_questions(*),
          applications(id)
        `
      )
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = data as any[];

    return rows.map((row) => ({
      ...normalizeJob(row),
      applicant_count: Array.isArray(row.applications)
        ? row.applications.length
        : 0,
    }));
  } catch {
    return [];
  }
}

export async function searchTags(query: string, type?: string): Promise<Tag[]> {
  try {
    const supabase = await createServerClient();

    let dbQuery = supabase
      .from("tags")
      .select("*")
      .ilike("name", `%${query}%`)
      .limit(10);

    if (type) {
      dbQuery = dbQuery.eq("type", type);
    }

    const { data, error } = await dbQuery;

    if (error || !data) return [];

    return data;
  } catch {
    return [];
  }
}

// Normalize the nested Supabase join shape into the expected JobWithDetails shape
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeJob(row: any): JobWithDetails {
  const tags: Tag[] = Array.isArray(row.tags)
    ? row.tags
        .map((jt: { tag: Tag | null }) => jt.tag)
        .filter((t: Tag | null): t is Tag => t !== null)
    : [];

  const prescreen_questions = Array.isArray(row.prescreen_questions)
    ? row.prescreen_questions
    : [];

  return {
    id: row.id,
    company_id: row.company_id,
    title: row.title,
    description: row.description,
    spec: row.spec,
    qualifications: row.qualifications ?? [],
    location: row.location,
    job_type: row.job_type,
    level: row.level,
    salary: row.salary,
    status: row.status,
    created_by: row.created_by,
    created_at: row.created_at,
    company: row.company,
    tags,
    prescreen_questions,
  };
}
