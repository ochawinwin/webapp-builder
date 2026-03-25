import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/data/auth";
import { getCompanyByMembership } from "@/lib/data/companies";
import { getJobsByCompany } from "@/lib/data/jobs";
import { getApplicationsByJob } from "@/lib/data/applications";
import { JobManagementClient } from "@/components/hr/JobManagementClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "จัดการประกาศงาน" };

export default async function HRJobsPage() {
  const auth = await getAuthUser();
  if (!auth) redirect("/hr/login");

  const membership = await getCompanyByMembership(auth.user.id);
  if (!membership) redirect("/hr/login");

  const companyId = membership.company.id;
  const jobs = await getJobsByCompany(companyId);

  // Get applicant counts per job
  const applicantCountsArr = await Promise.all(
    jobs.map(async (job) => {
      const apps = await getApplicationsByJob(job.id, companyId);
      return { jobId: job.id, count: apps.length };
    })
  );

  const applicantCounts: Record<string, number> = {};
  for (const { jobId, count } of applicantCountsArr) {
    applicantCounts[jobId] = count;
  }

  return (
    <JobManagementClient
      jobs={jobs}
      applicantCounts={applicantCounts}
      companyId={companyId}
      isAdmin={membership.role === "admin"}
    />
  );
}
