"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@futurecareer/ui";
import { loginAction } from "@/app/actions/auth.actions";
import { Briefcase, ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export function CandidateLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") ?? "/search";
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result.success) {
        router.push(result.data?.redirectTo ?? nextUrl);
      } else {
        setError(result.error ?? "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่");
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
            ก้าวต่อไปของอาชีพ <br />
            เริ่มต้นที่นี่
          </h2>
          <p className="text-xl text-primary-foreground/80 leading-relaxed mb-8 font-sarabun">
            ยินดีต้อนรับกลับมา!
            ลงชื่อเข้าใช้เพื่อดูงานแนะนำที่คัดสรรมาเพื่อคุณโดยเฉพาะ
            และติดตามสถานะการสมัครงานของคุณได้แบบเรียลไทม์
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-secondary">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">งานแนะนำกว่า 10,000+ ตำแหน่ง</p>
                <p className="text-sm text-primary-foreground/60">
                  อัปเดตทุกวันจากบริษัทชั้นนำ
                </p>
              </div>
            </div>
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
            <h1 className="text-3xl font-bold font-kanit mb-3">
              เข้าสู่ระบบ (ผู้หางาน)
            </h1>
            <p className="text-muted-foreground">
              ป้อนอีเมลและรหัสผ่านเพื่อเข้าใช้งานบัญชีของคุณ
            </p>
          </div>

          <div className="flex bg-muted p-1 rounded-xl mb-8">
            <button className="flex-1 py-2 text-sm font-semibold rounded-lg bg-white shadow-sm text-primary">
              สำหรับผู้หางาน
            </button>
            <Link
              href="/hr/login"
              className="flex-1 py-2 text-sm font-medium text-muted-foreground hover:text-foreground text-center"
            >
              สำหรับบริษัท
            </Link>
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" /> รหัสผ่าน
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  ลืมรหัสผ่าน?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                  className="h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
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
              {isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Button>
          </form>

          <p className="text-center mt-10 text-muted-foreground">
            ยังไม่มีบัญชี?{" "}
            <Link
              href="/register"
              className="text-primary font-bold hover:underline"
            >
              สมัครสมาชิกที่นี่
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
