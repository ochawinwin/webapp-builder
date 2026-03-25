"use client";

import { useState } from "react";
import { Button, Card, Badge, cn } from "@futurecareer/ui";
import { JobCard } from "@/components/JobCard";
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Calendar,
  MessageSquare,
  Share2,
  Heart,
  ChevronRight,
  Megaphone,
  CheckCircle2,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { JobWithDetails } from "@futurecareer/types";

interface CompanyPost {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  created_at: string;
  post_type?: string;
}

interface Company {
  id: string;
  name: string;
  logo_url?: string | null;
  banner_url?: string | null;
  industry?: string | null;
  size?: string | null;
  founded_year?: number | null;
  website?: string | null;
  location?: string | null;
  description?: string | null;
  full_bio?: string | null;
}

interface CompanyPublicProfileClientProps {
  company: Company;
  jobs: JobWithDetails[];
  posts: CompanyPost[];
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "วันนี้";
  if (days === 1) return "เมื่อวาน";
  if (days < 7) return `${days} วันที่แล้ว`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} สัปดาห์ที่แล้ว`;
  return new Date(dateString).toLocaleDateString("th-TH");
}

export function CompanyPublicProfileClient({
  company,
  jobs,
  posts,
}: CompanyPublicProfileClientProps) {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Banner & Header */}
      <div className="relative h-[250px] md:h-[350px] overflow-hidden">
        {company.banner_url ? (
          <img
            src={company.banner_url}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white bg-white shadow-2xl overflow-hidden flex items-center justify-center -mb-8 md:-mb-10 relative z-10">
                {company.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2 relative z-10 md:pb-2">
                <h1 className="text-3xl md:text-5xl font-bold font-kanit text-white leading-tight flex items-center gap-3">
                  {company.name}
                  <CheckCircle2 className="w-6 h-6 text-primary fill-white" />
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/80 font-sarabun text-sm md:text-base">
                  {company.industry && (
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" /> {company.industry}
                    </span>
                  )}
                  {company.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> {company.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 font-bold text-secondary">
                    <Star className="w-4 h-4 fill-current" /> Premium Partner
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 relative z-10 md:pb-2 self-center md:self-auto">
              <Button
                variant="outline"
                className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-slate-900 font-bold gap-2"
              >
                <Heart className="w-5 h-5" /> ติดตามบริษัท
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-slate-900 w-11 h-11 p-0 rounded-full"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("คัดลอกลิงก์แล้ว");
                }}
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16 md:mt-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-border">
              {(
                [
                  { id: "about", label: "เกี่ยวกับบริษัท" },
                  { id: "jobs", label: `ตำแหน่งงานที่เปิดรับ (${jobs.length})` },
                  { id: "feed", label: "Company Feed" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 py-3 text-sm font-bold font-kanit rounded-xl transition-all",
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "about" && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <Card className="p-8 border-none shadow-sm font-sarabun">
                    <h3 className="text-2xl font-bold font-kanit mb-6 flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-primary rounded-full"></div>{" "}
                      เกี่ยวกับเรา
                    </h3>
                    <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                      {company.description && <p>{company.description}</p>}
                      {company.full_bio && <p>{company.full_bio}</p>}
                      {!company.description && !company.full_bio && (
                        <p className="text-muted-foreground italic">
                          ยังไม่มีข้อมูลบริษัท
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-10">
                      {company.size && (
                        <div className="p-4 bg-muted/50 rounded-2xl border border-border/50 flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase">
                              ขนาดบริษัท
                            </p>
                            <p className="font-bold text-slate-900">
                              {company.size}
                            </p>
                          </div>
                        </div>
                      )}
                      {company.founded_year && (
                        <div className="p-4 bg-muted/50 rounded-2xl border border-border/50 flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase">
                              ก่อตั้งเมื่อปี
                            </p>
                            <p className="font-bold text-slate-900">
                              {company.founded_year}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === "jobs" && (
                <motion.div
                  key="jobs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold font-kanit">
                      ตำแหน่งงานที่เปิดรับ
                    </h3>
                    <Badge
                      variant="secondary"
                      className="bg-primary/5 text-primary border-none font-bold"
                    >
                      {jobs.length} Positions
                    </Badge>
                  </div>
                  {jobs.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-border">
                      <p className="text-muted-foreground">
                        ไม่มีตำแหน่งงานที่เปิดรับในขณะนี้
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "feed" && (
                <motion.div
                  key="feed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <Card
                        key={post.id}
                        className="p-0 border-none shadow-sm overflow-hidden flex flex-col md:flex-row font-sarabun group"
                      >
                        {post.image_url ? (
                          <div className="md:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden bg-slate-100">
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className="md:w-64 h-48 md:h-auto shrink-0 bg-primary/10 flex flex-col items-center justify-center gap-2 text-primary">
                            <Megaphone className="w-10 h-10 opacity-30" />
                            <span className="text-[10px] font-bold uppercase opacity-60">
                              Story Update
                            </span>
                          </div>
                        )}
                        <div className="p-6 md:p-8 flex-1 flex flex-col gap-4">
                          <div className="flex items-center gap-2">
                            {post.post_type && (
                              <Badge className="bg-primary/5 text-primary border-none text-[10px] font-bold uppercase">
                                {post.post_type}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {timeAgo(post.created_at)}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold font-kanit group-hover:text-primary transition-colors leading-tight">
                            {post.title}
                          </h3>
                          {post.content && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {post.content}
                            </p>
                          )}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-border">
                      <p className="text-muted-foreground">
                        ยังไม่มีโพสต์จากบริษัทนี้
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="p-6 border-none shadow-sm">
              <h4 className="font-bold font-kanit mb-6">ข้อมูลติดต่อ</h4>
              <div className="space-y-6 font-sarabun">
                {company.website && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-primary shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-bold uppercase">
                        เว็บไซต์
                      </p>
                      <a
                        href={
                          company.website.startsWith("http")
                            ? company.website
                            : `https://${company.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-primary hover:underline"
                      >
                        {company.website}
                      </a>
                    </div>
                  </div>
                )}
                {company.location && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-primary shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-bold uppercase">
                        สถานที่ปฏิบัติงาน
                      </p>
                      <p className="font-bold text-slate-900">
                        {company.location}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-slate-900 text-white border-none shadow-lg">
              <h4 className="font-bold font-kanit mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />{" "}
                ยืนยันข้อมูลบริษัทแล้ว
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed font-sarabun mb-6">
                บริษัทนี้ผ่านการยืนยันตัวตน (Identity Verification)
                และข้อมูลการลงทะเบียนบริษัทกับ FutureCareer เรียบร้อยแล้ว
              </p>
            </Card>

            <div className="p-6 rounded-3xl bg-secondary/10 border border-secondary/30 relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
              <div className="relative z-10 flex flex-col items-center text-center gap-4">
                <MessageSquare className="w-10 h-10 text-secondary-foreground" />
                <div>
                  <h4 className="font-bold font-kanit text-lg">ร่วมงานกับเรา</h4>
                  <p className="text-xs text-muted-foreground font-sarabun mt-1">
                    ส่งคำถามถึง HR
                    หรือปรึกษาเกี่ยวกับวัฒนธรรมองค์กรของเราได้ที่นี่
                  </p>
                </div>
                <Button variant="secondary" className="w-full font-bold">
                  สอบถามรายละเอียด
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
