import type { JobWithDetails } from "@futurecareer/types";

/**
 * Score a job against a user's tag IDs.
 * Returns a 0–100 score based on the proportion of the user's tags
 * that overlap with the job's tags.
 */
export function scoreJobMatch(
  jobTags: string[],
  userTagIds: string[]
): number {
  if (userTagIds.length === 0 || jobTags.length === 0) return 0;

  const jobTagSet = new Set(jobTags);
  const matchCount = userTagIds.filter((id) => jobTagSet.has(id)).length;

  // Score is based on how many of the user's tags appear in the job
  return Math.round((matchCount / userTagIds.length) * 100);
}

/**
 * Sort jobs by match score descending.
 * Jobs with the same score retain their original order.
 */
export function sortJobsByMatch(
  jobs: JobWithDetails[],
  userTagIds: string[]
): JobWithDetails[] {
  if (userTagIds.length === 0) return jobs;

  return [...jobs].sort((a, b) => {
    const aTagIds = a.tags.map((t) => t.id);
    const bTagIds = b.tags.map((t) => t.id);
    const scoreA = scoreJobMatch(aTagIds, userTagIds);
    const scoreB = scoreJobMatch(bTagIds, userTagIds);
    return scoreB - scoreA;
  });
}
