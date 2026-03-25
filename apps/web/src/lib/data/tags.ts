import { createServerClient } from "@/lib/supabase/server";
import type { Tag, TagCategory } from "@futurecareer/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTag(row: any): Tag {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    createdAt: row.created_at,
  };
}

export async function getTags(category?: TagCategory): Promise<Tag[]> {
  const supabase = await createServerClient();

  let query = supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapTag);
}

export async function getTagsByIds(ids: string[]): Promise<Tag[]> {
  if (ids.length === 0) return [];
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .in("id", ids);

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapTag);
}
