"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@futurecareer/ui";
import { createBrowserClient } from "@/lib/supabase/browser";

const STATUS_MAP: Record<string, { label: string; style: string }> = {
  active: { label: "เผยแพร่", style: "bg-success-bg text-success" },
  paused: { label: "หยุดชั่วคราว", style: "bg-warning-bg text-warning" },
  draft: { label: "แบบร่าง", style: "bg-bg-tertiary text-text-tertiary" },
  closed: { label: "ปิดแล้ว", style: "bg-error-bg text-error" },
};

interface CompanyJob {
  id: string;
  title: string;
  status: string;
  created_at: string;
  applicant_count: number;
}

export default function CompanyJobsPage() {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchJobs() {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: membership } = await supabase
        .from("company_members")
        .select("company_id")
        .eq("user_id", user.id)
        .single();

      if (!membership?.company_id) return;
      const companyId = membership.company_id;

      const { data: jobRows } = await supabase
        .from("jobs")
        .select("id, title, status, created_at")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      if (!jobRows) { setLoading(false); return; }

      const jobsWithCounts: CompanyJob[] = await Promise.all(
        jobRows.map(async (job) => {
          const { count } = await supabase
            .from("applications")
            .select("*", { count: "exact", head: true })
            .eq("job_id", job.id);
          return {
            id: job.id,
            title: job.title,
            status: job.status ?? "draft",
            created_at: job.created_at ?? new Date().toISOString(),
            applicant_count: count ?? 0,
          };
        })
      );

      setJobs(jobsWithCounts);
      setLoading(false);
    }
    fetchJobs();
  }, []);

  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-primary">ประกาศรับสมัครงาน</h1>
        <Button variant="primary" size="md" href="/company/jobs/new/edit">
          + สร้างประกาศใหม่
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="flex-1">
          <label htmlFor="job-search" className="sr-only">ค้นหาตำแหน่งงาน</label>
          <input
            id="job-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาตำแหน่งงาน..."
            className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
          />
        </div>
      </div>

      <section className="rounded-xl border border-border-default bg-bg-primary shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default bg-bg-secondary">
                <th scope="col" className="px-6 py-3 font-medium text-text-secondary">ตำแหน่ง</th>
                <th scope="col" className="px-6 py-3 font-medium text-text-secondary">สถานะ</th>
                <th scope="col" className="px-6 py-3 font-medium text-text-secondary">ผู้สมัคร</th>
                <th scope="col" className="px-6 py-3 font-medium text-text-secondary">วันที่</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">เมนู</span></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-text-tertiary">กำลังโหลด...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-text-tertiary">ยังไม่มีประกาศงาน</td></tr>
              ) : filtered.map((job) => {
                const s = STATUS_MAP[job.status] ?? { label: job.status, style: "" };
                return (
                  <tr key={job.id} className="border-b border-border-default last:border-b-0 transition-colors hover:bg-bg-secondary">
                    <td className="px-6 py-4">
                      <Link href={`/company/jobs/${job.id}/edit`} className="font-medium text-text-primary transition-colors hover:text-primary">
                        {job.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.style}`}>{s.label}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href="/company/candidates" className="font-medium text-primary transition-colors hover:text-primary-hover">
                        {job.applicant_count}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{new Date(job.created_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                          aria-label={`เมนูสำหรับ ${job.title}`}
                          aria-expanded={openMenuId === job.id}
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === job.id ? null : job.id); }}
                        >
                          &#8942;
                        </button>
                        {openMenuId === job.id && (
                          <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-border-default bg-bg-primary py-1 shadow-lg" role="menu">
                            <Link href={`/company/jobs/${job.id}/edit`} className="block px-4 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary" role="menuitem">แก้ไข</Link>
                            <button type="button" className="block w-full px-4 py-2 text-left text-sm text-error hover:bg-error-bg" role="menuitem" onClick={() => router.refresh()}>ลบ</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
