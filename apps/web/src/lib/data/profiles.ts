import { createServerClient } from "@/lib/supabase/server";
import { getSignedUrl, BUCKETS } from "@/lib/storage";
import type { Profile, Tag } from "@futurecareer/types";
import type { Tables } from "@futurecareer/supabase";

export interface ProfileWithUrls extends Profile {
  resume_signed_url: string | null;
  /** Tag IDs from a separate user-tags junction table (if present), otherwise empty */
  tags: Tag[];
}

export async function getProfileByUserId(
  userId: string
): Promise<ProfileWithUrls | null> {
  try {
    const supabase = await createServerClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !profile) return null;

    const row = profile as Tables<"profiles">;

    let resume_signed_url: string | null = null;
    if (row.resume_url) {
      // resume_url stores the storage path (not a full URL) for private bucket
      try {
        resume_signed_url = await getSignedUrl(
          BUCKETS.RESUMES,
          row.resume_url,
          3600
        );
      } catch {
        resume_signed_url = null;
      }
    }

    return {
      ...row,
      resume_signed_url,
      // Tags are stored in a separate table not yet defined; return empty array
      tags: [],
    };
  } catch {
    return null;
  }
}
