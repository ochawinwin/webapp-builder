"use server";

import { createServerClient } from "@/lib/supabase/server";
import { updateCompanySchema, inviteRecruiterSchema } from "@futurecareer/types";

async function requireCompanyAdmin(supabase: Awaited<ReturnType<typeof createServerClient>>, userId: string, companyId: string) {
  const { data } = await supabase
    .from("company_members")
    .select("role")
    .eq("company_id", companyId)
    .eq("user_id", userId)
    .single();
  return data?.role === "admin";
}

export async function updateCompanyAction(companyId: string, input: unknown) {
  const parsed = updateCompanySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false as const, error: "ไม่ได้เข้าสู่ระบบ" };

    if (!(await requireCompanyAdmin(supabase, user.id, companyId))) {
      return { success: false as const, error: "คุณไม่มีสิทธิ์แก้ไขข้อมูลบริษัท" };
    }

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    const data = parsed.data;
    if (data.name !== undefined) updateData["name"] = data.name;
    if (data.shortBio !== undefined) updateData["short_bio"] = data.shortBio;
    if (data.fullBio !== undefined) updateData["full_bio"] = data.fullBio;
    if (data.industry !== undefined) updateData["industry"] = data.industry;
    if (data.size !== undefined) updateData["size"] = data.size;
    if (data.logoUrl !== undefined) updateData["logo_url"] = data.logoUrl;
    if (data.coverUrl !== undefined) updateData["cover_url"] = data.coverUrl;

    const { error } = await supabase
      .from("companies")
      .update(updateData)
      .eq("id", companyId);

    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function inviteRecruiterAction(companyId: string, input: unknown) {
  const parsed = inviteRecruiterSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false as const, error: "ไม่ได้เข้าสู่ระบบ" };

    if (!(await requireCompanyAdmin(supabase, user.id, companyId))) {
      return { success: false as const, error: "เฉพาะแอดมินเท่านั้นที่สามารถเชิญสมาชิกได้" };
    }

    const { email } = parsed.data;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (!profile) return { success: false as const, error: "ไม่พบผู้ใช้งานที่มีอีเมลนี้" };

    const { error } = await supabase.from("company_members").insert({
      company_id: companyId,
      user_id: profile.id,
      role: "recruiter",
      invited_by: user.id,
    });

    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function removeTeamMemberAction(memberId: string) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false as const, error: "ไม่ได้เข้าสู่ระบบ" };

    // Fetch the member to check company + prevent self-deletion
    const { data: member } = await supabase
      .from("company_members")
      .select("id, company_id, user_id, role")
      .eq("id", memberId)
      .single();

    if (!member) return { success: false as const, error: "ไม่พบสมาชิก" };

    // Verify caller is admin of the same company
    if (!(await requireCompanyAdmin(supabase, user.id, member.company_id))) {
      return { success: false as const, error: "เฉพาะแอดมินเท่านั้นที่สามารถลบสมาชิกได้" };
    }

    // Prevent removing the last admin
    if (member.role === "admin") {
      const { count } = await supabase
        .from("company_members")
        .select("*", { count: "exact", head: true })
        .eq("company_id", member.company_id)
        .eq("role", "admin");
      if ((count ?? 0) <= 1) {
        return { success: false as const, error: "ไม่สามารถลบแอดมินคนสุดท้ายได้" };
      }
    }

    const { error } = await supabase
      .from("company_members")
      .delete()
      .eq("id", memberId);

    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}
