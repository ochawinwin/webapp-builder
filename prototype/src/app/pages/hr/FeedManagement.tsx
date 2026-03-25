import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Input, Badge, cn } from "../../components/UI";
import { 
  MessageSquare, PlusCircle, Image as ImageIcon, 
  Trash2, Edit2, Share2, Eye, Heart, MoreVertical,
  Clock, CheckCircle, Search, Filter, Megaphone
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

const MOCK_FEED = [
  { id: "1", title: "บรรยากาศกิจกรรม Outing ประจำปี 2025", type: "Story", status: "Published", date: "3 วันที่แล้ว", views: 1200, likes: 45, image: "https://images.unsplash.com/photo-1727857934741-93f20b9ffe71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzc0NDIwNzkyfDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "2", title: "รับสมัคร Internship Batch #3 ประจำปีนี้", type: "Announcement", status: "Published", date: "1 สัปดาห์ที่แล้ว", views: 4500, likes: 120, image: "https://images.unsplash.com/photo-1761912915167-558fa68f16b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjB0ZWFtJTIwYnVpbGRpbmclMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzc0NDIwNzk3fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "3", title: "TechCorp คว้ารางวัล Best Workplace 2024", type: "News", status: "Draft", date: "ยังไม่ได้เผยแพร่", views: 0, likes: 0, image: null },
];

export function FeedManagement() {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsCreating(false);
      toast.success("สร้างโพสต์ใหม่สำเร็จ!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-10">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
           <div>
              <h1 className="text-3xl font-bold font-kanit mb-2">Company Feed</h1>
              <p className="text-muted-foreground font-sarabun">แชร์เรื่องราว กิจกรรม และประกาศต่างๆ ของบริษัทเพื่อดึงดูด Talent</p>
           </div>
           {!isCreating && (
              <Button className="gap-2 font-bold font-kanit h-12 shadow-lg shadow-primary/20" onClick={() => setIsCreating(true)}>
                <PlusCircle className="w-5 h-5" /> สร้างโพสต์ใหม่
              </Button>
           )}
        </div>

        {isCreating && (
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             className="mb-8"
           >
              <Card className="p-8 border-none shadow-md">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold font-kanit flex items-center gap-2">
                       <Megaphone className="w-5 h-5 text-primary" /> รายละเอียดโพสต์ใหม่
                    </h2>
                    <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>ยกเลิก</Button>
                 </div>
                 
                 <form onSubmit={handlePost} className="space-y-6 font-sarabun">
                    <div className="grid md:grid-cols-3 gap-6">
                       <div className="md:col-span-2 space-y-4">
                          <div className="space-y-2">
                             <label className="text-sm font-bold">หัวข้อโพสต์ *</label>
                             <Input placeholder="ระบุหัวข้อที่น่าสนใจ..." required />
                          </div>
                          <div className="space-y-2">
                             <label className="text-sm font-bold">ประเภทโพสต์</label>
                             <select className="w-full h-11 px-3 rounded-xl border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                                <option>Story / Work Life</option>
                                <option>Announcement</option>
                                <option>News / Updates</option>
                                <option>Benefit Update</option>
                             </select>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-bold">รูปภาพหน้าปก</label>
                          <div className="h-[120px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/30 transition-colors cursor-pointer group">
                             <ImageIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                             <span className="text-xs font-bold uppercase">อัปโหลดรูปภาพ</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-bold">เนื้อหาโพสต์ *</label>
                       <textarea 
                         className="w-full min-h-[150px] p-4 rounded-xl border border-border bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm leading-relaxed"
                         placeholder="เขียนเนื้อหาที่คุณต้องการแชร์กับผู้สมัคร..."
                         required
                       ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                       <Button variant="outline" type="button" onClick={() => setIsCreating(false)}>ร่างไว้ก่อน (Draft)</Button>
                       <Button className="px-8 font-bold" type="submit" isLoading={isLoading}>เผยแพร่ทันที (Publish)</Button>
                    </div>
                 </form>
              </Card>
           </motion.div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
           <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="ค้นหาโพสต์ของคุณ..." className="pl-10 h-10 border-none shadow-sm" />
           </div>
           <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" className="bg-white border-none shadow-sm gap-2 text-xs font-bold">
                 <Filter className="w-4 h-4" /> กรองข้อมูล
              </Button>
              <select className="bg-white text-xs font-bold p-2.5 rounded-lg border-none shadow-sm focus:ring-1 focus:ring-primary outline-none">
                 <option>แสดงทั้งหมด</option>
                 <option>Published</option>
                 <option>Draft</option>
              </select>
           </div>
        </div>

        {/* Feed List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {MOCK_FEED.map((post) => (
             <Card key={post.id} className="p-0 border-none shadow-sm overflow-hidden flex flex-col md:flex-row group">
                {post.image ? (
                   <div className="md:w-48 h-48 md:h-auto shrink-0 relative overflow-hidden bg-slate-100">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                   </div>
                ) : (
                   <div className="md:w-48 h-48 md:h-auto shrink-0 bg-primary/10 flex flex-col items-center justify-center gap-2 text-primary">
                      <Megaphone className="w-8 h-8 opacity-40" />
                      <span className="text-[10px] font-bold uppercase opacity-60">No Image</span>
                   </div>
                )}
                <div className="p-6 flex-1 flex flex-col gap-4">
                   <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                         <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold uppercase">
                            {post.type}
                         </Badge>
                         <Badge variant={post.status === 'Published' ? 'success' : 'default'} className="text-[10px] font-bold uppercase">
                            {post.status}
                         </Badge>
                      </div>
                      <button className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors">
                         <MoreVertical className="w-4 h-4" />
                      </button>
                   </div>
                   
                   <div className="flex-1">
                      <h3 className="text-lg font-bold font-kanit mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-sarabun font-medium">
                         <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.date}</span>
                         <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {post.views}</span>
                         <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /> {post.likes}</span>
                      </div>
                   </div>

                   <div className="flex items-center gap-2 pt-4 border-t border-border mt-auto">
                      <Button variant="ghost" size="sm" className="flex-1 h-9 text-xs font-bold gap-2">
                         <Edit2 className="w-3.5 h-3.5" /> แก้ไข
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 h-9 text-xs font-bold gap-2">
                         <Share2 className="w-3.5 h-3.5" /> แชร์
                      </Button>
                      <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-destructive hover:bg-destructive/5 rounded-lg">
                         <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                   </div>
                </div>
             </Card>
           ))}

           {/* Empty State / Add New Card */}
           <button 
             onClick={() => setIsCreating(true)}
             className="border-2 border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all group"
           >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                 <PlusCircle className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                 <h3 className="text-lg font-bold font-kanit">แชร์เรื่องราวใหม่</h3>
                 <p className="text-sm text-muted-foreground font-sarabun">เพิ่มโพสต์ใหม่เพื่อดึงดูด Candidate</p>
              </div>
           </button>
        </div>
      </div>
    </div>
  );
}
