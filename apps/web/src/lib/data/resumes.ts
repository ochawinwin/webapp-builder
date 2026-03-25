import { createServerClient } from "@/lib/supabase/server";
import type { Resume } from "@futurecareer/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapResume(row: any): Resume {
  return {
    id: row.id,
    userId: row.user_id,
    fileUrl: row.file_url,
    fileName: row.file_name,
    fileSize: row.file_size,
    isPrimary: row.is_primary,
    createdAt: row.created_at,
  };
}

export async function getResumes(userId: string): Promise<Resume[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapResume);
}

export async function getResumeById(id: string): Promise<Resume | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return mapResume(data);
}
