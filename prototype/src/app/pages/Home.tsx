import React from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Briefcase, Target, Zap, Layout, Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center lg:text-left z-10"
            >
              <h1 className="mb-6 font-heading font-bold">
                Find your next career with <span className="text-primary">Personalized Match</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                FutureCareer เป็นแพลตฟอร์มหางานที่มุ่งเน้นความแม่นยำ ช่วยแนะนำงานที่เหมาะสมกับทักษะและตัวตนของคุณที่สุด พร้อมระบบจัดการผู้สมัครอัจฉริยะสำหรับบริษัท
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => navigate('/search')}
                  className="bg-primary text-white px-8 py-4 rounded-button font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  <Search size={20} />
                  หางานทันที
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-secondary text-secondary-foreground px-8 py-4 rounded-button font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  สำหรับบริษัท / HR
                </button>
              </div>
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Verified Jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Smart Match</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Easy Apply</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1757405934467-21fc25c60660?q=80&w=800&auto=format&fit=crop" 
                  alt="Professional Collaboration" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Background Shapes */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full -z-10 blur-3xl"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full -z-10 blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-accent/10 rounded-full -z-10 blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4">ทำไมต้อง FutureCareer?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              เราออกแบบแพลตฟอร์มมาเพื่อแก้ปัญหาการหางานที่ไม่ตรงกับทักษะ และลดความยุ่งยากในกระบวนการคัดกรองผู้สมัคร
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Target className="text-primary" size={32} />}
              title="Personalized Match"
              description="ระบบแนะนำงานที่ตรงกับทักษะ ประสบการณ์ และความสนใจของคุณด้วยระบบ Tag อัจฉริยะ"
            />
            <FeatureCard 
              icon={<Zap className="text-primary" size={32} />}
              title="Easy Apply"
              description="สมัครงานได้รวดเร็วเพียงปลายนิ้ว พร้อมระบบ Resume Management และการตอบคำถามคัดกรองเบื้องต้น"
            />
            <FeatureCard 
              icon={<Layout className="text-primary" size={32} />}
              title="Kanban ATS"
              description="ระบบบริหารจัดการผู้สมัครสำหรับบริษัทในรูปแบบ Kanban Board ให้คุณคัดกรองผู้สมัครได้อย่างมืออาชีพ"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 lg:p-20 text-center border border-white/20">
            <h2 className="text-white mb-6">พร้อมเริ่มต้นก้าวต่อไปของอาชีพคุณหรือยัง?</h2>
            <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">
              เข้าร่วมกับผู้ใช้กว่า 10,000 คน และบริษัทชั้นนำที่ใช้ FutureCareer ในการค้นหาโอกาสที่ดีที่สุด
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-white text-primary px-10 py-4 rounded-button font-bold text-lg hover:bg-surface transition-all">
                สร้างโปรไฟล์หางาน
              </Link>
              <Link to="/search" className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-button font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                ค้นหางาน <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-card border border-border hover:shadow-xl transition-all"
  >
    <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export default Home;
