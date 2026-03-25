import { createServerClient } from "@/lib/supabase/server";
import type { Profile } from "@futurecareer/types";
import type { Tables } from "@futurecareer/supabase";

export interface AuthUser {
  user: {
    id: string;
    email: string;
  };
  profile: Profile;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) return null;

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profileData) return null;

    const profile = profileData as Tables<"profiles">;

    return {
      user: {
        id: user.id,
        email: user.email ?? "",
      },
      profile,
    };
  } catch {
    return null;
  }
}
