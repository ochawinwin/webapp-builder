"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

interface ResumeOption {
  id: string;
  filename: string;
  isPrimary: boolean;
  date: string;
  size: string;
}

const resumes: ResumeOption[] = [
  {
    id: "1",
    filename: "Resume_Somchai_2026.pdf",
    isPrimary: true,
    date: "15 มี.ค. 2026",
    size: "245 KB",
  },
  {
    id: "2",
    filename: "Resume_Somchai_Design.pdf",
    isPrimary: false,
    date: "28 ก.พ. 2026",
    size: "312 KB",
  },
];

export default function ApplyPage() {
  const [selectedResume, setSelectedResume] = useState("1");
  const [coverLetter, setCoverLetter] = useState("");
  const [q2Answer, setQ2Answer] = useState("");
  const [q3Answer, setQ3Answer] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          สมัครงาน Senior Frontend Developer ที่ TechCorp
        </h1>
      </div>

      {/* Section 1: Resume selection */}
      <Card>
        <fieldset>
          <legend className="text-lg font-semibold text-text-primary">
            เลือกเรซูเม่
          </legend>
          <div className="mt-4 space-y-3">
            {resumes.map((resume) => (
              <label
                key={resume.id}
                className={`flex cursor-pointer items-center gap-4 rounded-[8px] border p-4 transition-colors ${
                  selectedResume === resume.id
                    ? "border-primary bg-primary-subtle"
                    : "border-border-default hover:border-border-strong"
                }`}
              >
                <input
                  type="radio"
                  name="resume"
                  value={resume.id}
                  checked={selectedResume === resume.id}
                  onChange={() => setSelectedResume(resume.id)}
                  className="h-4 w-4 text-primary accent-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">
                      📄 {resume.filename}
                    </span>
                    {resume.isPrimary && (
                      <Badge variant="success" size="sm">
                        ⭐ หลัก
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-text-tertiary">
                    {resume.date} · {resume.size}
                  </p>
                </div>
              </label>
            ))}
          </div>
          <Link
            href="/dashboard/resumes"
            className="mt-3 inline-block text-sm font-medium text-text-link hover:underline"
          >
            อัปโหลดเรซูเม่ใหม่
          </Link>
        </fieldset>
      </Card>

      {/* Section 2: Cover letter */}
      <Card>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">
            ข้อความแนะนำตัว
          </h2>
          <Textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="บอก Recruiter ว่าทำไมคุณถึงเหมาะกับตำแหน่งนี้..."
            rows={5}
            maxCharacters={500}
          />
        </div>
      </Card>

      {/* Section 3: Contact info */}
      <Card>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">
            ข้อมูลติดต่อ
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="อีเมล"
              variant="email"
              defaultValue="somchai@example.com"
            />
            <Input
              label="เบอร์โทร"
              defaultValue="081-234-5678"
            />
          </div>
        </div>
      </Card>

      {/* Section 4: Screening questions */}
      <Card>
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-text-primary">
            คำถามคัดกรอง (3 ข้อ)
          </h2>

          {/* Q1: Open-ended */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              1. ทำไมคุณถึงสนใจตำแหน่งนี้?
            </label>
            <Textarea
              placeholder="อธิบายเหตุผลของคุณ..."
              rows={3}
            />
          </div>

          {/* Q2: Radio */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-text-primary">
              2. คุณมีประสบการณ์ด้าน Frontend Development กี่ปี?
            </legend>
            <div className="space-y-2">
              {["1-2 ปี", "3-5 ปี", "5+ ปี"].map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 rounded-[6px] border border-border-default px-4 py-3 transition-colors hover:border-border-strong"
                >
                  <input
                    type="radio"
                    name="experience"
                    value={option}
                    checked={q2Answer === option}
                    onChange={() => setQ2Answer(option)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-sm text-text-primary">{option}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Q3: Radio */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-text-primary">
              3. คุณสามารถเข้าออฟฟิศได้หรือไม่?
            </legend>
            <div className="space-y-2">
              {["ได้", "ไม่ได้", "Hybrid"].map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 rounded-[6px] border border-border-default px-4 py-3 transition-colors hover:border-border-strong"
                >
                  <input
                    type="radio"
                    name="office"
                    value={option}
                    checked={q3Answer === option}
                    onChange={() => setQ3Answer(option)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-sm text-text-primary">{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="outline" size="lg" href="/jobs/1">
          ← กลับไปหน้างาน
        </Button>
        <Button
          variant="accent"
          size="lg"
          onClick={() => setShowConfirmModal(true)}
        >
          ส่งใบสมัคร
        </Button>
      </div>

      {/* Confirmation modal */}
      <Modal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="ยืนยันการส่งใบสมัคร?"
        footer={
          <>
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowConfirmModal(false)}
            >
              ยกเลิก
            </Button>
            <Button
              variant="accent"
              size="md"
              onClick={() => setShowConfirmModal(false)}
            >
              ส่งใบสมัคร
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary leading-relaxed">
          เมื่อส่งใบสมัครแล้ว คุณจะไม่สามารถแก้ไขข้อมูลได้
          กรุณาตรวจสอบข้อมูลให้ครบถ้วนก่อนส่ง
        </p>
      </Modal>
    </div>
  );
}
