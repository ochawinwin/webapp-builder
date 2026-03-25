import { createServerClient } from "@/lib/supabase/server";
import type { Company, CompanyMember, CompanyWithMembers } from "@futurecareer/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCompany(row: any): Company {
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    coverUrl: row.cover_url,
    shortBio: row.short_bio,
    fullBio: row.full_bio,
    industry: row.industry,
    size: row.size,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMember(row: any): CompanyMember {
  return {
    id: row.id,
    companyId: row.company_id,
    userId: row.user_id,
    role: row.role,
    invitedBy: row.invited_by,
    createdAt: row.created_at,
  };
}

export async function getCompany(id: string): Promise<Company | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return mapCompany(data);
}

export async function getCompanyMembers(companyId: string): Promise<CompanyMember[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("company_members")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapMember);
}

export async function getCompanyWithMembers(id: string): Promise<CompanyWithMembers | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("companies")
    .select(`*, company_members(*)`)
    .eq("id", id)
    .single();

  if (error) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row: any = data;
  return {
    ...mapCompany(row),
    members: (row.company_members ?? []).map(mapMember),
  };
}

export async function getCompanyByUserId(userId: string): Promise<Company | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("company_members")
    .select(`company:companies(*)`)
    .eq("user_id", userId)
    .single();

  if (error) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row: any = data;
  return row.company ? mapCompany(row.company) : null;
}
