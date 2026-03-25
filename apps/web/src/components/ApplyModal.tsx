"use client";

import { useState, useTransition } from "react";
import { Dialog, Button, Input } from "@futurecareer/ui";
import { FileText, Send, Link as LinkIcon } from "lucide-react";
import { submitApplicationAction } from "@/app/actions/application.actions";
import { toast } from "sonner";
import Link from "next/link";

interface PrescreenQuestion {
  id: string;
  question: string;
  type: "text" | "long_text" | "choice";
  options?: string[];
}

interface ApplyModalProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogoUrl?: string | null;
  prescreenQuestions: PrescreenQuestion[];
  resumeFileName?: string | null;
  resumeSignedUrl?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApplyModal({
  jobId,
  jobTitle,
  companyName,
  companyLogoUrl,
  prescreenQuestions,
  resumeFileName,
  resumeSignedUrl,
  isOpen,
  onClose,
  onSuccess,
}: ApplyModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("job_id", jobId);

    // Aggregate individual prescreen_<id> fields into a single JSON blob
    const prescreenAnswers: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("prescreen_")) {
        prescreenAnswers[key.slice("prescreen_".length)] = value as string;
      }
    }
    formData.set("prescreen_answers", JSON.stringify(prescreenAnswers));

    startTransition(async () => {
      const result = await submitApplicationAction(formData);
      if (result.success) {
        toast.success("ส่งใบสมัครของคุณเรียบร้อยแล้ว!", {
          description: "บริษัทจะติดต่อกลับหาคุณผ่านช่องทางที่ระบุไว้ในโปรไฟล์",
        });
        onSuccess();
        onClose();
      } else {
        setError(result.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="สมัครงาน"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job info */}
        <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-2xl border border-border/50">
          <div className="w-12 h-12 rounded-xl border border-border bg-white flex items-center justify-center shrink-0 overflow-hidden">
            {companyLogoUrl ? (
              <img
                src={companyLogoUrl}
                alt={companyName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                {companyName.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold font-kanit">{jobTitle}</h4>
            <p className="text-sm text-muted-foreground font-sarabun">
              {companyName}
            </p>
          </div>
        </div>

        {/* Resume section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold font-kanit flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> ยืนยัน Resume
            </h4>
            <Link
              href="/profile"
              className="text-xs text-primary font-bold hover:underline"
            >
              จัดการ Resume
            </Link>
          </div>
          {resumeFileName ? (
            <div className="flex items-center justify-between p-4 bg-white border border-primary/20 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold">{resumeFileName}</p>
                  {resumeSignedUrl && (
                    <a
                      href={resumeSignedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <LinkIcon className="w-3 h-3" /> ดูไฟล์
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="use_resume"
                  defaultChecked
                  className="w-4 h-4 text-primary rounded"
                />
                <span className="text-xs font-medium">ใช้ไฟล์นี้</span>
              </div>
            </div>
          ) : (
            <div className="p-4 border-2 border-dashed border-border rounded-xl text-center">
              <p className="text-sm text-muted-foreground mb-3">
                คุณยังไม่มี Resume ในระบบ
              </p>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  อัปโหลด Resume ใหม่
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Intro message */}
        <div className="space-y-3">
          <label className="text-sm font-bold font-kanit">
            ข้อความแนะนำตัวสั้นๆ (Intro Message)
          </label>
          <textarea
            name="intro_message"
            className="w-full min-h-[100px] p-4 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-sarabun"
            placeholder="เขียนแนะนำตัวหรือเหตุผลที่สนใจตำแหน่งงานนี้ เพื่อเพิ่มโอกาสในการถูกคัดเลือก..."
          />
        </div>

        {/* Prescreen questions */}
        {prescreenQuestions.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-bold font-kanit border-b border-border pb-2">
              คำถามคัดกรองเบื้องต้น (Prescreen Questions)
            </h4>
            <div className="space-y-6">
              {prescreenQuestions.map((q, idx) => (
                <div key={q.id} className="space-y-3">
                  <p className="text-sm font-bold font-kanit">
                    {idx + 1}. {q.question}
                  </p>
                  {q.type === "choice" ? (
                    <div className="grid grid-cols-2 gap-3">
                      {q.options?.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className="flex items-center gap-2 p-3 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <input
                            type="radio"
                            name={`prescreen_${q.id}`}
                            value={opt}
                            className="w-4 h-4 text-primary"
                            required
                          />
                          <span className="text-sm font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : q.type === "long_text" ? (
                    <textarea
                      name={`prescreen_${q.id}`}
                      className="w-full min-h-[80px] p-3 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-sarabun"
                      placeholder="ระบุคำตอบของคุณ..."
                      required
                    />
                  ) : (
                    <Input
                      name={`prescreen_${q.id}`}
                      placeholder="ระบุคำตอบของคุณ..."
                      required
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive bg-destructive/5 p-3 rounded-xl">
            {error}
          </p>
        )}

        <div className="flex gap-4 pt-4">
          <Button
            variant="ghost"
            className="flex-1"
            type="button"
            onClick={onClose}
            disabled={isPending}
          >
            ยกเลิก
          </Button>
          <Button
            className="flex-1 font-bold gap-2"
            type="submit"
            disabled={isPending}
          >
            <Send className="w-4 h-4" />
            {isPending ? "กำลังส่ง..." : "ส่งใบสมัคร"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
