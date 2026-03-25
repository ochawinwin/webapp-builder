import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Input, Button, Card, Badge, cn } from "../components/UI";
import { JobCard, type Job } from "../components/JobCard";
import { Search, Filter, SlidersHorizontal, MapPin, Briefcase, ChevronDown, Check, X, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";

const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer (React)",
    companyName: "TechCorp Solutions",
    location: "กรุงเทพฯ (MRT พระราม 9)",
    salary: "80,000 - 120,000 บาท",
    type: "Full-time",
    level: "Senior",
    tags: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    postedAt: "2 ชม. ที่แล้ว",
    isNew: true,
    isRecommended: true,
  },
  {
    id: "2",
    title: "Backend Engineer (Node.js)",
    companyName: "Innovate.co",
    location: "Remote / กรุงเทพฯ",
    salary: "60,000 - 90,000 บาท",
    type: "Full-time",
    level: "Middle",
    tags: ["Node.js", "Express", "PostgreSQL", "AWS"],
    postedAt: "5 ชม. ที่แล้ว",
    isNew: true,
    isRecommended: true,
  },
  {
    id: "3",
    title: "UI/UX Designer",
    companyName: "Creative Pixel",
    location: "กรุงเทพฯ (BTS สยาม)",
    salary: "45,000 - 70,000 บาท",
    type: "Full-time",
    level: "Middle",
    tags: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    postedAt: "1 วันที่แล้ว",
    isRecommended: false,
  },
  {
    id: "4",
    title: "Product Manager",
    companyName: "FastTrack",
    location: "กรุงเทพฯ (ทองหล่อ)",
    salary: "100,000 - 150,000 บาท",
    type: "Full-time",
    level: "Senior",
    tags: ["Product Roadmap", "Agile", "Stakeholder Management"],
    postedAt: "2 วันที่แล้ว",
  },
  {
    id: "5",
    title: "Junior Fullstack Developer",
    companyName: "Startup Hub",
    location: "กรุงเทพฯ (สามย่าน)",
    salary: "35,000 - 50,000 บาท",
    type: "Full-time",
    level: "Junior",
    tags: ["React", "Node.js", "MongoDB"],
    postedAt: "3 วันที่แล้ว",
  },
  {
    id: "6",
    title: "Marketing Lead",
    companyName: "Global Solutions",
    location: "กรุงเทพฯ (สีลม)",
    salary: "70,000 - 100,000 บาท",
    type: "Full-time",
    level: "Senior",
    tags: ["Digital Marketing", "SEO", "Content Strategy"],
    postedAt: "4 วันที่แล้ว",
  },
];

const JOB_TYPES = ["Full-time", "Contract", "Freelance", "Internship"];
const EXPERIENCE_LEVELS = ["Junior", "Middle", "Senior", "Lead", "Intern"];
const INDUSTRIES = ["Tech", "Finance", "Education", "Healthcare", "Creative", "E-commerce"];

export function JobSearch() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredJobs = useMemo(() => {
    let result = MOCK_JOBS.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);
      const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(job.level);
      return matchesSearch && matchesType && matchesLevel;
    });

    // Personalized Match Logic: Sort by tag matches if user is logged in
    if (user && user.tags && user.tags.length > 0) {
      result = [...result].sort((a, b) => {
        const aMatches = a.tags.filter(tag => user.tags?.includes(tag)).length;
        const bMatches = b.tags.filter(tag => user.tags?.includes(tag)).length;
        return bMatches - aMatches;
      });
      
      // Also mark as recommended if there's any tag match
      result = result.map(job => ({
        ...job,
        isRecommended: job.tags.some(tag => user.tags?.includes(tag))
      }));
    }

    return result;
  }, [searchQuery, selectedTypes, selectedLevels, user]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]);
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedLevels([]);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Top Search Banner */}
      <div className="bg-white border-b border-border pt-12 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <h1 className="text-3xl lg:text-4xl font-bold font-kanit">ค้นหางานที่ใช่สำหรับคุณ</h1>
            <div className="flex flex-col md:flex-row gap-3 p-2 bg-muted rounded-2xl border border-border/50 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <div className="flex-1 relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="ตำแหน่งงาน, ทักษะ หรือ ชื่อบริษัท..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-transparent border-none shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="w-px bg-border/50 hidden md:block"></div>
              <div className="flex-1 relative flex items-center">
                <MapPin className="absolute left-4 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="สถานที่ปฏิบัติงาน..." 
                  className="pl-12 h-12 bg-transparent border-none shadow-none focus-visible:ring-0"
                />
              </div>
              <Button size="lg" className="h-12 px-8 font-kanit font-bold rounded-xl">
                ค้นหา
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted-foreground font-medium">แท็กยอดนิยม:</span>
              <button onClick={() => setSearchQuery("React")} className="text-xs px-3 py-1 bg-primary/5 text-primary rounded-full font-bold hover:bg-primary/10 transition-colors">#React</button>
              <button onClick={() => setSearchQuery("UI/UX")} className="text-xs px-3 py-1 bg-primary/5 text-primary rounded-full font-bold hover:bg-primary/10 transition-colors">#UI/UX</button>
              <button onClick={() => setSearchQuery("Remote")} className="text-xs px-3 py-1 bg-primary/5 text-primary rounded-full font-bold hover:bg-primary/10 transition-colors">#Remote</button>
              <button onClick={() => setSearchQuery("Senior")} className="text-xs px-3 py-1 bg-primary/5 text-primary rounded-full font-bold hover:bg-primary/10 transition-colors">#Senior</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={cn(
            "lg:w-72 shrink-0 space-y-8 lg:block",
            isSidebarOpen ? "block" : "hidden"
          )}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold font-kanit text-lg flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" /> ตัวกรอง
              </h3>
              <button onClick={clearFilters} className="text-xs text-primary font-bold hover:underline">ล้างทั้งหมด</button>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">ประเภทงาน</h4>
              <div className="flex flex-col gap-2">
                {JOB_TYPES.map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <div 
                      onClick={() => toggleType(type)}
                      className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                        selectedTypes.includes(type) ? "bg-primary border-primary" : "border-border group-hover:border-primary"
                      )}
                    >
                      {selectedTypes.includes(type) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">ระดับประสบการณ์</h4>
              <div className="flex flex-col gap-2">
                {EXPERIENCE_LEVELS.map(level => (
                  <label key={level} className="flex items-center gap-3 cursor-pointer group">
                    <div 
                      onClick={() => toggleLevel(level)}
                      className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                        selectedLevels.includes(level) ? "bg-primary border-primary" : "border-border group-hover:border-primary"
                      )}
                    >
                      {selectedLevels.includes(level) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm font-medium">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
               <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">ช่วงเงินเดือน (บาท)</h4>
               <div className="flex items-center gap-2">
                 <Input placeholder="Min" className="h-9 text-xs" />
                 <span className="text-muted-foreground">-</span>
                 <Input placeholder="Max" className="h-9 text-xs" />
               </div>
            </div>
            
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
               <p className="text-xs font-bold text-primary mb-2 flex items-center gap-1.5"><Star className="w-3.5 h-3.5 fill-current" /> Personalized Match</p>
               {user ? (
                 <>
                   <p className="text-xs text-primary/80 leading-relaxed font-sarabun mb-2">
                     เรากำลังแสดงงานที่ตรงกับทักษะของคุณ: 
                     <span className="font-bold ml-1">{user.tags?.join(", ")}</span>
                   </p>
                   <Link to="/profile" className="text-xs font-bold text-primary hover:underline">
                     ปรับแต่งทักษะของคุณ →
                   </Link>
                 </>
               ) : (
                 <>
                   <p className="text-xs text-primary/80 leading-relaxed font-sarabun">
                     ลงชื่อเข้าใช้เพื่อดูตำแหน่งงานที่ระบบคัดกรองมาให้ตรงกับทักษะของคุณโดยเฉพาะ
                   </p>
                   <Link to="/login" className="mt-3 block text-xs font-bold text-primary hover:underline">
                     เข้าสู่ระบบเพื่อใช้งาน →
                   </Link>
                 </>
               )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <p className="font-medium text-muted-foreground">พบทั้งหมด <span className="text-foreground font-bold">{filteredJobs.length}</span> ตำแหน่งงาน</p>
              <div className="flex items-center gap-3">
                 <Button 
                   variant="outline" 
                   size="sm" 
                   className="lg:hidden flex items-center gap-2"
                   onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                 >
                   <Filter className="w-4 h-4" /> ตัวกรอง
                 </Button>
                 <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground hidden sm:block">เรียงตาม:</span>
                    <button className="flex items-center gap-1.5 font-bold hover:text-primary transition-colors">
                       อัปเดตล่าสุด <ChevronDown className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-12 text-center border border-dashed border-border flex flex-col items-center justify-center gap-6"
                >
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                    <Search className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-kanit mb-2">ไม่พบงานที่ค้นหา</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      ลองใช้คำค้นหาอื่น หรือล้างตัวกรองเพื่อดูงานทั้งหมดในระบบ
                    </p>
                  </div>
                  <Button variant="outline" onClick={clearFilters}>ล้างตัวกรองทั้งหมด</Button>
                </motion.div>
              )}
            </AnimatePresence>

            {filteredJobs.length > 0 && (
              <div className="mt-12 flex justify-center gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="primary" size="sm">1</Button>
                <Button variant="ghost" size="sm">2</Button>
                <Button variant="ghost" size="sm">3</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
