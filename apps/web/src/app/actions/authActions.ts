"use server";

import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  registerSeekerSchema,
  registerCompanySchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@futurecareer/types";

export async function registerSeekerAction(input: unknown) {
  const parsed = registerSeekerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten().fieldErrors };
  }

  const { fullName, email, password } = parsed.data;

  try {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, user_type: "seeker" },
      },
    });

    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function registerCompanyAction(input: unknown) {
  const parsed = registerCompanySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten().fieldErrors };
  }

  const { fullName, workEmail, companyName, password } = parsed.data;

  try {
    const supabase = await createServerClient();

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: workEmail,
      password,
      options: {
        data: { full_name: fullName, user_type: "company" },
      },
    });

    if (signUpError) return { success: false as const, error: signUpError.message };
    if (!authData.user) return { success: false as const, error: "ไม่สามารถสร้างบัญชีได้" };

    const userId = authData.user.id;

    // Use admin client to bypass RLS (user has no session yet — email not confirmed)
    const adminClient = createAdminClient();

    // Create company
    const { data: company, error: companyError } = await adminClient
      .from("companies")
      .insert({ name: companyName })
      .select("id")
      .single();

    if (companyError) return { success: false as const, error: companyError.message };

    // Add user as company admin
    const { error: memberError } = await adminClient.from("company_members").insert({
      company_id: company.id,
      user_id: userId,
      role: "admin",
    });

    if (memberError) return { success: false as const, error: memberError.message };

    return { success: true as const };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function loginAction(input: unknown) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  try {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function logoutAction() {
  try {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function forgotPasswordAction(input: unknown) {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten().fieldErrors };
  }

  const { email } = parsed.data;

  try {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}

export async function resetPasswordAction(input: unknown) {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten().fieldErrors };
  }

  const { password } = parsed.data;

  try {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { success: false as const, error: error.message };
    return { success: true as const };
  } catch {
    return { success: false as const, error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
  }
}
