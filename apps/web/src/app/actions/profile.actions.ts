"use server";

import { revalidatePath } from "next/cache";
import { updateProfileSchema } from "@futurecareer/types";
import { createServerClient } from "@/lib/supabase/server";
import { uploadFile, BUCKETS } from "@/lib/storage";
import type { TablesUpdate } from "@futurecareer/supabase";

type ActionResult<T = undefined> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function updateProfileAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "กรุณาเข้าสู่ระบบก่อน" };

    const raw = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      bio: formData.get("bio") ?? undefined,
      phone: formData.get("phone") ?? undefined,
      location: formData.get("location") ?? undefined,
      website: formData.get("website") ?? undefined,
    };

    const parsed = updateProfileSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      bio: parsed.data.bio ?? null,
      phone: parsed.data.phone ?? null,
      location: parsed.data.location ?? null,
      website: parsed.data.website ?? null,
    };

    const { error } = await supabase
      .from("profiles")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update(updateData as any)
      .eq("id", user.id);

    if (error) {
      return { success: false, error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
    }

    revalidatePath("/profile");
    return { success: true };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function uploadResumeAction(
  formData: FormData
): Promise<ActionResult<{ resumePath: string }>> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "กรุณาเข้าสู่ระบบก่อน" };

    const file = formData.get("resume") as File | null;
    if (!file) return { success: false, error: "ไม่พบไฟล์" };

    if (file.type !== "application/pdf") {
      return { success: false, error: "รองรับเฉพาะไฟล์ PDF เท่านั้น" };
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return { success: false, error: "ไฟล์ต้องมีขนาดไม่เกิน 5MB" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const path = `${user.id}/resume.pdf`;

    const resumePath = await uploadFile(
      BUCKETS.RESUMES,
      path,
      buffer,
      "application/pdf"
    );

    const updateData: TablesUpdate<"profiles"> = { resume_url: resumePath };

    const { error } = await supabase
      .from("profiles")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update(updateData as any)
      .eq("id", user.id);

    if (error) {
      return { success: false, error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
    }

    revalidatePath("/profile");
    return { success: true, data: { resumePath } };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์" };
  }
}

export async function uploadAvatarAction(
  formData: FormData
): Promise<ActionResult<{ avatarUrl: string }>> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "กรุณาเข้าสู่ระบบก่อน" };

    const file = formData.get("avatar") as File | null;
    if (!file) return { success: false, error: "ไม่พบไฟล์" };

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "รองรับเฉพาะไฟล์ JPEG, PNG, WEBP เท่านั้น",
      };
    }

    const MAX_SIZE = 3 * 1024 * 1024; // 3MB
    if (file.size > MAX_SIZE) {
      return { success: false, error: "ไฟล์ต้องมีขนาดไม่เกิน 3MB" };
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const path = `${user.id}/avatar.${ext}`;

    const avatarUrl = await uploadFile(
      BUCKETS.AVATARS,
      path,
      buffer,
      file.type
    );

    const updateData: TablesUpdate<"profiles"> = { avatar_url: avatarUrl };

    const { error } = await supabase
      .from("profiles")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update(updateData as any)
      .eq("id", user.id);

    if (error) {
      return { success: false, error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
    }

    revalidatePath("/profile");
    return { success: true, data: { avatarUrl } };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ" };
  }
}
