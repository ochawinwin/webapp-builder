"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Card, Input, Badge, cn } from "@futurecareer/ui";
import {
  updateProfileAction,
  uploadResumeAction,
  uploadAvatarAction,
} from "@/app/actions/profile.actions";
import { logoutAction, updatePasswordAction } from "@/app/actions/auth.actions";
import { toast } from "sonner";
import {
  User,
  Mail,
  FileText,
  Upload,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  MapPin,
  Globe,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Application {
  id: string;
  job_id: string;
  status: string;
  applied_at: string;
}

interface Profile {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  bio?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  resume_url?: string | null;
  resume_signed_url?: string | null;
  location?: string | null;
  website?: string | null;
}

interface ProfileFormProps {
  userId: string;
  email: string;
  profile: Profile | null;
  applications: Application[];
  savedJobs?: unknown[];
}

const statusLabel: Record<string, string> = {
  new: "ส่งใบสมัครแล้ว",
  reviewing: "กำลังพิจารณา",
  interview: "นัดสัมภาษณ์",
  hired: "ผ่านการคัดเลือก",
  rejected: "ไม่ผ่าน",
};

const statusColorMap: Record<string, string> = {
  new: "text-blue-500 bg-blue-50 border-blue-200",
  reviewing: "text-warning bg-warning/10 border-warning/20",
  interview: "text-primary bg-primary/10 border-primary/20",
  hired: "text-success bg-success/10 border-success/20",
  rejected: "text-destructive bg-destructive/10 border-destructive/20",
};

export function ProfileForm({
  userId,
  email,
  profile,
  applications,
  savedJobs: _savedJobs,
}: ProfileFormProps) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") ?? "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isPending, startTransition] = useTransition();
  const [isResumeUploading, startResumeTransition] = useTransition();
  const [isAvatarUploading, startAvatarTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm_password") as string;
    if (password !== confirm) {
      toast.error("รหัสผ่านไม่ตรงกัน");
      return;
    }
    startPasswordTransition(async () => {
      const result = await updatePasswordAction(formData);
      if (result.success) {
        toast.success("เปลี่ยนรหัสผ่านสำเร็จ!");
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(result.error ?? "เกิดข้อผิดพลาด");
      }
    });
  };

  const resumeFileName = profile?.resume_url
    ? profile.resume_url.split("/").pop() ?? null
    : null;

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result.success) {
        toast.success("บันทึกข้อมูลเรียบร้อยแล้ว!");
      } else {
        toast.error(result.error ?? "บันทึกไม่สำเร็จ");
      }
    });
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ไฟล์ต้องมีขนาดไม่เกิน 5 MB");
      return;
    }
    const formData = new FormData();
    formData.append("resume", file);
    startResumeTransition(async () => {
      const result = await uploadResumeAction(formData);
      if (result.success) {
        toast.success("อัปโหลด Resume สำเร็จ!");
      } else {
        toast.error(result.error ?? "อัปโหลดไม่สำเร็จ");
      }
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    startAvatarTransition(async () => {
      const result = await uploadAvatarAction(formData);
      if (result.success) {
        toast.success("อัปโหลดรูปโปรไฟล์สำเร็จ!");
      } else {
        toast.error(result.error ?? "อัปโหลดไม่สำเร็จ");
      }
    });
  };

  const SidebarItem = ({
    id,
    icon: Icon,
    label,
  }: {
    id: string;
    icon: React.ElementType;
    label: string;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
        activeTab === id
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon
        className={cn(
          "w-5 h-5",
          activeTab === id
            ? "text-primary-foreground"
            : "text-muted-foreground group-hover:text-primary"
        )}
      />
      <span className="font-bold text-sm font-kanit">{label}</span>
      {activeTab === id && <ChevronRight className="w-4 h-4 ml-auto" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <aside className="lg:w-72 shrink-0 space-y-4">
            <Card className="p-6 text-center flex flex-col items-center gap-4 border-none shadow-sm">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-muted">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-3xl font-bold">
                      {(profile?.first_name ?? email).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isAvatarUploading}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold font-kanit">
                  {profile?.first_name && profile?.last_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : email}
                </h3>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
              <Badge variant="success" className="gap-1.5">
                <CheckCircle2 className="w-3 h-3" /> Verified Profile
              </Badge>
            </Card>

            <nav className="space-y-2">
              <SidebarItem id="profile" icon={User} label="ข้อมูลส่วนตัว" />
              <SidebarItem id="resume" icon={FileText} label="จัดการ Resume" />
              <SidebarItem
                id="applications"
                icon={Briefcase}
                label="สถานะการสมัครงาน"
              />
              <SidebarItem id="settings" icon={Settings} label="ตั้งค่าบัญชี" />
              <hr className="my-4 border-border" />
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/5 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-bold text-sm font-kanit">
                    ออกจากระบบ
                  </span>
                </button>
              </form>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card className="p-8 border-none shadow-sm">
                    <form onSubmit={handleSave}>
                      <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
                        <h2 className="text-2xl font-bold font-kanit">
                          แก้ไขข้อมูลส่วนตัว
                        </h2>
                        <Button
                          size="sm"
                          type="submit"
                          disabled={isPending}
                          className="gap-2 px-6"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {isPending ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                        </Button>
                      </div>

                      <div className="space-y-8 font-sarabun">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold">ชื่อ</label>
                            <Input
                              name="first_name"
                              defaultValue={profile?.first_name ?? ""}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold">นามสกุล</label>
                            <Input
                              name="last_name"
                              defaultValue={profile?.last_name ?? ""}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold">อีเมล</label>
                            <Input
                              defaultValue={email}
                              disabled
                              className="bg-muted text-muted-foreground"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold">
                              เบอร์โทรศัพท์
                            </label>
                            <Input
                              name="phone"
                              defaultValue={profile?.phone ?? ""}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold">
                            Bio / ประวัติย่อ
                          </label>
                          <textarea
                            name="bio"
                            className="w-full min-h-[120px] p-4 rounded-xl border border-border bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm leading-relaxed"
                            defaultValue={profile?.bio ?? ""}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />{" "}
                              สถานที่ปัจจุบัน
                            </label>
                            <Input
                              name="location"
                              defaultValue={profile?.location ?? ""}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                              <Globe className="w-4 h-4 text-primary" />{" "}
                              เว็บไซต์ / พอร์ตโฟลิโอ
                            </label>
                            <Input
                              name="website"
                              defaultValue={profile?.website ?? ""}
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </Card>
                </motion.div>
              )}

              {activeTab === "resume" && (
                <motion.div
                  key="resume"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card className="p-8 border-none shadow-sm">
                    <h2 className="text-2xl font-bold font-kanit mb-4">
                      จัดการ Resume
                    </h2>
                    <p className="text-muted-foreground mb-8 font-sarabun">
                      อัปโหลดไฟล์ Resume (PDF เท่านั้น) เพื่อใช้ประกอบการสมัครงาน
                    </p>

                    <div className="grid gap-6">
                      <label
                        htmlFor="resume-upload"
                        className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-3xl p-12 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group"
                      >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-primary/20 mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-10 h-10 text-primary" />
                        </div>
                        <h4 className="font-bold text-lg mb-2">
                          ลากไฟล์มาวาง หรือ คลิกเพื่อเลือกไฟล์
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          PDF (ขนาดไม่เกิน 5 MB)
                        </p>
                        {isResumeUploading && (
                          <p className="text-xs text-primary mt-2 animate-pulse">
                            กำลังอัปโหลด...
                          </p>
                        )}
                        <input
                          id="resume-upload"
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={handleResumeUpload}
                          disabled={isResumeUploading}
                        />
                      </label>

                      {resumeFileName && (
                        <div className="space-y-4">
                          <h4 className="font-bold font-kanit">ไฟล์ปัจจุบัน</h4>
                          <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shadow-sm">
                                <FileText className="w-8 h-8" />
                              </div>
                              <div>
                                <p className="font-bold text-lg">
                                  {resumeFileName}
                                </p>
                              </div>
                            </div>
                            {profile?.resume_signed_url && (
                              <div className="flex items-center gap-3 mt-4 md:mt-0">
                                <a
                                  href={profile.resume_signed_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                  >
                                    <Globe className="w-4 h-4" /> ดูไฟล์
                                  </Button>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-blue-900 mb-1">
                        เคล็ดลับ: ทำ Resume ให้น่าสนใจ
                      </h4>
                      <p className="text-sm text-blue-800 leading-relaxed font-sarabun">
                        บริษัทกว่า 80%
                        มองหา Resume ที่มีความยาวไม่เกิน 2 หน้า
                        และมีคีย์เวิร์ดที่ตรงกับ Job Description
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "applications" && (
                <motion.div
                  key="applications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card className="p-8 border-none shadow-sm">
                    <h2 className="text-2xl font-bold font-kanit mb-8">
                      สถานะการสมัครงาน
                    </h2>

                    <div className="space-y-4 font-sarabun">
                      {applications.length > 0 ? (
                        applications.map((app) => (
                          <div
                            key={app.id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-border rounded-2xl hover:border-primary/30 transition-all group"
                          >
                            <div className="flex items-center gap-4 mb-4 md:mb-0">
                              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center shrink-0">
                                <Briefcase className="w-6 h-6 text-muted-foreground" />
                              </div>
                              <div>
                                <h4 className="font-bold group-hover:text-primary transition-colors">
                                  ตำแหน่งงาน
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  สมัครเมื่อ{" "}
                                  {new Date(app.applied_at).toLocaleDateString(
                                    "th-TH"
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div
                                className={cn(
                                  "px-4 py-1.5 rounded-full text-xs font-bold border",
                                  statusColorMap[app.status] ??
                                    "text-muted-foreground bg-muted border-border"
                                )}
                              >
                                {statusLabel[app.status] ?? app.status}
                              </div>
                              <Link href={`/jobs/${app.job_id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-2 h-10 w-10"
                                >
                                  <ChevronRight className="w-5 h-5" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 bg-muted/20 rounded-3xl border-2 border-dashed border-border">
                          <p className="text-muted-foreground">
                            คุณยังไม่ได้สมัครงานในตำแหน่งใดๆ
                          </p>
                          <Link href="/search">
                            <Button
                              variant="ghost"
                              className="text-primary font-bold hover:bg-transparent underline"
                            >
                              ไปที่หน้าค้นหางาน
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card className="p-8 border-none shadow-sm">
                    <h2 className="text-2xl font-bold font-kanit mb-8">
                      ตั้งค่าบัญชี
                    </h2>

                    <div className="space-y-10 font-sarabun">
                      {/* Change password */}
                      <section>
                        <div className="flex items-center gap-2 mb-6">
                          <Lock className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-bold font-kanit">
                            เปลี่ยนรหัสผ่าน
                          </h3>
                        </div>
                        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                          <div className="space-y-2">
                            <label className="text-sm font-bold">รหัสผ่านใหม่</label>
                            <div className="relative">
                              <Input
                                type={showNewPassword ? "text" : "password"}
                                name="password"
                                placeholder="รหัสผ่านใหม่ (8+ ตัว, มีตัวพิมพ์ใหญ่และตัวเลข)"
                                required
                                minLength={8}
                                className="h-11 pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                              >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold">ยืนยันรหัสผ่านใหม่</label>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirm_password"
                                placeholder="ป้อนรหัสผ่านอีกครั้ง"
                                required
                                className="h-11 pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                              >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <Button type="submit" disabled={isPasswordPending} className="gap-2">
                            <Lock className="w-4 h-4" />
                            {isPasswordPending ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
                          </Button>
                        </form>
                      </section>

                      <hr className="border-border" />

                      {/* Danger zone */}
                      <section className="p-6 bg-destructive/5 rounded-3xl border border-destructive/10">
                        <div className="flex items-center gap-2 text-destructive mb-4">
                          <AlertCircle className="w-5 h-5" />
                          <h3 className="text-lg font-bold font-kanit">
                            พื้นที่อันตราย
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          เมื่อคุณลบบัญชี
                          ข้อมูลทั้งหมดรวมถึงประวัติการสมัครงานและ Resume
                          จะถูกลบออกอย่างถาวร
                        </p>
                        <Button
                          variant="outline"
                          className="text-destructive border-destructive hover:bg-destructive hover:text-white transition-all"
                        >
                          ลบบัญชีผู้ใช้งาน
                        </Button>
                      </section>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
