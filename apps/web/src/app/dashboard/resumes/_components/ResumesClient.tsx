"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Badge, Button } from "@futurecareer/ui";
import { uploadResumeAction, deleteResumeAction, setPrimaryResumeAction } from "@/app/actions/resumeActions";
import type { Resume } from "@futurecareer/types";

interface ResumesClientProps {
  initialResumes: Resume[];
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function ResumesClient({ initialResumes }: ResumesClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  async function handleFile(file: File) {
    setUploadError(null);
    if (file.type !== "application/pdf") {
      setUploadError("รองรับเฉพาะไฟล์ PDF เท่านั้น");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("ขนาดไฟล์ต้องไม่เกิน 10MB");
      return;
    }
    const formData = new FormData();
    formData.append("resume", file);
    setUploading(true);
    try {
      const result = await uploadResumeAction(formData);
      if (!result.success) {
        const errorMsg = typeof result.error === "string" ? result.error : "เกิดข้อผิดพลาดในการอัปโหลด";
        setUploadError(errorMsg);
      } else {
        router.refresh();
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setUploading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  async function handleDelete(resumeId: string) {
    const result = await deleteResumeAction(resumeId);
    if (result.success) router.refresh();
    else setUploadError(result.error);
  }

  async function handleSetPrimary(resumeId: string) {
    const result = await setPrimaryResumeAction(resumeId);
    if (result.success) router.refresh();
    else setUploadError(result.error);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">เรซูเม่ของฉัน</h1>
        <p className="mt-2 text-sm text-text-secondary">
          อัปโหลดเรซูเม่ที่นี่ เรซูเม่หลักจะถูกเลือกอัตโนมัติเมื่อสมัครงาน
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleInputChange}
      />

      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-[12px] border-2 border-dashed px-6 py-12 text-center transition-colors cursor-pointer ${
          isDragging ? "border-primary bg-primary-subtle" : "border-border-strong bg-bg-secondary hover:border-primary hover:bg-primary-subtle"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        role="button"
        tabIndex={0}
        aria-label="อัปโหลดเรซูเม่"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
      >
        {uploading ? (
          <>
            <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm font-medium text-text-primary">กำลังอัปโหลด...</p>
          </>
        ) : (
          <>
            <span className="text-4xl" aria-hidden="true">📄</span>
            <p className="text-sm font-medium text-text-primary">ลากไฟล์ PDF มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
            <p className="text-xs text-text-tertiary">รองรับ: PDF, สูงสุด 10MB</p>
          </>
        )}
      </div>

      {uploadError && (
        <p role="alert" className="text-sm text-error">{uploadError}</p>
      )}

      {initialResumes.length === 0 ? (
        <p className="text-center text-sm text-text-tertiary">ยังไม่มีเรซูเม่ อัปโหลดเพื่อเริ่มต้น</p>
      ) : (
        <div className="space-y-4">
          {initialResumes.map((resume) => (
            <Card key={resume.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden="true">📄</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-text-primary">{resume.fileName}</h3>
                      {resume.isPrimary && <Badge variant="success" size="sm">หลัก</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-text-secondary">
                      อัปโหลดเมื่อ {new Date(resume.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })}
                      {resume.fileSize ? ` · ${Math.round(resume.fileSize / 1024)} KB` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {resume.fileUrl && (
                    <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-lg border border-border-default px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-tertiary">
                      ดูตัวอย่าง
                    </a>
                  )}
                  {!resume.isPrimary && (
                    <Button variant="ghost" size="sm" onClick={() => void handleSetPrimary(resume.id)}>
                      ตั้งเป็นหลัก
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-error hover:text-red-600 hover:bg-error-bg"
                    onClick={() => void handleDelete(resume.id)}
                  >
                    ลบ
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
