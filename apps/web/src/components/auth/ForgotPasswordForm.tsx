"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button, Input } from "@futurecareer/ui";
import { sendPasswordResetAction } from "@/app/actions/auth.actions";
import { Briefcase, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await sendPasswordResetAction(formData);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left side: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div
          className="absolute top-0 right-0 w-full h-full bg-cover bg-center opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1761912915167-558fa68f16b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjB0ZWFtJTIwYnVpbGRpbmclMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzc0NDIwNzk3fDA&ixlib=rb-4.1.0&q=80&w=1080')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent/40"></div>

        <div className="relative z-10 max-w-lg text-white">
          <Link href="/" className="flex items-center gap-2 mb-12 w-fit">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-poppins tracking-tight">
              FutureCareer
            </span>
          </Link>

          <h2 className="text-5xl font-bold font-kanit mb-6 leading-tight">
            รีเซ็ตรหัสผ่าน
            <br />
            ของคุณ
          </h2>
          <p className="text-xl text-primary-foreground/80 leading-relaxed mb-8 font-sarabun">
            ใส่อีเมลที่ใช้สมัครสมาชิก
            เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้คุณทันที
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-secondary">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">ส่งลิงก์ผ่านอีเมล</p>
                <p className="text-sm text-primary-foreground/60">
                  ตรวจสอบกล่องจดหมายหลังจากส่งคำขอ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
        <Link
          href="/login"
          className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> กลับหน้าเข้าสู่ระบบ
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {success ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold font-kanit mb-3">
                ตรวจสอบอีเมลของคุณ
              </h1>
              <p className="text-muted-foreground font-sarabun leading-relaxed mb-8">
                เราส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว
                ตรวจสอบกล่องจดหมายได้เลย
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full h-12 font-kanit">
                  กลับหน้าเข้าสู่ระบบ
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold font-kanit mb-3">
                  ลืมรหัสผ่าน?
                </h1>
                <p className="text-muted-foreground font-sarabun">
                  ป้อนอีเมลที่ใช้สมัครสมาชิก เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้คุณ
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" /> อีเมล
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="example@mail.com"
                    required
                    className="h-12"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive bg-destructive/5 p-3 rounded-xl">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="h-12 mt-2 font-kanit"
                  disabled={isPending}
                >
                  {isPending ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
                </Button>
              </form>

              <p className="text-center mt-10 text-muted-foreground">
                จำรหัสผ่านได้แล้ว?{" "}
                <Link href="/login" className="text-primary font-bold hover:underline">
                  เข้าสู่ระบบที่นี่
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
