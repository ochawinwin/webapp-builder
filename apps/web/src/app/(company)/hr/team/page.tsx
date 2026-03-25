import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/data/auth";
import { getCompanyByMembership } from "@/lib/data/companies";
import { getCompanyMembers } from "@/lib/data/team";
import { TeamManagementClient } from "@/components/hr/TeamManagementClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "จัดการทีม" };

export default async function HRTeamPage() {
  const auth = await getAuthUser();
  if (!auth) redirect("/hr/login");

  const membership = await getCompanyByMembership(auth.user.id);
  if (!membership) redirect("/hr/login");

  const members = await getCompanyMembers(membership.company.id);

  return (
    <TeamManagementClient
      members={members}
      currentUserId={auth.user.id}
      isAdmin={membership.role === "admin"}
    />
  );
}
