import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyProfileForm } from "./CompanyProfileForm";

export default async function CompanyProfilePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login-company");

  const { data: membership } = await supabase
    .from("company_members")
    .select("company_id, role, companies(id, name, short_bio, full_bio, industry, size, logo_url, cover_url)")
    .eq("user_id", user.id)
    .single();

  if (!membership) redirect("/auth/login-company");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const company = (membership as any).companies;

  return (
    <CompanyProfileForm
      companyId={membership.company_id}
      initialData={{
        name: company?.name ?? "",
        shortBio: company?.short_bio ?? "",
        fullBio: company?.full_bio ?? "",
        industry: company?.industry ?? "technology",
        size: company?.size ?? "51-200",
        logoUrl: company?.logo_url ?? null,
        coverUrl: company?.cover_url ?? null,
      }}
    />
  );
}
