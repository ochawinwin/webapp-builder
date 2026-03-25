import { createServerClient } from "@/lib/supabase/server";
import { getSignedUrl, BUCKETS } from "@/lib/storage";
import type { Application, ApplicationWithCandidate } from "@futurecareer/types";
import type { Tables } from "@futurecareer/supabase";

type ApplicationRow = Tables<"applications">;
type ProfileRow = Tables<"profiles">;

type ProfileSnippet = Pick<ProfileRow, "id" | "first_name" | "last_name" | "avatar_url" | "phone">;

// PostgREST cannot join across auth.users → public.profiles via FK hints.
// Instead we fetch applications first, then profiles separately and merge.

export async function getApplicationsByJob(
  jobId: string,
  companyId: string
): Promise<ApplicationWithCandidate[]> {
  try {
    const supabase = await createServerClient();

    // Verify the job belongs to the company before returning data
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id")
      .eq("id", jobId)
      .eq("company_id", companyId)
      .single();

    if (jobError || !job) return [];

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("job_id", jobId)
      .order("applied_at", { ascending: false });

    if (error || !data) return [];

    const rows = data as ApplicationRow[];

    // Fetch profiles separately to avoid cross-schema FK join issues
    const candidateIds = [...new Set(rows.map((r) => r.candidate_id))];
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, avatar_url, phone")
      .in("id", candidateIds);

    const profileMap = new Map<string, ProfileSnippet>(
      ((profilesData ?? []) as ProfileSnippet[]).map((p) => [p.id, p])
    );

    return rows.map((row) => {
      const candidate = profileMap.get(row.candidate_id);
      return {
        id: row.id,
        job_id: row.job_id,
        candidate_id: row.candidate_id,
        intro_message: row.intro_message,
        prescreen_answers: (row.prescreen_answers as Record<string, string>) ?? {},
        status: row.status,
        resume_url: row.resume_url,
        applied_at: row.applied_at,
        candidate: {
          id: candidate?.id ?? row.candidate_id,
          first_name: candidate?.first_name ?? null,
          last_name: candidate?.last_name ?? null,
          avatar_url: candidate?.avatar_url ?? null,
          phone: candidate?.phone ?? null,
          email: "", // populated via viewContactAction to avoid bulk exposure
        },
      };
    });
  } catch {
    return [];
  }
}

export async function getApplicationsByUser(
  userId: string
): Promise<Application[]> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("candidate_id", userId)
      .order("applied_at", { ascending: false });

    if (error || !data) return [];

    const rows = data as ApplicationRow[];

    return rows.map((row) => ({
      ...row,
      prescreen_answers: (row.prescreen_answers as Record<string, string>) ?? {},
    }));
  } catch {
    return [];
  }
}

export async function getApplicationById(
  appId: string
): Promise<ApplicationWithCandidate | null> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("id", appId)
      .single();

    if (error || !data) return null;

    const row = data as ApplicationRow;

    // Fetch profile separately
    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, avatar_url, phone")
      .eq("id", row.candidate_id)
      .single();

    const candidate = profileData as ProfileSnippet | null;

    let resumeUrl = row.resume_url;
    if (resumeUrl && !resumeUrl.startsWith("http")) {
      try {
        resumeUrl = await getSignedUrl(BUCKETS.RESUMES, resumeUrl, 3600);
      } catch {
        resumeUrl = row.resume_url;
      }
    }

    return {
      id: row.id,
      job_id: row.job_id,
      candidate_id: row.candidate_id,
      intro_message: row.intro_message,
      prescreen_answers: (row.prescreen_answers as Record<string, string>) ?? {},
      status: row.status,
      resume_url: resumeUrl,
      applied_at: row.applied_at,
      candidate: {
        id: candidate?.id ?? row.candidate_id,
        first_name: candidate?.first_name ?? null,
        last_name: candidate?.last_name ?? null,
        avatar_url: candidate?.avatar_url ?? null,
        phone: candidate?.phone ?? null,
        email: "",
      },
    };
  } catch {
    return null;
  }
}
