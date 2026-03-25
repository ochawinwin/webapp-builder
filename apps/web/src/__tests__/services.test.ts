import { describe, it, expect } from "vitest";
import { calculateMatchScore } from "@/lib/services/matching";
import type { Tag } from "@futurecareer/types";

function makeTag(id: string): Tag {
  return { id, name: `Tag ${id}`, category: "skill", createdAt: new Date().toISOString() };
}

describe("calculateMatchScore", () => {
  it("returns 0 when profileTags is empty", () => {
    const jobTags = [makeTag("1"), makeTag("2")];
    expect(calculateMatchScore([], jobTags)).toBe(0);
  });

  it("returns 0 when jobTags is empty", () => {
    const profileTags = [makeTag("1"), makeTag("2")];
    expect(calculateMatchScore(profileTags, [])).toBe(0);
  });

  it("returns 0 when there is no overlap", () => {
    const profileTags = [makeTag("1"), makeTag("2")];
    const jobTags = [makeTag("3"), makeTag("4")];
    expect(calculateMatchScore(profileTags, jobTags)).toBe(0);
  });

  it("returns 100 when there is full overlap", () => {
    const tags = [makeTag("1"), makeTag("2"), makeTag("3")];
    expect(calculateMatchScore(tags, tags)).toBe(100);
  });

  it("returns correct percentage for partial overlap", () => {
    const profileTags = [makeTag("1"), makeTag("2"), makeTag("3")];
    const jobTags = [makeTag("1"), makeTag("2"), makeTag("4"), makeTag("5")];
    // 2 matches out of 4 job tags = 50%
    expect(calculateMatchScore(profileTags, jobTags)).toBe(50);
  });

  it("rounds the result to the nearest integer", () => {
    const profileTags = [makeTag("1")];
    // 1 match out of 3 job tags = 33.33% -> rounds to 33
    const jobTags = [makeTag("1"), makeTag("2"), makeTag("3")];
    expect(calculateMatchScore(profileTags, jobTags)).toBe(33);
  });

  it("returns score based on job tags count, not profile tags count", () => {
    const profileTags = [makeTag("1")];
    const jobTags = [makeTag("1")];
    // 1 match out of 1 job tag = 100%
    expect(calculateMatchScore(profileTags, jobTags)).toBe(100);
  });
});
