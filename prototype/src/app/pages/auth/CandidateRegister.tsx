import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button, Input, Card, Badge } from "../../components/UI";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { Briefcase, ArrowLeft, Mail, Lock, Eye, EyeOff, User, Phone, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export function CandidateRegister() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: "", 
    lastName: "",
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
        "candidate", 
        formData.email, 
        `${formData.firstName} ${formData.lastName}`
      );
      toast.success("สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน");
      navigate("/search");
    } catch (error) {
      toast.error("สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left side: Graphic/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent/40"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1727857934741-93f20b9ffe71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzc0NDIwNzkyfDA&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        
        <div className="relative z-10 max-w-lg text-white">
          <Link to="/" className="flex items-center gap-2 mb-12 w-fit">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-poppins tracking-tight text-white">FutureCareer</span>
          </Link>
          
          <h2 className="text-5xl font-bold font-kanit mb-6 leading-tight text-white">เริ่มต้นเส้นทางอาชีพ <br />ในฝันของคุณ</h2>
          <p className="text-xl text-primary-foreground/80 leading-relaxed mb-8 font-sarabun">
            สร้างโปรไฟล์และอัปโหลด Resume ของคุณเพื่อเริ่มจับคู่กับตำแหน่งงานที่ใช่ที่สุด 
            สมัครสมาชิกเพียงครั้งเดียว เข้าถึงงานจากบริษัทชั้นนำทั่วประเทศ
          </p>
          
          <ul className="flex flex-col gap-5">
             <li className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
               <CheckCircle className="w-6 h-6 text-secondary" />
               <span>สมัครงานง่ายด้วย One-Click Apply</span>
             </li>
             <li className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
               <CheckCircle className="w-6 h-6 text-secondary" />
               <span>ระบบ AI แนะนำงานตามทักษะ (Skill Tags)</span>
             </li>
             <li className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
               <CheckCircle className="w-6 h-6 text-secondary" />
               <span>จัดการ Resume และประวัติส่วนตัวได้ในที่เดียว</span>
             </li>
          </ul>
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
            <h1 className="text-3xl font-bold font-kanit mb-3">สมัครสมาชิก (ผู้หางาน)</h1>
            <p className="text-muted-foreground">ลงทะเบียนเพื่อเริ่มต้นการหางานในฝันของคุณ</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> ชื่อ
                </label>
                <Input 
                  placeholder="สมชาย" 
                  required 
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">นามสกุล</label>
                <Input 
                  placeholder="สายรุ้ง" 
                  required 
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> อีเมล
              </label>
              <Input 
                type="email" 
                placeholder="example@mail.com" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
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
                  className="h-11 pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">ยืนยันรหัสผ่าน</label>
              <Input 
                type="password" 
                placeholder="ป้อนรหัสผ่านอีกครั้ง" 
                required 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="flex items-start gap-2 py-2">
              <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 text-primary rounded border-border focus:ring-primary/20" />
              <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed font-sarabun">
                ฉันได้อ่านและยอมรับ <Link to="#" className="text-primary hover:underline">เงื่อนไขการใช้งาน</Link> และ <Link to="#" className="text-primary hover:underline">นโยบายความเป็นส่วนตัว</Link> ของ FutureCareer
              </label>
            </div>

            <Button type="submit" size="lg" className="h-12 mt-2 font-kanit font-bold" isLoading={isLoading}>
              สมัครสมาชิก
            </Button>
          </form>

          <p className="text-center mt-8 text-muted-foreground">
            มีบัญชีอยู่แล้ว? <Link to="/login" className="text-primary font-bold hover:underline">เข้าสู่ระบบที่นี่</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
