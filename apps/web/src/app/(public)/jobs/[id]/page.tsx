import { notFound } from "next/navigation";
import { getJobById } from "@/lib/data/jobs";
import { getAuthUser } from "@/lib/data/auth";
import { getApplicationsByUser } from "@/lib/data/applications";
import { getProfileByUserId } from "@/lib/data/profiles";
import { JobDetailClient } from "@/components/JobDetailClient";
import type { Metadata } from "next";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) return { title: "ไม่พบตำแหน่งงาน" };
  return { title: `${job.title} — ${job.company?.name}` };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const [job, auth] = await Promise.all([getJobById(id), getAuthUser()]);

  if (!job) notFound();

  let isAlreadyApplied = false;
  let resumeFileName: string | null = null;
  let resumeSignedUrl: string | null = null;

  if (auth) {
    const [apps, profile] = await Promise.all([
      getApplicationsByUser(auth.user.id),
      getProfileByUserId(auth.user.id),
    ]);
    isAlreadyApplied = apps.some((a) => a.job_id === id);

    if (profile?.resume_url) {
      const parts = profile.resume_url.split("/");
      resumeFileName = parts[parts.length - 1] ?? null;
      resumeSignedUrl = profile.resume_signed_url;
    }
  }

  return (
    <JobDetailClient
      job={job}
      isAlreadyApplied={isAlreadyApplied}
      isLoggedIn={!!auth}
      resumeFileName={resumeFileName}
      resumeSignedUrl={resumeSignedUrl}
    />
  );
}
