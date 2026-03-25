"use client";

import Link from "next/link";
import { Button, Card, Badge } from "@futurecareer/ui";
import {
  Users,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Clock,
  PlusCircle,
  ChevronRight,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CompanyStats } from "@/lib/data/stats";
import type { ApplicationWithCandidate } from "@futurecareer/types";
import type { Job } from "@futurecareer/types";

const STATUS_BADGE_VARIANT: Record<string, "secondary" | "warning" | "success" | "destructive" | "default"> = {
  new: "secondary",
  reviewing: "warning",
  interview: "success",
  hired: "success",
  rejected: "destructive",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  reviewing: "Reviewing",
  interview: "Interview",
  hired: "Hired",
  rejected: "Rejected",
};

interface DashboardClientProps {
  userName: string;
  companyId: string;
  stats: CompanyStats;
  latestApplications: ApplicationWithCandidate[];
  jobs: Job[];
}

export function DashboardClient({
  userName,
  companyId,
  stats,
  latestApplications,
  jobs,
}: DashboardClientProps) {
  const openJobs = jobs.filter((j) => j.status === "open").length;
  const closedJobs = jobs.length - openJobs;
  const openPct = jobs.length > 0 ? Math.round((openJobs / jobs.length) * 100) : 0;
  const closedPct = 100 - openPct;

  const statCards = [
    {
      label: "ผู้สมัครทั้งหมด",
      value: stats.totalApplicants,
      icon: Users,
      color: "text-primary bg-primary/10",
    },
    {
      label: "ตำแหน่งที่เปิดรับ",
      value: stats.openJobs,
      icon: Briefcase,
      color: "text-secondary-foreground bg-secondary/20",
    },
    {
      label: "สัมภาษณ์แล้ว",
      value: stats.interviewStage,
      icon: CheckCircle2,
      color: "text-success bg-success/10",
    },
    {
      label: "รอการพิจารณา",
      value: stats.pendingReview,
      icon: Clock,
      color: "text-warning bg-warning/10",
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-10">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold font-kanit mb-2">
              ยินดีต้อนรับกลับมา, {userName}
            </h1>
            <p className="text-muted-foreground font-sarabun">
              นี่คือภาพรวมการสรรหาบุคลากรของบริษัทคุณในรอบ 7 วันที่ผ่านมา
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/hr/jobs">
              <Button variant="outline" className="gap-2 font-bold font-kanit">
                <Briefcase className="w-4 h-4" /> ดูประกาศงานทั้งหมด
              </Button>
            </Link>
            <Link href="/hr/jobs">
              <Button className="gap-2 font-bold font-kanit shadow-lg shadow-primary/20">
                <PlusCircle className="w-4 h-4" /> สร้างประกาศงานใหม่
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, idx) => (
            <Card key={idx} className="p-6 border-none shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-success">
                  <TrendingUp className="w-3 h-3" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold font-poppins">{stat.value}</h3>
                <p className="text-sm text-muted-foreground font-kanit font-bold">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Charts Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bar Chart */}
            <Card className="p-8 border-none shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold font-kanit flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" /> สถิติผู้สมัครและยอดเข้าชม
                </h3>
              </div>
              {stats.weeklyData.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#888" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#888" }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        }}
                        cursor={{ fill: "rgba(154, 82, 228, 0.05)" }}
                      />
                      <Bar dataKey="applicants" fill="#9A52E4" radius={[4, 4, 0, 0]} name="ผู้สมัคร" />
                      <Bar dataKey="views" fill="#F1CB46" radius={[4, 4, 0, 0]} name="ยอดเข้าชม" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground font-sarabun text-sm">
                  ยังไม่มีข้อมูลสถิติ
                </div>
              )}
            </Card>

            {/* Latest Applications Table */}
            <Card className="p-8 border-none shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-kanit flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary-foreground" /> ผู้สมัครล่าสุด
                </h3>
                <Link href="/hr/jobs" className="text-xs font-bold text-primary hover:underline">
                  ดูทั้งหมด →
                </Link>
              </div>
              <div className="overflow-x-auto -mx-8">
                <table className="w-full text-left font-sarabun">
                  <thead>
                    <tr className="bg-muted/50 border-y border-border">
                      <th className="px-8 py-3 text-xs font-bold text-muted-foreground uppercase">ผู้สมัคร</th>
                      <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase">สถานะ</th>
                      <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase">วันที่</th>
                      <th className="px-8 py-3 text-xs font-bold text-muted-foreground uppercase text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {latestApplications.length > 0 ? (
                      latestApplications.map((app) => {
                        const candidateName = [app.candidate.first_name, app.candidate.last_name]
                          .filter(Boolean)
                          .join(" ") || "ไม่ระบุชื่อ";
                        const initials = candidateName.charAt(0).toUpperCase();
                        return (
                          <tr key={app.id} className="hover:bg-muted/30 transition-colors group">
                            <td className="px-8 py-4">
                              <div className="flex items-center gap-3">
                                {app.candidate.avatar_url ? (
                                  <img
                                    src={app.candidate.avatar_url}
                                    alt={candidateName}
                                    className="w-9 h-9 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs uppercase">
                                    {initials}
                                  </div>
                                )}
                                <span className="font-bold text-sm">{candidateName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <Badge
                                variant={STATUS_BADGE_VARIANT[app.status] ?? "default"}
                                className="text-[10px] uppercase font-bold"
                              >
                                {STATUS_LABELS[app.status] ?? app.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 text-xs text-muted-foreground">
                              {new Date(app.applied_at).toLocaleDateString("th-TH")}
                            </td>
                            <td className="px-8 py-4 text-right">
                              <Link href={`/hr/jobs/${app.job_id}/ats`}>
                                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 rounded-full">
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-8 py-10 text-center text-muted-foreground font-sarabun text-sm">
                          ยังไม่มีผู้สมัคร — เริ่มประกาศงานแรกของคุณ!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Job Summary Card */}
            <Card className="p-6 border-none shadow-sm bg-primary text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="relative z-10">
                <h4 className="font-bold font-kanit text-lg mb-2">สรุปตำแหน่งงาน</h4>
                <p className="text-primary-foreground/80 text-sm font-sarabun mb-6">
                  คุณเปิดรับสมัครงานรวม {jobs.length} ตำแหน่ง มียอดผู้สนใจเฉลี่ยตำแหน่งละ{" "}
                  {jobs.length > 0 ? Math.round(stats.totalApplicants / jobs.length) : 0} คน
                </p>
                {jobs.length > 0 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>ตำแหน่งที่ปิดรับแล้ว ({closedJobs})</span>
                        <span>{closedPct}%</span>
                      </div>
                      <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-secondary h-full"
                          style={{ width: `${closedPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>ตำแหน่งที่กำลังเปิดรับ ({openJobs})</span>
                        <span>{openPct}%</span>
                      </div>
                      <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-accent h-full"
                          style={{ width: `${openPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <Link href="/hr/jobs">
                  <Button variant="secondary" className="w-full mt-8 font-bold text-xs uppercase tracking-wider">
                    จัดการตำแหน่งงาน
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Share Profile Card */}
            <Card className="p-6 border-none shadow-sm bg-secondary/10 border-secondary/30 border">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary-foreground shrink-0">
                  <PieChart className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm font-kanit mb-1">แชร์โปรไฟล์บริษัทของคุณ</h4>
                  <p className="text-xs text-muted-foreground font-sarabun leading-relaxed mb-3">
                    ช่วยเพิ่มโอกาสให้คนรู้จักบริษัทคุณมากขึ้น และดึงดูด Talent ที่ใช่
                  </p>
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        const url = `${window.location.origin}/company/${companyId}`;
                        navigator.clipboard?.writeText(url);
                      }
                    }}
                    className="w-full text-[10px] font-bold uppercase py-2 px-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    คัดลอกลิงก์โปรไฟล์
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
