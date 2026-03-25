import { useState, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Button, Card, Badge, Input, cn } from "../../components/UI";
import { Modal } from "../../components/Modal";
import { 
  Search, Filter, ChevronLeft, MoreVertical, 
  FileText, Phone, Mail, CheckCircle2, XCircle,
  Clock, Calendar, User, UserCheck, UserPlus, 
  Eye, Download, MessageSquare, Star, ArrowRight,
  GripVertical, PlusCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { getJobApplications, updateApplicationStatus, type Application } from "../../lib/mockData";

const COLUMNS = [
  { id: "new", label: "New Applied", color: "bg-blue-500", icon: UserPlus },
  { id: "reviewing", label: "Reviewing", color: "bg-warning", icon: Eye },
  { id: "interview", label: "Interview", color: "bg-primary", icon: Calendar },
  { id: "hired", label: "Hired", color: "bg-success", icon: UserCheck },
  { id: "rejected", label: "Rejected", color: "bg-destructive", icon: XCircle },
];

const ItemType = {
  CANDIDATE: "candidate",
};

function CandidateCard({ candidate, onSelect }: { candidate: Application; onSelect: (c: Application) => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.CANDIDATE,
    item: { id: candidate.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const match = (candidate as any).match || 90;
  const avatar = (candidate as any).avatar || (candidate.candidateName ? candidate.candidateName.charAt(0) : "C");

  return (
    <motion.div
      ref={drag as any}
      layoutId={candidate.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "bg-white p-4 rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group",
        isDragging && "opacity-40 grayscale"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
             {avatar}
           </div>
           <div>
              <p className="font-bold text-sm text-slate-900 line-clamp-1">{candidate.candidateName}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                {new Date(candidate.appliedAt).toLocaleDateString('th-TH')}
              </p>
           </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted opacity-0 group-hover:opacity-100 transition-all">
           <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
         <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold">
            {match}% MATCH
         </Badge>
         <div className="flex -space-x-1.5">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-5 h-5 rounded-full border border-white bg-muted text-[8px] flex items-center justify-center font-bold">
                {i}
              </div>
            ))}
         </div>
      </div>

      <div className="flex items-center gap-2">
         <Button 
           variant="outline" 
           size="sm" 
           className="flex-1 text-[10px] font-bold uppercase h-8 border-slate-200"
           onClick={() => onSelect(candidate)}
         >
            View Info
         </Button>
         <button className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
            <MessageSquare className="w-4 h-4" />
         </button>
      </div>
    </motion.div>
  );
}

function KanbanColumn({ 
  column, 
  candidates, 
  onDrop, 
  onSelect 
}: { 
  column: typeof COLUMNS[0]; 
  candidates: Application[]; 
  onDrop: (candidateId: string, status: string) => void;
  onSelect: (c: Application) => void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType.CANDIDATE,
    drop: (item: { id: string }) => onDrop(item.id, column.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop as any}
      className={cn(
        "flex flex-col h-full min-w-[300px] rounded-2xl transition-colors",
        isOver ? "bg-primary/5 ring-2 ring-primary/20" : "bg-muted/30"
      )}
    >
      <div className="p-4 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", column.color)}></div>
            <h4 className="font-bold text-sm uppercase tracking-wider font-kanit">{column.label}</h4>
            <Badge className="ml-2 bg-white text-slate-500 font-bold border-none shadow-sm">{candidates.length}</Badge>
         </div>
         <button className="text-muted-foreground hover:text-foreground p-1">
            <PlusCircle className="w-4 h-4" />
         </button>
      </div>

      <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar">
         {candidates.map(candidate => (
           <CandidateCard key={candidate.id} candidate={candidate} onSelect={onSelect} />
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

export function ATSBoard() {
  const { id } = useParams();
  const [candidates, setCandidates] = useState<Application[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (id) {
      const apps = getJobApplications(id);
      // If no apps found, use initial mock for demo purposes
      if (apps.length === 0) {
        const initialMock: Application[] = [
          { id: "c1", jobId: id, candidateId: "u1", candidateName: "สมชาย รักดี", status: "new", match: 95, appliedAt: new Date().toISOString(), candidateAvatar: "S", jobTitle: "Senior Frontend Dev", companyName: "TechCorp" },
          { id: "c2", jobId: id, candidateId: "u2", candidateName: "วิภาวดี ตั้งใจ", status: "new", match: 88, appliedAt: new Date().toISOString(), candidateAvatar: "V", jobTitle: "Senior Frontend Dev", companyName: "TechCorp" },
          { id: "c3", jobId: id, candidateId: "u3", candidateName: "กิตติพงษ์ มั่นคง", status: "reviewing", match: 92, appliedAt: new Date().toISOString(), candidateAvatar: "K", jobTitle: "Senior Frontend Dev", companyName: "TechCorp" },
        ] as any;
        setCandidates(initialMock);
      } else {
        setCandidates(apps);
      }
    }
  }, [id]);

  const moveCandidate = useCallback((candidateId: string, newStatus: string) => {
    updateApplicationStatus(candidateId, newStatus as any);
    setCandidates(prev => prev.map(c => 
      c.id === candidateId ? { ...c, status: newStatus as any } : c
    ));
    toast.success("อัปเดตสถานะผู้สมัครเรียบร้อยแล้ว");
  }, []);

  const handleSelect = (candidate: Application) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const filteredCandidates = candidates.filter(c => 
    c.candidateName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-white">
        {/* Sub Header */}
        <div className="bg-slate-900 text-white py-6">
           <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                    <Link to="/hr/jobs" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                       <ChevronLeft className="w-5 h-5 text-slate-400" />
                    </Link>
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <h1 className="text-xl font-bold font-kanit">ATS: Senior Frontend Developer</h1>
                          <Badge className="bg-success text-white border-none text-[10px] font-bold uppercase">OPEN</Badge>
                       </div>
                       <p className="text-xs text-slate-400 font-sarabun">TechCorp Solutions • ประกาศเมื่อ 12 มี.ค. 2026</p>
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
                    <Button variant="outline" className="h-10 border-white/10 text-white hover:bg-white/5 font-bold text-xs uppercase">
                       <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                    <Button variant="primary" className="h-10 font-bold text-xs uppercase shadow-lg shadow-primary/20">
                       <PlusCircle className="w-4 h-4 mr-2" /> Add Candidate
                    </Button>
                 </div>
              </div>
           </div>
        </div>

        {/* Kanban Board */}
        <div className="w-full overflow-x-auto p-6 md:p-8 bg-muted/20">
           <div className="flex gap-6 h-[calc(100vh-220px)] min-h-[500px]">
              {COLUMNS.map(column => (
                <KanbanColumn 
                  key={column.id} 
                  column={column} 
                  candidates={filteredCandidates.filter(c => c.status === column.id)}
                  onDrop={moveCandidate}
                  onSelect={handleSelect}
                />
              ))}
           </div>
        </div>

        {/* Candidate Detail Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title="ข้อมูลผู้สมัคร"
          size="xl"
        >
          {selectedCandidate && (
            <div className="space-y-8 font-sarabun">
               <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-border pb-6">
                  <div className="flex items-center gap-4">
                     <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center text-3xl font-bold shadow-xl shadow-primary/20">
                        {selectedCandidate.candidateAvatar}
                     </div>
                     <div className="space-y-1">
                        <h2 className="text-2xl font-bold font-kanit">{selectedCandidate.candidateName}</h2>
                        <p className="text-muted-foreground font-medium">{selectedCandidate.jobTitle}</p>
                        <div className="flex items-center gap-3 text-xs font-bold uppercase pt-1">
                           <span className="flex items-center gap-1.5 text-primary"><Star className="w-3.5 h-3.5 fill-current" /> {(selectedCandidate as any).match || 90}% Match</span>
                           <span className="flex items-center gap-1.5 text-slate-400"><Clock className="w-3.5 h-3.5" /> Applied {new Date(selectedCandidate.appliedAt).toLocaleDateString('th-TH')}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button className="font-bold gap-2">
                        <Phone className="w-4 h-4" /> ดูเบอร์โทรศัพท์
                     </Button>
                     <Button variant="outline" className="font-bold gap-2">
                        <Mail className="w-4 h-4" /> ส่งอีเมล
                     </Button>
                  </div>
               </div>

               <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-8">
                     <section>
                        <h4 className="font-bold font-kanit text-lg mb-4 flex items-center gap-2">
                           <FileText className="w-5 h-5 text-primary" /> ประวัติย่อ (Resume)
                        </h4>
                        <div className="p-4 border border-border rounded-2xl bg-muted/30 flex items-center justify-between hover:border-primary/30 transition-all group">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shadow-sm">
                                <FileText className="w-8 h-8" />
                              </div>
                              <div>
                                 <p className="font-bold text-slate-900">Somyos_Resume_2026.pdf</p>
                                 <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">PDF • 1.2 MB</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
                                <Download className="w-4 h-4" />
                              </Button>
                           </div>
                        </div>
                     </section>

                     <section>
                        <h4 className="font-bold font-kanit text-lg mb-4 flex items-center gap-2">
                           <MessageSquare className="w-5 h-5 text-primary" /> คำตอบ Prescreening
                        </h4>
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <p className="text-sm font-bold text-slate-900">1. คุณมีประสบการณ์การใช้งาน React นานกี่ปี?</p>
                              <div className="p-3 bg-success/5 border border-success/20 rounded-xl text-success font-bold text-sm">
                                 5 ปีขึ้นไป
                              </div>
                           </div>
                           <div className="space-y-2">
                              <p className="text-sm font-bold text-slate-900">2. ทำไมคุณถึงสนใจร่วมงานกับเรา?</p>
                              <div className="p-4 bg-muted/50 rounded-xl text-sm leading-relaxed text-slate-600 italic">
                                 "ผมติดตามผลงานของ TechCorp มาสักพักแล้ว ชอบแนวทางการใช้เทคโนโลยีใหม่ๆ และเห็นว่าทีมมีวัฒนธรรมการทำงานที่แข็งแกร่ง ผมเชื่อว่าทักษะ React และ TypeScript ของผมจะช่วยสร้างคุณค่าให้ทีมได้ทันทีครับ"
                              </div>
                           </div>
                        </div>
                     </section>
                  </div>

                  <div className="space-y-6">
                     <section>
                        <h4 className="font-bold font-kanit text-lg mb-4">สถานะปัจจุบัน</h4>
                        <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                           <select 
                             className="w-full h-11 px-3 rounded-xl border border-border bg-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                             value={selectedCandidate.status}
                             onChange={(e) => moveCandidate(selectedCandidate.id, e.target.value)}
                           >
                              {COLUMNS.map(col => (
                                <option key={col.id} value={col.id}>{col.label}</option>
                              ))}
                           </select>
                        </div>
                     </section>

                     <section>
                        <h4 className="font-bold font-kanit text-lg mb-4">ประวัติการติดต่อ</h4>
                        <div className="space-y-4">
                           <div className="flex gap-3 relative before:absolute before:left-2 before:top-6 before:bottom-0 before:w-0.5 before:bg-border last:before:hidden">
                              <div className="w-4 h-4 rounded-full bg-primary mt-1 z-10"></div>
                              <div className="flex-1">
                                 <p className="text-xs font-bold text-slate-900 uppercase">Applied</p>
                                 <p className="text-[10px] text-muted-foreground">{new Date(selectedCandidate.appliedAt).toLocaleString('th-TH')}</p>
                              </div>
                           </div>
                           <div className="flex gap-3 relative before:absolute before:left-2 before:top-6 before:bottom-0 before:w-0.5 before:bg-border last:before:hidden">
                              <div className="w-4 h-4 rounded-full bg-slate-300 mt-1 z-10"></div>
                              <div className="flex-1">
                                 <p className="text-xs font-bold text-muted-foreground uppercase">Reviewing</p>
                                 <p className="text-[10px] text-muted-foreground">รอการดำเนินการ...</p>
                              </div>
                           </div>
                        </div>
                     </section>

                     <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/5 font-bold uppercase text-xs tracking-wider" onClick={() => moveCandidate(selectedCandidate.id, 'rejected')}>
                        ย้ายไป Rejected
                     </Button>
                  </div>
               </div>
            </div>
          )}
        </Modal>
      </div>
    </DndProvider>
  );
}
