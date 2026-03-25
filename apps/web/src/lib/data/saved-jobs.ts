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
