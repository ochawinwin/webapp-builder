import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button, Input, Card, Badge } from "../../components/UI";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { Briefcase, ArrowLeft, Mail, Lock, Eye, EyeOff, Building2 } from "lucide-react";
import { motion } from "motion/react";

export function HRLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login("company", formData.email, formData.password);
      toast.success("เข้าสู่ระบบ HR สำเร็จ!");
      navigate("/hr/dashboard");
    } catch (error) {
      toast.error("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left side: Graphic/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1761912915167-558fa68f16b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjB0ZWFtJTIwYnVpbGRpbmclMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzc0NDIwNzk3fDA&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center opacity-30 mix-blend-soft-light"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/90 to-primary/40"></div>
        
        <div className="relative z-10 max-w-lg text-white">
          <Link to="/" className="flex items-center gap-2 mb-12 w-fit">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-poppins tracking-tight text-white">FutureCareer <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full uppercase ml-2 tracking-widest">For Company</span></span>
          </Link>
          
          <h2 className="text-5xl font-bold font-kanit mb-6 leading-tight text-white">ค้นหาบุคลากรที่ใช่ <br />ด้วยระบบอัจฉริยะ</h2>
          <p className="text-xl text-slate-300 leading-relaxed mb-8 font-sarabun">
            ยินดีต้อนรับ HR และ Recruiter ทุกท่าน! เข้าใช้งานระบบจัดการผู้สมัคร (ATS) 
            ที่ทันสมัยที่สุด เพื่อสร้างทีมที่มีคุณภาพให้องค์กรของคุณ
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <Building2 className="w-6 h-6 text-primary mb-2" />
              <p className="font-bold text-white">Employer Branding</p>
              <p className="text-xs text-slate-400 font-sarabun">สร้างภาพลักษณ์ที่ดีผ่าน Company Feed</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <Briefcase className="w-6 h-6 text-secondary mb-2" />
              <p className="font-bold text-white">ATS Dashboard</p>
              <p className="text-xs text-slate-400 font-sarabun">จัดการ Candidate ด้วย Kanban Board</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
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
            <Badge variant="secondary" className="mb-4">HR & RECRUITER AREA</Badge>
            <h1 className="text-3xl font-bold font-kanit mb-3 text-slate-900">เข้าสู่ระบบสำหรับบริษัท</h1>
            <p className="text-muted-foreground font-sarabun">ป้อนอีเมลบริษัทและรหัสผ่านเพื่อจัดการประกาศงานของคุณ</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl mb-8 border border-slate-200">
            <Link to="/login" className="flex-1 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 text-center">
              สำหรับผู้หางาน
            </Link>
            <button className="flex-1 py-2 text-sm font-bold rounded-lg bg-white shadow-sm text-primary">
              สำหรับบริษัท
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-primary" /> อีเมลบริษัท
              </label>
              <Input 
                type="email" 
                placeholder="hr@company.com" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                  <Lock className="w-4 h-4 text-primary" /> รหัสผ่าน
                </label>
                <button type="button" className="text-xs text-primary font-bold hover:underline">ลืมรหัสผ่าน?</button>
              </div>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="********" 
                  required 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 border-slate-200 pr-10"
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

            <Button type="submit" size="lg" className="h-12 mt-2 font-kanit font-bold shadow-lg shadow-primary/20" isLoading={isLoading}>
              เข้าสู่ระบบ HR
            </Button>
          </form>

          <p className="text-center mt-10 text-slate-500 font-sarabun">
            ยังไม่ได้ลงทะเบียนบริษัท? <Link to="/hr/register" className="text-primary font-bold hover:underline">สมัครใช้งานที่นี่</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
