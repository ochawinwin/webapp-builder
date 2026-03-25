import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/data/auth";
import { getCompanyByMembership, getCompanyById } from "@/lib/data/companies";
import { FeedManagementClient } from "@/components/hr/FeedManagementClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Company Feed" };

export default async function HRFeedPage() {
  const auth = await getAuthUser();
  if (!auth) redirect("/hr/login");

  const membership = await getCompanyByMembership(auth.user.id);
  if (!membership) redirect("/hr/login");

  const companyWithPosts = await getCompanyById(membership.company.id);
  const posts = companyWithPosts?.recent_posts ?? [];

  return (
    <FeedManagementClient
      initialPosts={posts}
      companyId={membership.company.id}
    />
  );
}
