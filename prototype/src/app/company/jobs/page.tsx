"use client";

import { useState } from "react";
import Link from "next/link";

interface JobPosting {
  id: number;
  title: string;
  status: "เปิดรับ" | "หยุดชั่วคราว" | "แบบร่าง" | "ปิดแล้ว";
  applicants: number;
  date: string;
}

const jobs: JobPosting[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    status: "เปิดรับ",
    applicants: 12,
    date: "15 มี.ค. 2026",
  },
  {
    id: 2,
    title: "Full Stack Developer",
    status: "เปิดรับ",
    applicants: 8,
    date: "12 มี.ค. 2026",
  },
  {
    id: 3,
    title: "Backend Engineer",
    status: "หยุดชั่วคราว",
    applicants: 3,
    date: "10 มี.ค. 2026",
  },
  {
    id: 4,
    title: "UI/UX Designer",
    status: "แบบร่าง",
    applicants: 0,
    date: "22 มี.ค. 2026",
  },
  {
    id: 5,
    title: "DevOps Lead",
    status: "ปิดแล้ว",
    applicants: 15,
    date: "28 ก.พ. 2026",
  },
];

const statusStyles: Record<string, string> = {
  เปิดรับ: "bg-success-bg text-success",
  หยุดชั่วคราว: "bg-warning-bg text-warning",
  แบบร่าง: "bg-bg-tertiary text-text-tertiary",
  ปิดแล้ว: "bg-error-bg text-error",
};

export default function CompanyJobsPage() {
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-primary">
          ประกาศรับสมัครงาน
        </h1>
        <Link
          href="/company/jobs/new/edit"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-text-inverse shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          + สร้างประกาศใหม่
        </Link>
      </div>

      {/* Search & filter row */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="flex-1">
          <label htmlFor="job-search" className="sr-only">
            ค้นหาตำแหน่งงาน
          </label>
          <input
            id="job-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาตำแหน่งงาน..."
            className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
          />
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm font-medium text-text-secondary shadow-sm transition-colors hover:bg-bg-tertiary"
        >
          สถานะ: ทั้งหมด
          <span aria-hidden="true">&#9662;</span>
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm font-medium text-text-secondary shadow-sm transition-colors hover:bg-bg-tertiary"
        >
          เรียง
          <span aria-hidden="true">&#9662;</span>
        </button>
      </div>

      {/* Jobs table */}
      <section className="rounded-xl border border-border-default bg-bg-primary shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default bg-bg-secondary">
                <th
                  scope="col"
                  className="px-6 py-3 font-medium text-text-secondary"
                >
                  ตำแหน่ง
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-medium text-text-secondary"
                >
                  สถานะ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-medium text-text-secondary"
                >
                  ผู้สมัคร
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-medium text-text-secondary"
                >
                  วันที่
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">เมนู</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-border-default last:border-b-0 hover:bg-bg-secondary transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/company/jobs/${job.id}/edit`}
                      className="font-medium text-text-primary hover:text-primary transition-colors"
                    >
                      {job.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[job.status]}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href="/company/candidates"
                      className="font-medium text-primary hover:text-primary-hover transition-colors"
                    >
                      {job.applicants}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{job.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                        aria-label={`เมนูสำหรับ ${job.title}`}
                        aria-expanded={openMenuId === job.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === job.id ? null : job.id
                          );
                        }}
                      >
                        &#8942;
                      </button>
                      {openMenuId === job.id && (
                        <div
                          className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-border-default bg-bg-primary py-1 shadow-lg"
                          role="menu"
                        >
                          <Link
                            href={`/company/jobs/${job.id}/edit`}
                            className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                            role="menuitem"
                          >
                            แก้ไข
                          </Link>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                            role="menuitem"
                          >
                            ทำสำเนา
                          </button>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-left text-sm text-error hover:bg-error-bg"
                            role="menuitem"
                          >
                            ลบ
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
