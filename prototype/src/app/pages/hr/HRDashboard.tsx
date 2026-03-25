import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Badge, cn } from "../../components/UI";
import { 
  Users, Briefcase, TrendingUp, CheckCircle2, Clock, 
  MessageSquare, LayoutDashboard, PlusCircle, ArrowUpRight,
  MoreVertical, ChevronRight, BarChart3, PieChart
} from "lucide-react";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { getApplications, type Application } from "../../lib/mockData";

const MOCK_STATS = [
  { label: "ผู้สมัครทั้งหมด", value: "248", icon: Users, color: "text-primary bg-primary/10", trend: "+12%" },
  { label: "ตำแหน่งที่เปิดรับ", value: "12", icon: Briefcase, color: "text-secondary-foreground bg-secondary/20", trend: "+2" },
  { label: "สัมภาษณ์แล้ว", value: "45", icon: CheckCircle2, color: "text-success bg-success/10", trend: "+5" },
  { label: "รอการพิจารณา", value: "18", icon: Clock, color: "text-warning bg-warning/10", trend: "-3" },
];

const CHART_DATA = [
  { name: "Mon", applicants: 12, views: 45 },
  { name: "Tue", applicants: 19, views: 52 },
  { name: "Wed", applicants: 15, views: 48 },
  { name: "Thu", applicants: 22, views: 61 },
  { name: "Fri", applicants: 30, views: 75 },
  { name: "Sat", applicants: 10, views: 30 },
  { name: "Sun", applicants: 8, views: 25 },
];

export function HRDashboard() {
  const { user } = useAuth();
  const [latestApplications, setLatestApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (user && user.role === "company") {
      const apps = getApplications();
      // Only show apps for jobs belonging to this company (mocking company jobs)
      setLatestApplications(apps.slice(-4).reverse());
    }
  }, [user]);

  if (!user || user.role !== "company") {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-kanit mb-4">เข้าถึงได้เฉพาะบัญชีบริษัทเท่านั้น</h2>
        <Button onClick={() => window.location.href = "/hr/login"}>ไปที่หน้าเข้าสู่ระบบ HR</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-10">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
           <div>
              <h1 className="text-3xl font-bold font-kanit mb-2">ยินดีต้อนรับกลับมา, {user.name} 👋</h1>
              <p className="text-muted-foreground font-sarabun">นี่คือภาพรวมการสรรหาบุคลากรของบริษัทคุณในรอบ 7 วันที่ผ่านมา</p>
           </div>
           <div className="flex items-center gap-3">
              <Link to="/hr/jobs">
                <Button variant="outline" className="gap-2 font-bold font-kanit">
                  <Briefcase className="w-4 h-4" /> ดูประกาศงานทั้งหมด
                </Button>
              </Link>
              <Link to="/hr/jobs">
                <Button className="gap-2 font-bold font-kanit shadow-lg shadow-primary/20">
                  <PlusCircle className="w-4 h-4" /> สร้างประกาศงานใหม่
                </Button>
              </Link>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {MOCK_STATS.map((stat, idx) => (
            <Card key={idx} className="p-6 border-none shadow-sm hover:shadow-md transition-shadow">
               <div className="flex items-center justify-between mb-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.color)}>
                     <stat.icon className="w-6 h-6" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-bold",
                    stat.trend.startsWith("+") ? "text-success" : "text-destructive"
                  )}>
                    {stat.trend} <TrendingUp className="w-3 h-3" />
                  </div>
               </div>
               <div>
                  <h3 className="text-3xl font-bold font-poppins">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground font-kanit font-bold">{stat.label}</p>
               </div>
            </Card>
          ))}
        </div>

        {/* Main Content Sections */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Charts Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 border-none shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold font-kanit flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" /> สถิติผู้สมัครและยอดเข้าชม
                  </h3>
                  <select className="bg-muted text-xs font-bold p-2 rounded-lg border-none focus:ring-1 focus:ring-primary outline-none">
                     <option>สัปดาห์นี้</option>
                     <option>เดือนนี้</option>
                     <option>ทั้งหมด</option>
                  </select>
               </div>
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        cursor={{ fill: 'rgba(154, 82, 228, 0.05)' }}
                      />
                      <Bar dataKey="applicants" fill="#9A52E4" radius={[4, 4, 0, 0]} name="ผู้สมัคร" />
                      <Bar dataKey="views" fill="#F1CB46" radius={[4, 4, 0, 0]} name="ยอดเข้าชม" />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </Card>

            <Card className="p-8 border-none shadow-sm overflow-hidden">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold font-kanit flex items-center gap-2">
                    <Clock className="w-5 h-5 text-secondary-foreground" /> ผู้สมัครล่าสุด
                  </h3>
                  <Link to="/hr/jobs" className="text-xs font-bold text-primary hover:underline">ดูทั้งหมด →</Link>
               </div>
               <div className="overflow-x-auto -mx-8">
                  <table className="w-full text-left font-sarabun">
                    <thead>
                       <tr className="bg-muted/50 border-y border-border">
                          <th className="px-8 py-3 text-xs font-bold text-muted-foreground uppercase">ผู้สมัคร</th>
                          <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase">ตำแหน่ง</th>
                          <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase">สถานะ</th>
                          <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase">วันที่</th>
                          <th className="px-8 py-3 text-xs font-bold text-muted-foreground uppercase text-right">จัดการ</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                       {latestApplications.length > 0 ? latestApplications.map((item, idx) => (
                         <tr key={idx} className="hover:bg-muted/30 transition-colors group">
                           <td className="px-8 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs uppercase">
                                   {item.candidateAvatar}
                                 </div>
                                 <span className="font-bold text-sm">{item.candidateName}</span>
                              </div>
                           </td>
                           <td className="px-4 py-4 text-sm font-medium">{item.jobTitle}</td>
                           <td className="px-4 py-4">
                              <Badge variant={item.status === 'new' ? 'secondary' : item.status === 'reviewing' ? 'warning' : 'success'} className="text-[10px] uppercase font-bold">
                                {item.status}
                              </Badge>
                           </td>
                           <td className="px-4 py-4 text-xs text-muted-foreground">{new Date(item.appliedAt).toLocaleDateString('th-TH')}</td>
                           <td className="px-8 py-4 text-right">
                              <Link to={`/hr/ats/${item.jobId}`}>
                                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 rounded-full">
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </Link>
                           </td>
                         </tr>
                       )) : (
                         [
                           { name: "สมชาย รักดี", role: "Senior Frontend Dev", status: "New", date: "10 นาทีที่แล้ว" },
                           { name: "วิภาวดี ตั้งใจ", role: "UI/UX Designer", status: "Reviewing", date: "2 ชม. ที่แล้ว" },
                           { name: "กิตติพงษ์ มั่นคง", role: "Backend Engineer", status: "Interview", date: "5 ชม. ที่แล้ว" },
                           { name: "อารยา สดใส", role: "Senior Frontend Dev", status: "New", date: "1 วันที่แล้ว" },
                         ].map((item, idx) => (
                           <tr key={idx} className="hover:bg-muted/30 transition-colors group">
                             <td className="px-8 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs uppercase">
                                     {item.name.charAt(0)}
                                   </div>
                                   <span className="font-bold text-sm">{item.name}</span>
                                </div>
                             </td>
                             <td className="px-4 py-4 text-sm font-medium">{item.role}</td>
                             <td className="px-4 py-4">
                                <Badge variant={item.status === 'New' ? 'secondary' : item.status === 'Reviewing' ? 'warning' : 'success'} className="text-[10px] uppercase font-bold">
                                  {item.status}
                                </Badge>
                             </td>
                             <td className="px-4 py-4 text-xs text-muted-foreground">{item.date}</td>
                             <td className="px-8 py-4 text-right">
                                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 rounded-full">
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                             </td>
                           </tr>
                         ))
                       )}
                    </tbody>
                  </table>
               </div>
            </Card>
          </div>

          {/* Right Column: Mini Stats & Actions */}
          <div className="space-y-6">
            <Card className="p-6 border-none shadow-sm bg-primary text-white overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
               <div className="relative z-10">
                  <h4 className="font-bold font-kanit text-lg mb-2">สรุปตำแหน่งงาน</h4>
                  <p className="text-primary-foreground/80 text-sm font-sarabun mb-6">คุณเปิดรับสมัครงานรวม 12 ตำแหน่ง มียอดผู้สนใจเฉลี่ยตำแหน่งละ 20 คน</p>
                  
                  <div className="space-y-4">
                     <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold mb-1">
                           <span>ตำแหน่งที่ได้คนแล้ว (8)</span>
                           <span>67%</span>
                        </div>
                        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                           <div className="bg-secondary h-full w-[67%]"></div>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold mb-1">
                           <span>ตำแหน่งที่กำลังเปิดรับ (4)</span>
                           <span>33%</span>
                        </div>
                        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                           <div className="bg-accent h-full w-[33%]"></div>
                        </div>
                     </div>
                  </div>
                  
                  <Button variant="secondary" className="w-full mt-8 font-bold text-xs uppercase tracking-wider">
                    จัดการตำแหน่งงาน
                  </Button>
               </div>
            </Card>

            <Card className="p-6 border-none shadow-sm">
               <h4 className="font-bold font-kanit mb-4 flex items-center gap-2">
                 <MessageSquare className="w-4 h-4 text-primary" /> ประกาศสำคัญ (Feed)
               </h4>
               <div className="space-y-4">
                  {[
                    { title: "กิจกรรม Outing ประจำปี", date: "3 วันที่แล้ว", views: 120 },
                    { title: "รับสมัคร Internship Batch #3", date: "1 สัปดาห์ที่แล้ว", views: 450 },
                  ].map((post, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                       <p className="font-bold text-sm mb-1">{post.title}</p>
                       <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase font-bold">
                          <span>{post.date}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {post.views} views</span>
                       </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full text-xs font-bold border-dashed">
                    <PlusCircle className="w-3 h-3 mr-2" /> สร้างโพสต์ใหม่
                  </Button>
               </div>
            </Card>
            
            <Card className="p-6 border-none shadow-sm bg-secondary/10 border-secondary/30 border">
               <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary-foreground shrink-0">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm font-kanit mb-1">แชร์โปรไฟล์บริษัทของคุณ</h4>
                    <p className="text-xs text-muted-foreground font-sarabun leading-relaxed mb-3">
                      ช่วยเพิ่มโอกาสให้คนรู้จักบริษัทคุณมากขึ้น และดึงดูด Talent ที่ใช่
                    </p>
                    <Button variant="secondary" size="sm" className="w-full text-[10px] font-bold uppercase py-1">คัดลอกลิงก์โปรไฟล์</Button>
                  </div>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
