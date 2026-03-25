"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Badge } from "@futurecareer/ui";
import { ApplyModal } from "@/components/ApplyModal";
import { toggleSavedJobAction } from "@/app/actions/saved-jobs.actions";
import {
  CheckCircle2,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Building2,
  Share2,
  Heart,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { JobWithDetails } from "@futurecareer/types";

interface JobDetailClientProps {
  job: JobWithDetails;
  isAlreadyApplied: boolean;
  isLoggedIn: boolean;
  isSaved: boolean;
  resumeFileName: string | null;
  resumeSignedUrl: string | null;
}

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
};

const JOB_LEVEL_LABELS: Record<string, string> = {
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
  lead: "Lead",
};

function formatSalary(salary: string | null | undefined): string {
  if (!salary) return "ไม่ระบุเงินเดือน";
  return salary;
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (hours < 1) return "เมื่อกี้";
  if (hours < 24) return `${hours} ชม. ที่แล้ว`;
  return `${days} วันที่แล้ว`;
}

export function JobDetailClient({
  job,
  isAlreadyApplied,
  isLoggedIn,
  isSaved,
  resumeFileName,
  resumeSignedUrl,
}: JobDetailClientProps) {
  const router = useRouter();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applied, setApplied] = useState(isAlreadyApplied);
  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();

  const handleApplyClick = () => {
    if (!isLoggedIn) {
      toast.info("กรุณาเข้าสู่ระบบก่อนสมัครงาน");
      router.push(`/login?next=/jobs/${job.id}`);
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleSaveClick = () => {
    if (!isLoggedIn) {
      router.push(`/register?next=/jobs/${job.id}`);
      return;
    }
    startTransition(async () => {
      const result = await toggleSavedJobAction(job.id);
      if (result.error) {
        toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
        return;
      }
      setSaved(result.saved);
      toast.success(result.saved ? "บันทึกงานแล้ว" : "ยกเลิกการบันทึกแล้ว");
    });
  };

  const prescreenQuestions = (job.prescreen_questions ?? []).map((q: any) => ({
    id: q.id,
    question: q.question,
    type: q.question_type as "text" | "long_text" | "choice",
    options: q.options ?? [],
  }));

  const qualifications = Array.isArray(job.qualifications)
    ? (job.qualifications as string[])
    : [];

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-6">
      <div className="container mx-auto px-4">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> กลับไปหน้าค้นหางาน
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 border-none shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl border border-border bg-white flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                    {job.company?.logo_url ? (
                      <img
                        src={job.company.logo_url}
                        alt={job.company.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Briefcase className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold font-kanit leading-tight">
                      {job.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
                      <Link
                        href={`/company/${job.company_id}`}
                        className="font-bold text-primary hover:underline flex items-center gap-1.5"
                      >
                        <Building2 className="w-4 h-4" /> {job.company?.name}
                      </Link>
                      {job.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" /> {job.location}
                        </div>
                      )}
                      {job.created_at && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" /> {timeAgo(job.created_at)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full"
                    onClick={handleSaveClick}
                    disabled={isPending}
                    aria-label={saved ? "ยกเลิกบันทึกงาน" : "บันทึกงาน"}
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={saved ? "currentColor" : "none"}
                      style={saved ? { color: "var(--destructive)" } : undefined}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("คัดลอกลิงก์แล้ว");
                    }}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 p-4 bg-muted/50 rounded-2xl">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">
                    ประเภทงาน
                  </p>
                  <p className="font-bold flex items-center justify-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-primary" />{" "}
                    {JOB_TYPE_LABELS[job.job_type ?? ""] ?? job.job_type}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">
                    เงินเดือน
                  </p>
                  <p className="font-bold flex items-center justify-center gap-1.5 text-primary text-sm">
                    <DollarSign className="w-4 h-4" />{" "}
                    {formatSalary(job.salary)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">
                    ระดับงาน
                  </p>
                  <p className="font-bold flex items-center justify-center gap-1.5">
                    <Star className="w-4 h-4 text-secondary" /> {JOB_LEVEL_LABELS[job.level ?? ""] ?? job.level}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">
                    ประกาศเมื่อ
                  </p>
                  <p className="font-bold flex items-center justify-center gap-1.5 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />{" "}
                    {job.created_at ? timeAgo(job.created_at) : "-"}
                  </p>
                </div>
              </div>

              <div className="space-y-10 font-sarabun">
                {job.description && (
                  <section>
                    <h3 className="text-xl font-bold font-kanit mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary rounded-full"></div>{" "}
                      รายละเอียดงาน
                    </h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {job.description}
                    </p>
                  </section>
                )}

                {qualifications.length > 0 && (
                  <section>
                    <h3 className="text-xl font-bold font-kanit mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary rounded-full"></div>{" "}
                      คุณสมบัติผู้สมัคร
                    </h3>
                    <ul className="grid gap-3">
                      {qualifications.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-muted-foreground"
                        >
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {job.tags && job.tags.length > 0 && (
                  <section>
                    <h3 className="text-xl font-bold font-kanit mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary rounded-full"></div>{" "}
                      ทักษะที่ต้องการ
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="px-3 py-1 font-bold"
                        >
                          #{tag.name}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-24 border-none shadow-sm">
              <div className="flex flex-col gap-4">
                {applied ? (
                  <div className="p-4 bg-success/10 border border-success/20 rounded-2xl flex flex-col items-center text-center gap-3">
                    <CheckCircle2 className="w-10 h-10 text-success" />
                    <div>
                      <p className="font-bold text-success text-lg">
                        สมัครงานแล้ว
                      </p>
                      <p className="text-xs text-success/80">
                        คุณได้ส่งใบสมัครให้บริษัทนี้แล้ว
                      </p>
                    </div>
                    <Link href="/profile?tab=applications" className="w-full">
                      <Button
                        variant="outline"
                        className="w-full border-success text-success hover:bg-success/5"
                      >
                        ดูสถานะการสมัคร
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="w-full h-14 text-lg font-kanit font-bold shadow-lg shadow-primary/20"
                      onClick={handleApplyClick}
                    >
                      สมัครงานทันที
                    </Button>
                    <p className="text-xs text-center text-muted-foreground font-sarabun">
                      การันตีข้อมูลถูกเก็บเป็นความลับและเข้าถึงโดยบริษัทโดยตรง
                    </p>
                  </>
                )}

                <hr className="border-border my-2" />

                <div className="space-y-4">
                  <h4 className="font-bold font-kanit">เกี่ยวกับบริษัท</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center shrink-0 overflow-hidden bg-white">
                      {job.company?.logo_url ? (
                        <img
                          src={job.company.logo_url}
                          alt={job.company.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{job.company?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {job.company?.industry}
                      </p>
                    </div>
                  </div>
                  <Link href={`/company/${job.company_id}`}>
                    <Button variant="outline" className="w-full text-xs font-bold">
                      ดูโปรไฟล์บริษัท
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>

      {isApplyModalOpen && (
        <ApplyModal
          jobId={job.id}
          jobTitle={job.title}
          companyName={job.company?.name ?? ""}
          companyLogoUrl={job.company?.logo_url}
          prescreenQuestions={prescreenQuestions}
          resumeFileName={resumeFileName}
          resumeSignedUrl={resumeSignedUrl}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccess={() => setApplied(true)}
        />
      )}
    </div>
  );
}
