"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleSavedJobAction(
  jobId: string
): Promise<{ saved: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { saved: false, error: "unauthenticated" };
    }

    const { data: existing } = await supabase
      .from("saved_jobs")
      .select("id")
      .eq("user_id", user.id)
      .eq("job_id", jobId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("id", existing.id);
      if (error) return { saved: true, error: error.message };
      revalidatePath(`/jobs/${jobId}`);
      return { saved: false };
    } else {
      const { error } = await supabase
        .from("saved_jobs")
        .insert({ user_id: user.id, job_id: jobId });
      if (error) return { saved: false, error: error.message };
      revalidatePath(`/jobs/${jobId}`);
      return { saved: true };
    }
  } catch {
    return { saved: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่" };
  }
}
