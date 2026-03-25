"use server";

import { createServerClient } from "@/lib/supabase/server";
import type { UserType } from "@futurecareer/types";

export async function getCurrentUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("ไม่ได้เข้าสู่ระบบ");
  }
  return user;
}

export async function requireRole(role: UserType) {
  const user = await requireAuth();
  const userType = user.user_metadata?.["user_type"] as UserType | undefined;
  if (userType !== role) {
    throw new Error("ไม่มีสิทธิ์เข้าถึง");
  }
  return user;
}

export async function getCompanyMembership(userId: string, companyId: string) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("company_members")
    .select("*")
    .eq("user_id", userId)
    .eq("company_id", companyId)
    .single();
  return data;
}
