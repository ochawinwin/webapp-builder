"use server";

import { createServerClient } from "@/lib/supabase/server";
import { createFeedPostSchema, updateFeedPostSchema } from "@futurecareer/types";

export async function createFeedPostAction(companyId: string, input: unknown) {
  const parsed = createFeedPostSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false as const, error: "ไม่ได้เข้าสู่ระบบ" };

    const { title, content, imageUrl } = parsed.data;

    const { data: post, error } = await supabase
      .from("company_feed_posts")
      .insert({
        company_id: companyId,
        author_id: user.id,
        title,
        content: content ?? null,
        image_url: imageUrl ?? null,
      })
      .select("id")
      .single();

    if (error) return { success: false as const, error: error.message };
    return { success: true as const, data: { postId: post.id } };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function updateFeedPostAction(input: unknown) {
  const parsed = updateFeedPostSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false as const, error: "ไม่ได้เข้าสู่ระบบ" };

    const { postId, title, content, imageUrl } = parsed.data;

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (title !== undefined) updateData["title"] = title;
    if (content !== undefined) updateData["content"] = content;
    if (imageUrl !== undefined) updateData["image_url"] = imageUrl;

    const { error } = await supabase
      .from("company_feed_posts")
      .update(updateData)
      .eq("id", postId);

    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function deleteFeedPostAction(postId: string) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false as const, error: "ไม่ได้เข้าสู่ระบบ" };

    const { error } = await supabase
      .from("company_feed_posts")
      .delete()
      .eq("id", postId);

    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}
