"use client";

import { useState } from "react";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: "แอดมิน" | "Recruiter";
  status: "ใช้งาน";
}

interface PendingInvite {
  id: number;
  email: string;
  sentDate: string;
}

const members: TeamMember[] = [
  {
    id: 1,
    name: "สมชาย วงศ์เจริญ",
    email: "somchai@techcorp.co.th",
    role: "แอดมิน",
    status: "ใช้งาน",
  },
  {
    id: 2,
    name: "สมหญิง แสงดาว",
    email: "somying@techcorp.co.th",
    role: "Recruiter",
    status: "ใช้งาน",
  },
  {
    id: 3,
    name: "วิชัย ทองคำ",
    email: "wichai@techcorp.co.th",
    role: "Recruiter",
    status: "ใช้งาน",
  },
];

const pendingInvites: PendingInvite[] = [
  {
    id: 1,
    email: "newrecruiter@techcorp.co.th",
    sentDate: "22 มี.ค. 2026",
  },
];

export default function CompanyTeamPage() {
  const [inviteEmail, setInviteEmail] = useState("");

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <h1 className="mb-6 text-2xl font-bold text-text-primary">
        จัดการทีมงาน
      </h1>

      {/* Invite card */}
      <section
        className="mb-6 rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm"
        aria-label="เชิญสมาชิกใหม่"
      >
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          เชิญ Recruiter
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="invite-email" className="sr-only">
            อีเมล
          </label>
          <input
            id="invite-email"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="อีเมลของผู้ที่ต้องการเชิญ"
            className="flex-1 rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
          />
          <button
            type="button"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-text-inverse shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            ส่งคำเชิญ
          </button>
        </div>
      </section>

      {/* Team members table */}
      <section
        className="mb-6 rounded-xl border border-border-default bg-bg-primary shadow-sm"
        aria-label="สมาชิกทีม"
      >
        <div className="border-b border-border-default px-6 py-4">
          <h2 className="text-lg font-semibold text-text-primary">
            สมาชิกทีม ({members.length})
          </h2>
        </div>
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
                  ตำแหน่ง
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 font-medium text-text-secondary"
                >
                  สถานะ
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">การจัดการ</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-border-default last:border-b-0"
                >
                  <td className="px-6 py-4 font-medium text-text-primary">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {member.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        member.role === "แอดมิน"
                          ? "bg-primary-light text-primary"
                          : "bg-accent-light text-accent"
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-success">
                      <span
                        className="h-2 w-2 rounded-full bg-success"
                        aria-hidden="true"
                      />
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {member.role !== "แอดมิน" && (
                      <button
                        type="button"
                        className="rounded-lg border border-error px-3 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error-bg"
                      >
                        ลบออก
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pending invites table */}
      <section
        className="rounded-xl border border-border-default bg-bg-primary shadow-sm"
        aria-label="คำเชิญที่รอดำเนินการ"
      >
        <div className="border-b border-border-default px-6 py-4">
          <h2 className="text-lg font-semibold text-text-primary">
            คำเชิญที่รอดำเนินการ ({pendingInvites.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default bg-bg-secondary">
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
                  ส่งเมื่อ
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">การจัดการ</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingInvites.map((invite) => (
                <tr
                  key={invite.id}
                  className="border-b border-border-default last:border-b-0"
                >
                  <td className="px-6 py-4 text-text-primary">
                    {invite.email}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {invite.sentDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-border-default bg-bg-primary px-3 py-1.5 text-xs font-medium text-text-secondary shadow-sm transition-colors hover:bg-bg-tertiary"
                      >
                        ส่งอีกครั้ง
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-error px-3 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error-bg"
                      >
                        ยกเลิก
                      </button>
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
