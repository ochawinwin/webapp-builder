import { createServerClient } from "@/lib/supabase/server";
import type { CompanyPost } from "@futurecareer/types";
import type { Tables } from "@futurecareer/supabase";

type PostRow = Tables<"company_posts">;

function normalizePost(row: PostRow): CompanyPost {
  return {
    id: row.id,
    company_id: row.company_id,
    created_by: row.created_by,
    created_at: row.created_at,
    content: row.content,
    image_url: row.image_url,
    // Derive title from first line of content (capped at 60 chars)
    title: row.content.split("\n")[0]?.slice(0, 60) ?? row.content.slice(0, 60),
  };
}

export async function getCompanyPosts(
  companyId: string,
  limit = 20
): Promise<CompanyPost[]> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("company_posts")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    const rows = data as PostRow[];
    return rows.map(normalizePost);
  } catch {
    return [];
  }
}
