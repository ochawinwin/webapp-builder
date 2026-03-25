import { createServerClient } from "@/lib/supabase/server";

export async function getSavedJobIdsByUser(userId: string): Promise<string[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("saved_jobs")
      .select("job_id")
      .eq("user_id", userId);
    if (error || !data) return [];
    return data.map((r) => r.job_id);
  } catch {
    return [];
  }
}

export async function isJobSavedByUser(
  userId: string,
  jobId: string
): Promise<boolean> {
  try {
    const supabase = await createServerClient();
    const { data } = await supabase
      .from("saved_jobs")
      .select("id")
      .eq("user_id", userId)
      .eq("job_id", jobId)
      .maybeSingle();
    return !!data;
  } catch {
    return false;
  }
}

export interface SavedJobEntry {
  id: string;
  job_id: string;
  saved_at: string;
  job: {
    id: string;
    title: string;
    location: string | null;
    salary: string | null;
    job_type: string | null;
    company: { name: string; logo_url: string | null } | null;
  } | null;
}

export async function getSavedJobsByUser(
  userId: string
): Promise<SavedJobEntry[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("saved_jobs")
      .select(
        "id, job_id, saved_at, job:jobs(id, title, location, salary, job_type, company:companies(name, logo_url))"
      )
      .eq("user_id", userId)
      .order("saved_at", { ascending: false });

    if (error || !data) return [];
    return data as unknown as SavedJobEntry[];
  } catch {
    return [];
  }
}
