import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Button, Card, Badge, Input, cn } from "../components/UI";
import { Modal } from "../components/Modal";
import { 
  MapPin, Briefcase, Clock, DollarSign, Building2, 
  ChevronLeft, Share2, Heart, CheckCircle2, 
  FileText, Send, User, ShieldCheck, HelpCircle, Star
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

import { saveApplication, type Application } from "../lib/mockData";

export function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResume, setHasResume] = useState(true); // Mock resume status

  useEffect(() => {
    // Check if already applied
    if (user && id) {
      const apps = JSON.parse(localStorage.getItem('futurecareer_applications') || '[]');
      const alreadyApplied = apps.some((app: any) => app.candidateId === user.id && app.jobId === id);
      setIsApplied(alreadyApplied);
    }
  }, [user, id]);

  // Mock Job Data
  const job = {
    id: id || "1",
    title: "Senior Frontend Developer (React)",
    companyName: "TechCorp Solutions",
    logo: "https://images.unsplash.com/photo-1760138270903-d95903188730?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29tcGFueSUyMGxvZ28lMjBidXNpbmVzcyUyMG1vZGVybiUyMG9mZmljZSUyMGljb258ZW58MXx8fHwxNzc0NDIwOTEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    location: "กรุงเทพฯ (MRT พระราม 9)",
    salary: "80,000 - 120,000 บาท",
    type: "Full-time",
    level: "Senior",
    postedAt: "2 ชม. ที่แล้ว",
    description: `เรากำลังมองหา Senior Frontend Developer ที่มีความเชี่ยวชาญใน React และระบบนิเวศของ JavaScript เพื่อร่วมทีมพัฒนาแพลตฟอร์มรุ่นใหม่ของเรา คุณจะได้ทำงานในสภาพแวดล้อมที่เน้นความร่วมมือ (Collaborative) และได้ใช้เทคโนโลยีล่าสุดในการแก้ปัญหาที่ท้าทาย`,
    responsibilities: [
      "พัฒนาและบำรุงรักษา Component ที่ซับซ้อนโดยใช้ React และ TypeScript",
      "ร่วมมือกับ UI/UX Designer เพื่อแปลงงานออกแบบเป็น Code ที่ใช้งานได้จริงและมีประสิทธิภาพ",
      "ทำ Code Review และให้คำแนะนำ (Mentoring) แก่ทีมพัฒนาระดับ Junior",
      "ปรับปรุงประสิทธิภาพการทำงาน (Performance Optimization) ของ Web Application",
      "ทำงานร่วมกับ Backend Team ในการเชื่อมต่อ RESTful APIs และ GraphQL"
    ],
    qualifications: [
      "ประสบการณ์พัฒนา Frontend อย่างน้อย 5 ปี",
      "เชี่ยวชาญการใช้ React, Hooks, Context API และ State Management อื่นๆ",
      "มีความรู้ความเข้าใจใน TypeScript และ Modern CSS (Tailwind, Styled-components)",
      "เข้าใจพื้นฐานของ Web Performance และ SEO",
      "สามารถสื่อสารและทำงานเป็นทีมได้ดี (Soft Skills)",
      "มีประสบการณ์กับ Next.js จะพิจารณาเป็นพิเศษ"
    ],
    benefits: [
      "ประกันสุขภาพกลุ่ม (IPD/OPD)",
      "กองทุนสำรองเลี้ยงชีพ",
      "งบประมาณสำหรับการเรียนรู้ (Learning Budget)",
      "Flexible Working Hours & Remote Work 2-3 days/week",
      "โบนัสประจำปีตามผลประกอบการ",
      "กิจกรรมสันทนาการและ Team Building ประจำไตรมาส"
    ],
    companyInfo: {
      industry: "Software & Technology",
      size: "50-100 คน",
      founded: "2018",
      website: "www.techcorpsolutions.com",
      description: "TechCorp Solutions เป็นบริษัทผู้ให้บริการด้านการพัฒนาซอฟต์แวร์แบบครบวงจร ที่มุ่งเน้นการสร้างนวัตกรรมเพื่อขับเคลื่อนธุรกิจในยุคดิจิทัล"
    },
    prescreenQuestions: [
      {
        id: "q1",
        question: "คุณมีประสบการณ์การใช้งาน React นานกี่ปี?",
        type: "choice",
        options: ["0-1 ปี", "1-3 ปี", "3-5 ปี", "5 ปีขึ้นไป"]
      },
      {
        id: "q2",
        question: "ทักษะด้านภาษาอังกฤษของคุณอยู่ในระดับใด? (Speaking/Reading/Writing)",
        type: "choice",
        options: ["Basic", "Intermediate", "Fluent", "Native"]
      },
      {
        id: "q3",
        question: "ทำไมคุณถึงสนใจร่วมงานกับเรา?",
        type: "text"
      }
    ]
  };

  const handleApplyClick = () => {
    if (!user) {
      toast.info("กรุณาเข้าสู่ระบบก่อนสมัครงาน");
      navigate("/login");
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    setIsLoading(true);
    
    // Simulate application process
    setTimeout(() => {
      const newApp: Application = {
        id: Math.random().toString(36).substring(7),
        jobId: id,
        candidateId: user.id,
        status: 'new',
        appliedAt: new Date().toISOString(),
        candidateName: user.name,
        candidateAvatar: user.name.charAt(0),
        jobTitle: job.title,
        companyName: job.companyName
      };
      
      saveApplication(newApp);
      setIsLoading(false);
      setIsApplyModalOpen(false);
      setIsApplied(true);
      toast.success("ส่งใบสมัครของคุณเรียบร้อยแล้ว!", {
        description: "บริษัทจะติดต่อกลับหาคุณผ่านช่องทางที่ระบุไว้ในโปรไฟล์",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-6">
      <div className="container mx-auto px-4">
        <Link to="/search" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 font-medium">
          <ChevronLeft className="w-4 h-4" /> กลับไปหน้าค้นหางาน
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 border-none shadow-sm hover:shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl border border-border bg-white flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                    <img src={job.logo} alt={job.companyName} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold font-kanit leading-tight">{job.title}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
                      <Link to="/company/techcorp" className="font-bold text-primary hover:underline flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" /> {job.companyName}
                      </Link>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" /> {job.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {job.postedAt}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="w-10 h-10 p-0 rounded-full">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="sm" className="w-10 h-10 p-0 rounded-full">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 p-4 bg-muted/50 rounded-2xl">
                 <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">ประเภทงาน</p>
                    <p className="font-bold flex items-center justify-center gap-1.5"><Briefcase className="w-4 h-4 text-primary" /> {job.type}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">เงินเดือน</p>
                    <p className="font-bold flex items-center justify-center gap-1.5 text-primary"><DollarSign className="w-4 h-4" /> {job.salary}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">ระดับงาน</p>
                    <p className="font-bold flex items-center justify-center gap-1.5"><Star className="w-4 h-4 text-secondary" /> {job.level}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">ประกาศเมื่อ</p>
                    <p className="font-bold flex items-center justify-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {job.postedAt}</p>
                 </div>
              </div>

              <div className="space-y-10 font-sarabun">
                <section>
                  <h3 className="text-xl font-bold font-kanit mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full"></div> รายละเอียดงาน
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                </section>

                <section>
                  <h3 className="text-xl font-bold font-kanit mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full"></div> หน้าที่ความรับผิดชอบ
                  </h3>
                  <ul className="grid gap-3">
                    {job.responsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold font-kanit mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full"></div> คุณสมบัติผู้สมัคร
                  </h3>
                  <ul className="grid gap-3">
                    {job.qualifications.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold font-kanit mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full"></div> สวัสดิการ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {job.benefits.map((item, idx) => (
                      <div key={idx} className="p-3 bg-muted/30 rounded-xl flex items-center gap-3">
                         <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                           <ShieldCheck className="w-4 h-4 text-primary" />
                         </div>
                         <span className="text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-24 border-none shadow-sm">
              <div className="flex flex-col gap-4">
                {isApplied ? (
                  <div className="p-4 bg-success/10 border border-success/20 rounded-2xl flex flex-col items-center text-center gap-3">
                    <CheckCircle2 className="w-10 h-10 text-success" />
                    <div>
                      <p className="font-bold text-success text-lg">สมัครงานแล้ว</p>
                      <p className="text-xs text-success/80">คุณได้ส่งใบสมัครให้บร��ษัทนี้แล้วเมื่อครู่</p>
                    </div>
                    <Button variant="outline" className="w-full border-success text-success hover:bg-success/5" onClick={() => navigate("/profile")}>
                      ดูสถานะการสมัคร
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button size="lg" className="w-full h-14 text-lg font-kanit font-bold shadow-lg shadow-primary/20" onClick={handleApplyClick}>
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
                        <img src={job.logo} alt={job.companyName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{job.companyName}</p>
                        <p className="text-xs text-muted-foreground">{job.companyInfo.industry}</p>
                      </div>
                   </div>
                   <p className="text-sm text-muted-foreground font-sarabun line-clamp-3 leading-relaxed">
                     {job.companyInfo.description}
                   </p>
                   <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">ขนาดบริษัท:</span>
                        <span className="font-bold">{job.companyInfo.size}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">ก่อตั้งเมื่อ:</span>
                        <span className="font-bold">{job.companyInfo.founded}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">เว็บไซต์:</span>
                        <a href="#" className="font-bold text-primary hover:underline">{job.companyInfo.website}</a>
                      </div>
                   </div>
                   <Link to={`/company/${id}`}>
                     <Button variant="outline" className="w-full text-xs font-bold">ดูโปรไฟล์บริษัท</Button>
                   </Link>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-secondary/5 border-secondary/20 border">
               <div className="flex items-center gap-3 mb-3 text-secondary-foreground">
                  <HelpCircle className="w-5 h-5" />
                  <h4 className="font-bold font-kanit">มีคำถามเกี่ยวกับงานนี้?</h4>
               </div>
               <p className="text-sm text-muted-foreground font-sarabun leading-relaxed mb-4">
                 หากคุณต้องการสอบถามรายละเอียดเพิ่มเติม สามารถส่งข้อความถาม HR ของบริษัทได้โดยตรง
               </p>
               <Button variant="secondary" className="w-full text-xs font-bold">สอบถาม HR</Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal 
        isOpen={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)}
        title="สมัครงาน"
        size="lg"
      >
        <form onSubmit={handleApplySubmit} className="space-y-6">
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-2xl border border-border/50">
            <div className="w-12 h-12 rounded-xl border border-border bg-white flex items-center justify-center shrink-0 overflow-hidden">
               <img src={job.logo} alt={job.companyName} className="w-full h-full object-cover" />
            </div>
            <div>
               <h4 className="font-bold font-kanit">{job.title}</h4>
               <p className="text-sm text-muted-foreground font-sarabun">{job.companyName}</p>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="font-bold font-kanit flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> ยืนยัน Resume
                </h4>
                <Link to="/profile" className="text-xs text-primary font-bold hover:underline">จัดการ Resume</Link>
             </div>
             {hasResume ? (
               <div className="flex items-center justify-between p-4 bg-white border border-primary/20 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Somyos_Resume_2026.pdf</p>
                      <p className="text-xs text-muted-foreground">อัปโหลดเมื่อ 15 มี.ค. 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded" />
                     <span className="text-xs font-medium">ใช้ไฟล์นี้</span>
                  </div>
               </div>
             ) : (
               <div className="p-4 border-2 border-dashed border-border rounded-xl text-center">
                  <p className="text-sm text-muted-foreground mb-3">คุณยังไม่มี Resume ในระบบ</p>
                  <Button variant="outline" size="sm">อัปโหลด Resume ใหม่</Button>
               </div>
             )}
          </div>

          <div className="space-y-3">
             <label className="text-sm font-bold font-kanit">ข้อความแนะนำตัวสั้นๆ (Intro Message)</label>
             <textarea 
               className="w-full min-h-[100px] p-4 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-sarabun"
               placeholder="เขียนแนะนำตัวหรือเหตุผลที่สนใจตำแหน่งงานนี้ เพื่อเพิ่มโอกาสในการถูกคัดเลือก..."
             ></textarea>
          </div>

          <div className="space-y-4">
             <h4 className="font-bold font-kanit border-b border-border pb-2">คำถามคัดกรองเบื้องต้น (Prescreen Questions)</h4>
             <div className="space-y-6">
                {job.prescreenQuestions.map((q) => (
                  <div key={q.id} className="space-y-3">
                    <p className="text-sm font-bold font-kanit">{q.question}</p>
                    {q.type === "choice" ? (
                      <div className="grid grid-cols-2 gap-3">
                        {q.options?.map((opt, idx) => (
                          <label key={idx} className="flex items-center gap-2 p-3 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                            <input type="radio" name={q.id} className="w-4 h-4 text-primary" required />
                            <span className="text-sm font-medium">{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <Input placeholder="ระบุคำตอบของคุณ..." required />
                    )}
                  </div>
                ))}
             </div>
          </div>

          <div className="flex gap-4 pt-4">
             <Button variant="ghost" className="flex-1" type="button" onClick={() => setIsApplyModalOpen(false)}>ยกเลิก</Button>
             <Button className="flex-1 font-bold gap-2" type="submit" isLoading={isLoading}>
                <Send className="w-4 h-4" /> ส่งใบสมัคร
             </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
