import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button, Input, Card, Badge } from "../../components/UI";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { Briefcase, ArrowLeft, Mail, Lock, Eye, EyeOff, User, Building2, CheckCircle, Globe } from "lucide-react";
import { motion } from "motion/react";

export function HRRegister() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    companyName: "",
    adminName: "",
    email: "", 
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("รหัสผ่านไม่ตรงกัน");
      return;
    }
    setIsLoading(true);
    
    try {
      await register(
        "company", 
        formData.email, 
        formData.adminName, 
        formData.companyName
      );
      toast.success("ลงทะเบียนบริษัทสำเร็จ! เราได้ส่งอีเมลยืนยันไปยัง " + formData.email);
      navigate("/hr/dashboard");
    } catch (error) {
      toast.error("ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left side: Graphic/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/90 to-primary/40"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1761912915167-558fa68f16b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjB0ZWFtJTIwYnVpbGRpbmclMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzc0NDIwNzk3fDA&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center opacity-20 mix-blend-soft-light"></div>
        
        <div className="relative z-10 max-w-lg text-white">
          <Link to="/" className="flex items-center gap-2 mb-12 w-fit">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-poppins tracking-tight text-white">FutureCareer <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full uppercase ml-2 tracking-widest">For Company</span></span>
          </Link>
          
          <h2 className="text-5xl font-bold font-kanit mb-6 leading-tight text-white">ยกระดับการสรรหา <br />บุคลากรสู่ดิจิทัล</h2>
          <p className="text-xl text-slate-300 leading-relaxed mb-10 font-sarabun">
            ร่วมเป็นส่วนหนึ่งกับ FutureCareer เพื่อเข้าถึงกลุ่มผู้สมัครที่มีทักษะตรงตามต้องการ 
            และใช้เครื่องมือจัดการผู้สมัครแบบครบวงจรในที่เดียว
          </p>
          
          <div className="flex flex-col gap-5">
             <li className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
               <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center text-success">
                 <CheckCircle className="w-5 h-5" />
               </div>
               <span className="text-white font-sarabun">ระบบ Kanban ATS จัดการสถานะผู้สมัครอย่างเป็นระบบ</span>
             </li>
             <li className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
               <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center text-success">
                 <CheckCircle className="w-5 h-5" />
               </div>
               <span className="text-white font-sarabun">สร้าง Employer Branding ด้วยหน้าโปรไฟล์และ Feed บริษัท</span>
             </li>
             <li className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
               <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center text-success">
                 <CheckCircle className="w-5 h-5" />
               </div>
               <span className="text-white font-sarabun">Custom Prescreening กรองคนเบื้องต้นอัตโนมัติ</span>
             </li>
          </div>
        </div>
      </div>

      {/* Right side: Register Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
        <Link to="/" className="absolute top-8 left-8 lg:hidden flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> กลับหน้าแรก
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold font-kanit mb-3 text-slate-900">ลงทะเบียนบริษัท</h1>
            <p className="text-muted-foreground font-sarabun">สมัครสมาชิกวันนี้เพื่อเริ่มค้นหาผู้ร่วมทีมคนใหม่ของคุณ</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                <Building2 className="w-4 h-4 text-primary" /> ชื่อบริษัท
              </label>
              <Input 
                placeholder="บริษัท เอบีซี เทคโนโลยี จำกัด" 
                required 
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="h-11 border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                <User className="w-4 h-4 text-primary" /> ชื่อ-นามสกุล ผู้ประสานงาน
              </label>
              <Input 
                placeholder="สมปอง ขยันสมัคร" 
                required 
                value={formData.adminName}
                onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                className="h-11 border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-primary" /> อีเมลบริษัท (ใช้สำหรับลงชื่อเข้าใช้)
              </label>
              <Input 
                type="email" 
                placeholder="hr@company.com" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-11 border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                <Lock className="w-4 h-4 text-primary" /> รหัสผ่าน
              </label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="รหัสผ่าน (อย่างน้อย 8 ตัว)" 
                  required 
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-11 border-slate-200 pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">ยืนยันรหัสผ่าน</label>
              <Input 
                type="password" 
                placeholder="ป้อนรหัสผ่านอีกครั้ง" 
                required 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="h-11 border-slate-200"
              />
            </div>

            <div className="flex items-start gap-2 py-2">
              <input type="checkbox" id="hr-terms" required className="mt-1 w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary/20" />
              <label htmlFor="hr-terms" className="text-xs text-slate-500 leading-relaxed font-sarabun">
                ในฐานะตัวแทนบริษัท ฉันยอมรับ <Link to="#" className="text-primary font-bold hover:underline">เงื่อนไขการใช้บริการ</Link> สำหรับพาร์ทเนอร์และนโยบายความเป็นส่วนตัว
              </label>
            </div>

            <Button type="submit" size="lg" className="h-12 mt-2 font-kanit font-bold shadow-lg shadow-primary/20" isLoading={isLoading}>
              ลงทะเบียนบริษัท
            </Button>
          </form>

          <p className="text-center mt-8 text-slate-500 font-sarabun">
            มีบัญชีอยู่แล้ว? <Link to="/hr/login" className="text-primary font-bold hover:underline">เข้าสู่ระบบที่นี่</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
