import { redirect, notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { EditJobForm } from "./EditJobForm";

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login-company");

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (!job) notFound();

  return (
    <EditJobForm
      jobId={job.id}
      initialData={{
        title: job.title,
        description: job.description ?? "",
        location: job.location ?? "bangkok",
        jobType: job.job_type ?? "fulltime",
        level: job.level ?? "mid",
        status: job.status ?? "draft",
      }}
    />
  );
}
