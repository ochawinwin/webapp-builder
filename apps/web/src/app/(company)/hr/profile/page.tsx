import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/data/auth";
import { getCompanyByMembership } from "@/lib/data/companies";
import { CompanyProfileForm } from "@/components/hr/CompanyProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ตั้งค่าโปรไฟล์บริษัท" };

export default async function HRProfilePage() {
  const auth = await getAuthUser();
  if (!auth) redirect("/hr/login");

  const membership = await getCompanyByMembership(auth.user.id);
  if (!membership) redirect("/hr/login");

  return (
    <CompanyProfileForm
      company={membership.company}
      isAdmin={membership.role === "admin"}
    />
  );
}
