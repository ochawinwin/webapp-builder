"use server";

import { revalidatePath } from "next/cache";
import {
  createJobSchema,
  updateJobSchema,
  updateJobStatusSchema,
} from "@futurecareer/types";
import { createServerClient } from "@/lib/supabase/server";
import { getCompanyByMembership } from "@/lib/data/companies";
import type { TablesInsert, TablesUpdate } from "@futurecareer/supabase";

type ActionResult<T = undefined> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function createJobAction(
  formData: FormData
): Promise<ActionResult<{ jobId: string }>> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "กรุณาเข้าสู่ระบบก่อน" };

    const membership = await getCompanyByMembership(user.id);
    if (!membership) {
      return { success: false, error: "คุณไม่มีสิทธิ์สร้างประกาศงาน" };
    }

    // Parse qualifications from JSON array or newline-separated string
    const qualificationsRaw = formData.get("qualifications");
    let qualifications: string[] = [];
    if (qualificationsRaw) {
      try {
        qualifications = JSON.parse(qualificationsRaw as string);
      } catch {
        qualifications = (qualificationsRaw as string)
          .split("\n")
          .map((q) => q.trim())
          .filter(Boolean);
      }
    }

    const tagIdsRaw = formData.get("tag_ids");
    let tagIds: string[] = [];
    if (tagIdsRaw) {
      try {
        tagIds = JSON.parse(tagIdsRaw as string);
      } catch {
        tagIds = [];
      }
    }

    const prescreenRaw = formData.get("prescreen_questions");
    let prescreenQuestions: unknown[] = [];
    if (prescreenRaw) {
      try {
        prescreenQuestions = JSON.parse(prescreenRaw as string);
      } catch {
        prescreenQuestions = [];
      }
    }

    const raw = {
      title: formData.get("title"),
      description: formData.get("description"),
      spec: formData.get("spec") || undefined,
      qualifications,
      location: formData.get("location") || undefined,
      job_type: formData.get("job_type"),
      level: formData.get("level"),
      salary: formData.get("salary") || undefined,
      tag_ids: tagIds,
      prescreen_questions: prescreenQuestions,
    };

    const parsed = createJobSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
      };
    }

    // Insert job
    const jobInsert: TablesInsert<"jobs"> = {
      company_id: membership.company.id,
      created_by: user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      spec: parsed.data.spec || null,
      qualifications: parsed.data.qualifications,
      location: parsed.data.location || null,
      job_type: parsed.data.job_type,
      level: parsed.data.level,
      salary: parsed.data.salary || null,
      status: "open",
    };

    const { data: jobData, error: jobError } = await supabase
      .from("jobs")
      .insert(jobInsert)
      .select("id")
      .single();

    if (jobError || !jobData) {
      return { success: false, error: "เกิดข้อผิดพลาดในการสร้างประกาศงาน" };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const job = jobData as any;

    // Insert job_tags
    if (parsed.data.tag_ids.length > 0) {
      const tagRows: TablesInsert<"job_tags">[] = parsed.data.tag_ids.map(
        (tagId) => ({
          job_id: job.id,
          tag_id: tagId,
        })
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await supabase.from("job_tags").insert(tagRows as any);
    }

    // Insert prescreen_questions
    if (parsed.data.prescreen_questions.length > 0) {
      const questionRows: TablesInsert<"prescreen_questions">[] =
        parsed.data.prescreen_questions.map((q, idx) => ({
          job_id: job.id,
          order_index: q.order_index ?? idx,
          type: q.type,
          question: q.question,
          options: q.options ?? null,
        }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await supabase.from("prescreen_questions").insert(questionRows as any);
    }

    revalidatePath("/hr/jobs");
    return { success: true, data: { jobId: job.id as string } };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function updateJobAction(
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
      return { success: false, error: "คุณไม่มีสิทธิ์แก้ไขประกาศงาน" };
    }

    const jobId = formData.get("id") as string;

    // Ownership check
    const { data: existingJobData, error: ownershipError } = await supabase
      .from("jobs")
      .select("id")
      .eq("id", jobId)
      .eq("company_id", membership.company.id)
      .single();

    if (ownershipError || !existingJobData) {
      return {
        success: false,
        error: "ไม่พบประกาศงานหรือคุณไม่มีสิทธิ์แก้ไข",
      };
    }

    const qualificationsRaw = formData.get("qualifications");
    let qualifications: string[] | undefined;
    if (qualificationsRaw) {
      try {
        qualifications = JSON.parse(qualificationsRaw as string);
      } catch {
        qualifications = (qualificationsRaw as string)
          .split("\n")
          .map((q) => q.trim())
          .filter(Boolean);
      }
    }

    const tagIdsRaw = formData.get("tag_ids");
    let tagIds: string[] | undefined;
    if (tagIdsRaw) {
      try {
        tagIds = JSON.parse(tagIdsRaw as string);
      } catch {
        tagIds = [];
      }
    }

    const prescreenRaw = formData.get("prescreen_questions");
    let prescreenQuestions: unknown[] | undefined;
    if (prescreenRaw) {
      try {
        prescreenQuestions = JSON.parse(prescreenRaw as string);
      } catch {
        prescreenQuestions = [];
      }
    }

    const raw = {
      id: jobId,
      title: formData.get("title") || undefined,
      description: formData.get("description") || undefined,
      spec: formData.get("spec") || undefined,
      qualifications,
      location: formData.get("location") || undefined,
      job_type: formData.get("job_type") || undefined,
      level: formData.get("level") || undefined,
      salary: formData.get("salary") || undefined,
      tag_ids: tagIds,
      prescreen_questions: prescreenQuestions,
    };

    const parsed = updateJobSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
      };
    }

    const { id: _id, tag_ids, prescreen_questions, ...jobFields } = parsed.data;

    // Build typed update payload
    const updatePayload: TablesUpdate<"jobs"> = {};
    if (jobFields.title !== undefined) updatePayload.title = jobFields.title;
    if (jobFields.description !== undefined)
      updatePayload.description = jobFields.description;
    if (jobFields.spec !== undefined)
      updatePayload.spec = jobFields.spec || null;
    if (jobFields.qualifications !== undefined)
      updatePayload.qualifications = jobFields.qualifications;
    if (jobFields.location !== undefined)
      updatePayload.location = jobFields.location || null;
    if (jobFields.job_type !== undefined)
      updatePayload.job_type = jobFields.job_type;
    if (jobFields.level !== undefined) updatePayload.level = jobFields.level;
    if (jobFields.salary !== undefined)
      updatePayload.salary = jobFields.salary || null;

    if (Object.keys(updatePayload).length > 0) {
      const { error: updateError } = await supabase
        .from("jobs")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update(updatePayload as any)
        .eq("id", jobId);

      if (updateError) {
        return { success: false, error: "เกิดข้อผิดพลาดในการแก้ไขประกาศงาน" };
      }
    }

    // Replace tags if provided
    if (tag_ids !== undefined) {
      await supabase.from("job_tags").delete().eq("job_id", jobId);
      if (tag_ids.length > 0) {
        const tagRows: TablesInsert<"job_tags">[] = tag_ids.map((tagId) => ({
          job_id: jobId,
          tag_id: tagId,
        }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await supabase.from("job_tags").insert(tagRows as any);
      }
    }

    // Replace prescreen questions if provided
    if (prescreen_questions !== undefined) {
      await supabase
        .from("prescreen_questions")
        .delete()
        .eq("job_id", jobId);

      if (prescreen_questions.length > 0) {
        const questionRows: TablesInsert<"prescreen_questions">[] =
          prescreen_questions.map((q, idx) => ({
            job_id: jobId,
            order_index: q.order_index ?? idx,
            type: q.type,
            question: q.question,
            options: q.options ?? null,
          }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await supabase.from("prescreen_questions").insert(questionRows as any);
      }
    }

    revalidatePath("/hr/jobs");
    revalidatePath(`/hr/jobs/${jobId}`);
    return { success: true };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function updateJobStatusAction(
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
      return { success: false, error: "คุณไม่มีสิทธิ์แก้ไขสถานะงาน" };
    }

    const raw = {
      id: formData.get("id"),
      status: formData.get("status"),
    };

    const parsed = updateJobStatusSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
      };
    }

    // Ownership check
    const { data: jobData, error: ownershipError } = await supabase
      .from("jobs")
      .select("id")
      .eq("id", parsed.data.id)
      .eq("company_id", membership.company.id)
      .single();

    if (ownershipError || !jobData) {
      return {
        success: false,
        error: "ไม่พบประกาศงานหรือคุณไม่มีสิทธิ์แก้ไข",
      };
    }

    const updateData: TablesUpdate<"jobs"> = { status: parsed.data.status };

    const { error } = await supabase
      .from("jobs")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update(updateData as any)
      .eq("id", parsed.data.id);

    if (error) {
      return { success: false, error: "เกิดข้อผิดพลาดในการแก้ไขสถานะ" };
    }

    revalidatePath("/hr/jobs");
    return { success: true };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function deleteJobAction(
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
      return { success: false, error: "คุณไม่มีสิทธิ์ลบประกาศงาน" };
    }

    const jobId = formData.get("id") as string;
    if (!jobId) return { success: false, error: "ไม่พบ ID ของงาน" };

    // Ownership check
    const { data: jobData, error: ownershipError } = await supabase
      .from("jobs")
      .select("id")
      .eq("id", jobId)
      .eq("company_id", membership.company.id)
      .single();

    if (ownershipError || !jobData) {
      return { success: false, error: "ไม่พบประกาศงานหรือคุณไม่มีสิทธิ์ลบ" };
    }

    const { error } = await supabase.from("jobs").delete().eq("id", jobId);

    if (error) {
      return { success: false, error: "เกิดข้อผิดพลาดในการลบประกาศงาน" };
    }

    revalidatePath("/hr/jobs");
    return { success: true };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}
