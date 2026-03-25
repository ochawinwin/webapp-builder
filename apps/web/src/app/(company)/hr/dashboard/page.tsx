import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/data/auth";
import { getCompanyByMembership } from "@/lib/data/companies";
import { getCompanyStats } from "@/lib/data/stats";
import { getApplicationsByJob } from "@/lib/data/applications";
import { getJobsByCompany } from "@/lib/data/jobs";
import { DashboardClient } from "@/components/hr/DashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "HR Dashboard" };

export default async function HRDashboardPage() {
  const auth = await getAuthUser();
  if (!auth) redirect("/hr/login");

  const membership = await getCompanyByMembership(auth.user.id);
  if (!membership) redirect("/hr/login");

  const companyId = membership.company.id;

  const [stats, jobs] = await Promise.all([
    getCompanyStats(companyId),
    getJobsByCompany(companyId),
  ]);

  // Get latest applications across all company jobs (up to 4 most recent)
  const latestApplications = jobs.length > 0
    ? (await Promise.all(
        jobs.slice(0, 3).map((job) => getApplicationsByJob(job.id, companyId))
      ))
        .flat()
        .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
        .slice(0, 8)
    : [];

  const userName = [auth.profile.first_name, auth.profile.last_name]
    .filter(Boolean)
    .join(" ") || "คุณ";

  return (
    <DashboardClient
      userName={userName}
      companyId={companyId}
      stats={stats}
      latestApplications={latestApplications}
      jobs={jobs}
    />
  );
}
