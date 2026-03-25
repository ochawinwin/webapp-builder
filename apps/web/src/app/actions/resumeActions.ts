"use server";

import { createServerClient } from "@/lib/supabase/server";
import { uploadResumeSchema } from "@futurecareer/types";

export async function uploadResumeAction(formData: FormData) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false as const, error: "ไม่ได้เข้าสู่ระบบ" };

    const file = formData.get("resume");
    if (!file || !(file instanceof Blob)) return { success: false as const, error: "ไม่พบไฟล์" };

    const fileName = (file as File).name || `resume_${Date.now()}.pdf`;
    const fileSize = file.size;
    const fileType = file.type || "application/pdf";

    const metaValidation = uploadResumeSchema.safeParse({
      fileName,
      fileSize,
      fileType,
    });
    if (!metaValidation.success) {
      const errors = metaValidation.error.flatten().fieldErrors;
      const firstError = Object.values(errors).flat()[0] ?? "ข้อมูลไฟล์ไม่ถูกต้อง";
      return { success: false as const, error: firstError };
    }

    // Convert to ArrayBuffer for Supabase upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const path = `${user.id}/${Date.now()}_${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(path, buffer, { contentType: fileType, upsert: true });
    if (uploadError) return { success: false as const, error: `อัปโหลดไม่สำเร็จ: ${uploadError.message}` };

    // Store the path (not signed URL) — we generate signed URLs on read
    const { data: resume, error: dbError } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        file_url: path,
        file_name: fileName,
        file_size: fileSize,
        is_primary: false,
      })
      .select("id")
      .single();

    if (dbError) return { success: false as const, error: `บันทึกไม่สำเร็จ: ${dbError.message}` };
    return { success: true as const, data: { resumeId: resume.id } };
  } catch (err) {
    const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
    return { success: false as const, error: `เกิดข้อผิดพลาด: ${message}` };
  }
}

export async function deleteResumeAction(resumeId: string) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false as const, error: "ไม่ได้เข้าสู่ระบบ" };

    // Get resume path info
    const { data: resume } = await supabase
      .from("resumes")
      .select("file_url, file_name")
      .eq("id", resumeId)
      .eq("user_id", user.id)
      .single();

    if (!resume) return { success: false as const, error: "ไม่พบไฟล์ Resume" };

    // Extract storage path from URL or use file_name
    const storagePath = `${user.id}/${resume.file_name}`;
    await supabase.storage.from("resumes").remove([storagePath]);

    const { error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", resumeId)
      .eq("user_id", user.id);

    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function setPrimaryResumeAction(resumeId: string) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false as const, error: "ไม่ได้เข้าสู่ระบบ" };

    // Unset all primaries
    await supabase
      .from("resumes")
      .update({ is_primary: false })
      .eq("user_id", user.id);

    const { error } = await supabase
      .from("resumes")
      .update({ is_primary: true })
      .eq("id", resumeId)
      .eq("user_id", user.id);

    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}
