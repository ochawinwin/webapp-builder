"use client";

import { useState, useEffect, useMemo, useCallback, type DragEvent } from "react";
import Link from "next/link";
import { useRealtime } from "@/hooks/useRealtime";
import { createBrowserClient } from "@/lib/supabase/browser";
import { updateApplicationStatusAction } from "@/app/actions/applicationActions";

interface Candidate {
  id: string;
  name: string;
  date: string;
  tags: string[];
  email: string;
  avatar: string;
  status: string;
  jobId: string;
}

interface CompanyJob {
  id: string;
  title: string;
}

interface KanbanColumn {
  title: string;
  color: string;
  statusKey: string;
}

type ApplicationRow = {
  id: string;
  applicant_id: string;
  created_at: string;
  status: string;
  contact_email: string;
  job_id: string;
};

const COLUMNS: KanbanColumn[] = [
  { title: "ใหม่", color: "bg-info", statusKey: "new" },
  { title: "พิจารณา", color: "bg-warning", statusKey: "reviewing" },
  { title: "สัมภาษณ์", color: "bg-primary", statusKey: "interview" },
  { title: "เสนอ", color: "bg-success", statusKey: "offered" },
];

const STATUS_BADGE_STYLES: Record<string, string> = {
  ใหม่: "bg-info-bg text-info",
  พิจารณา: "bg-warning-bg text-warning",
  สัมภาษณ์: "bg-primary-light text-primary",
  เสนอ: "bg-success-bg text-success",
};

export default function CompanyCandidatesPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [newApplicationCount, setNewApplicationCount] = useState(0);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: membership } = await supabase.from("company_members").select("company_id").eq("user_id", user.id).single();
      if (!membership?.company_id) return;

      // Fetch company jobs
      const { data: jobRows } = await supabase
        .from("jobs")
        .select("id, title")
        .eq("company_id", membership.company_id)
        .order("created_at", { ascending: false });

      if (!jobRows || jobRows.length === 0) { setLoading(false); return; }
      setJobs(jobRows);

      // Fetch all applications for company jobs
      const jobIds = jobRows.map((j) => j.id);
      const { data: apps } = await supabase
        .from("applications")
        .select("id, status, created_at, contact_email, job_id, profiles!applicant_id(full_name)")
        .in("job_id", jobIds)
        .order("created_at", { ascending: false });

      if (apps) {
        setCandidates(apps.map((a) => {
          const name = (a.profiles as unknown as { full_name: string })?.full_name ?? "ผู้สมัคร";
          return {
            id: a.id,
            name,
            date: a.created_at ? new Date(a.created_at).toLocaleDateString("th-TH", { day: "numeric", month: "short" }) : "",
            tags: [],
            email: a.contact_email ?? "",
            avatar: name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
            status: a.status ?? "new",
            jobId: a.job_id ?? "",
          };
        }));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useRealtime<ApplicationRow>({
    table: "applications",
    event: "INSERT",
    callback: (payload) => {
      const newCandidate: Candidate = {
        id: payload.new.id,
        name: "ผู้สมัครใหม่",
        date: new Date(payload.new.created_at).toLocaleDateString("th-TH", { day: "numeric", month: "short" }),
        tags: [],
        email: payload.new.contact_email ?? "",
        avatar: "NN",
        status: payload.new.status ?? "new",
        jobId: payload.new.job_id ?? "",
      };
      setCandidates((prev) => [newCandidate, ...prev]);
      setNewApplicationCount((c) => c + 1);
    },
  });

  // Filter candidates by selected job
  const filteredCandidates = useMemo(() => {
    if (selectedJobId === "all") return candidates;
    return candidates.filter((c) => c.jobId === selectedJobId);
  }, [candidates, selectedJobId]);

  const selectedJobTitle = useMemo(() => {
    if (selectedJobId === "all") return "ทุกตำแหน่ง";
    return jobs.find((j) => j.id === selectedJobId)?.title ?? "ทุกตำแหน่ง";
  }, [selectedJobId, jobs]);

  const kanbanData = useMemo(() => COLUMNS.map((col) => ({
    ...col,
    candidates: filteredCandidates.filter((c) => c.status === col.statusKey),
  })), [filteredCandidates]);

  const allCandidates = useMemo(() => filteredCandidates.map((c) => ({
    ...c,
    statusLabel: COLUMNS.find((col) => col.statusKey === c.status)?.title ?? c.status,
  })), [filteredCandidates]);

  // Drag and drop handlers
  const handleDragStart = useCallback((e: DragEvent, candidateId: string) => {
    e.dataTransfer.setData("text/plain", candidateId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: DragEvent, statusKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(statusKey);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(async (e: DragEvent, newStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    const candidateId = e.dataTransfer.getData("text/plain");
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate || candidate.status === newStatus) return;

    // Optimistic update
    setCandidates((prev) =>
      prev.map((c) => c.id === candidateId ? { ...c, status: newStatus } : c)
    );

    // Persist to DB
    const result = await updateApplicationStatusAction({
      applicationId: candidateId,
      status: newStatus,
    });

    if (!result.success) {
      console.error("Status update failed:", result.error);
      // Revert on failure
      setCandidates((prev) =>
        prev.map((c) => c.id === candidateId ? { ...c, status: candidate.status } : c)
      );
    }
  }, [candidates]);

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><p className="text-text-tertiary">กำลังโหลด...</p></div>;
  }

  return (
    <div className="max-w-full">
      <div className="mb-2">
        <p className="text-sm text-text-tertiary">งาน &gt; ผู้สมัคร {selectedJobTitle}</p>
      </div>
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-text-primary">ผู้สมัคร {selectedJobTitle}</h1>
        {newApplicationCount > 0 && (
          <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-text-inverse">
            +{newApplicationCount} ใหม่
          </span>
        )}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <select
          aria-label="เลือกตำแหน่งงาน"
          className="rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm font-medium text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
          value={selectedJobId}
          onChange={(e) => {
            setSelectedJobId(e.target.value);
            setNewApplicationCount(0);
          }}
        >
          <option value="all">ทุกตำแหน่ง</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>

        <div
          className="inline-flex rounded-lg border border-border-default bg-bg-primary"
          role="group"
          aria-label="เลือกมุมมอง"
        >
          <button
            type="button"
            className={`rounded-l-lg px-4 py-2 text-sm font-medium transition-colors ${
              view === "kanban" ? "bg-primary text-text-inverse" : "text-text-secondary hover:bg-bg-tertiary"
            }`}
            onClick={() => setView("kanban")}
            aria-pressed={view === "kanban"}
          >
            &#9632; Kanban
          </button>
          <button
            type="button"
            className={`rounded-r-lg px-4 py-2 text-sm font-medium transition-colors ${
              view === "list" ? "bg-primary text-text-inverse" : "text-text-secondary hover:bg-bg-tertiary"
            }`}
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
          >
            &#9776; รายการ
          </button>
        </div>
      </div>

      {view === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {kanbanData.map((column) => (
            <div
              key={column.title}
              className={`w-72 shrink-0 rounded-xl border-2 transition-colors ${
                dragOverColumn === column.statusKey
                  ? "border-primary bg-primary-subtle"
                  : "border-border-default bg-bg-secondary"
              }`}
              onDragOver={(e) => handleDragOver(e, column.statusKey)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.statusKey)}
            >
              <div className="flex items-center gap-2 border-b border-border-default px-4 py-3">
                <span className={`h-3 w-3 rounded-full ${column.color}`} aria-hidden="true" />
                <h2 className="text-sm font-semibold text-text-primary">{column.title}</h2>
                <span className="ml-auto rounded-full bg-bg-tertiary px-2 py-0.5 text-xs font-medium text-text-tertiary">
                  {column.candidates.length}
                </span>
              </div>
              <div className="min-h-[100px] space-y-3 p-3">
                {column.candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate.id)}
                    className="cursor-grab rounded-lg border border-border-default bg-bg-primary p-4 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing active:shadow-lg"
                  >
                    <Link href={`/company/candidates/${candidate.id}`}>
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary" aria-hidden="true">
                          {candidate.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-text-primary">{candidate.name}</p>
                          <p className="text-xs text-text-tertiary">{candidate.date}</p>
                        </div>
                      </div>
                    </Link>
                    {candidate.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-bg-tertiary px-2 py-0.5 text-xs text-text-secondary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "list" && (
        <section className="rounded-xl border border-border-default bg-bg-primary shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-default bg-bg-secondary">
                  <th scope="col" className="px-6 py-3 font-medium text-text-secondary">ชื่อ</th>
                  <th scope="col" className="px-6 py-3 font-medium text-text-secondary">อีเมล</th>
                  <th scope="col" className="px-6 py-3 font-medium text-text-secondary">สมัครเมื่อ</th>
                  <th scope="col" className="px-6 py-3 font-medium text-text-secondary">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {allCandidates.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-text-tertiary">ยังไม่มีผู้สมัคร</td></tr>
                ) : allCandidates.map((candidate) => (
                  <tr key={candidate.id} className="border-b border-border-default last:border-b-0 transition-colors hover:bg-bg-secondary">
                    <td className="px-6 py-4">
                      <Link href={`/company/candidates/${candidate.id}`} className="font-medium text-text-primary transition-colors hover:text-primary">
                        {candidate.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{candidate.email}</td>
                    <td className="px-6 py-4 text-text-secondary">{candidate.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE_STYLES[candidate.statusLabel] ?? ""}`}>
                        {candidate.statusLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
