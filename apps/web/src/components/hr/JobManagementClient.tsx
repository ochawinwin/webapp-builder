"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, Badge, Input, Dialog } from "@futurecareer/ui";
import { createJobAction, updateJobStatusAction, deleteJobAction } from "@/app/actions/job.actions";
import {
  PlusCircle,
  Search,
  Briefcase,
  Users,
  Trash2,
  MapPin,
  Plus,
  Trash,
  MessageSquare,
  Tag,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { Job, JobType, JobLevel } from "@futurecareer/types";

const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
};

const JOB_LEVEL_LABELS: Record<JobLevel, string> = {
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
  lead: "Lead",
};

interface PrescreenQ {
  id: string;
  question: string;
  type: "text" | "long_text" | "choice";
  options: string[];
}

interface JobManagementClientProps {
  jobs: Job[];
  applicantCounts: Record<string, number>;
  companyId: string;
  isAdmin: boolean;
}

export function JobManagementClient({
  jobs,
  applicantCounts,
  companyId,
  isAdmin,
}: JobManagementClientProps) {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [prescreenQuestions, setPrescreenQuestions] = useState<PrescreenQ[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const addQuestion = () => {
    setPrescreenQuestions([
      ...prescreenQuestions,
      { id: Date.now().toString(), question: "", type: "text", options: [] },
    ]);
  };

  const removeQuestion = (id: string) => {
    setPrescreenQuestions(prescreenQuestions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, field: string, value: string) => {
    setPrescreenQuestions(
      prescreenQuestions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const addOption = (questionId: string) => {
    setPrescreenQuestions(
      prescreenQuestions.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const updateOption = (questionId: string, optionIdx: number, value: string) => {
    setPrescreenQuestions(
      prescreenQuestions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.map((o, i) => (i === optionIdx ? value : o)) }
          : q
      )
    );
  };

  const removeOption = (questionId: string, optionIdx: number) => {
    setPrescreenQuestions(
      prescreenQuestions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, i) => i !== optionIdx) }
          : q
      )
    );
  };

  const handleCreateJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Qualifications from textarea — newline separated
    const qualRaw = formData.get("qualifications_raw") as string;
    const qualifications = qualRaw
      .split("\n")
      .map((q) => q.trim())
      .filter(Boolean);
    formData.set("qualifications", JSON.stringify(qualifications));
    formData.delete("qualifications_raw");

    // Prescreen questions
    const questions = prescreenQuestions
      .filter((q) => q.question.trim())
      .map((q, idx) => ({
        order_index: idx,
        type: q.type,
        question: q.question,
        options: q.type === "choice" && q.options.length > 0 ? q.options : undefined,
      }));
    formData.set("prescreen_questions", JSON.stringify(questions));

    // Salary: combine min-max
    const salaryMin = formData.get("salary_min") as string;
    const salaryMax = formData.get("salary_max") as string;
    if (salaryMin || salaryMax) {
      formData.set("salary", `${salaryMin || "0"} - ${salaryMax || "?"} บาท`);
    }
    formData.delete("salary_min");
    formData.delete("salary_max");

    // tag_ids empty
    formData.set("tag_ids", JSON.stringify([]));

    startTransition(async () => {
      const result = await createJobAction(formData);
      if (result.success) {
        setIsCreateModalOpen(false);
        setPrescreenQuestions([]);
        form.reset();
        router.refresh();
        toast.success("ประกาศงานสำเร็จ!", {
          description: "ตำแหน่งงานของคุณถูกเผยแพร่สู่หน้าค้นหางานเรียบร้อยแล้ว",
        });
      } else {
        setError(result.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    });
  };

  const handleDeleteJob = (jobId: string) => {
    if (!confirm("ยืนยันการลบประกาศงานนี้?")) return;
    setDeletingId(jobId);
    const formData = new FormData();
    formData.set("id", jobId);
    startTransition(async () => {
      const result = await deleteJobAction(formData);
      setDeletingId(null);
      if (result.success) {
        router.refresh();
        toast.success("ลบประกาศงานเรียบร้อยแล้ว");
      } else {
        toast.error(result.error ?? "เกิดข้อผิดพลาด");
      }
    });
  };

  const handleToggleStatus = (job: Job) => {
    const newStatus = job.status === "open" ? "closed" : "open";
    const formData = new FormData();
    formData.set("id", job.id);
    formData.set("status", newStatus);
    startTransition(async () => {
      const result = await updateJobStatusAction(formData);
      if (result.success) {
        router.refresh();
        toast.success(`เปลี่ยนสถานะเป็น ${newStatus === "open" ? "เปิดรับ" : "ปิดรับ"} แล้ว`);
      } else {
        toast.error(result.error ?? "เกิดข้อผิดพลาด");
      }
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-kanit mb-2">จัดการประกาศงาน</h1>
            <p className="text-muted-foreground font-sarabun">
              สร้าง แก้ไข หรือปิดรับสมัครตำแหน่งงานของคุณ
            </p>
          </div>
          <Button
            className="gap-2 font-bold font-kanit shadow-lg shadow-primary/20"
            size="lg"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle className="w-5 h-5" /> สร้างประกาศงานใหม่
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6 border-none shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาชื่อตำแหน่งงาน..."
                className="pl-10 h-10 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                className="flex-1 md:w-40 bg-muted text-xs font-bold p-2.5 rounded-lg border-none focus:ring-1 focus:ring-primary outline-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">ทุกสถานะ</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Jobs Table */}
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sarabun">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">ตำแหน่งงาน</th>
                  <th className="px-4 py-4 text-xs font-bold text-muted-foreground uppercase">สถานะ</th>
                  <th className="px-4 py-4 text-xs font-bold text-muted-foreground uppercase text-center">ผู้สมัคร</th>
                  <th className="px-4 py-4 text-xs font-bold text-muted-foreground uppercase">วันที่ลงประกาศ</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-sarabun text-sm">
                      {searchQuery || filterStatus !== "all"
                        ? "ไม่พบประกาศงานที่ตรงกับเงื่อนไข"
                        : "ยังไม่มีประกาศงาน — กดปุ่ม 'สร้างประกาศงานใหม่' เพื่อเริ่มต้น"}
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-bold text-slate-900 mb-1">{job.title}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" /> {JOB_TYPE_LABELS[job.job_type]}
                            </span>
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {job.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <button
                          onClick={() => handleToggleStatus(job)}
                          disabled={isPending}
                          title="คลิกเพื่อเปลี่ยนสถานะ"
                        >
                          <Badge
                            variant={job.status === "open" ? "success" : "destructive"}
                            className="text-[10px] font-bold uppercase py-0.5 px-2 cursor-pointer hover:opacity-80 transition-opacity"
                          >
                            {job.status === "open" ? "Open" : "Closed"}
                          </Badge>
                        </button>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-slate-900">
                            {applicantCounts[job.id] ?? 0}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold">Candidates</span>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-sm text-muted-foreground">
                        {new Date(job.created_at).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/hr/jobs/${job.id}/ats`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 px-3 gap-1.5 text-xs font-bold text-primary border-primary/20 hover:bg-primary/5"
                            >
                              <Users className="w-3.5 h-3.5" /> ดูผู้สมัคร
                            </Button>
                          </Link>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 w-9 p-0 rounded-full text-destructive hover:bg-destructive/5"
                              onClick={() => handleDeleteJob(job.id)}
                              disabled={deletingId === job.id || isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Create Job Dialog */}
      <Dialog
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) {
            setError(null);
            setPrescreenQuestions([]);
          }
        }}
        title="ลงประกาศงานใหม่"
        size="xl"
      >
        <form onSubmit={handleCreateJob} className="space-y-6 font-sarabun">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold font-kanit">ชื่อตำแหน่งงาน *</label>
              <Input name="title" placeholder="เช่น Senior Frontend Developer" required className="h-11" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold font-kanit">ประเภทงาน *</label>
              <select
                name="job_type"
                required
                className="w-full h-11 px-3 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              >
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold font-kanit">ระดับ *</label>
              <select
                name="level"
                required
                className="w-full h-11 px-3 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              >
                <option value="junior">Junior</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold font-kanit">สถานที่ปฏิบัติงาน</label>
              <Input name="location" placeholder="เช่น กรุงเทพฯ (สามย่าน)" className="h-11" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold font-kanit">เงินเดือน (ช่วง)</label>
              <div className="flex items-center gap-2">
                <Input name="salary_min" placeholder="Min (บาท)" className="flex-1" />
                <span className="text-muted-foreground">-</span>
                <Input name="salary_max" placeholder="Max (บาท)" className="flex-1" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold font-kanit">รายละเอียดงาน & หน้าที่รับผิดชอบ *</label>
            <textarea
              name="description"
              className="w-full min-h-[120px] p-4 rounded-xl border border-border bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm leading-relaxed"
              placeholder="ระบุรายละเอียดงาน หน้าที่ความรับผิดชอบ..."
              required
              minLength={1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold font-kanit">คุณสมบัติผู้สมัคร *</label>
            <textarea
              name="qualifications_raw"
              className="w-full min-h-[100px] p-4 rounded-xl border border-border bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm leading-relaxed"
              placeholder="ระบุทักษะ ประสบการณ์ หรือวุฒิการศึกษา (แต่ละบรรทัดคือ 1 รายการ)"
              required
            />
          </div>

          {/* Prescreen Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <label className="text-md font-bold font-kanit flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" /> คำถามคัดกรอง (Prescreening)
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQuestion}
                className="h-8 gap-1.5 text-[10px] uppercase font-bold"
              >
                <Plus className="w-3 h-3" /> เพิ่มคำถาม
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              คำถามเหล่านี้จะช่วยให้คุณคัดเลือกผู้สมัครเบื้องต้นได้รวดเร็วขึ้น
            </p>
            <div className="space-y-4">
              {prescreenQuestions.map((q, idx) => (
                <div key={q.id} className="p-4 bg-muted/30 border border-border rounded-xl relative">
                  <button
                    type="button"
                    onClick={() => removeQuestion(q.id)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        คำถามที่ {idx + 1}
                      </label>
                      <Input
                        placeholder="เช่น คุณมีประสบการณ์กี่ปี?"
                        value={q.question}
                        onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        ประเภทคำตอบ
                      </label>
                      <select
                        className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm"
                        value={q.type}
                        onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
                      >
                        <option value="text">ข้อความ (บรรทัดเดียว)</option>
                        <option value="long_text">ข้อความ (หลายบรรทัด)</option>
                        <option value="choice">ตัวเลือก (Multiple Choice)</option>
                      </select>
                    </div>
                  </div>
                  {q.type === "choice" && (
                    <div className="mt-3 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        ตัวเลือก (อย่างน้อย 2 ข้อ)
                      </label>
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex gap-2">
                          <Input
                            placeholder={`ตัวเลือกที่ ${optIdx + 1}`}
                            value={opt}
                            onChange={(e) => updateOption(q.id, optIdx, e.target.value)}
                            className="h-9 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(q.id, optIdx)}
                            className="text-muted-foreground hover:text-destructive p-1"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(q.id)}
                        className="text-xs text-primary font-bold hover:underline flex items-center gap-1 mt-1"
                      >
                        <Plus className="w-3 h-3" /> เพิ่มตัวเลือก
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/5 p-3 rounded-xl">{error}</p>
          )}

          <div className="flex gap-4 pt-6 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setIsCreateModalOpen(false);
                setError(null);
                setPrescreenQuestions([]);
              }}
            >
              ยกเลิก
            </Button>
            <Button className="flex-1 font-bold h-12" type="submit" disabled={isPending}>
              {isPending ? "กำลังส่ง..." : "ลงประกาศงานทันที"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
