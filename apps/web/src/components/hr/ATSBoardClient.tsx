"use client";

import { useState, useCallback, useTransition } from "react";
import Link from "next/link";
import { Button, Card, Badge, Input, Dialog } from "@futurecareer/ui";
import { updateApplicationStatusAction, viewContactAction } from "@/app/actions/application.actions";
import { useApplicationsRealtime } from "@/hooks/useApplicationsRealtime";
import {
  Search,
  ChevronLeft,
  FileText,
  Phone,
  Mail,
  XCircle,
  Calendar,
  UserCheck,
  UserPlus,
  Eye,
  MessageSquare,
  Star,
  Clock,
} from "lucide-react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { toast } from "sonner";
import type { JobWithDetails, ApplicationWithCandidate, ApplicationStatus } from "@futurecareer/types";

const COLUMNS: {
  id: ApplicationStatus;
  label: string;
  colorClass: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "new", label: "New Applied", colorClass: "bg-blue-500", icon: UserPlus },
  { id: "reviewing", label: "Reviewing", colorClass: "bg-warning", icon: Eye },
  { id: "interview", label: "Interview", colorClass: "bg-primary", icon: Calendar },
  { id: "hired", label: "Hired", colorClass: "bg-success", icon: UserCheck },
  { id: "rejected", label: "Rejected", colorClass: "bg-destructive", icon: XCircle },
];

function CandidateCard({
  application,
  onSelect,
  isDragging,
}: {
  application: ApplicationWithCandidate;
  onSelect: (a: ApplicationWithCandidate) => void;
  isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: application.id,
  });

  const candidateName = [application.candidate.first_name, application.candidate.last_name]
    .filter(Boolean)
    .join(" ") || "ไม่ระบุชื่อ";
  const initials = candidateName.charAt(0).toUpperCase();

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      suppressHydrationWarning
      className={`bg-white p-4 rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {application.candidate.avatar_url ? (
            <img
              src={application.candidate.avatar_url}
              alt={candidateName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {initials}
            </div>
          )}
          <div>
            <p className="font-bold text-sm text-slate-900 line-clamp-1">{candidateName}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
              {new Date(application.applied_at).toLocaleDateString("th-TH")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-[10px] font-bold uppercase h-8 border-slate-200"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(application);
          }}
        >
          View Info
        </Button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(application);
          }}
          className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function KanbanColumn({
  column,
  candidates,
  onSelect,
  activeId,
}: {
  column: (typeof COLUMNS)[0];
  candidates: ApplicationWithCandidate[];
  onSelect: (a: ApplicationWithCandidate) => void;
  activeId: string | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full min-w-[280px] rounded-2xl transition-colors ${
        isOver ? "bg-primary/5 ring-2 ring-primary/20" : "bg-muted/30"
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${column.colorClass}`} />
          <h4 className="font-bold text-sm uppercase tracking-wider font-kanit">{column.label}</h4>
          <Badge className="ml-2 bg-white text-slate-500 font-bold border-none shadow-sm">
            {candidates.length}
          </Badge>
        </div>
      </div>

      <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-300px)]">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            application={candidate}
            onSelect={onSelect}
            isDragging={activeId === candidate.id}
          />
        ))}
        {candidates.length === 0 && (
          <div className="h-24 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-xs text-muted-foreground font-sarabun text-center p-4">
            ลากผู้สมัครมาที่นี่เพื่อเปลี่ยนสถานะ
          </div>
        )}
      </div>
    </div>
  );
}

interface ATSBoardClientProps {
  job: JobWithDetails;
  initialApplications: ApplicationWithCandidate[];
  companyId: string;
}

export function ATSBoardClient({ job, initialApplications, companyId }: ATSBoardClientProps) {
  const [applications, setApplications] = useApplicationsRealtime(job.id, initialApplications);
  const [selectedApp, setSelectedApp] = useState<ApplicationWithCandidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [contactInfo, setContactInfo] = useState<{ email: string; phone: string | null } | null>(null);
  const [isLoadingContact, setIsLoadingContact] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const moveApplication = useCallback(
    (applicationId: string, newStatus: ApplicationStatus) => {
      // Optimistic update
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
      );

      const formData = new FormData();
      formData.set("id", applicationId);
      formData.set("status", newStatus);

      startTransition(async () => {
        const result = await updateApplicationStatusAction(formData);
        if (!result.success) {
          // Revert on failure
          setApplications((prev) =>
            prev.map((a) =>
              a.id === applicationId
                ? { ...a, status: initialApplications.find((ia) => ia.id === applicationId)?.status ?? a.status }
                : a
            )
          );
          toast.error(result.error ?? "เกิดข้อผิดพลาดในการอัปเดตสถานะ");
        } else {
          toast.success("อัปเดตสถานะผู้สมัครเรียบร้อยแล้ว");
          // Update selected app if open
          if (selectedApp?.id === applicationId) {
            setSelectedApp((prev) => prev ? { ...prev, status: newStatus } : prev);
          }
        }
      });
    },
    [initialApplications, selectedApp, setApplications]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const applicationId = active.id as string;
    const newStatus = over.id as ApplicationStatus;

    const currentApp = applications.find((a) => a.id === applicationId);
    if (currentApp && currentApp.status !== newStatus) {
      moveApplication(applicationId, newStatus);
    }
  };

  const handleViewContact = async (applicationId: string) => {
    setIsLoadingContact(true);
    setContactInfo(null);
    const formData = new FormData();
    formData.set("application_id", applicationId);
    const result = await viewContactAction(formData);
    setIsLoadingContact(false);
    if (result.success && result.data) {
      setContactInfo(result.data);
    } else {
      toast.error(result.error ?? "ไม่สามารถดูข้อมูลติดต่อได้");
    }
  };

  const filteredApplications = applications.filter((a) => {
    const name = [a.candidate.first_name, a.candidate.last_name].filter(Boolean).join(" ");
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeApp = activeId ? applications.find((a) => a.id === activeId) : null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Sub Header */}
      <div className="bg-slate-900 text-white py-6 shrink-0">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link
                href="/hr/jobs"
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400" />
              </Link>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold font-kanit">ATS: {job.title}</h1>
                  <Badge className="bg-success text-white border-none text-[10px] font-bold uppercase">
                    {job.status === "open" ? "OPEN" : "CLOSED"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 font-sarabun">
                  {job.company.name} • ประกาศเมื่อ{" "}
                  {new Date(job.created_at).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="ค้นหาชื่อผู้สมัคร..."
                  className="pl-10 h-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6 md:p-8 bg-muted/20">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 min-h-[500px]">
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                candidates={filteredApplications.filter((a) => a.status === column.id)}
                onSelect={(app) => {
                  setSelectedApp(app);
                  setContactInfo(null);
                  setIsModalOpen(true);
                }}
                activeId={activeId}
              />
            ))}
          </div>

          <DragOverlay>
            {activeApp ? (
              <div className="bg-white p-4 rounded-xl border border-border shadow-2xl opacity-90">
                <p className="font-bold text-sm">
                  {[activeApp.candidate.first_name, activeApp.candidate.last_name]
                    .filter(Boolean)
                    .join(" ") || "ผู้สมัคร"}
                </p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Candidate Detail Dialog */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setSelectedApp(null);
            setContactInfo(null);
          }
        }}
        title="ข้อมูลผู้สมัคร"
        size="xl"
      >
        {selectedApp && (
          <div className="space-y-6 font-sarabun max-h-[75vh] overflow-y-auto">
            {/* Candidate Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-border pb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-xl shadow-primary/20">
                  {[selectedApp.candidate.first_name, selectedApp.candidate.last_name]
                    .filter(Boolean)
                    .join(" ")
                    .charAt(0)
                    .toUpperCase() || "?"}
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold font-kanit">
                    {[selectedApp.candidate.first_name, selectedApp.candidate.last_name]
                      .filter(Boolean)
                      .join(" ") || "ไม่ระบุชื่อ"}
                  </h2>
                  <div className="flex items-center gap-3 text-xs font-bold uppercase pt-1">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      Applied {new Date(selectedApp.applied_at).toLocaleDateString("th-TH")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {contactInfo ? (
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>{contactInfo.email}</span>
                    </div>
                    {contactInfo.phone && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{contactInfo.phone}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    className="font-bold gap-2"
                    onClick={() => handleViewContact(selectedApp.id)}
                    disabled={isLoadingContact}
                  >
                    <Phone className="w-4 h-4" />
                    {isLoadingContact ? "กำลังโหลด..." : "ดูข้อมูลติดต่อ"}
                  </Button>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {/* Resume */}
                <section>
                  <h4 className="font-bold font-kanit text-base mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> ประวัติย่อ (Resume)
                  </h4>
                  {selectedApp.resume_url ? (
                    <a
                      href={selectedApp.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 border border-border rounded-2xl bg-muted/30 flex items-center justify-between hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shadow-sm">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">ดูไฟล์ Resume</p>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">PDF</p>
                        </div>
                      </div>
                      <Eye className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">ไม่มี Resume</p>
                  )}
                </section>

                {/* Intro message */}
                {selectedApp.intro_message && (
                  <section>
                    <h4 className="font-bold font-kanit text-base mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary" /> ข้อความแนะนำตัว
                    </h4>
                    <div className="p-4 bg-muted/50 rounded-xl text-sm leading-relaxed text-slate-600 italic">
                      "{selectedApp.intro_message}"
                    </div>
                  </section>
                )}

                {/* Prescreen answers */}
                {Object.keys(selectedApp.prescreen_answers).length > 0 && (
                  <section>
                    <h4 className="font-bold font-kanit text-base mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-primary" /> คำตอบ Prescreening
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(selectedApp.prescreen_answers).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <p className="text-sm font-bold text-slate-900">{key}</p>
                          <div className="p-3 bg-muted/50 rounded-xl text-sm text-slate-600">
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <div className="space-y-6">
                {/* Status change */}
                <section>
                  <h4 className="font-bold font-kanit text-base mb-3">สถานะปัจจุบัน</h4>
                  <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                    <select
                      className="w-full h-11 px-3 rounded-xl border border-border bg-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={selectedApp.status}
                      onChange={(e) =>
                        moveApplication(selectedApp.id, e.target.value as ApplicationStatus)
                      }
                      disabled={isPending}
                    >
                      {COLUMNS.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </section>

                {/* Timeline */}
                <section>
                  <h4 className="font-bold font-kanit text-base mb-3">ประวัติการสมัคร</h4>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-4 h-4 rounded-full bg-primary mt-1 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 uppercase">Applied</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(selectedApp.applied_at).toLocaleString("th-TH")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-4 h-4 rounded-full bg-slate-300 mt-1 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase">
                          {selectedApp.status}
                        </p>
                        <p className="text-[10px] text-muted-foreground">สถานะปัจจุบัน</p>
                      </div>
                    </div>
                  </div>
                </section>

                <Button
                  variant="outline"
                  className="w-full text-destructive border-destructive hover:bg-destructive/5 font-bold uppercase text-xs tracking-wider"
                  onClick={() => moveApplication(selectedApp.id, "rejected")}
                  disabled={isPending || selectedApp.status === "rejected"}
                >
                  ย้ายไป Rejected
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
