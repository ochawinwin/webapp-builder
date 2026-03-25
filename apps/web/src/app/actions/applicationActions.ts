"use server";

import { createServerClient } from "@/lib/supabase/server";
import { applyJobSchema, updateApplicationStatusSchema } from "@futurecareer/types";

export async function applyJobAction(jobId: string, input: unknown) {
  const parsed = applyJobSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false as const, error: "ไม่ได้เข้าสู่ระบบ" };

    const { resumeId, coverMessage, contactEmail, contactPhone, answers } = parsed.data;

    const { data: application, error: appError } = await supabase
      .from("applications")
      .insert({
        job_id: jobId,
        applicant_id: user.id,
        resume_id: resumeId,
        cover_message: coverMessage ?? null,
        contact_email: contactEmail,
        contact_phone: contactPhone ?? null,
        status: "new",
      })
      .select("id")
      .single();

    if (appError) return { success: false as const, error: appError.message };

    if (answers.length > 0) {
      const { error: answerError } = await supabase.from("application_answers").insert(
        answers.map((a) => ({
          application_id: application.id,
          question_id: a.questionId,
          answer_text: a.answerText,
        }))
      );
      if (answerError) return { success: false as const, error: answerError.message };
    }

    return { success: true as const, data: { applicationId: application.id } };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function updateApplicationStatusAction(input: unknown) {
  const parsed = updateApplicationStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false as const, error: "ไม่ได้เข้าสู่ระบบ" };

    const { applicationId, status } = parsed.data;

    // Verify caller is a company member for this application's job
    const { data: application, error: appErr } = await supabase
      .from("applications")
      .select("job_id")
      .eq("id", applicationId)
      .single();

    if (appErr || !application?.job_id) return { success: false as const, error: "ไม่พบใบสมัคร" };

    const { data: job, error: jobErr } = await supabase
      .from("jobs")
      .select("company_id")
      .eq("id", application.job_id)
      .single();

    if (jobErr || !job?.company_id) return { success: false as const, error: "ไม่พบตำแหน่งงาน" };

    const { data: membership } = await supabase
      .from("company_members")
      .select("id")
      .eq("company_id", job.company_id)
      .eq("user_id", user.id)
      .single();

    if (!membership) return { success: false as const, error: "คุณไม่มีสิทธิ์เปลี่ยนสถานะใบสมัคร" };

    const { error } = await supabase
      .from("applications")
      .update({ status: status as "new" | "reviewing" | "interview" | "offered" | "hired" | "rejected", updated_at: new Date().toISOString() })
      .eq("id", applicationId);

    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}
