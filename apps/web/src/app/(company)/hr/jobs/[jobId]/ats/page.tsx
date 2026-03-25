import { redirect, notFound } from "next/navigation";
import { getAuthUser } from "@/lib/data/auth";
import { getCompanyByMembership } from "@/lib/data/companies";
import { getJobById } from "@/lib/data/jobs";
import { getApplicationsByJob } from "@/lib/data/applications";
import { ATSBoardClient } from "@/components/hr/ATSBoardClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ jobId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { jobId } = await params;
  const job = await getJobById(jobId);
  return { title: job ? `ATS: ${job.title}` : "ATS Board" };
}

export default async function ATSPage({ params }: Props) {
  const { jobId } = await params;

  const auth = await getAuthUser();
  if (!auth) redirect("/hr/login");

  const membership = await getCompanyByMembership(auth.user.id);
  if (!membership) redirect("/hr/login");

  const [job, applications] = await Promise.all([
    getJobById(jobId),
    getApplicationsByJob(jobId, membership.company.id),
  ]);

  if (!job || job.company_id !== membership.company.id) notFound();

  return (
    <ATSBoardClient
      job={job}
      initialApplications={applications}
      companyId={membership.company.id}
    />
  );
}
