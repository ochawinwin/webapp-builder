"use client";

import { useState } from "react";
import Link from "next/link";

export default function CandidateDetailPage() {
  const [showContact, setShowContact] = useState(false);
  const [notes, setNotes] = useState("");

  return (
    <div className="mx-auto max-w-5xl">
      {/* Back link */}
      <Link
        href="/company/candidates"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
      >
        &larr; กลับไปหน้าผู้สมัคร
      </Link>

      {/* Header */}
      <header className="mb-6 rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm">
        <div className="flex flex-wrap items-start gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-light text-xl font-bold text-primary"
            aria-hidden="true"
          >
            AJ
          </div>
          <div className="flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold text-text-primary">
                Alice Johnson
              </h1>
              <span className="inline-flex items-center rounded-full bg-warning-bg px-2.5 py-0.5 text-xs font-medium text-warning">
                กำลังพิจารณา
              </span>
            </div>
            <p className="text-sm text-text-secondary">
              สมัครตำแหน่ง Senior Frontend Dev เมื่อ 20 มี.ค. 2026
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-text-inverse shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            ย้ายไปสัมภาษณ์
          </button>
          <button
            type="button"
            className="rounded-lg border border-error px-5 py-2 text-sm font-medium text-error shadow-sm transition-colors hover:bg-error-bg"
          >
            ปฏิเสธ
          </button>
          <button
            type="button"
            className="rounded-lg border border-border-default bg-bg-primary px-5 py-2 text-sm font-medium text-text-secondary shadow-sm transition-colors hover:bg-bg-tertiary"
          >
            ดาวน์โหลดเรซูเม่
          </button>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* LEFT column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile & Contact card */}
          <section
            className="rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm"
            aria-label="โปรไฟล์และข้อมูลติดต่อ"
          >
            <h2 className="mb-4 text-lg font-semibold text-text-primary">
              โปรไฟล์ &amp; ติดต่อ
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-text-tertiary">ชื่อ</p>
                <p className="text-sm text-text-primary">Alice Johnson</p>
              </div>
              <div>
                <p className="text-xs font-medium text-text-tertiary">Bio</p>
                <p className="text-sm text-text-secondary">
                  Frontend Developer ที่มีประสบการณ์ 5 ปี เชี่ยวชาญ React,
                  TypeScript และ Next.js ชอบสร้าง UI ที่สวยงามและ accessible
                </p>
              </div>

              {/* Contact - toggle reveal */}
              <div>
                <p className="mb-2 text-xs font-medium text-text-tertiary">
                  ข้อมูลติดต่อ
                </p>
                {!showContact ? (
                  <button
                    type="button"
                    onClick={() => setShowContact(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-bg-secondary px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-tertiary"
                  >
                    <span aria-hidden="true">&#128065;</span>
                    คลิกเพื่อดูข้อมูลติดต่อ
                  </button>
                ) : (
                  <div className="space-y-2 rounded-lg bg-bg-secondary p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-text-tertiary">อีเมล:</span>
                      <span className="text-text-primary">
                        alice.johnson@email.com
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-text-tertiary">โทรศัพท์:</span>
                      <span className="text-text-primary">081-234-5678</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Resume section */}
              <div>
                <p className="mb-2 text-xs font-medium text-text-tertiary">
                  เรซูเม่
                </p>
                <div className="rounded-lg border border-border-default bg-bg-secondary p-4">
                  <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-bg-tertiary text-text-tertiary">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                        />
                      </svg>
                      <p className="mt-1 text-xs">PDF Preview</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full rounded-lg border border-border-default bg-bg-primary py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-tertiary"
                  >
                    ดาวน์โหลดเรซูเม่ (PDF)
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Application card */}
          <section
            className="rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm"
            aria-label="ใบสมัคร"
          >
            <h2 className="mb-4 text-lg font-semibold text-text-primary">
              ใบสมัคร
            </h2>

            {/* Cover message */}
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-medium text-text-primary">
                ข้อความแนะนำตัว
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                สวัสดีครับ ผมชื่อ Alice Johnson เป็น Frontend Developer
                ที่มีประสบการณ์ทำงานกับ React มากกว่า 5 ปี
                ผมสนใจตำแหน่งนี้เพราะ TechCorp
                มีโปรเจกต์ที่น่าสนใจและวัฒนธรรมองค์กรที่ดี
                ผมมั่นใจว่าประสบการณ์ของผมจะเป็นประโยชน์ต่อทีม
              </p>
            </div>

            {/* Screening answers */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-text-primary">
                คำตอบคัดกรอง
              </h3>
              <div className="space-y-4">
                <div className="rounded-lg bg-bg-secondary p-3">
                  <p className="mb-1 text-xs font-medium text-text-tertiary">
                    Q1: ทำไมคุณถึงสนใจตำแหน่งนี้ที่ TechCorp?
                  </p>
                  <p className="text-sm text-text-secondary">
                    ผมชื่นชมผลิตภัณฑ์ของ TechCorp
                    และอยากมีส่วนร่วมในการพัฒนาแพลตฟอร์มที่ช่วยเหลือผู้คน
                    นอกจากนี้ Tech Stack ที่ใช้ตรงกับทักษะของผมพอดี
                  </p>
                </div>
                <div className="rounded-lg bg-bg-secondary p-3">
                  <p className="mb-1 text-xs font-medium text-text-tertiary">
                    Q2: คุณมีประสบการณ์ React กี่ปี?
                  </p>
                  <p className="text-sm text-text-secondary">มากกว่า 5 ปี</p>
                </div>
                <div className="rounded-lg bg-bg-secondary p-3">
                  <p className="mb-1 text-xs font-medium text-text-tertiary">
                    Q3: คุณพร้อมเริ่มงานได้เมื่อไหร่?
                  </p>
                  <p className="text-sm text-text-secondary">
                    พร้อมเริ่มงานได้ทันทีหลังจากแจ้งลาออกจากที่ทำงานปัจจุบัน 30
                    วัน
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Notes card */}
          <section
            className="rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm"
            aria-label="บันทึกภายใน"
          >
            <h2 className="mb-4 text-lg font-semibold text-text-primary">
              บันทึก
            </h2>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เพิ่มบันทึกภายในเกี่ยวกับผู้สมัคร..."
              aria-label="บันทึกภายใน"
              className="mb-3 w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
            />
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-text-inverse shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                บันทึก
              </button>
            </div>
          </section>

          {/* Status history card */}
          <section
            className="rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm"
            aria-label="ประวัติสถานะ"
          >
            <h2 className="mb-4 text-lg font-semibold text-text-primary">
              ประวัติสถานะ
            </h2>
            <ol className="space-y-4" aria-label="ไทม์ไลน์สถานะ">
              <li className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className="h-3 w-3 rounded-full bg-warning"
                    aria-hidden="true"
                  />
                  <span
                    className="mt-1 w-px flex-1 bg-border-default"
                    aria-hidden="true"
                  />
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-text-primary">
                    พิจารณา
                  </p>
                  <p className="text-xs text-text-tertiary">22 มี.ค. 2026</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className="h-3 w-3 rounded-full bg-info"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    ส่งใบสมัคร
                  </p>
                  <p className="text-xs text-text-tertiary">20 มี.ค. 2026</p>
                </div>
              </li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
