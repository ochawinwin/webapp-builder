"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tag } from "@/components/ui/Tag";
import { JobCard } from "@/components/shared/JobCard";

const mockJobs = [
  {
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "กรุงเทพฯ",
    type: "Full-time",
    tags: ["React", "TypeScript", "Senior"],
    matchPercent: 92,
    postedAt: "2 วันที่แล้ว",
    href: "/jobs/1",
  },
  {
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Remote",
    type: "Contract",
    tags: ["Node.js", "React", "Mid-level"],
    matchPercent: 85,
    postedAt: "3 วันที่แล้ว",
    href: "/jobs/2",
  },
  {
    title: "Backend Engineer",
    company: "BigCo Inc.",
    location: "เชียงใหม่",
    type: "Full-time",
    tags: ["Go", "PostgreSQL", "Mid-level"],
    matchPercent: 78,
    postedAt: "5 วันที่แล้ว",
    href: "/jobs/3",
  },
  {
    title: "DevOps Lead",
    company: "CloudFirm",
    location: "กรุงเทพฯ",
    type: "Full-time",
    tags: ["AWS", "K8s", "Senior"],
    matchPercent: 71,
    postedAt: "1 สัปดาห์ที่แล้ว",
    href: "/jobs/4",
  },
  {
    title: "UI/UX Designer",
    company: "DesignHub",
    location: "กรุงเทพฯ",
    type: "Full-time",
    tags: ["Figma", "UI/UX", "Mid-level"],
    matchPercent: 88,
    postedAt: "1 วันที่แล้ว",
    href: "/jobs/5",
  },
  {
    title: "Data Engineer",
    company: "DataTech",
    location: "Remote",
    type: "Freelance",
    tags: ["Python", "SQL", "Senior"],
    matchPercent: 75,
    postedAt: "4 วันที่แล้ว",
    href: "/jobs/6",
  },
];

const filterButtons = [
  { label: "ทักษะ" },
  { label: "อุตสาหกรรม" },
  { label: "ระดับ" },
  { label: "สถานที่" },
  { label: "ประเภท" },
];

const activeFilters = [
  { label: "React", category: "skill" as const },
  { label: "Senior", category: "level" as const },
  { label: "กรุงเทพฯ", category: "location" as const },
];

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5 text-text-tertiary"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`h-5 w-5 ${active ? "text-primary" : "text-text-tertiary"}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`h-5 w-5 ${active ? "text-primary" : "text-text-tertiary"}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
    </svg>
  );
}

export default function JobsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="flex flex-col min-h-full">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Info Banner */}
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
          {/* Search Bar */}
          <div className="relative">
            <label htmlFor="job-search" className="sr-only">ค้นหางาน</label>
            <span className="pointer-events-none flex items-center pl-4" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" }}>
              <SearchIcon />
            </span>
            <input
              id="job-search"
              type="search"
              placeholder="ค้นหาตำแหน่งงาน, ทักษะ, หรือคำที่สนใจ..."
              className="w-full rounded-xl border border-border-default bg-bg-primary py-4 pl-12 pr-4 text-base text-text-primary placeholder:text-text-tertiary shadow-sm focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary"
            />
          </div>

          {/* Filter Row */}
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="ตัวกรอง">
            {filterButtons.map((filter) => (
              <button
                key={filter.label}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-default bg-bg-primary px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-tertiary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                {filter.label}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            ))}
          </div>

          {/* Active Filters */}
          <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="ตัวกรองที่เลือก">
            {activeFilters.map((f) => (
              <Tag key={f.label} category={f.category} onRemove={() => {}}>
                {f.label}
              </Tag>
            ))}
            <button
              type="button"
              className="text-sm text-text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded"
            >
              ล้างทั้งหมด
            </button>
          </div>

          {/* Results Header */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-lg font-semibold text-text-primary">
              พบ <span className="text-primary">42</span> ตำแหน่ง
            </h1>
            <div className="flex items-center gap-3">
              <label htmlFor="sort-select" className="sr-only">เรียงตาม</label>
              <select
                id="sort-select"
                className="rounded-lg border border-border-default bg-bg-primary px-3 py-2 pr-8 text-sm text-text-secondary appearance-none focus:outline-none focus:ring-2 focus:ring-focus-ring"
                defaultValue="match"
              >
                <option value="match">ตรงกันมากสุด</option>
                <option value="newest">ใหม่ล่าสุด</option>
                <option value="salary">เงินเดือนสูงสุด</option>
              </select>
              <div className="flex items-center rounded-lg border border-border-default overflow-hidden" role="group" aria-label="โหมดแสดงผล">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-bg-tertiary" : "hover:bg-bg-tertiary"}`}
                  aria-label="แสดงแบบตาราง"
                  aria-pressed={viewMode === "grid"}
                >
                  <GridIcon active={viewMode === "grid"} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-bg-tertiary" : "hover:bg-bg-tertiary"}`}
                  aria-label="แสดงแบบรายการ"
                  aria-pressed={viewMode === "list"}
                >
                  <ListIcon active={viewMode === "list"} />
                </button>
              </div>
            </div>
          </div>

          {/* Job Cards Grid */}
          <div
            className={`mt-6 grid gap-4 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {mockJobs.map((job) => (
              <JobCard key={job.href} {...job} />
            ))}
          </div>

          {/* Pagination */}
          <nav className="mt-10 flex items-center justify-center gap-1" aria-label="การนำทางหน้า">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-text-secondary hover:bg-bg-tertiary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              aria-label="หน้าก่อนหน้า"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                type="button"
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                  page === 1
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:bg-bg-tertiary"
                }`}
                aria-label={`หน้า ${page}`}
                aria-current={page === 1 ? "page" : undefined}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-text-secondary hover:bg-bg-tertiary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              aria-label="หน้าถัดไป"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
}
