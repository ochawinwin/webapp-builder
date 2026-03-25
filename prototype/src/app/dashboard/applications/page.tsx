"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";

type ApplicationStatus = "reviewing" | "submitted" | "rejected";

interface TimelineEvent {
  label: string;
  date: string;
  active: boolean;
}

interface ApplicationItem {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: ApplicationStatus;
  statusLabel: string;
  resume: string;
  coverMessage: string;
  questions: { q: string; a: string }[];
  timeline: TimelineEvent[];
}

const statusBadgeVariant: Record<ApplicationStatus, "violet" | "info" | "error"> = {
  reviewing: "violet",
  submitted: "info",
  rejected: "error",
};

const mockApplications: ApplicationItem[] = [
  {
    id: "1",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp",
    appliedDate: "20 มี.ค. 2026",
    status: "reviewing",
    statusLabel: "กำลังพิจารณา",
    resume: "Resume_Somchai_2026.pdf",
    coverMessage:
      "ผมมีประสบการณ์ด้าน Frontend Development กว่า 5 ปี โดยเฉพาะ React และ TypeScript ผมสนใจที่จะร่วมพัฒนาผลิตภัณฑ์ของ TechCorp เพราะเชื่อว่าทักษะและประสบการณ์ของผมจะช่วยยกระดับ UX ของแพลตฟอร์มได้",
    questions: [
      {
        q: "ทำไมคุณถึงสนใจตำแหน่งนี้?",
        a: "ผมชอบวัฒนธรรมการทำงานของ TechCorp และอยากมีส่วนร่วมในโปรเจกต์ที่ท้าทาย",
      },
    ],
    timeline: [
      { label: "ส่งใบสมัคร", date: "20 มี.ค.", active: true },
      { label: "กำลังพิจารณา", date: "22 มี.ค.", active: true },
    ],
  },
  {
    id: "2",
    jobTitle: "Full Stack Developer",
    company: "StartupXYZ",
    appliedDate: "18 มี.ค. 2026",
    status: "submitted",
    statusLabel: "ส่งแล้ว",
    resume: "Resume_Somchai_2026.pdf",
    coverMessage:
      "ผมมีความสนใจในการทำงานแบบ Full Stack และมีประสบการณ์ทั้ง Frontend และ Backend",
    questions: [],
    timeline: [
      { label: "ส่งใบสมัคร", date: "18 มี.ค.", active: true },
    ],
  },
  {
    id: "3",
    jobTitle: "Backend Engineer",
    company: "BigCo Inc.",
    appliedDate: "10 มี.ค. 2026",
    status: "rejected",
    statusLabel: "ไม่ผ่าน",
    resume: "Resume_Somchai_Design.pdf",
    coverMessage:
      "ผมมีประสบการณ์ด้าน Backend Development และต้องการร่วมงานกับทีมของ BigCo",
    questions: [],
    timeline: [
      { label: "ส่งใบสมัคร", date: "10 มี.ค.", active: true },
      { label: "กำลังพิจารณา", date: "12 มี.ค.", active: true },
      { label: "ไม่ผ่าน", date: "15 มี.ค.", active: true },
    ],
  },
];

function ApplicationCard({ app }: { app: ApplicationItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      {/* Header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-primary">
            {app.jobTitle}{" "}
            <span className="font-normal text-text-secondary">
              at {app.company}
            </span>
          </h3>
          <p className="mt-1 text-xs text-text-tertiary">
            สมัครเมื่อ {app.appliedDate}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusBadgeVariant[app.status]}>
            {app.statusLabel}
          </Badge>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 rounded-[6px] px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            aria-expanded={expanded}
            aria-label={expanded ? "ซ่อนรายละเอียด" : "ดูรายละเอียด"}
          >
            {expanded ? "ซ่อน" : "ดูรายละเอียด"}
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="mt-6 space-y-6 border-t border-border-default pt-6">
          {/* Resume */}
          <div>
            <h4 className="text-sm font-medium text-text-primary">
              เรซูเม่
            </h4>
            <p className="mt-1 text-sm text-text-secondary">
              📄 {app.resume}
            </p>
          </div>

          {/* Cover message */}
          <div>
            <h4 className="text-sm font-medium text-text-primary">
              ข้อความแนะนำตัว
            </h4>
            <p className="mt-1 text-sm text-text-secondary leading-relaxed">
              {app.coverMessage}
            </p>
          </div>

          {/* Q&A */}
          {app.questions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-text-primary">
                คำถาม-คำตอบ
              </h4>
              <div className="mt-2 space-y-3">
                {app.questions.map((qa, i) => (
                  <div key={i} className="rounded-[8px] bg-bg-secondary p-4">
                    <p className="text-sm font-medium text-text-primary">
                      {qa.q}
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">{qa.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h4 className="text-sm font-medium text-text-primary">
              ไทม์ไลน์
            </h4>
            <ol className="mt-3 space-y-0" aria-label="ไทม์ไลน์การสมัคร">
              {app.timeline.map((event, i) => (
                <li key={i} className="flex items-start gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span
                      className={`mt-0.5 h-3 w-3 shrink-0 rounded-full ${
                        event.active ? "bg-primary" : "bg-border-default"
                      }`}
                      aria-hidden="true"
                    />
                    {i < app.timeline.length - 1 && (
                      <span
                        className="w-0.5 flex-1 bg-border-default"
                        style={{ minHeight: "20px" }}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {event.label}
                    </p>
                    <p className="text-xs text-text-tertiary">{event.date}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function ApplicationsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">งานที่สมัคร</h1>
        <p className="mt-2 text-sm text-text-secondary">
          คุณมี {mockApplications.length} รายการที่สมัคร
        </p>
      </div>

      {/* Filter row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="w-full sm:w-48">
          <Select label="กรอง" defaultValue="all">
            <option value="all">ทั้งหมด</option>
            <option value="reviewing">กำลังพิจารณา</option>
            <option value="submitted">ส่งแล้ว</option>
            <option value="rejected">ไม่ผ่าน</option>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select label="เรียง" defaultValue="latest">
            <option value="latest">ล่าสุด</option>
            <option value="oldest">เก่าสุด</option>
          </Select>
        </div>
      </div>

      {/* Application cards */}
      <div className="space-y-4">
        {mockApplications.map((app) => (
          <ApplicationCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}
