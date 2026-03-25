import { createServerClient } from "@/lib/supabase/server";
import type { Profile, ProfileWithTags } from "@futurecareer/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProfile(row: any): Profile {
  return {
    id: row.id,
    userType: row.user_type,
    fullName: row.full_name,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    phone: row.phone,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return mapProfile(data);
}

export async function getProfileWithTags(userId: string): Promise<ProfileWithTags | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(`*, profile_tags(tag:tags(*))`)
    .eq("id", userId)
    .single();

  if (error) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row: any = data;

  return {
    ...mapProfile(row),
    tags: (row.profile_tags ?? []).map((pt: { tag: { id: string; name: string; category: string; created_at: string } }) => ({
      id: pt.tag.id,
      name: pt.tag.name,
      category: pt.tag.category,
      createdAt: pt.tag.created_at,
    })),
  };
}
