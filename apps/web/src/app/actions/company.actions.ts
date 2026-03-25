"use server";

import { revalidatePath } from "next/cache";
import { updateCompanySchema, createPostSchema } from "@futurecareer/types";
import { createServerClient } from "@/lib/supabase/server";
import { getCompanyByMembership } from "@/lib/data/companies";
import { uploadFile, BUCKETS } from "@/lib/storage";
import type { TablesInsert, TablesUpdate } from "@futurecareer/supabase";

type ActionResult<T = undefined> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function updateCompanyAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "กรุณาเข้าสู่ระบบก่อน" };

    const membership = await getCompanyByMembership(user.id);
    if (!membership) {
      return { success: false, error: "ไม่พบข้อมูลบริษัท" };
    }

    if (membership.role !== "admin") {
      return {
        success: false,
        error: "เฉพาะ Admin เท่านั้นที่แก้ไขข้อมูลบริษัทได้",
      };
    }

    const raw = {
      name: formData.get("name"),
      short_bio: formData.get("short_bio") || undefined,
      full_bio: formData.get("full_bio") || undefined,
      industry: formData.get("industry") || undefined,
      size: formData.get("size") || undefined,
      website: formData.get("website") || undefined,
      contact_email: formData.get("contact_email") || undefined,
      contact_phone: formData.get("contact_phone") || undefined,
      location: formData.get("location") || undefined,
    };

    const parsed = updateCompanySchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
      };
    }

    const updateData: TablesUpdate<"companies"> = {
      name: parsed.data.name,
      short_bio: parsed.data.short_bio || null,
      full_bio: parsed.data.full_bio || null,
      industry: parsed.data.industry || null,
      size: parsed.data.size ?? null,
      website: parsed.data.website || null,
      contact_email: parsed.data.contact_email || null,
      contact_phone: parsed.data.contact_phone || null,
      location: parsed.data.location || null,
    };

    const { error } = await supabase
      .from("companies")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update(updateData as any)
      .eq("id", membership.company.id);

    if (error) {
      return { success: false, error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
    }

    revalidatePath("/hr/settings");
    revalidatePath(`/company/${membership.company.id}`);
    return { success: true };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function uploadCompanyLogoAction(
  formData: FormData
): Promise<ActionResult<{ logoUrl: string }>> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "กรุณาเข้าสู่ระบบก่อน" };

    const membership = await getCompanyByMembership(user.id);
    if (!membership) {
      return { success: false, error: "ไม่พบข้อมูลบริษัท" };
    }

    if (membership.role !== "admin") {
      return {
        success: false,
        error: "เฉพาะ Admin เท่านั้นที่อัปโหลดโลโก้ได้",
      };
    }

    const file = formData.get("logo") as File | null;
    if (!file) return { success: false, error: "ไม่พบไฟล์" };

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "รองรับเฉพาะไฟล์ JPEG, PNG, WEBP, SVG เท่านั้น",
      };
    }

    const MAX_SIZE = 3 * 1024 * 1024; // 3MB
    if (file.size > MAX_SIZE) {
      return { success: false, error: "ไฟล์ต้องมีขนาดไม่เกิน 3MB" };
    }

    const ext = file.name.split(".").pop() ?? "png";
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const path = `${membership.company.id}/logo.${ext}`;

    const logoUrl = await uploadFile(BUCKETS.LOGOS, path, buffer, file.type);

    const updateData: TablesUpdate<"companies"> = { logo_url: logoUrl };

    const { error } = await supabase
      .from("companies")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update(updateData as any)
      .eq("id", membership.company.id);

    if (error) {
      return { success: false, error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
    }

    revalidatePath("/hr/settings");
    revalidatePath(`/company/${membership.company.id}`);
    return { success: true, data: { logoUrl } };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาดในการอัปโหลดโลโก้" };
  }
}

export async function createPostAction(
  formData: FormData
): Promise<ActionResult<{ postId: string; imageUrl: string | null }>> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "กรุณาเข้าสู่ระบบก่อน" };

    const membership = await getCompanyByMembership(user.id);
    if (!membership) {
      return { success: false, error: "ไม่พบข้อมูลบริษัท" };
    }

    let imageUrl: string | null = null;

    // Optional post image upload
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(imageFile.type)) {
        return {
          success: false,
          error: "รองรับเฉพาะไฟล์ภาพ JPEG, PNG, WEBP",
        };
      }

      const ext = imageFile.name.split(".").pop() ?? "jpg";
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const path = `${membership.company.id}/${Date.now()}.${ext}`;

      imageUrl = await uploadFile(BUCKETS.POSTS, path, buffer, imageFile.type);
    }

    const raw = {
      title: formData.get("title"),
      content: formData.get("content"),
      image_url: imageUrl || undefined,
    };

    const parsed = createPostSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
      };
    }

    const insertData: TablesInsert<"company_posts"> = {
      company_id: membership.company.id,
      created_by: user.id,
      title: parsed.data.title,
      content: parsed.data.content,
      image_url: imageUrl,
    };

    const { data: post, error } = await supabase
      .from("company_posts")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(insertData as any)
      .select("id")
      .single();

    if (error || !post) {
      return { success: false, error: "เกิดข้อผิดพลาดในการสร้างโพสต์" };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const postId = (post as any).id as string;

    revalidatePath("/hr/feed");
    revalidatePath(`/company/${membership.company.id}`);
    return { success: true, data: { postId, imageUrl } };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function deletePostAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "กรุณาเข้าสู่ระบบก่อน" };

    const membership = await getCompanyByMembership(user.id);
    if (!membership) {
      return { success: false, error: "ไม่พบข้อมูลบริษัท" };
    }

    const postId = formData.get("post_id") as string;
    if (!postId) return { success: false, error: "ไม่พบ ID ของโพสต์" };

    // Ownership check — post must belong to this company
    const { data: postData, error: postError } = await supabase
      .from("company_posts")
      .select("id")
      .eq("id", postId)
      .eq("company_id", membership.company.id)
      .single();

    if (postError || !postData) {
      return { success: false, error: "ไม่พบโพสต์หรือคุณไม่มีสิทธิ์ลบ" };
    }

    const { error } = await supabase
      .from("company_posts")
      .delete()
      .eq("id", postId);

    if (error) {
      return { success: false, error: "เกิดข้อผิดพลาดในการลบโพสต์" };
    }

    revalidatePath("/hr/feed");
    revalidatePath(`/company/${membership.company.id}`);
    return { success: true };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}
