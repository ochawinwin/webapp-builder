"use client";

import { useState } from "react";
import { JobCard } from "@futurecareer/ui";
import type { JobWithCompany } from "@futurecareer/types";

interface JobsClientViewProps {
  jobs: JobWithCompany[];
}

export default function JobsClientView({ jobs }: JobsClientViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <>
      <div className="mt-4 flex justify-end">
        <div className="flex items-center rounded-lg border border-border-default overflow-hidden" role="group" aria-label="โหมดแสดงผล">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`p-2 transition-colors ${viewMode === "grid" ? "bg-bg-tertiary" : "hover:bg-bg-tertiary"}`}
            aria-label="แสดงแบบตาราง"
            aria-pressed={viewMode === "grid"}
          >
            <svg className={`h-5 w-5 ${viewMode === "grid" ? "text-primary" : "text-text-tertiary"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`p-2 transition-colors ${viewMode === "list" ? "bg-bg-tertiary" : "hover:bg-bg-tertiary"}`}
            aria-label="แสดงแบบรายการ"
            aria-pressed={viewMode === "list"}
          >
            <svg className={`h-5 w-5 ${viewMode === "list" ? "text-primary" : "text-text-tertiary"}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
          </button>
        </div>
      </div>

      <div className={`mt-4 grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            title={job.title}
            company={job.company.name}
            location={job.location ?? ""}
            jobType={job.jobType ?? ""}
            tags={job.tags.map((t) => t.name)}
            postedDate={job.createdAt ? new Date(job.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) : ""}
            href={`/jobs/${job.id}`}
          />
        ))}
      </div>
    </>
  );
}
