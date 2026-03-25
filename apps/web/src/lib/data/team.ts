import { createServerClient } from "@/lib/supabase/server";
import type { CompanyMember, Profile } from "@futurecareer/types";
import type { Tables } from "@futurecareer/supabase";

type MemberRow = Tables<"company_members">;
type ProfileRow = Tables<"profiles">;

// PostgREST cannot join across auth.users → public.profiles via FK hints.
// Fetch members first, then profiles separately and merge.

export async function getCompanyMembers(
  companyId: string
): Promise<(CompanyMember & { profile: Profile })[]> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("company_members")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: true });

    if (error || !data) return [];

    const rows = data as MemberRow[];
    const userIds = rows.map((r) => r.user_id);

    const { data: profilesData } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userIds);

    const profileMap = new Map<string, ProfileRow>(
      ((profilesData ?? []) as ProfileRow[]).map((p) => [p.id, p])
    );

    return rows
      .filter((row) => profileMap.has(row.user_id))
      .map((row) => ({
        id: row.id,
        company_id: row.company_id,
        user_id: row.user_id,
        role: row.role,
        invited_by: row.invited_by,
        created_at: row.created_at,
        profile: profileMap.get(row.user_id) as Profile,
      }));
  } catch {
    return [];
  }
}
