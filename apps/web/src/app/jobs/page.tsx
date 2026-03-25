export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Footer, JobCard, Tag } from "@futurecareer/ui";
import { AuthHeader } from "@/components/AuthHeader";

export const metadata: Metadata = { title: "ค้นหางาน" };
import { getJobs } from "@/lib/data/jobs";
import JobsClientView from "./_components/JobsClientView";

const FILTER_BUTTONS = ["ทักษะ", "อุตสาหกรรม", "ระดับ", "สถานที่", "ประเภท"];

interface JobsPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const { q, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const limit = 12;
  const offset = (currentPage - 1) * limit;

  let jobs: Awaited<ReturnType<typeof getJobs>> = [];
  try {
    jobs = await getJobs({ search: q, limit, offset, status: "active" });
  } catch {
    jobs = [];
  }

  return (
    <div className="flex flex-col min-h-full">
      <AuthHeader />

      <main id="main-content" className="flex-1">
        <div className="bg-info-bg border-b border-blue-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2">
            <svg className="h-5 w-5 text-info shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <p className="text-sm text-blue-800">
              <a href="/auth/login" className="font-medium underline hover:text-blue-900">เข้าสู่ระบบ</a>เพื่อดูคะแนนจับคู่ส่วนตัว
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <form method="GET" className="relative">
            <label htmlFor="job-search" className="sr-only">ค้นหางาน</label>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="h-5 w-5 text-text-tertiary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </span>
            <input
              id="job-search"
              name="q"
              type="search"
              defaultValue={q ?? ""}
              placeholder="ค้นหาตำแหน่งงาน, ทักษะ, หรือคำที่สนใจ..."
              className="w-full rounded-xl border border-border-default bg-bg-primary py-4 pl-12 pr-4 text-base text-text-primary placeholder:text-text-tertiary shadow-sm focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary"
            />
          </form>

          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="ตัวกรอง">
            {FILTER_BUTTONS.map((label) => (
              <button
                key={label}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-default bg-bg-primary px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-tertiary transition-colors"
              >
                {label}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            ))}
          </div>

          {q && (
            <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="ตัวกรองที่เลือก">
              <Tag label={q} category="skill" onRemove={undefined} />
              <a href="/jobs" className="text-sm text-text-link hover:underline rounded">ล้างทั้งหมด</a>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-lg font-semibold text-text-primary">
              พบ <span className="text-primary">{jobs.length}</span> ตำแหน่ง
              {q && <span className="font-normal text-text-secondary"> สำหรับ &quot;{q}&quot;</span>}
            </h1>
          </div>

          {jobs.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-3 text-center">
              <p className="text-text-secondary">ไม่พบตำแหน่งงาน{q ? ` สำหรับ "${q}"` : ""}</p>
              {q && <a href="/jobs" className="text-sm text-text-link hover:underline">ดูทั้งหมด</a>}
            </div>
          ) : (
            <JobsClientView jobs={jobs} />
          )}

          {jobs.length > 0 && (
            <nav className="mt-10 flex items-center justify-center gap-1" aria-label="การนำทางหน้า">
              {currentPage > 1 && (
                <a href={`/jobs?${q ? `q=${q}&` : ""}page=${currentPage - 1}`} className="inline-flex items-center justify-center rounded-lg p-2 text-text-secondary hover:bg-bg-tertiary transition-colors" aria-label="หน้าก่อนหน้า">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </a>
              )}
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-medium text-white" aria-current="page">
                {currentPage}
              </span>
              {jobs.length === limit && (
                <a href={`/jobs?${q ? `q=${q}&` : ""}page=${currentPage + 1}`} className="inline-flex items-center justify-center rounded-lg p-2 text-text-secondary hover:bg-bg-tertiary transition-colors" aria-label="หน้าถัดไป">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </a>
              )}
            </nav>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
