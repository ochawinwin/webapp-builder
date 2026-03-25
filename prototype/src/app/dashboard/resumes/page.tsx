"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface ResumeItem {
  id: string;
  filename: string;
  isPrimary: boolean;
  uploadDate: string;
  size: string;
}

const mockResumes: ResumeItem[] = [
  {
    id: "1",
    filename: "Resume_Somchai_2026.pdf",
    isPrimary: true,
    uploadDate: "15 มี.ค. 2026",
    size: "245 KB",
  },
  {
    id: "2",
    filename: "Resume_Somchai_Design.pdf",
    isPrimary: false,
    uploadDate: "28 ก.พ. 2026",
    size: "312 KB",
  },
];

export default function ResumesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          เรซูเม่ของฉัน
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          อัปโหลดเรซูเม่ที่นี่
          เรซูเม่หลักจะถูกเลือกอัตโนมัติเมื่อสมัครงาน
        </p>
      </div>

      {/* Upload zone */}
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-[12px] border-2 border-dashed border-border-strong bg-bg-secondary px-6 py-12 text-center transition-colors hover:border-primary hover:bg-primary-subtle cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label="อัปโหลดเรซูเม่"
      >
        <span className="text-4xl" aria-hidden="true">
          📄
        </span>
        <p className="text-sm font-medium text-text-primary">
          ลากไฟล์ PDF มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
        </p>
        <p className="text-xs text-text-tertiary">รองรับ: PDF, สูงสุด 5MB</p>
      </div>

      {/* Resume cards */}
      <div className="space-y-4">
        {mockResumes.map((resume) => (
          <Card key={resume.id}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Left: file info */}
              <div className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  📄
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-text-primary">
                      {resume.filename}
                    </h3>
                    {resume.isPrimary && (
                      <Badge variant="success" size="sm">
                        ⭐ หลัก
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">
                    อัปโหลดเมื่อ {resume.uploadDate} · {resume.size}
                  </p>
                </div>
              </div>

              {/* Right: actions */}
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm">
                  ดูตัวอย่าง
                </Button>
                <Button variant="outline" size="sm">
                  ดาวน์โหลด
                </Button>
                {!resume.isPrimary && (
                  <Button variant="ghost" size="sm">
                    ตั้งเป็นหลัก
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-error hover:text-red-600 hover:bg-error-bg">
                  ลบ
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
