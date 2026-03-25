import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Badge, Input, cn } from "../../components/UI";
import { Modal } from "../../components/Modal";
import { 
  PlusCircle, Search, Filter, Briefcase, MoreVertical, 
  Users, Eye, Edit2, Trash2, CheckCircle, XCircle, 
  LayoutDashboard, ChevronRight, MessageSquare, Tag, 
  MapPin, Plus, Trash
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

const MOCK_COMPANY_JOBS = [
  { id: "1", title: "Senior Frontend Developer", status: "Open", applicants: 45, views: 1200, createdAt: "12 มี.ค. 2026", type: "Full-time", location: "Bangkok" },
  { id: "2", title: "Backend Engineer (Node.js)", status: "Open", applicants: 28, views: 850, createdAt: "15 มี.ค. 2026", type: "Full-time", location: "Remote" },
  { id: "3", title: "UI/UX Designer", status: "Closed", applicants: 15, views: 420, createdAt: "20 ก.พ. 2026", type: "Contract", location: "Bangkok" },
  { id: "4", title: "Product Manager", status: "Draft", applicants: 0, views: 0, createdAt: "20 มี.ค. 2026", type: "Full-time", location: "Bangkok" },
];

export function JobManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [prescreenQuestions, setPrescreenQuestions] = useState<any[]>([
    { id: "q1", question: "คุณมีประสบการณ์การใช้งาน React นานกี่ปี?", type: "choice", options: ["0-1 ปี", "1-3 ปี", "3-5 ปี", "5 ปีขึ้นไป"] }
  ]);

  const addQuestion = () => {
    setPrescreenQuestions([...prescreenQuestions, { id: Date.now().toString(), question: "", type: "text" }]);
  };

  const removeQuestion = (id: string) => {
    setPrescreenQuestions(prescreenQuestions.filter(q => q.id !== id));
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsCreateModalOpen(false);
      toast.success("ประกาศงานสำเร็จ!", {
        description: "ตำแหน่งงานของคุณถูกเผยแพร่สู่หน้าค้นหางานเรียบร้อยแล้ว",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-10">
      <div className="container mx-auto px-4">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
           <div>
              <h1 className="text-3xl font-bold font-kanit mb-2">จัดการประกาศงาน</h1>
              <p className="text-muted-foreground font-sarabun">สร้าง แก้ไข หรือปิดรับสมัครตำแหน่งงานของคุณ</p>
           </div>
           <Button className="gap-2 font-bold font-kanit shadow-lg shadow-primary/20" size="lg" onClick={() => setIsCreateModalOpen(true)}>
             <PlusCircle className="w-5 h-5" /> สร้างประกาศงานใหม่
           </Button>
        </div>

        {/* Filters & Search */}
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
                 <select className="flex-1 md:w-40 bg-muted text-xs font-bold p-2.5 rounded-lg border-none focus:ring-1 focus:ring-primary outline-none">
                    <option>ทุกสถานะ</option>
                    <option>Open</option>
                    <option>Closed</option>
                    <option>Draft</option>
                 </select>
                 <select className="flex-1 md:w-40 bg-muted text-xs font-bold p-2.5 rounded-lg border-none focus:ring-1 focus:ring-primary outline-none">
                    <option>เรียงจากล่าสุด</option>
                    <option>จำนวนผู้สมัครมากสุด</option>
                 </select>
              </div>
           </div>
        </Card>

        {/* Job List Table */}
        <Card className="border-none shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left font-sarabun">
                <thead>
                   <tr className="bg-muted/50 border-b border-border">
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">ตำแหน่งงาน</th>
                      <th className="px-4 py-4 text-xs font-bold text-muted-foreground uppercase">สถานะ</th>
                      <th className="px-4 py-4 text-xs font-bold text-muted-foreground uppercase text-center">ผู้สมัคร</th>
                      <th className="px-4 py-4 text-xs font-bold text-muted-foreground uppercase text-center">ยอดเข้าชม</th>
                      <th className="px-4 py-4 text-xs font-bold text-muted-foreground uppercase">วันที่ลงประกาศ</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase text-right">จัดการ</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-border">
                   {MOCK_COMPANY_JOBS.filter(job => job.title.toLowerCase().includes(searchQuery.toLowerCase())).map((job) => (
                     <tr key={job.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-5">
                           <div>
                              <p className="font-bold text-slate-900 mb-1">{job.title}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                 <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.type}</span>
                                 <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-4 py-5">
                           <Badge variant={job.status === 'Open' ? 'success' : job.status === 'Closed' ? 'destructive' : 'default'} className="text-[10px] font-bold uppercase py-0.5 px-2">
                             {job.status}
                           </Badge>
                        </td>
                        <td className="px-4 py-5 text-center">
                           <div className="flex flex-col items-center">
                              <span className="font-bold text-slate-900">{job.applicants}</span>
                              <span className="text-[10px] text-muted-foreground uppercase font-bold">Candidates</span>
                           </div>
                        </td>
                        <td className="px-4 py-5 text-center text-sm font-medium text-slate-600">
                           {job.views.toLocaleString()}
                        </td>
                        <td className="px-4 py-5 text-sm text-muted-foreground">
                           {job.createdAt}
                        </td>
                        <td className="px-6 py-5 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <Link to={`/hr/ats/${job.id}`}>
                                <Button variant="outline" size="sm" className="h-9 px-3 gap-1.5 text-xs font-bold text-primary border-primary/20 hover:bg-primary/5">
                                   <Users className="w-3.5 h-3.5" /> ดูผู้สมัคร
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
                                 <Edit2 className="w-4 h-4 text-slate-400" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full text-destructive hover:bg-destructive/5">
                                 <Trash2 className="w-4 h-4" />
                              </Button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
              </table>
           </div>
        </Card>
      </div>

      {/* Create Job Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        title="ลงประกาศงานใหม่"
        size="xl"
      >
        <form onSubmit={handleCreateJob} className="space-y-8 font-sarabun">
           <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-sm font-bold font-kanit">ชื่อตำแหน่งงาน *</label>
                 <Input placeholder="เช่น Senior Frontend Developer" required />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold font-kanit">ประเภทงาน *</label>
                 <select className="w-full h-10 px-3 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm">
                    <option>Full-time</option>
                    <option>Contract</option>
                    <option>Freelance</option>
                    <option>Internship</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold font-kanit">สถานที่ปฏิบัติงาน *</label>
                 <Input placeholder="เช่น กรุงเทพฯ (สามย่าน)" required />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold font-kanit">เงินเดือน (ช่วง)</label>
                 <div className="flex items-center gap-2">
                    <Input placeholder="Min" className="flex-1" />
                    <span className="text-muted-foreground">-</span>
                    <Input placeholder="Max" className="flex-1" />
                 </div>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-sm font-bold font-kanit">รายละเอียดงาน & หน้าที่รับผิดชอบ *</label>
              <textarea 
                className="w-full min-h-[150px] p-4 rounded-xl border border-border bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm leading-relaxed"
                placeholder="ระบุรายละเอียดงาน หน้าที่ความรับผิดชอบ และสิ่งที่พนักงานต้องทำในแต่ละวัน..."
                required
              ></textarea>
           </div>

           <div className="space-y-2">
              <label className="text-sm font-bold font-kanit">คุณสมบัติผู้สมัคร *</label>
              <textarea 
                className="w-full min-h-[120px] p-4 rounded-xl border border-border bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm leading-relaxed"
                placeholder="ระบุทักษะ ประสบการณ์ หรือวุฒิการศึกษาที่ต้องการ..."
                required
              ></textarea>
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                 <label className="text-md font-bold font-kanit flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" /> คำถามคัดกรอง (Prescreening Questions)
                 </label>
                 <Button type="button" variant="outline" size="sm" onClick={addQuestion} className="h-8 gap-1.5 text-[10px] uppercase font-bold">
                    <Plus className="w-3 h-3" /> เพิ่มคำถาม
                 </Button>
              </div>
              <p className="text-xs text-muted-foreground">คำถามเหล่านี้จะช่วยให้คุณคัดเลือกผู้สมัครเบื้องต้นได้รวดเร็วขึ้นเมื่อส่งใบสมัครเข้ามา</p>
              
              <div className="space-y-4">
                 {prescreenQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 bg-muted/30 border border-border rounded-xl relative">
                       <button type="button" onClick={() => removeQuestion(q.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive">
                          <Trash className="w-4 h-4" />
                       </button>
                       <div className="grid md:grid-cols-3 gap-4">
                          <div className="md:col-span-2 space-y-2">
                             <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">คำถามที่ {idx + 1}</label>
                             <Input 
                               placeholder="เช่น คุณมีประสบการณ์กี่ปี?" 
                               defaultValue={q.question}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ประเภทคำตอบ</label>
                             <select className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm">
                                <option value="text">ข้อความ (บรรทัดเดียว)</option>
                                <option value="long_text">ข้อความ (หลายบรรทัด)</option>
                                <option value="choice">ตัวเลือก (Multiple Choice)</option>
                             </select>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-sm font-bold font-kanit flex items-center gap-2">
                 <Tag className="w-4 h-4 text-primary" /> Skill Tags
              </label>
              <div className="flex flex-wrap gap-2">
                 {["React", "JavaScript", "TypeScript", "Frontend"].map(tag => (
                   <Badge key={tag} className="gap-1.5 py-1.5 px-3 bg-primary/10 text-primary border-primary/20 font-bold uppercase text-[10px]">
                      {tag} <XCircle className="w-3.5 h-3.5 cursor-pointer" />
                   </Badge>
                 ))}
                 <Button type="button" variant="outline" className="h-8 w-8 p-0 rounded-full border-dashed">
                    <Plus className="w-4 h-4" />
                 </Button>
              </div>
           </div>

           <div className="flex gap-4 pt-6 border-t border-border">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsCreateModalOpen(false)}>ยกเลิก</Button>
              <Button className="flex-1 font-bold h-12" type="submit" isLoading={isLoading}>
                 ลงประกาศงานทันที
              </Button>
           </div>
        </form>
      </Modal>
    </div>
  );
}
