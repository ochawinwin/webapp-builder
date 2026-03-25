"use client";

import { useState } from "react";
import Link from "next/link";

interface Candidate {
  id: number;
  name: string;
  date: string;
  tags: string[];
  email: string;
  avatar: string;
}

interface KanbanColumn {
  title: string;
  color: string;
  candidates: Candidate[];
}

const kanbanData: KanbanColumn[] = [
  {
    title: "ใหม่",
    color: "bg-info",
    candidates: [
      {
        id: 1,
        name: "Alice Johnson",
        date: "23 มี.ค.",
        tags: ["React", "TypeScript"],
        email: "alice@example.com",
        avatar: "AJ",
      },
      {
        id: 2,
        name: "Bob Smith",
        date: "22 มี.ค.",
        tags: ["Next.js", "Node.js"],
        email: "bob@example.com",
        avatar: "BS",
      },
      {
        id: 3,
        name: "Carol Lee",
        date: "21 มี.ค.",
        tags: ["React", "GraphQL"],
        email: "carol@example.com",
        avatar: "CL",
      },
      {
        id: 4,
        name: "Dan Wilson",
        date: "20 มี.ค.",
        tags: ["Vue.js", "TypeScript"],
        email: "dan@example.com",
        avatar: "DW",
      },
    ],
  },
  {
    title: "พิจารณา",
    color: "bg-warning",
    candidates: [
      {
        id: 5,
        name: "Dave Brown",
        date: "19 มี.ค.",
        tags: ["React", "Redux"],
        email: "dave@example.com",
        avatar: "DB",
      },
      {
        id: 6,
        name: "Eve Davis",
        date: "18 มี.ค.",
        tags: ["TypeScript", "Testing"],
        email: "eve@example.com",
        avatar: "ED",
      },
      {
        id: 7,
        name: "Frank Miller",
        date: "17 มี.ค.",
        tags: ["React", "CSS"],
        email: "frank@example.com",
        avatar: "FM",
      },
    ],
  },
  {
    title: "สัมภาษณ์",
    color: "bg-primary",
    candidates: [
      {
        id: 8,
        name: "Grace Taylor",
        date: "16 มี.ค.",
        tags: ["React", "Next.js"],
        email: "grace@example.com",
        avatar: "GT",
      },
      {
        id: 9,
        name: "Hank Anderson",
        date: "15 มี.ค.",
        tags: ["Full Stack", "AWS"],
        email: "hank@example.com",
        avatar: "HA",
      },
    ],
  },
  {
    title: "เสนอ",
    color: "bg-success",
    candidates: [
      {
        id: 10,
        name: "Ivy Chen",
        date: "14 มี.ค.",
        tags: ["React", "Lead"],
        email: "ivy@example.com",
        avatar: "IC",
      },
    ],
  },
];

const allCandidates = kanbanData.flatMap((col) =>
  col.candidates.map((c) => ({ ...c, status: col.title }))
);

const statusBadgeStyles: Record<string, string> = {
  ใหม่: "bg-info-bg text-info",
  พิจารณา: "bg-warning-bg text-warning",
  สัมภาษณ์: "bg-primary-light text-primary",
  เสนอ: "bg-success-bg text-success",
};

export default function CompanyCandidatesPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="mb-2">
        <p className="text-sm text-text-tertiary">
          งาน &gt; ผู้สมัคร Senior Frontend Developer
        </p>
      </div>
      <h1 className="mb-4 text-2xl font-bold text-text-primary">
        ผู้สมัคร Senior Frontend Developer
      </h1>

      {/* Position selector + view toggle */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <select
          aria-label="เลือกตำแหน่งงาน"
          className="rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm font-medium text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
          defaultValue="senior-frontend"
        >
          <option value="senior-frontend">Senior Frontend Developer</option>
          <option value="fullstack">Full Stack Developer</option>
          <option value="backend">Backend Engineer</option>
        </select>

        <div
          className="inline-flex rounded-lg border border-border-default bg-bg-primary"
          role="group"
          aria-label="เลือกมุมมอง"
        >
          <button
            type="button"
            className={`rounded-l-lg px-4 py-2 text-sm font-medium transition-colors ${
              view === "kanban"
                ? "bg-primary text-text-inverse"
                : "text-text-secondary hover:bg-bg-tertiary"
            }`}
            onClick={() => setView("kanban")}
            aria-pressed={view === "kanban"}
          >
            &#9632; Kanban
          </button>
          <button
            type="button"
            className={`rounded-r-lg px-4 py-2 text-sm font-medium transition-colors ${
              view === "list"
                ? "bg-primary text-text-inverse"
                : "text-text-secondary hover:bg-bg-tertiary"
            }`}
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
          >
            &#9776; รายการ
          </button>
        </div>
      </div>

      {/* Kanban view */}
      {view === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {kanbanData.map((column) => (
            <div
              key={column.title}
              className="w-72 shrink-0 rounded-xl border border-border-default bg-bg-secondary"
            >
              {/* Column header */}
              <div className="flex items-center gap-2 border-b border-border-default px-4 py-3">
                <span
                  className={`h-3 w-3 rounded-full ${column.color}`}
                  aria-hidden="true"
                />
                <h2 className="text-sm font-semibold text-text-primary">
                  {column.title}
                </h2>
                <span className="ml-auto rounded-full bg-bg-tertiary px-2 py-0.5 text-xs font-medium text-text-tertiary">
                  {column.candidates.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3 p-3">
                {column.candidates.map((candidate) => (
                  <Link
                    key={candidate.id}
                    href={`/company/candidates/${candidate.id}`}
                    className="block rounded-lg border border-border-default bg-bg-primary p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary"
                        aria-hidden="true"
                      >
                        {candidate.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-text-primary">
                          {candidate.name}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {candidate.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-bg-tertiary px-2 py-0.5 text-xs text-text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <section className="rounded-xl border border-border-default bg-bg-primary shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-default bg-bg-secondary">
                  <th
                    scope="col"
                    className="px-6 py-3 font-medium text-text-secondary"
                  >
                    ชื่อ
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 font-medium text-text-secondary"
                  >
                    อีเมล
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 font-medium text-text-secondary"
                  >
                    สมัครเมื่อ
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 font-medium text-text-secondary"
                  >
                    สถานะ
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">เมนู</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {allCandidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="border-b border-border-default last:border-b-0 hover:bg-bg-secondary transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/company/candidates/${candidate.id}`}
                        className="font-medium text-text-primary hover:text-primary transition-colors"
                      >
                        {candidate.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {candidate.email}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {candidate.date} 2026
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeStyles[candidate.status]}`}
                      >
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                        aria-label={`เมนูสำหรับ ${candidate.name}`}
                      >
                        &#8942;
                      </button>
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
