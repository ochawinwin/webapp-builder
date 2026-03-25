import type { Tag } from "@futurecareer/types";

/**
 * Calculates match score as percentage overlap between profile preference tags and job tags.
 * Returns a number between 0 and 100.
 */
export function calculateMatchScore(profileTags: Tag[], jobTags: Tag[]): number {
  if (profileTags.length === 0 || jobTags.length === 0) return 0;

  const profileTagIds = new Set(profileTags.map((t) => t.id));
  const matchCount = jobTags.filter((t) => profileTagIds.has(t.id)).length;

  return Math.round((matchCount / jobTags.length) * 100);
}
