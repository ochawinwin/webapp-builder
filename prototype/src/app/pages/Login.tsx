import React, { useState } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, User, Briefcase, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [role, setRole] = useState<'candidate' | 'company'>('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { handleLogin } = useOutletContext<{ handleLogin: (u: any) => void }>();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login logic
    setTimeout(() => {
      setIsLoading(false);
      const userData = {
        id: role === 'candidate' ? 'u1' : 'c1',
        email,
        role,
        name: role === 'candidate' ? 'Somchai Jaidee' : 'TechCorp Solutions',
        avatar: role === 'candidate' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=200&h=200&auto=format&fit=crop'
      };
      
      handleLogin(userData);
      toast.success('เข้าสู่ระบบสำเร็จ!');
      
      if (role === 'candidate') {
        navigate('/candidate/dashboard');
      } else {
        navigate('/hr/dashboard');
      }
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-surface">
      {/* Left side: Graphic (Desktop only) */}
      <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden items-center justify-center p-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-primary to-accent opacity-50"></div>
        <div className="relative z-10 text-white max-w-md">
          <h2 className="text-white text-5xl mb-8 leading-tight font-bold">เชื่อมต่อคุณกับ<br/>อาชีพที่ใช่</h2>
          <p className="text-white/80 text-xl leading-relaxed">
            ก้าวเข้าสู่ระบบ FutureCareer เพื่อเริ่มต้นค้นหาโอกาสใหม่ๆ หรือจัดการทีมของคุณอย่างมืออาชีพ
          </p>
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <Briefcase className="text-secondary-foreground" size={24} />
              </div>
              <div>
                <p className="font-bold">บริษัทชั้นนำ</p>
                <p className="text-sm text-white/70">มีงานใหม่ๆ เข้ามาทุกวัน</p>
              </div>
            </div>
          </div>
        </div>
        {/* Abstract shapes */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft size={16} /> กลับหน้าหลัก
          </Link>
          
          <h2 className="mb-2">ยินดีต้อนรับกลับมา</h2>
          <p className="text-muted-foreground mb-8 text-lg">เข้าสู่ระบบเพื่อดำเนินการต่อ</p>

          {/* Role Toggle */}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold block">อีเมล</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-button focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold block">รหัสผ่าน</label>
                <a href="#" className="text-xs text-primary hover:underline font-bold">ลืมรหัสผ่าน?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-3 bg-white border border-border rounded-button focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
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

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary text-white py-4 rounded-button font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <p className="mt-8 text-center text-muted-foreground">
            ยังไม่มีบัญชี? <Link to="/register" className="text-primary font-bold hover:underline">สมัครสมาชิก</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
