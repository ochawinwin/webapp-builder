import { getJobs, type JobSearchParams } from "@/lib/data/jobs";
import { getAuthUser } from "@/lib/data/auth";
import { getProfileByUserId } from "@/lib/data/profiles";
import { JobSearchClient } from "@/components/JobSearchClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ค้นหางาน",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    types?: string | string[];
    levels?: string | string[];
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;

  const query = sp.q ?? "";
  const types = sp.types
    ? Array.isArray(sp.types)
      ? sp.types
      : [sp.types]
    : [];
  const levels = sp.levels
    ? Array.isArray(sp.levels)
      ? sp.levels
      : [sp.levels]
    : [];
  const page = Math.max(1, Number(sp.page ?? 1));

  const params: JobSearchParams = {
    query: query || undefined,
    types: types.length > 0 ? types : undefined,
    levels: levels.length > 0 ? levels : undefined,
    page,
    limit: 10,
    status: "open",
  };

  const [{ jobs, total }, auth] = await Promise.all([
    getJobs(params),
    getAuthUser(),
  ]);

  let userTagIds: string[] = [];
  if (auth) {
    const profile = await getProfileByUserId(auth.user.id);
    userTagIds = (profile?.tags ?? []).map((t: { id: string }) => t.id);
  }

  return (
    <JobSearchClient
      jobs={jobs}
      total={total}
      currentPage={page}
      initialQuery={query}
      initialTypes={types}
      initialLevels={levels}
      userTagIds={userTagIds}
      isLoggedIn={!!auth}
    />
  );
}
