"use server";

import { revalidatePath } from "next/cache";
import { inviteMemberSchema } from "@futurecareer/types";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCompanyByMembership } from "@/lib/data/companies";

type ActionResult<T = undefined> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function inviteMemberAction(
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
        error: "เฉพาะ Admin เท่านั้นที่สามารถเชิญสมาชิกได้",
      };
    }

    const raw = {
      email: formData.get("email"),
      role: formData.get("role"),
    };

    const parsed = inviteMemberSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
      };
    }

    const admin = createAdminClient();

    // Check if a user with this email already exists — use targeted lookup, not listUsers()
    const { data: userByEmail } = await admin.auth.admin.getUserByEmail(
      parsed.data.email
    );
    const existingAuthUser = userByEmail?.user ?? null;

    if (existingAuthUser) {
      // User exists — check if already a member
      const { data: existingMember } = await supabase
        .from("company_members")
        .select("id")
        .eq("company_id", membership.company.id)
        .eq("user_id", existingAuthUser.id)
        .maybeSingle();

      if (existingMember) {
        return { success: false, error: "ผู้ใช้นี้เป็นสมาชิกของบริษัทอยู่แล้ว" };
      }

      // Add them directly
      const { error } = await admin.from("company_members").insert({
        company_id: membership.company.id,
        user_id: existingAuthUser.id,
        role: parsed.data.role,
        invited_by: user.id,
      });

      if (error) {
        return { success: false, error: "เกิดข้อผิดพลาดในการเพิ่มสมาชิก" };
      }
    } else {
      // User does not exist — send invite email
      const { error } = await admin.auth.admin.inviteUserByEmail(
        parsed.data.email,
        {
          data: {
            company_id: membership.company.id,
            role: parsed.data.role,
            user_type: "company",
            invited_by: user.id,
          },
        }
      );

      if (error) {
        return { success: false, error: "เกิดข้อผิดพลาดในการส่งอีเมลเชิญ" };
      }
    }

    revalidatePath("/hr/team");
    return { success: true };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function removeMemberAction(
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
        error: "เฉพาะ Admin เท่านั้นที่สามารถลบสมาชิกได้",
      };
    }

    const memberId = formData.get("member_id") as string;
    if (!memberId) return { success: false, error: "ไม่พบ ID ของสมาชิก" };

    // Get the member row to check they belong to this company
    const { data: targetMemberData, error: memberError } = await supabase
      .from("company_members")
      .select("id, user_id")
      .eq("id", memberId)
      .eq("company_id", membership.company.id)
      .single();

    if (memberError || !targetMemberData) {
      return { success: false, error: "ไม่พบสมาชิกหรือคุณไม่มีสิทธิ์ลบ" };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const targetMember = targetMemberData as any;

    // Cannot remove yourself
    if (targetMember.user_id === user.id) {
      return { success: false, error: "ไม่สามารถลบตัวเองออกจากทีมได้" };
    }

    const { error } = await supabase
      .from("company_members")
      .delete()
      .eq("id", memberId);

    if (error) {
      return { success: false, error: "เกิดข้อผิดพลาดในการลบสมาชิก" };
    }

    revalidatePath("/hr/team");
    return { success: true };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}
