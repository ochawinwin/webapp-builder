"use server";

import { createServerClient } from "@/lib/supabase/server";
import { createJobSchema, updateJobSchema } from "@futurecareer/types";

export async function createJobAction(input: unknown) {
  const parsed = createJobSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false as const, error: "ไม่ได้เข้าสู่ระบบ" };

    // Get user's company
    const { data: membership } = await supabase
      .from("company_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();
    if (!membership) return { success: false as const, error: "ไม่พบข้อมูลบริษัท" };

    const { tagIds, ...jobData } = parsed.data;

    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .insert({
        company_id: membership.company_id,
        created_by: user.id,
        title: jobData.title,
        description: jobData.description ?? null,
        qualifications: jobData.qualifications ?? null,
        benefits: jobData.benefits ?? null,
        location: jobData.location ?? null,
        job_type: jobData.jobType ?? null,
        level: jobData.level ?? null,
        status: jobData.status,
      })
      .select("id")
      .single();

    if (jobError) return { success: false as const, error: jobError.message };

    if (tagIds.length > 0) {
      const { error: tagError } = await supabase
        .from("job_tags")
        .insert(tagIds.map((tagId) => ({ job_id: job.id, tag_id: tagId })));
      if (tagError) return { success: false as const, error: tagError.message };
    }

    return { success: true as const, data: { jobId: job.id } };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function updateJobAction(jobId: string, input: unknown) {
  const parsed = updateJobSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false as const, error: "ไม่ได้เข้าสู่ระบบ" };

    const { tagIds, ...jobData } = parsed.data;

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (jobData.title !== undefined) updateData["title"] = jobData.title;
    if (jobData.description !== undefined) updateData["description"] = jobData.description;
    if (jobData.qualifications !== undefined) updateData["qualifications"] = jobData.qualifications;
    if (jobData.benefits !== undefined) updateData["benefits"] = jobData.benefits;
    if (jobData.location !== undefined) updateData["location"] = jobData.location;
    if (jobData.jobType !== undefined) updateData["job_type"] = jobData.jobType;
    if (jobData.level !== undefined) updateData["level"] = jobData.level;
    if (jobData.status !== undefined) updateData["status"] = jobData.status;

    const { error: jobError } = await supabase
      .from("jobs")
      .update(updateData)
      .eq("id", jobId);
    if (jobError) return { success: false as const, error: jobError.message };

    if (tagIds !== undefined) {
      await supabase.from("job_tags").delete().eq("job_id", jobId);
      if (tagIds.length > 0) {
        const { error: tagError } = await supabase
          .from("job_tags")
          .insert(tagIds.map((tagId) => ({ job_id: jobId, tag_id: tagId })));
        if (tagError) return { success: false as const, error: tagError.message };
      }
    }

    return { success: true as const };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function deleteJobAction(jobId: string) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false as const, error: "ไม่ได้เข้าสู่ระบบ" };

    // Verify caller is admin of the company that owns this job
    const { data: job } = await supabase.from("jobs").select("company_id").eq("id", jobId).single();
    if (!job) return { success: false as const, error: "ไม่พบตำแหน่งงาน" };

    const { data: membership } = await supabase
      .from("company_members")
      .select("role")
      .eq("company_id", job.company_id)
      .eq("user_id", user.id)
      .single();

    if (membership?.role !== "admin") {
      return { success: false as const, error: "เฉพาะแอดมินเท่านั้นที่สามารถปิดตำแหน่งงานได้" };
    }

    const { error } = await supabase
      .from("jobs")
      .update({ status: "closed", updated_at: new Date().toISOString() })
      .eq("id", jobId);

    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}
