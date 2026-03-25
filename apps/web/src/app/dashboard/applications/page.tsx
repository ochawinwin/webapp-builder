export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getApplicationsByUser } from "@/lib/data/applications";
import ApplicationsClient from "./_components/ApplicationsClient";

export default async function DashboardApplicationsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  let applications: Awaited<ReturnType<typeof getApplicationsByUser>> = [];
  try {
    applications = await getApplicationsByUser(user.id);
  } catch {
    applications = [];
  }

  return <ApplicationsClient applications={applications} />;
}
