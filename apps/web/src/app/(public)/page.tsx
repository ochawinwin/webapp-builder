import Link from "next/link";
import { Card, Badge } from "@futurecareer/ui";
import {
  Briefcase,
  Zap,
  BarChart3,
  Users,
  CheckCircle,
  ArrowRight,
  Search,
  Target,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: <Target className="w-6 h-6 text-primary" />,
    title: "Smart Match",
    description:
      "ระบบจับคู่ทักษะของคุณกับตำแหน่งงานที่ใช่ที่สุดด้วย AI Tags",
  },
  {
    icon: <Zap className="w-6 h-6 text-secondary" />,
    title: "Easy Apply",
    description:
      "สมัครงานง่ายเพียงคลิกเดียว พร้อมจัดการ Resume แบบครบวงจร",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-accent" />,
    title: "Kanban ATS",
    description:
      "ระบบจัดการผู้สมัครแบบ Kanban Board สำหรับบริษัท ติดตามง่ายทุกขั้นตอน",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-success" />,
    title: "Verification",
    description:
      "ยืนยันตัวตนทั้งฝั่งผู้หางานและบริษัท เพื่อความปลอดภัยและเชื่อมั่น",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden isolate">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 bg-gradient-to-br from-white to-primary/5">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-8 max-w-2xl">
            <Badge
              variant="secondary"
              className="w-fit text-sm py-1.5 px-4 font-poppins"
            >
              #1 Job Matching Platform for Future Careers
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold font-kanit text-foreground tracking-tight leading-[1.1]">
              หางานที่ใช่{" "}
              <span className="text-primary italic">ในแบบที่คุณเป็น</span>{" "}
              ด้วย Smart Matching
            </h1>
            <p className="text-xl text-muted-foreground font-sarabun leading-relaxed">
              FutureCareer เชื่อมต่อคุณกับบริษัทชั้นนำผ่านระบบ Tags อัจฉริยะ
              ลดความซับซ้อนในการสมัครงาน
              และเพิ่มความแม่นยำในการหาบุคลากรที่ตรงใจ
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/search"
                className="inline-flex items-center justify-center h-14 px-8 bg-primary text-white rounded-xl text-lg font-kanit font-bold hover:bg-primary/90 transition-colors"
              >
                เริ่มหางานทันที <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/hr/login"
                className="inline-flex items-center justify-center h-14 px-8 border border-border rounded-xl text-lg font-kanit hover:bg-muted transition-colors"
              >
                สำหรับบริษัท / HR
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-6 grayscale opacity-60">
              <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground font-poppins">
                Trusted By:
              </div>
              <div className="flex gap-8 items-center">
                <span className="font-bold text-lg">TECH CORP</span>
                <span className="font-bold text-lg">GLOBAL SOLUTIONS</span>
                <span className="font-bold text-lg">INNOVATE</span>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white transform hover:scale-[1.02] transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1727857934741-93f20b9ffe71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzc0NDIwNzkyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Modern office workspace"
                className="w-full h-auto"
              />
            </div>

            <div className="absolute top-20 -right-8 bg-white p-4 rounded-xl shadow-xl border border-border flex items-center gap-3">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center text-success">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">
                  Matches Found
                </p>
                <p className="text-lg font-bold">12,450+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold font-kanit mb-6 leading-tight">
              ทำไมต้อง FutureCareer?
            </h2>
            <p className="text-lg text-muted-foreground">
              เราออกแบบแพลตฟอร์มมาเพื่อลดช่องว่างระหว่างทักษะและความต้องการของตลาดงาน
              ให้คุณก้าวสู่สายอาชีพที่มั่นคงและตรงความสามารถมากที่สุด
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="p-8 h-full flex flex-col items-center text-center gap-6 border-none shadow-none bg-muted/50 hover:bg-white hover:shadow-xl hover:scale-[1.05] transition-all duration-300"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-border">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold font-kanit">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-[2.5rem] p-12 lg:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform origin-top"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>

            <div className="flex flex-col gap-6 max-w-xl text-white relative z-10 text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-bold font-kanit leading-tight">
                พร้อมเริ่มต้นก้าวแรก <br />
                สู่ความสำเร็จแล้วหรือยัง?
              </h2>
              <p className="text-lg text-primary-foreground/80">
                ไม่ว่าคุณจะเป็นนักศึกษาจบใหม่ หรือผู้เชี่ยวชาญที่มีประสบการณ์
                FutureCareer มีตำแหน่งงานที่ใช่รอคุณอยู่เสมอ
              </p>
              <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center h-14 px-8 bg-secondary text-secondary-foreground rounded-xl text-lg font-bold hover:bg-secondary/90 transition-colors"
                >
                  สมัครสมาชิกฟรี
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center h-14 px-8 bg-white text-primary rounded-xl text-lg hover:bg-white/90 transition-colors"
                >
                  ดูงานที่เปิดรับ
                </Link>
              </div>
            </div>

            <div className="lg:flex-1 grid grid-cols-2 gap-4 relative z-10 w-full lg:w-auto">
              <div className="flex flex-col gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                  <p className="text-3xl font-bold text-white">500+</p>
                  <p className="text-primary-foreground/70 text-sm">
                    บริษัทชั้นนำ
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                  <p className="text-3xl font-bold text-white">2,000+</p>
                  <p className="text-primary-foreground/70 text-sm">
                    ตำแหน่งงานใหม่/เดือน
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                  <p className="text-3xl font-bold text-white">95%</p>
                  <p className="text-primary-foreground/70 text-sm">
                    ความพึงพอใจ
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                  <p className="text-3xl font-bold text-white">10min</p>
                  <p className="text-primary-foreground/70 text-sm">
                    เวลาเฉลี่ยในการสมัคร
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-24 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-kanit mb-16">
            บริษัทที่มองหาบุคลากรกับเรา
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-50 grayscale">
            <div className="flex flex-col items-center">
              <Users className="w-12 h-12 mb-2" />
              <span className="font-bold text-xl font-poppins">TECHGIANT</span>
            </div>
            <div className="flex flex-col items-center">
              <Briefcase className="w-12 h-12 mb-2" />
              <span className="font-bold text-xl font-poppins">INNOVATE.CO</span>
            </div>
            <div className="flex flex-col items-center">
              <Search className="w-12 h-12 mb-2" />
              <span className="font-bold text-xl font-poppins">FINDERS</span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-12 h-12 mb-2" />
              <span className="font-bold text-xl font-poppins">FASTTRACK</span>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-12 h-12 mb-2" />
              <span className="font-bold text-xl font-poppins">TRUSTED</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
