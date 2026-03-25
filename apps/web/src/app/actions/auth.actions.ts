"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  loginSchema,
  candidateRegisterSchema,
  companyRegisterSchema,
} from "@futurecareer/types";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/data/auth";

type ActionResult<T = undefined> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function loginAction(
  formData: FormData
): Promise<ActionResult<{ redirectTo: string }>> {
  try {
    const raw = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
      };
    }

    const supabase = await createServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return {
        success: false,
        error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      };
    }

    // Determine redirect target based on user type
    const authUser = await getAuthUser();
    const redirectTo =
      authUser?.profile.user_type === "company" ? "/hr/dashboard" : "/search";

    revalidatePath("/");
    return { success: true, data: { redirectTo } };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function registerCandidateAction(
  formData: FormData
): Promise<ActionResult<{ message: string }>> {
  try {
    const raw = {
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirm_password"),
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
    };

    const parsed = candidateRegisterSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
      };
    }

    const supabase = await createServerClient();
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          user_type: "seeker",
          first_name: parsed.data.first_name,
          last_name: parsed.data.last_name,
        },
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes("already registered")) {
        return { success: false, error: "อีเมลนี้ถูกใช้งานแล้ว" };
      }
      return { success: false, error: "เกิดข้อผิดพลาดในการสมัครสมาชิก" };
    }

    return {
      success: true,
      data: { message: "กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน" },
    };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function registerCompanyAction(
  formData: FormData
): Promise<ActionResult<{ message: string }>> {
  try {
    const raw = {
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirm_password"),
      company_name: formData.get("company_name"),
      industry: formData.get("industry"),
      size: formData.get("size"),
    };

    const parsed = companyRegisterSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
      };
    }

    // Step 1: Create auth user via server client (triggers handle_new_user)
    const supabase = await createServerClient();
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          user_type: "company",
        },
      },
    });

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes("already registered")) {
        return { success: false, error: "อีเมลนี้ถูกใช้งานแล้ว" };
      }
      return { success: false, error: "เกิดข้อผิดพลาดในการสมัครสมาชิก" };
    }

    const userId = authData.user?.id;
    if (!userId) {
      return { success: false, error: "เกิดข้อผิดพลาดในการสร้างบัญชี" };
    }

    // Step 2: Use admin client to create company + member rows
    // No user session yet at this point, so RLS requires admin client
    const admin = createAdminClient();

    const { data: company, error: companyError } = await admin
      .from("companies")
      .insert({
        name: parsed.data.company_name,
        industry: parsed.data.industry,
        size: parsed.data.size,
      })
      .select("id")
      .single();

    if (companyError || !company) {
      return { success: false, error: "เกิดข้อผิดพลาดในการสร้างบริษัท" };
    }

    const { error: memberError } = await admin.from("company_members").insert({
      company_id: company.id,
      user_id: userId,
      role: "admin",
    });

    if (memberError) {
      return {
        success: false,
        error: "เกิดข้อผิดพลาดในการตั้งค่าสิทธิ์ผู้ใช้",
      };
    }

    return {
      success: true,
      data: { message: "กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน" },
    };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function logoutAction(): Promise<never> {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
