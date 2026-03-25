import { createServerClient } from "@/lib/supabase/server";
import type { CompanyFeedPost } from "@futurecareer/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPost(row: any): CompanyFeedPost {
  return {
    id: row.id,
    companyId: row.company_id,
    authorId: row.author_id,
    title: row.title,
    content: row.content,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getFeedPosts(companyId: string): Promise<CompanyFeedPost[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("company_feed_posts")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapPost);
}
