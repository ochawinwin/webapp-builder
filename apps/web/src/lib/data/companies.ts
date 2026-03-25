import { createServerClient } from "@/lib/supabase/server";
import type { Company, MemberRole, CompanyPost } from "@futurecareer/types";
import type { Tables } from "@futurecareer/supabase";

export interface CompanyWithPosts extends Company {
  recent_posts: CompanyPost[];
  open_job_count: number;
}

export async function getCompanyById(
  id: string
): Promise<CompanyWithPosts | null> {
  try {
    const supabase = await createServerClient();

    const { data: company, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !company) return null;

    const row = company as Tables<"companies">;

    const { data: posts } = await supabase
      .from("company_posts")
      .select("*")
      .eq("company_id", id)
      .order("created_at", { ascending: false })
      .limit(5);

    const { count: openJobCount } = await supabase
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("company_id", id)
      .eq("status", "open");

    const postRows = (posts ?? []) as Tables<"company_posts">[];

    const normalizedPosts: CompanyPost[] = postRows.map((p) => ({
      id: p.id,
      company_id: p.company_id,
      created_by: p.created_by,
      created_at: p.created_at,
      content: p.content,
      image_url: p.image_url,
      title: p.content.split("\n")[0]?.slice(0, 60) ?? p.content.slice(0, 60),
    }));

    return {
      ...row,
      recent_posts: normalizedPosts,
      open_job_count: openJobCount ?? 0,
    };
  } catch {
    return null;
  }
}

export async function getCompanyByMembership(
  userId: string
): Promise<{ company: Company; role: MemberRole } | null> {
  try {
    const supabase = await createServerClient();

    const { data: member, error } = await supabase
      .from("company_members")
      .select(
        `
          role,
          company:companies!company_members_company_id_fkey(*)
        `
      )
      .eq("user_id", userId)
      .single();

    if (error || !member) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row = member as unknown as {
      role: MemberRole;
      company: Tables<"companies"> | null;
    };

    if (!row.company) return null;

    return {
      company: row.company,
      role: row.role,
    };
  } catch {
    return null;
  }
}
