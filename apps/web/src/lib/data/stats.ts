import { createServerClient } from "@/lib/supabase/server";
import type { Tables } from "@futurecareer/supabase";

type JobRow = Tables<"jobs">;
type ApplicationRow = Tables<"applications">;

export type CompanyStats = {
  totalApplicants: number;
  openJobs: number;
  interviewStage: number;
  pendingReview: number;
  weeklyData: { day: string; applicants: number; views: number }[];
};

export async function getCompanyStats(
  companyId: string
): Promise<CompanyStats> {
  const defaultStats: CompanyStats = {
    totalApplicants: 0,
    openJobs: 0,
    interviewStage: 0,
    pendingReview: 0,
    weeklyData: [],
  };

  try {
    const supabase = await createServerClient();

    // Get all job IDs for this company
    const { data: jobs, error: jobsError } = await supabase
      .from("jobs")
      .select("id, status")
      .eq("company_id", companyId);

    if (jobsError || !jobs) return defaultStats;

    const jobRows = jobs as Pick<JobRow, "id" | "status">[];
    const jobIds = jobRows.map((j) => j.id);
    const openJobs = jobRows.filter((j) => j.status === "open").length;

    if (jobIds.length === 0) {
      return { ...defaultStats, openJobs };
    }

    // Get all applications for company jobs
    const { data: applications, error: appsError } = await supabase
      .from("applications")
      .select("id, status, applied_at")
      .in("job_id", jobIds);

    if (appsError || !applications) {
      return { ...defaultStats, openJobs };
    }

    const appRows = applications as Pick<
      ApplicationRow,
      "id" | "status" | "applied_at"
    >[];

    const totalApplicants = appRows.length;
    const interviewStage = appRows.filter(
      (a) => a.status === "interview"
    ).length;
    const pendingReview = appRows.filter(
      (a) => a.status === "new" || a.status === "reviewing"
    ).length;

    // Build last 7 days weekly data
    const weeklyData: { day: string; applicants: number; views: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStr = date.toLocaleDateString("th-TH", { weekday: "short" });
      const datePrefix = date.toISOString().split("T")[0] ?? "";

      const dayApplicants = appRows.filter((a) =>
        a.applied_at.startsWith(datePrefix)
      ).length;

      weeklyData.push({
        day: dayStr,
        applicants: dayApplicants,
        views: 0,
      });
    }

    return {
      totalApplicants,
      openJobs,
      interviewStage,
      pendingReview,
      weeklyData,
    };
  } catch {
    return defaultStats;
  }
}
