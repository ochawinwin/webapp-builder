import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Input, Badge, cn } from "../../components/UI";
import { 
  Building2, Globe, MapPin, Mail, Phone, Users, 
  Upload, CheckCircle2, AlertCircle, Edit2, Camera,
  Link as LinkIcon, Twitter, Linkedin, Facebook
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

export function CompanyProfileSettings() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: "TechCorp Solutions",
    industry: "Software & Technology",
    size: "50-100 คน",
    founded: "2018",
    website: "www.techcorpsolutions.com",
    email: "hr@techcorpsolutions.com",
    phone: "02-123-4567",
    location: "กรุงเทพฯ (MRT พระราม 9)",
    shortBio: "TechCorp Solutions เป็นบริษัทผู้ให้บริการด้านการพัฒนาซอฟต์แวร์แบบครบวงจร ที่มุ่งเน้นการสร้างนวัตกรรมเพื่อขับเคลื่อนธุรกิจในยุคดิจิทัล",
    fullBio: "เราคือทีมงานคนรุ่นใหม่ที่มีความเชี่ยวชาญด้านเทคโนโลยี มุ่งมั่นที่จะส่งมอบคุณค่าให้กับลูกค้าผ่านซอฟต์แวร์ที่มีคุณภาพและใช้งานง่าย วัฒนธรรมองค์กรของเราเน้นความยืดหยุ่น การเรียนรู้ร่วมกัน และการเปิดกว้างสำหรับความคิดสร้างสรรค์ใหม่ๆ",
    logo: "https://images.unsplash.com/photo-1760138270903-d95903188730?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29tcGFueSUyMGxvZ28lMjBidXNpbmVzcyUyMG1vZGVybiUyMG9mZmljZSUyMGljb258ZW58MXx8fHwxNzc0NDIwOTEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    banner: "https://images.unsplash.com/photo-1761912915167-558fa68f16b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjB0ZWFtJTIwYnVpbGRpbmclMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzc0NDIwNzk3fDA&ixlib=rb-4.1.0&q=80&w=1080"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("บันทึกข้อมูลบริษัทเรียบร้อยแล้ว!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
           <div>
              <h1 className="text-3xl font-bold font-kanit mb-2">ตั้งค่าโปรไฟล์บริษัท</h1>
              <p className="text-muted-foreground font-sarabun">ข้อมูลเหล่านี้จะถูกแสดงในหน้า Profile สาธารณะเพื่อดึงดูดผู้สมัคร</p>
           </div>
           <Button className="gap-2 font-bold font-kanit px-8 h-12 shadow-lg shadow-primary/20" onClick={handleSave} isLoading={isSaving}>
             <CheckCircle2 className="w-5 h-5" /> บันทึกการเปลี่ยนแปลง
           </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           {/* Left Column: Branding Assets */}
           <div className="space-y-6">
              <Card className="p-0 border-none shadow-sm overflow-hidden">
                 <div className="h-32 bg-slate-200 relative">
                    <img src={companyData.banner} alt="Banner" className="w-full h-full object-cover" />
                    <button className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-md p-2 rounded-lg text-slate-700 hover:bg-white transition-colors">
                       <Camera className="w-4 h-4" />
                    </button>
                 </div>
                 <div className="px-6 pb-6 text-center -mt-10 relative z-10">
                    <div className="inline-block relative">
                       <div className="w-24 h-24 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden flex items-center justify-center">
                          <img src={companyData.logo} alt="Logo" className="w-full h-full object-cover" />
                       </div>
                       <button className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform">
                          <Edit2 className="w-3 h-3" />
                       </button>
                    </div>
                    <h3 className="text-xl font-bold font-kanit mt-4">{companyData.name}</h3>
                    <p className="text-sm text-muted-foreground font-sarabun">{companyData.industry}</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                       <Badge variant="secondary" className="bg-primary/5 text-primary border-none">Verified</Badge>
                       <Badge variant="secondary" className="bg-success/5 text-success border-none">Premium Partner</Badge>
                    </div>
                 </div>
              </Card>

              <Card className="p-6 border-none shadow-sm">
                 <h4 className="font-bold font-kanit mb-4 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-primary" /> โซเชียลมีเดีย
                 </h4>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-muted-foreground">Facebook</label>
                       <Input placeholder="facebook.com/company" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-muted-foreground">LinkedIn</label>
                       <Input placeholder="linkedin.com/company" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase text-muted-foreground">Twitter (X)</label>
                       <Input placeholder="twitter.com/company" />
                    </div>
                 </div>
              </Card>
           </div>

           {/* Right Column: Profile Details */}
           <div className="lg:col-span-2 space-y-6">
              <Card className="p-8 border-none shadow-sm font-sarabun">
                 <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-6">
                       <h4 className="font-bold font-kanit text-lg border-b border-border pb-2">ข้อมูลเบื้องต้น</h4>
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-sm font-bold">ชื่อบริษัท *</label>
                             <Input defaultValue={companyData.name} required />
                          </div>
                          <div className="space-y-2">
                             <label className="text-sm font-bold">อุตสาหกรรม *</label>
                             <select className="w-full h-11 px-3 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm">
                                <option>Software & Technology</option>
                                <option>Finance & Banking</option>
                                <option>Education</option>
                                <option>Healthcare</option>
                                <option>E-commerce</option>
                             </select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-sm font-bold">ขนาดองค์กร</label>
                                <Input defaultValue={companyData.size} />
                             </div>
                             <div className="space-y-2">
                                <label className="text-sm font-bold">ปีที่ก่อตั้ง</label>
                                <Input defaultValue={companyData.founded} />
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h4 className="font-bold font-kanit text-lg border-b border-border pb-2">ช่องทางติดต่อ</h4>
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-sm font-bold flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> เว็บไซต์</label>
                             <Input defaultValue={companyData.website} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-sm font-bold flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> อีเมลติดต่อ</label>
                             <Input defaultValue={companyData.email} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-sm font-bold flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> เบอร์โทรศัพท์</label>
                             <Input defaultValue={companyData.phone} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-sm font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> สำนักงานใหญ่</label>
                             <Input defaultValue={companyData.location} />
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <h4 className="font-bold font-kanit text-lg border-b border-border pb-2">คำอธิบายบริษัท</h4>
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <label className="text-sm font-bold">คำอธิบายสั้นๆ (Short Bio) *</label>
                          <textarea 
                            className="w-full min-h-[80px] p-4 rounded-xl border border-border bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm leading-relaxed"
                            placeholder="ระบุสโลแกนหรือคำบรรยายสั้นๆ ที่น่าสนใจ..."
                            defaultValue={companyData.shortBio}
                            required
                          ></textarea>
                          <p className="text-xs text-muted-foreground text-right">0/150 ตัวอักษร</p>
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-bold">รายละเอียดบริษัทฉบับเต็ม (Full Bio)</label>
                          <textarea 
                            className="w-full min-h-[150px] p-4 rounded-xl border border-border bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm leading-relaxed"
                            placeholder="บรรยายความเป็นมา วัฒนธรรมองค์กร และวิสัยทัศน์ของคุณ..."
                            defaultValue={companyData.fullBio}
                          ></textarea>
                       </div>
                    </div>
                 </div>

                 <div className="mt-10 p-6 bg-primary/5 rounded-2xl border border-primary/20 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div>
                       <h4 className="font-bold text-primary mb-1">ข้อมูลบริษัทเป็นสาธารณะ</h4>
                       <p className="text-sm text-primary/80 leading-relaxed">
                          โปรดตรวจสอบข้อมูลให้ถูกต้องก่อนบันทึก เนื่องจากการมีโปรไฟล์ที่สมบูรณ์และเป็นมืออาชีพ จะช่วยเพิ่มโอกาสให้ผู้สมัครที่มีคุณภาพสนใจร่วมงานกับคุณมากขึ้นถึง 40%
                       </p>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
}
