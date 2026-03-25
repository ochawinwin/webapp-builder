import { createServerClient } from "@/lib/supabase/server";
import type { JobWithCompany } from "@futurecareer/types";
import { getProfileWithTags } from "../data/profiles";
import { getJobs } from "../data/jobs";
import { calculateMatchScore } from "./matching";

export interface RecommendedJob extends JobWithCompany {
  matchScore: number;
}

export async function getRecommendedJobs(
  userId: string,
  limit = 10
): Promise<RecommendedJob[]> {
  const supabase = await createServerClient();

  // Check user exists
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const profile = await getProfileWithTags(userId);
  const profileTags = profile?.tags ?? [];

  const jobs = await getJobs({ status: "active", limit: 100 });

  const scored: RecommendedJob[] = jobs.map((job) => ({
    ...job,
    matchScore: calculateMatchScore(profileTags, job.tags),
  }));

  return scored
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}
