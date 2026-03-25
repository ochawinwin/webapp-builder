import { redirect, notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getJobWithPrescreen } from "@/lib/data/jobs";
import { getResumes } from "@/lib/data/resumes";
import ApplyForm from "./_components/ApplyForm";

interface ApplyPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { id } = await params;

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [job, resumes] = await Promise.all([
    getJobWithPrescreen(id),
    getResumes(user.id).catch(() => []),
  ]);

  if (!job) notFound();

  return <ApplyForm job={job} resumes={resumes} />;
}
