import { useState } from "react";
import { useParams, Link } from "react-router";
import { Button, Card, Badge, cn } from "../components/UI";
import { JobCard } from "../components/JobCard";
import { 
  Building2, Globe, MapPin, Users, Calendar, 
  MessageSquare, LayoutDashboard, Share2, Heart,
  ChevronRight, ArrowUpRight, Megaphone, CheckCircle2,
  Briefcase, Star
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const MOCK_COMPANY = {
  id: "techcorp",
  name: "TechCorp Solutions",
  logo: "https://images.unsplash.com/photo-1760138270903-d95903188730?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29tcGFueSUyMGxvZ28lMjBidXNpbmVzcyUyMG1vZGVybiUyMG9mZmljZSUyMGljb258ZW58MXx8fHwxNzc0NDIwOTEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  banner: "https://images.unsplash.com/photo-1761912915167-558fa68f16b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjB0ZWFtJTIwYnVpbGRpbmclMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzc0NDIwNzk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  industry: "Software & Technology",
  size: "50-100 คน",
  founded: "2018",
  website: "www.techcorpsolutions.com",
  location: "กรุงเทพฯ (MRT พระราม 9)",
  description: "TechCorp Solutions เป็นบริษัทผู้ให้บริการด้านการพัฒนาซอฟต์แวร์แบบครบวงจร ที่มุ่งเน้นการสร้างนวัตกรรมเพื่อขับเคลื่อนธุรกิจในยุคดิจิทัล เราสร้างซอฟต์แวร์ที่ช่วยให้ธุรกิจของคุณเติบโตได้อย่างยั่งยืน",
  fullBio: "เราคือกลุ่มคนที่หลงใหลในเทคโนโลยี และเชื่อมั่นว่าซอฟต์แวร์ที่มีคุณภาพสามารถสร้างความเปลี่ยนแปลงที่ยิ่งใหญ่ได้ ทีมงานของเราประกอบด้วยนักพัฒนา นักออกแบบ และผู้เชี่ยวชาญที่มีความหลากหลาย และมุ่งมั่นที่จะส่งมอบสิ่งที่ดีที่สุดให้กับลูกค้าเสมอ วัฒนธรรมองค์กรของเราเน้นความโปร่งใส การทำงานเป็นทีม และการพัฒนาตนเองอย่างต่อเนื่อง",
  openJobs: [
    {
      id: "1",
      title: "Senior Frontend Developer (React)",
      companyName: "TechCorp Solutions",
      location: "กรุงเทพฯ (MRT พระราม 9)",
      salary: "80,000 - 120,000 บาท",
      type: "Full-time",
      level: "Senior",
      tags: ["React", "TypeScript", "Tailwind CSS"],
      postedAt: "2 ชม. ที่แล้ว",
      isNew: true,
      isRecommended: true
    },
    {
      id: "2",
      title: "Backend Engineer (Node.js)",
      companyName: "TechCorp Solutions",
      location: "Remote / กรุงเทพฯ",
      salary: "60,000 - 90,000 บาท",
      type: "Full-time",
      level: "Middle",
      tags: ["Node.js", "Express", "PostgreSQL"],
      postedAt: "5 ชม. ที่แล้ว",
      isNew: true
    }
  ],
  feed: [
    { id: "f1", title: "บรรยากาศกิจกรรม Outing ประจำปี 2025", date: "3 วันที่แล้ว", views: "1.2k", likes: 45, type: "Story", image: "https://images.unsplash.com/photo-1727857934741-93f20b9ffe71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzc0NDIwNzkyfDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: "f2", title: "รับสมัคร Internship Batch #3 ประจำปีนี้", date: "1 สัปดาห์ที่แล้ว", views: "4.5k", likes: 120, type: "Announcement", image: null }
  ]
};

export function CompanyPublicProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Banner & Header */}
      <div className="relative h-[250px] md:h-[350px] overflow-hidden">
         <img src={MOCK_COMPANY.banner} alt="Banner" className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
         <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
            <div className="container mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
               <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white bg-white shadow-2xl overflow-hidden flex items-center justify-center -mb-8 md:-mb-10 relative z-10">
                    <img src={MOCK_COMPANY.logo} alt={MOCK_COMPANY.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2 relative z-10 md:pb-2">
                     <h1 className="text-3xl md:text-5xl font-bold font-kanit text-white leading-tight flex items-center gap-3">
                        {MOCK_COMPANY.name}
                        <CheckCircle2 className="w-6 h-6 text-primary fill-white" />
                     </h1>
                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/80 font-sarabun text-sm md:text-base">
                        <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {MOCK_COMPANY.industry}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {MOCK_COMPANY.location}</span>
                        <span className="flex items-center gap-1.5 font-bold text-secondary"><Star className="w-4 h-4 fill-current" /> Premium Partner</span>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-3 relative z-10 md:pb-2 self-center md:self-auto">
                  <Button variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-slate-900 font-bold gap-2">
                     <Heart className="w-5 h-5" /> ติดตามบริษัท
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-slate-900 w-11 h-11 p-0 rounded-full">
                     <Share2 className="w-5 h-5" />
                  </Button>
               </div>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 mt-16 md:mt-20">
         <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Details & Tabs */}
            <div className="lg:col-span-2 space-y-8">
               <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-border">
                  <button 
                    onClick={() => setActiveTab("about")}
                    className={cn(
                      "flex-1 py-3 text-sm font-bold font-kanit rounded-xl transition-all",
                      activeTab === "about" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    เกี่ยวกับบริษัท
                  </button>
                  <button 
                    onClick={() => setActiveTab("jobs")}
                    className={cn(
                      "flex-1 py-3 text-sm font-bold font-kanit rounded-xl transition-all",
                      activeTab === "jobs" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    ตำแหน่งงานที่เปิดรับ ({MOCK_COMPANY.openJobs.length})
                  </button>
                  <button 
                    onClick={() => setActiveTab("feed")}
                    className={cn(
                      "flex-1 py-3 text-sm font-bold font-kanit rounded-xl transition-all",
                      activeTab === "feed" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    Company Feed
                  </button>
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
                             <div className="w-1.5 h-8 bg-primary rounded-full"></div> เกี่ยวกับเรา
                          </h3>
                          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                             <p>{MOCK_COMPANY.description}</p>
                             <p>{MOCK_COMPANY.fullBio}</p>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 mt-10">
                             <div className="p-4 bg-muted/50 rounded-2xl border border-border/50 flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                                   <Users className="w-5 h-5" />
                                </div>
                                <div>
                                   <p className="text-xs font-bold text-muted-foreground uppercase">ขนาดบริษัท</p>
                                   <p className="font-bold text-slate-900">{MOCK_COMPANY.size}</p>
                                </div>
                             </div>
                             <div className="p-4 bg-muted/50 rounded-2xl border border-border/50 flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                                   <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                   <p className="text-xs font-bold text-muted-foreground uppercase">ก่อตั้งเมื่อปี</p>
                                   <p className="font-bold text-slate-900">{MOCK_COMPANY.founded}</p>
                                </div>
                             </div>
                          </div>
                       </Card>

                       <Card className="p-8 border-none shadow-sm font-sarabun">
                          <h3 className="text-2xl font-bold font-kanit mb-6 flex items-center gap-3">
                             <div className="w-1.5 h-8 bg-secondary rounded-full"></div> สวัสดิการพนักงาน
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {[
                                "ประกันสุขภาพกลุ่มครอบคลุม OPD/IPD",
                                "เวลาทำงานยืดหยุ่น (Hybrid Working)",
                                "งบพัฒนาความรู้รายปี",
                                "โบนัสประจำปีตามผลงาน",
                                "เครื่องดื่มและขนมฟรีตลอดวัน",
                                "กิจกรรม Team Building ประจำไตรมาส"
                             ].map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-muted-foreground">
                                   <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                                   <span className="font-medium">{benefit}</span>
                                </div>
                             ))}
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
                          <h3 className="text-2xl font-bold font-kanit">ตำแหน่งงานที่เปิดรับ</h3>
                          <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-bold">
                             {MOCK_COMPANY.openJobs.length} Positions
                          </Badge>
                       </div>
                       <div className="grid md:grid-cols-2 gap-6">
                          {MOCK_COMPANY.openJobs.map(job => (
                            <JobCard key={job.id} job={job as any} />
                          ))}
                       </div>
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
                       {MOCK_COMPANY.feed.map(post => (
                         <Card key={post.id} className="p-0 border-none shadow-sm overflow-hidden flex flex-col md:flex-row font-sarabun group">
                            {post.image ? (
                               <div className="md:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden bg-slate-100">
                                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                               </div>
                            ) : (
                               <div className="md:w-64 h-48 md:h-auto shrink-0 bg-primary/10 flex flex-col items-center justify-center gap-2 text-primary">
                                  <Megaphone className="w-10 h-10 opacity-30" />
                                  <span className="text-[10px] font-bold uppercase opacity-60">Story Update</span>
                               </div>
                            )}
                            <div className="p-6 md:p-8 flex-1 flex flex-col gap-4">
                               <div className="flex items-center gap-2">
                                  <Badge className="bg-primary/5 text-primary border-none text-[10px] font-bold uppercase">
                                     {post.type}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{post.date}</span>
                               </div>
                               <h3 className="text-xl font-bold font-kanit group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
                               <div className="flex items-center gap-6 mt-auto pt-4 border-t border-border/50 text-xs font-bold text-muted-foreground uppercase">
                                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {post.views} Views</span>
                                  <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> {post.likes} Likes</span>
                               </div>
                            </div>
                         </Card>
                       ))}
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* Right Column: Contact & Stats */}
            <div className="space-y-6">
               <Card className="p-6 border-none shadow-sm">
                  <h4 className="font-bold font-kanit mb-6">ข้อมูลติดต่อ</h4>
                  <div className="space-y-6 font-sarabun">
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-primary shrink-0">
                           <Globe className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-xs text-muted-foreground font-bold uppercase">เว็บไซต์</p>
                           <a href="#" className="font-bold text-primary hover:underline">{MOCK_COMPANY.website}</a>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-primary shrink-0">
                           <MapPin className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-xs text-muted-foreground font-bold uppercase">สถานที่ปฏิบัติงาน</p>
                           <p className="font-bold text-slate-900">{MOCK_COMPANY.location}</p>
                        </div>
                     </div>
                  </div>
                  <Button variant="outline" className="w-full mt-8 font-bold gap-2">
                     <ArrowUpRight className="w-4 h-4" /> ดูแผนที่บริษัท
                  </Button>
               </Card>

               <Card className="p-6 bg-slate-900 text-white border-none shadow-lg">
                  <h4 className="font-bold font-kanit mb-4 flex items-center gap-2">
                     <CheckCircle2 className="w-5 h-5 text-success" /> ยืนยันข้อมูลบริษัทแล้ว
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-sarabun mb-6">
                     บริษัทนี้ผ่านการยืนยันตัวตน (Identity Verification) และข้อมูลการลงทะเบียนบริษัทกับ FutureCareer เรียบร้อยแล้ว
                  </p>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                     <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-slate-300" />
                     </div>
                     <div>
                        <p className="text-xs text-slate-400">ผู้ติดตาม</p>
                        <p className="font-bold">1,245 คน</p>
                     </div>
                  </div>
               </Card>

               <div className="p-6 rounded-3xl bg-secondary/10 border border-secondary/30 relative overflow-hidden group cursor-pointer">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
                  <div className="relative z-10 flex flex-col items-center text-center gap-4">
                     <MessageSquare className="w-10 h-10 text-secondary-foreground" />
                     <div>
                        <h4 className="font-bold font-kanit text-lg">ร่วมงานกับเรา</h4>
                        <p className="text-xs text-muted-foreground font-sarabun mt-1">
                           ส่งคำถามถึง HR หรือปรึกษาเกี่ยวกับวัฒนธรรมองค์กรของเราได้ที่นี่
                        </p>
                     </div>
                     <Button variant="secondary" className="w-full font-bold">สอบถามรายละเอียด</Button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
