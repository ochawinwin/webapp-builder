import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, User, Briefcase, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const Register: React.FC = () => {
  const [role, setRole] = useState<'candidate' | 'company'>('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('รหัสผ่านไม่ตรงกัน');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน');
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-surface">
      {/* Right side: Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20 order-2 lg:order-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft size={16} /> กลับหน้าหลัก
          </Link>
          
          <h2 className="mb-2">สร้างบัญชีใหม่</h2>
          <p className="text-muted-foreground mb-8 text-lg">เริ่มต้นการเดินทางไปกับ FutureCareer</p>

          <div className="flex p-1 bg-muted rounded-xl mb-8">
            <button 
              onClick={() => setRole('candidate')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${role === 'candidate' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <User size={18} />
              ผู้หางาน
            </button>
            <button 
              onClick={() => setRole('company')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${role === 'company' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Briefcase size={18} />
              บริษัท / HR
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold block">อีเมล</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-button focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block">รหัสผ่าน</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="อย่างน้อย 8 ตัวอักษร" 
                  className="w-full pl-12 pr-12 py-3 bg-white border border-border rounded-button focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                  minLength={8}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block">ยืนยันรหัสผ่าน</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-3 bg-white border border-border rounded-button focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input type="checkbox" className="mt-1 w-4 h-4 text-primary border-border rounded-sm focus:ring-primary/20" required id="terms" />
              <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                ฉันยอมรับ <a href="#" className="text-primary font-bold hover:underline">ข้อกำหนดการใช้งาน</a> และ <a href="#" className="text-primary font-bold hover:underline">นโยบายความเป็นส่วนตัว</a>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary text-white py-4 rounded-button font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'สมัครสมาชิก'}
            </button>
          </form>

          <p className="mt-8 text-center text-muted-foreground">
            มีบัญชีอยู่แล้ว? <Link to="/login" className="text-primary font-bold hover:underline">เข้าสู่ระบบ</Link>
          </p>
        </motion.div>
      </div>

      {/* Left side: Graphic (Desktop only) */}
      <div className="hidden lg:flex flex-1 bg-white relative overflow-hidden items-center justify-center p-20 order-1 lg:order-2">
        <div className="relative z-10 max-w-md">
          <h2 className="text-5xl mb-8 leading-tight font-bold">สิ่งที่ได้รับจาก FutureCareer</h2>
          <div className="space-y-8">
            <BenefitItem icon={<CheckCircle2 className="text-success" size={24} />} title="Smart Recommendations" desc="งานแนะนำอิงจากทักษะและโปรไฟล์ของคุณ" />
            <BenefitItem icon={<CheckCircle2 className="text-success" size={24} />} title="Direct Communication" desc="ติดต่อสื่อสารกับบริษัทได้โดยตรงผ่านระบบ" />
            <BenefitItem icon={<CheckCircle2 className="text-success" size={24} />} title="ATS Tracking" desc="ติดตามสถานะการสมัครงานได้แบบ Real-time" />
          </div>
          <div className="mt-16 p-8 bg-surface rounded-2xl border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <p className="italic text-lg text-heading-dark mb-4">"FutureCareer ช่วยให้ผมได้งานที่ตรงกับทักษะ React จริงๆ ระบบ Matching ทำงานได้แม่นยำมากครับ"</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-full overflow-hidden border border-border">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&h=100&auto=format&fit=crop" alt="User" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold">Anurat P.</p>
                <p className="text-sm text-muted-foreground">Frontend Developer</p>
              </div>
            </div>
          </div>
        </div>
        {/* Abstract background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full -z-10 blur-3xl"></div>
      </div>
    </div>
  );
};

const BenefitItem: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <h4 className="font-bold text-lg mb-1">{title}</h4>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  </div>
);

export default Register;
