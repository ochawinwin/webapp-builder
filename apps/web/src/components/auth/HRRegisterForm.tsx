"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button, Input } from "@futurecareer/ui";
import { registerCompanyAction } from "@/app/actions/auth.actions";
import {
  Briefcase,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export function HRRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    startTransition(async () => {
      const result = await registerCompanyAction(formData);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error ?? "ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่");
      }
    });
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center space-y-6"
        >
          <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-3xl font-bold font-kanit">ลงทะเบียนสำเร็จ!</h2>
          <p className="text-muted-foreground font-sarabun">
            กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตนก่อนเข้าใช้งาน
          </p>
          <Link href="/hr/login">
            <Button className="w-full font-kanit">ไปที่หน้าเข้าสู่ระบบ HR</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/90 to-primary/40"></div>
        <div
          className="absolute top-0 right-0 w-full h-full bg-cover bg-center opacity-20 mix-blend-soft-light"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1761912915167-558fa68f16b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjB0ZWFtJTIwYnVpbGRpbmclMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzc0NDIwNzk3fDA&ixlib=rb-4.1.0&q=80&w=1080')",
          }}
        />

        <div className="relative z-10 max-w-lg text-white">
          <Link href="/" className="flex items-center gap-2 mb-12 w-fit">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-poppins tracking-tight text-white">
              FutureCareer{" "}
              <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full uppercase ml-2 tracking-widest">
                For Company
              </span>
            </span>
          </Link>

          <h2 className="text-5xl font-bold font-kanit mb-6 leading-tight text-white">
            ยกระดับการสรรหา <br />
            บุคลากรสู่ดิจิทัล
          </h2>
          <p className="text-xl text-slate-300 leading-relaxed mb-10 font-sarabun">
            ร่วมเป็นส่วนหนึ่งกับ FutureCareer
            เพื่อเข้าถึงกลุ่มผู้สมัครที่มีทักษะตรงตามต้องการ
          </p>

          <div className="flex flex-col gap-5">
            {[
              "ระบบ Kanban ATS จัดการสถานะผู้สมัครอย่างเป็นระบบ",
              "สร้าง Employer Branding ด้วยหน้าโปรไฟล์และ Feed บริษัท",
              "Custom Prescreening กรองคนเบื้องต้นอัตโนมัติ",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10"
              >
                <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center text-success">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-white font-sarabun">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
        <Link
          href="/"
          className="absolute top-8 left-8 lg:hidden flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> กลับหน้าแรก
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold font-kanit mb-3 text-slate-900">
              ลงทะเบียนบริษัท
            </h1>
            <p className="text-muted-foreground font-sarabun">
              สมัครสมาชิกวันนี้เพื่อเริ่มค้นหาผู้ร่วมทีมคนใหม่ของคุณ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                <Building2 className="w-4 h-4 text-primary" /> ชื่อบริษัท
              </label>
              <Input
                name="company_name"
                placeholder="บริษัท เอบีซี เทคโนโลยี จำกัด"
                required
                className="h-11 border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">อุตสาหกรรม *</label>
                <select
                  name="industry"
                  required
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                >
                  <option value="">เลือก</option>
                  <option value="Software & Technology">Software & Technology</option>
                  <option value="Finance & Banking">Finance & Banking</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Media & Entertainment">Media & Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">ขนาดองค์กร *</label>
                <select
                  name="size"
                  required
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                >
                  <option value="">เลือก</option>
                  <option value="1-10">1-10 คน</option>
                  <option value="11-50">11-50 คน</option>
                  <option value="51-200">51-200 คน</option>
                  <option value="201-500">201-500 คน</option>
                  <option value="501-1000">501-1,000 คน</option>
                  <option value="1000+">1,000+ คน</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-primary" /> อีเมลบริษัท
              </label>
              <Input
                type="email"
                name="email"
                placeholder="hr@company.com"
                required
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
                  name="password"
                  placeholder="รหัสผ่าน (8+ ตัว, มีตัวพิมพ์ใหญ่และตัวเลข)"
                  required
                  minLength={8}
                  className="h-11 border-slate-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                ยืนยันรหัสผ่าน
              </label>
              <Input
                type="password"
                name="confirm_password"
                placeholder="ป้อนรหัสผ่านอีกครั้ง"
                required
                className="h-11 border-slate-200"
              />
            </div>

            <div className="flex items-start gap-2 py-2">
              <input
                type="checkbox"
                id="hr-terms"
                required
                className="mt-1 w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary/20"
              />
              <label
                htmlFor="hr-terms"
                className="text-xs text-slate-500 leading-relaxed font-sarabun"
              >
                ในฐานะตัวแทนบริษัท ฉันยอมรับ{" "}
                <Link href="#" className="text-primary font-bold hover:underline">
                  เงื่อนไขการใช้บริการ
                </Link>{" "}
                สำหรับพาร์ทเนอร์และนโยบายความเป็นส่วนตัว
              </label>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/5 p-3 rounded-xl">
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="h-12 mt-2 font-kanit font-bold shadow-lg shadow-primary/20"
              disabled={isPending}
            >
              {isPending ? "กำลังลงทะเบียน..." : "ลงทะเบียนบริษัท"}
            </Button>
          </form>

          <p className="text-center mt-8 text-slate-500 font-sarabun">
            มีบัญชีอยู่แล้ว?{" "}
            <Link
              href="/hr/login"
              className="text-primary font-bold hover:underline"
            >
              เข้าสู่ระบบที่นี่
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
