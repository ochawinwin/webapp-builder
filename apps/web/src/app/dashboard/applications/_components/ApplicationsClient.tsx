"use client";

import { useState } from "react";
import { useRealtime } from "@/hooks/useRealtime";
import { Card, Badge, Select } from "@futurecareer/ui";
import type { ApplicationWithDetails, ApplicationStatus } from "@futurecareer/types";

type ApplicationRow = {
  id: string;
  status: ApplicationStatus;
  applicant_id: string;
};

const FILTER_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "new", label: "ใหม่" },
  { value: "reviewing", label: "กำลังพิจารณา" },
  { value: "interview", label: "สัมภาษณ์" },
  { value: "offered", label: "เสนองาน" },
  { value: "rejected", label: "ไม่ผ่าน" },
];

const SORT_OPTIONS = [
  { value: "latest", label: "ล่าสุด" },
  { value: "oldest", label: "เก่าสุด" },
];

type BadgeVariant = "violet" | "info" | "error" | "success" | "warning";

const STATUS_BADGE: Record<string, { variant: BadgeVariant; label: string }> = {
  new: { variant: "info", label: "ใหม่" },
  reviewing: { variant: "violet", label: "กำลังพิจารณา" },
  interview: { variant: "warning", label: "สัมภาษณ์" },
  offered: { variant: "success", label: "เสนองาน" },
  rejected: { variant: "error", label: "ไม่ผ่าน" },
};

function ApplicationCard({ app }: { app: ApplicationWithDetails }) {
  const [expanded, setExpanded] = useState(false);
  const statusInfo = STATUS_BADGE[app.status] ?? { variant: "info" as const, label: app.status };

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-primary">
            {app.job.title}{" "}
            <span className="font-normal text-text-secondary">at {app.job.companyId}</span>
          </h3>
          <p className="mt-1 text-xs text-text-tertiary">
            สมัครเมื่อ {new Date(app.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 rounded-[6px] px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
            aria-expanded={expanded}
            aria-label={expanded ? "ซ่อนรายละเอียด" : "ดูรายละเอียด"}
          >
            {expanded ? "ซ่อน" : "ดูรายละเอียด"}
            <svg className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-6 space-y-6 border-t border-border-default pt-6">
          {app.resume && (
            <div>
              <h4 className="text-sm font-medium text-text-primary">เรซูเม่</h4>
              <p className="mt-1 text-sm text-text-secondary">📄 {app.resume.fileName}</p>
            </div>
          )}
          {app.coverMessage && (
            <div>
              <h4 className="text-sm font-medium text-text-primary">ข้อความแนะนำตัว</h4>
              <p className="mt-1 text-sm text-text-secondary leading-relaxed">{app.coverMessage}</p>
            </div>
          )}
          {app.answers.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-text-primary">คำถาม-คำตอบ</h4>
              <div className="mt-2 space-y-3">
                {app.answers.map((ans, i) => (
                  <div key={i} className="rounded-[8px] bg-bg-secondary p-4">
                    <p className="text-sm font-medium text-text-primary">{ans.questionId}</p>
                    <p className="mt-1 text-sm text-text-secondary">{ans.answerText}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

interface ApplicationsClientProps {
  applications: ApplicationWithDetails[];
}

export default function ApplicationsClient({ applications: initialApplications }: ApplicationsClientProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("latest");

  const userId = initialApplications[0]?.applicantId ?? "";

  useRealtime<ApplicationRow>({
    table: "applications",
    event: "UPDATE",
    filter: userId ? `applicant_id=eq.${userId}` : undefined,
    callback: (payload) => {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === payload.new.id ? { ...app, status: payload.new.status } : app
        )
      );
    },
  });

  const filtered = applications
    .filter((app) => filter === "all" || app.status === filter)
    .sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">งานที่สมัคร</h1>
        <p className="mt-2 text-sm text-text-secondary">คุณมี {initialApplications.length} รายการที่สมัคร</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="w-full sm:w-48">
          <Select
            label="กรอง"
            value={filter}
            onValueChange={(v) => setFilter(v)}
            options={FILTER_OPTIONS}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            label="เรียง"
            value={sort}
            onValueChange={(v) => setSort(v)}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-text-tertiary">ไม่มีรายการที่สมัคร</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
