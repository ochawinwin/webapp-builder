export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getResumes } from "@/lib/data/resumes";
import ResumesClient from "./_components/ResumesClient";

export default async function DashboardResumesPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  let resumes: Awaited<ReturnType<typeof getResumes>> = [];
  try {
    resumes = await getResumes(user.id);
  } catch {
    resumes = [];
  }

  return <ResumesClient initialResumes={resumes} />;
}
