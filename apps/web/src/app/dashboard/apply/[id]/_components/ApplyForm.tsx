"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@futurecareer/ui";
import { applyJobAction } from "@/app/actions/applicationActions";
import type { Resume } from "@futurecareer/types";

interface PrescreenQuestion {
  id: string;
  question_text: string;
  question_type: string;
  options: unknown;
}

interface Job {
  id: string;
  title: string;
  company?: { name: string } | null;
  prescreen_questions?: PrescreenQuestion[];
}

interface ApplyFormProps {
  job: Job;
  resumes: Resume[];
}

export default function ApplyForm({ job, resumes }: ApplyFormProps) {
  const router = useRouter();
  const [selectedResume, setSelectedResume] = useState(
    resumes.find((r) => r.isPrimary)?.id ?? resumes[0]?.id ?? ""
  );
  const [coverMessage, setCoverMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const questions = job.prescreen_questions ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await applyJobAction(job.id, {
      resumeId: selectedResume,
      coverMessage,
      contactEmail,
      contactPhone,
      answers: questions.map((q) => ({
        questionId: q.id,
        answerText: answers[q.id] ?? "",
      })),
    });

    if (result.success) {
      router.push("/dashboard/applications");
    } else {
      setError(typeof result.error === "string" ? result.error : "เกิดข้อผิดพลาด กรุณาลองใหม่");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-text-primary">สมัครงาน</h1>
      <p className="mb-6 text-text-secondary">
        {job.title} — {job.company?.name ?? ""}
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-error-bg p-3 text-sm text-error" role="alert">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Resume selection */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">เลือก Resume</label>
          {resumes.length === 0 ? (
            <p className="text-sm text-text-tertiary">ยังไม่มี Resume — กรุณาอัปโหลดก่อนสมัคร</p>
          ) : (
            <div className="space-y-2">
              {resumes.map((r) => (
                <label key={r.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${selectedResume === r.id ? "border-primary bg-primary-subtle" : "border-border-default hover:bg-bg-secondary"}`}>
                  <input type="radio" name="resume" value={r.id} checked={selectedResume === r.id} onChange={() => setSelectedResume(r.id)} className="text-primary" />
                  <span className="text-sm text-text-primary">{r.fileName}</span>
                  {r.isPrimary && <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs text-primary">หลัก</span>}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Cover message */}
        <div>
          <label htmlFor="cover" className="mb-2 block text-sm font-medium text-text-primary">ข้อความแนะนำตัว</label>
          <textarea id="cover" rows={4} value={coverMessage} onChange={(e) => setCoverMessage(e.target.value)} placeholder="บอกเล่าเกี่ยวกับตัวคุณ..." className="w-full rounded-lg border border-border-default px-4 py-2.5 text-sm text-text-primary shadow-sm placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring" />
        </div>

        {/* Contact */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-text-primary">อีเมลติดต่อ</label>
            <input id="email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full rounded-lg border border-border-default px-4 py-2.5 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring" />
          </div>
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-text-primary">เบอร์โทร</label>
            <input id="phone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full rounded-lg border border-border-default px-4 py-2.5 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring" />
          </div>
        </div>

        {/* Prescreen questions */}
        {questions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">คำถามเบื้องต้น</h2>
            {questions.map((q) => (
              <div key={q.id}>
                <label htmlFor={`q-${q.id}`} className="mb-2 block text-sm font-medium text-text-primary">{q.question_text}</label>
                <textarea id={`q-${q.id}`} rows={3} value={answers[q.id] ?? ""} onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))} className="w-full rounded-lg border border-border-default px-4 py-2.5 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring" />
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>ย้อนกลับ</Button>
          <Button type="submit" variant="primary" size="lg" disabled={submitting || !selectedResume}>
            {submitting ? "กำลังส่ง..." : "ส่งใบสมัคร"}
          </Button>
        </div>
      </form>
    </div>
  );
}
