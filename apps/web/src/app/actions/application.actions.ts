"use server";

import { revalidatePath } from "next/cache";
import {
  submitApplicationSchema,
  updateApplicationStatusSchema,
} from "@futurecareer/types";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCompanyByMembership } from "@/lib/data/companies";
import type { Tables, TablesInsert, TablesUpdate } from "@futurecareer/supabase";

type ProfileRow = Tables<"profiles">;
type ApplicationRow = Tables<"applications">;

type ActionResult<T = undefined> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function submitApplicationAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "กรุณาเข้าสู่ระบบก่อน" };

    // Verify user is a seeker
    const { data: profileData } = await supabase
      .from("profiles")
      .select("user_type, resume_url")
      .eq("id", user.id)
      .single();

    if (!profileData) return { success: false, error: "ไม่พบข้อมูลผู้ใช้" };

    const profile = profileData as Pick<ProfileRow, "user_type" | "resume_url">;

    if (profile.user_type !== "seeker") {
      return {
        success: false,
        error: "เฉพาะผู้หางานเท่านั้นที่สามารถสมัครงานได้",
      };
    }

    const prescreenAnswersRaw = formData.get("prescreen_answers");
    let prescreenAnswers: Record<string, string> = {};
    if (prescreenAnswersRaw) {
      try {
        prescreenAnswers = JSON.parse(prescreenAnswersRaw as string);
      } catch {
        prescreenAnswers = {};
      }
    }

    const raw = {
      job_id: formData.get("job_id"),
      intro_message: formData.get("intro_message"),
      prescreen_answers: prescreenAnswers,
      use_profile_resume: formData.get("use_profile_resume") === "true",
    };

    const parsed = submitApplicationSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
      };
    }

    // Determine resume URL
    if (!profile.resume_url) {
      return {
        success: false,
        error: "กรุณาอัปโหลด Resume ก่อนสมัครงาน",
      };
    }
    const resumeUrl = profile.resume_url;

    // Check not already applied
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", parsed.data.job_id)
      .eq("candidate_id", user.id)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "คุณได้สมัครงานนี้ไปแล้ว" };
    }

    const insertData: TablesInsert<"applications"> = {
      job_id: parsed.data.job_id,
      candidate_id: user.id,
      intro_message: parsed.data.intro_message,
      prescreen_answers: parsed.data.prescreen_answers,
      resume_url: resumeUrl,
      status: "new",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from("applications").insert(insertData as any);

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "คุณได้สมัครงานนี้ไปแล้ว" };
      }
      return { success: false, error: "เกิดข้อผิดพลาดในการสมัครงาน" };
    }

    revalidatePath(`/jobs/${parsed.data.job_id}`);
    return { success: true };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function updateApplicationStatusAction(
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
      return { success: false, error: "คุณไม่มีสิทธิ์อัปเดตสถานะผู้สมัคร" };
    }

    const raw = {
      id: formData.get("id"),
      status: formData.get("status"),
    };

    const parsed = updateApplicationStatusSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
      };
    }

    // Verify the application's job belongs to this company
    const { data: applicationData, error: appError } = await supabase
      .from("applications")
      .select("id, job_id")
      .eq("id", parsed.data.id)
      .single();

    if (appError || !applicationData) {
      return { success: false, error: "ไม่พบข้อมูลการสมัครงาน" };
    }

    const application = applicationData as Pick<ApplicationRow, "id" | "job_id">;

    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id")
      .eq("id", application.job_id)
      .eq("company_id", membership.company.id)
      .single();

    if (jobError || !job) {
      return { success: false, error: "คุณไม่มีสิทธิ์อัปเดตสถานะนี้" };
    }

    const updateData: TablesUpdate<"applications"> = {
      status: parsed.data.status,
    };

    const { error } = await supabase
      .from("applications")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update(updateData as any)
      .eq("id", parsed.data.id);

    if (error) {
      return { success: false, error: "เกิดข้อผิดพลาดในการอัปเดตสถานะ" };
    }

    revalidatePath(`/hr/ats/${application.job_id}`);
    return { success: true };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function viewContactAction(
  formData: FormData
): Promise<ActionResult<{ email: string; phone: string | null }>> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "กรุณาเข้าสู่ระบบก่อน" };

    const membership = await getCompanyByMembership(user.id);
    if (!membership) {
      return { success: false, error: "คุณไม่มีสิทธิ์ดูข้อมูลติดต่อ" };
    }

    const applicationId = formData.get("application_id") as string;
    if (!applicationId)
      return { success: false, error: "ไม่พบ ID ของการสมัครงาน" };

    // Verify application belongs to this company's job
    const { data: applicationData, error: appError } = await supabase
      .from("applications")
      .select("id, job_id, candidate_id")
      .eq("id", applicationId)
      .single();

    if (appError || !applicationData) {
      return { success: false, error: "ไม่พบข้อมูลการสมัครงาน" };
    }

    const application = applicationData as Pick<
      ApplicationRow,
      "id" | "job_id" | "candidate_id"
    >;

    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id")
      .eq("id", application.job_id)
      .eq("company_id", membership.company.id)
      .single();

    if (jobError || !job) {
      return { success: false, error: "คุณไม่มีสิทธิ์ดูข้อมูลนี้" };
    }

    // Get candidate contact info — need email from auth.users via admin client
    const admin = createAdminClient();
    const { data: authUser, error: authError } =
      await admin.auth.admin.getUserById(application.candidate_id);

    if (authError || !authUser?.user) {
      return { success: false, error: "ไม่พบข้อมูลผู้สมัคร" };
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("phone")
      .eq("id", application.candidate_id)
      .single();

    const profileRow = profileData as Pick<ProfileRow, "phone"> | null;

    // Log the contact view
    const logData: TablesInsert<"contact_view_logs"> = {
      application_id: applicationId,
      viewed_by: user.id,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await supabase.from("contact_view_logs").insert(logData as any);

    return {
      success: true,
      data: {
        email: authUser.user.email ?? "",
        phone: profileRow?.phone ?? null,
      },
    };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}
