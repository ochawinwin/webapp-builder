import * as React from "react";
import Link from "next/link";
import { Briefcase, Facebook, Linkedin, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#2D1B52] text-white">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="font-poppins text-xl font-bold">
                Future<span className="text-primary">Career</span>
              </span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed">
              แพลตฟอร์มหางานที่เชื่อมผู้หางานกับบริษัทชั้นนำ
              ผ่านนักสรรหาบุคลากรมืออาชีพ
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-primary/80 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-primary/80 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-primary/80 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-primary/80 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* สำหรับผู้หางาน */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide">
              สำหรับผู้หางาน
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/jobs", label: "ค้นหางาน" },
                { href: "/register", label: "สมัครสมาชิก" },
                { href: "/profile", label: "สร้างโปรไฟล์" },
                { href: "/jobs?type=featured", label: "งานแนะนำ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* สำหรับบริษัท */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide">
              สำหรับบริษัท
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/hr/login", label: "เข้าสู่ระบบบริษัท" },
                { href: "/hr/register", label: "ลงทะเบียนบริษัท" },
                { href: "/hr/jobs/new", label: "ลงประกาศงาน" },
                { href: "/hr/dashboard", label: "แดชบอร์ด" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ติดต่อเรา */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide">
              ติดต่อเรา
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: "เกี่ยวกับเรา" },
                { href: "/contact", label: "ติดต่อ" },
                { href: "/privacy", label: "นโยบายความเป็นส่วนตัว" },
                { href: "/terms", label: "ข้อกำหนดการใช้งาน" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} FutureCareer. สงวนลิขสิทธิ์ทุกประการ
          </p>
          <p className="text-xs text-white/50">
            Made with ♡ in Thailand
          </p>
        </div>
      </div>
    </footer>
  );
}
