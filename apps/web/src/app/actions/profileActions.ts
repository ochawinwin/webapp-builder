"use server";

import { createServerClient } from "@/lib/supabase/server";
import { updateProfileSchema } from "@futurecareer/types";

export async function updateProfileAction(input: unknown) {
  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false as const, error: "ไม่ได้เข้าสู่ระบบ" };

    const { tagIds, ...profileData } = parsed.data;

    // Build update object with only defined fields
    const updateData: Record<string, unknown> = {};
    if (profileData.fullName !== undefined) updateData["full_name"] = profileData.fullName;
    if (profileData.bio !== undefined) updateData["bio"] = profileData.bio;
    if (profileData.phone !== undefined) updateData["phone"] = profileData.phone;
    if (profileData.avatarUrl !== undefined) updateData["avatar_url"] = profileData.avatarUrl;

    if (Object.keys(updateData).length > 0) {
      updateData["updated_at"] = new Date().toISOString();
      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);
      if (error) return { success: false as const, error: error.message };
    }

    // Update tags if provided
    if (tagIds !== undefined) {
      // Delete existing tags
      await supabase.from("profile_tags").delete().eq("profile_id", user.id);

      // Insert new tags
      if (tagIds.length > 0) {
        const { error: tagError } = await supabase.from("profile_tags").insert(
          tagIds.map((tagId) => ({ profile_id: user.id, tag_id: tagId }))
        );
        if (tagError) return { success: false as const, error: tagError.message };
      }
    }

    return { success: true as const };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function uploadAvatarAction(formData: FormData) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false as const, error: "ไม่ได้เข้าสู่ระบบ" };

    const file = formData.get("avatar") as File | null;
    if (!file) return { success: false as const, error: "ไม่พบไฟล์" };

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return { success: false as const, error: "รองรับเฉพาะ JPG, PNG หรือ WebP เท่านั้น" };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { success: false as const, error: "ไฟล์ต้องมีขนาดไม่เกิน 5MB" };
    }

    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (uploadError) return { success: false as const, error: uploadError.message };

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: urlData.publicUrl, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (updateError) return { success: false as const, error: updateError.message };

    return { success: true as const, data: { avatarUrl: urlData.publicUrl } };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}
