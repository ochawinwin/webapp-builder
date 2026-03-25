import { Link } from "react-router";
import { Briefcase, Mail, Phone, MapPin, Facebook, Linkedin, Twitter, Github } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-poppins text-foreground tracking-tight">
                Future<span className="text-primary">Career</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              แพลตฟอร์มหางานและจับคู่อาชีพที่มุ่งเน้นความแม่นยำและตอบโจทย์ทั้งผู้หางานและบริษัท
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-kanit font-bold text-lg mb-6">สำหรับผู้หางาน</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/search" className="text-muted-foreground hover:text-primary transition-colors">ค้นหางาน</Link></li>
              <li><Link to="/search" className="text-muted-foreground hover:text-primary transition-colors">งานแนะนำ</Link></li>
              <li><Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">โปรไฟล์ของฉัน</Link></li>
              <li><Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">��ลัง Resume</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-kanit font-bold text-lg mb-6">สำหรับบริษัท</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/hr/login" className="text-muted-foreground hover:text-primary transition-colors">เข้าสู่ระบบ HR</Link></li>
              <li><Link to="/hr/register" className="text-muted-foreground hover:text-primary transition-colors">ลงทะเบียนบริษัท</Link></li>
              <li><Link to="/hr/dashboard" className="text-muted-foreground hover:text-primary transition-colors">แดชบอร์ดจัดการผู้สมัคร</Link></li>
              <li><Link to="/hr/jobs" className="text-muted-foreground hover:text-primary transition-colors">ลงประกาศงาน</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-kanit font-bold text-lg mb-6">ติดต่อเรา</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span className="text-muted-foreground">123 อาคารฟิวเจอร์ ชั้น 45 กรุงเทพมหานคร 10110</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-muted-foreground">contact@futurecareer.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-muted-foreground">02-123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} FutureCareer Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">นโยบายความเป็นส่วนตัว</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">เงื่อนไขการใช้งาน</Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">คุ้กกี้</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
