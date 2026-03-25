import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button, Card, Input, Badge, cn } from "../components/UI";
import { 
  User, Mail, Phone, FileText, Upload, Plus, 
  Trash2, Edit2, CheckCircle2, AlertCircle,
  Briefcase, MapPin, Globe, Linkedin, Settings, LogOut, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

import { getCandidateApplications, type Application } from "../lib/mockData";

export function CandidateProfile() {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  
  useEffect(() => {
    if (user) {
      setApplications(getCandidateApplications(user.id));
    }
  }, [user, activeTab]);

  const [profileData, setProfileData] = useState({
    firstName: user?.name.split(" ")[0] || "สมชาย",
    lastName: user?.name.split(" ")[1] || "รักดี",
    email: user?.email || "somchai.r@mail.com",
    phone: user?.phone || "081-234-5678",
    bio: user?.bio || "Frontend Developer ที่มีประสบการณ์ 5 ปี มุ่งเน้นการสร้าง User Interface ที่สวยงามและใช้งานง่าย...",
    location: "กรุงเทพฯ, ประเทศไทย",
    website: "www.somchai.dev",
    linkedin: "linkedin.com/in/somchai-r",
    skills: user?.tags || ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    resume: {
      name: "Somchai_Resume_2026.pdf",
      size: "1.2 MB",
      uploadedAt: "15 มี.ค. 2026"
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      updateProfile({
        name: `${profileData.firstName} ${profileData.lastName}`,
        bio: profileData.bio,
        phone: profileData.phone,
        tags: profileData.skills
      });
      toast.success("บันทึกข้อมูลเรียบร้อยแล้ว!");
    }, 1000);
  };

  const handleResumeUpload = () => {
     toast.info("กำลังจำลองการอัปโหลดไฟล์...");
     setTimeout(() => {
        toast.success("อัปโหลด Resume ใหม่สำเร็จ!");
     }, 2000);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-kanit mb-4">กรุณาเข้าสู่ระบบก่อนจัดการโปรไฟล์</h2>
        <Button onClick={() => window.location.href = "/login"}>ไปที่หน้าเข้าสู่ระบบ</Button>
      </div>
    );
  }

  const SidebarItem = ({ id, icon: Icon, label }: { id: string; icon: any; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
        activeTab === id 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className={cn("w-5 h-5", activeTab === id ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
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
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1538916681305-d0792cdd7172?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdCUyMHdoaXRlJTIwc2hpcnQlMjBvZmZpY2UlMjBhdmF0YXIlMjBzbWlsaW5nfGVufDF8fHx8MTc3NDQyMzk2MXww&ixlib=rb-4.1.0&q=80&w=1080" 
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
               </div>
               <div>
                  <h3 className="text-xl font-bold font-kanit">{profileData.firstName} {profileData.lastName}</h3>
                  <p className="text-sm text-muted-foreground">Frontend Developer</p>
               </div>
               <Badge variant="success" className="gap-1.5"><CheckCircle2 className="w-3 h-3" /> Verified Profile</Badge>
            </Card>

            <nav className="space-y-2">
               <SidebarItem id="profile" icon={User} label="ข้อมูลส่วนตัว" />
               <SidebarItem id="resume" icon={FileText} label="จัดการ Resume" />
               <SidebarItem id="applications" icon={Briefcase} label="สถานะการสมัครงาน" />
               <SidebarItem id="settings" icon={Settings} label="ตั้งค่าบัญชี" />
               <hr className="my-4 border-border" />
               <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/5 transition-all">
                  <LogOut className="w-5 h-5" />
                  <span className="font-bold text-sm font-kanit">ออกจากระบบ</span>
               </button>
            </nav>
          </aside>

          {/* Main Content Area */}
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
                    <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
                       <h2 className="text-2xl font-bold font-kanit">แก้ไขข้อมูลส่วนตัว</h2>
                       <Button size="sm" onClick={handleSave} isLoading={isSaving} className="gap-2 px-6">
                         <CheckCircle2 className="w-4 h-4" /> บันทึกการเปลี่ยนแปลง
                       </Button>
                    </div>

                    <form className="space-y-8 font-sarabun">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold">ชื่อ</label>
                          <Input defaultValue={profileData.firstName} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold">นามสกุล</label>
                          <Input defaultValue={profileData.lastName} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold">อีเมล</label>
                          <Input defaultValue={profileData.email} disabled className="bg-muted text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold">เบอร์โทรศัพท์</label>
                          <Input defaultValue={profileData.phone} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold">Bio / ประวัติย่อ</label>
                        <textarea 
                          className="w-full min-h-[120px] p-4 rounded-xl border border-border bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm leading-relaxed"
                          defaultValue={profileData.bio}
                        ></textarea>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> สถานที่ปัจจุบัน</label>
                          <Input defaultValue={profileData.location} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> เว็บไซต์ / พอร์ตโฟลิโอ</label>
                          <Input defaultValue={profileData.website} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-bold">ทักษะความชำนาญ (Skills)</label>
                          <button type="button" className="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
                             <Plus className="w-3 h-3" /> เพิ่มทักษะ
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {profileData.skills.map(skill => (
                            <Badge key={skill} variant="secondary" className="px-3 py-1.5 flex items-center gap-2 bg-white border border-border">
                              {skill}
                              <button className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                            </Badge>
                          ))}
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
                    <h2 className="text-2xl font-bold font-kanit mb-4">จัดการ Resume</h2>
                    <p className="text-muted-foreground mb-8 font-sarabun">
                      อัปโหลดไฟล์ Resume (PDF เท่านั้น) เพื่อใช้ประกอบการสมัครงาน ระบบจะดึงข้อมูลบางส่วนจากไฟล์เพื่อช่วยกรอกใบสมัครอัตโนมัติ
                    </p>

                    <div className="grid gap-6">
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-3xl p-12 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group" onClick={handleResumeUpload}>
                         <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-primary/20 mb-4 group-hover:scale-110 transition-transform">
                           <Upload className="w-10 h-10 text-primary" />
                         </div>
                         <h4 className="font-bold text-lg mb-2">ลากไฟล์มาวาง หรือ คลิกเพื่อเลือกไฟล์</h4>
                         <p className="text-sm text-muted-foreground">PDF (ขนาดไม่เกิน 5 MB)</p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold font-kanit">ไฟล์ปัจจุบัน</h4>
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shadow-sm">
                                <FileText className="w-8 h-8" />
                              </div>
                              <div>
                                <p className="font-bold text-lg">{profileData.resume.name}</p>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                   <span>{profileData.resume.size}</span>
                                   <span>•</span>
                                   <span>อัปโหลดเมื่อ {profileData.resume.uploadedAt}</span>
                                </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-3 mt-4 md:mt-0">
                              <Button variant="outline" size="sm" className="gap-2">
                                <Globe className="w-4 h-4" /> ดูไฟล์
                              </Button>
                              <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/5">
                                <Trash2 className="w-4 h-4" /> ลบออก
                              </Button>
                           </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl flex items-start gap-4">
                     <AlertCircle className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                     <div>
                        <h4 className="font-bold text-blue-900 mb-1">เคล็ดลับ: ทำ Resume ให้น่าสนใจ</h4>
                        <p className="text-sm text-blue-800 leading-relaxed font-sarabun">
                          บริษัทกว่า 80% มองหา Resume ที่มีความยาวไม่เกิน 2 หน้า และมีคีย์เวิร์ดที่ตรงกับ Job Description แนะนำให้อัปเดต Resume ทุกครั้งเมื่อมีทักษะหรือประสบการณ์ใหม่ๆ
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
                    <h2 className="text-2xl font-bold font-kanit mb-8">สถานะการสมัครงาน</h2>
                    
                    <div className="space-y-4 font-sarabun">
                      {applications.length > 0 ? applications.map((app, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-border rounded-2xl hover:border-primary/30 transition-all group">
                           <div className="flex items-center gap-4 mb-4 md:mb-0">
                              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center shrink-0">
                                <Briefcase className="w-6 h-6 text-muted-foreground" />
                              </div>
                              <div>
                                <h4 className="font-bold group-hover:text-primary transition-colors">{app.jobTitle}</h4>
                                <p className="text-sm text-muted-foreground">{app.companyName}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-6">
                              <div className="text-right hidden sm:block">
                                <p className="text-xs text-muted-foreground">สมัครเมื่อ</p>
                                <p className="text-sm font-medium">{new Date(app.appliedAt).toLocaleDateString('th-TH')}</p>
                              </div>
                              <div className={cn(
                                "px-4 py-1.5 rounded-full text-xs font-bold border capitalize",
                                app.status === 'new' ? "text-blue-500 bg-blue-50 border-blue-200" :
                                app.status === 'reviewing' ? "text-warning bg-warning/10 border-warning/20" :
                                app.status === 'interview' ? "text-primary bg-primary/10 border-primary/20" :
                                app.status === 'hired' ? "text-success bg-success/10 border-success/20" :
                                "text-destructive bg-destructive/10 border-destructive/20"
                              )}>
                                 {app.status}
                              </div>
                              <Link to={`/jobs/${app.jobId}`}>
                                <Button variant="ghost" size="sm" className="p-2 h-10 w-10">
                                  <ChevronRight className="w-5 h-5" />
                                </Button>
                              </Link>
                           </div>
                        </div>
                      )) : (
                        <div className="text-center py-12 bg-muted/20 rounded-3xl border-2 border-dashed border-border">
                          <p className="text-muted-foreground">คุณยังไม่ได้สมัครงานในตำแหน่งใดๆ</p>
                          <Link to="/search">
                            <Button variant="link" className="text-primary font-bold">ไปที่หน้าค้นหางาน</Button>
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
                    <h2 className="text-2xl font-bold font-kanit mb-8">ตั้งค่าบัญชี</h2>
                    
                    <div className="space-y-10 font-sarabun">
                      {/* Change Password */}
                      <section className="space-y-4">
                        <h3 className="text-lg font-bold font-kanit flex items-center gap-2">
                          <Settings className="w-5 h-5 text-primary" /> เปลี่ยนรหัสผ่าน
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
                          <div className="space-y-2">
                            <label className="text-sm font-bold">รหัสผ่านปัจจุบัน</label>
                            <Input type="password" placeholder="••••••••" />
                          </div>
                          <div className="md:col-start-1 space-y-2">
                            <label className="text-sm font-bold">รหัสผ่านใหม่</label>
                            <Input type="password" placeholder="••••••••" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold">ยืนยันรหัสผ่านใหม่</label>
                            <Input type="password" placeholder="••••••••" />
                          </div>
                        </div>
                        <Button className="mt-2">อัปเดตรหัสผ่าน</Button>
                      </section>

                      <hr className="border-border" />

                      {/* Email Notifications */}
                      <section className="space-y-4">
                        <h3 className="text-lg font-bold font-kanit flex items-center gap-2">
                          <Mail className="w-5 h-5 text-primary" /> การแจ้งเตือนผ่านอีเมล
                        </h3>
                        <div className="space-y-4">
                          {[
                            { label: "แจ้งเตือนงานใหม่ที่แนะนำ", desc: "รับอีเมลเมื่อมีงานใหม่ที่ตรงกับทักษะของคุณ" },
                            { label: "ความคืบหน้าของใบสมัคร", desc: "แจ้งเตือนเมื่อสถานะใบสมัครงานมีการเปลี่ยนแปลง" },
                            { label: "ข่าวสารและโปรโมชั่น", desc: "รับข่าวสารอัปเดตและสิทธิพิเศษจาก FutureCareer" }
                          ].map((item, i) => (
                            <div key={i} className="flex items-start justify-between p-4 bg-muted/20 rounded-2xl border border-transparent hover:border-border transition-all">
                              <div>
                                <p className="font-bold">{item.label}</p>
                                <p className="text-xs text-muted-foreground">{item.desc}</p>
                              </div>
                              <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors bg-primary focus:outline-none">
                                <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      <hr className="border-border" />

                      {/* Danger Zone */}
                      <section className="space-y-4 p-6 bg-destructive/5 rounded-3xl border border-destructive/10">
                        <div className="flex items-center gap-2 text-destructive">
                          <AlertCircle className="w-5 h-5" />
                          <h3 className="text-lg font-bold font-kanit">พื้นที่อันตราย</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          เมื่อคุณลบบัญชี ข้อมูลทั้งหมดรวมถึงประวัติการสมัครงานและ Resume จะถูกลบออกอย่างถาวรและไม่สามารถเรียกคืนได้
                        </p>
                        <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-white transition-all">
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
