"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function getPasswordStrength(password: string): { level: number; label: string; color: string } {
  if (!password) return { level: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: "อ่อน", color: "bg-error" };
  if (score === 2) return { level: 2, label: "ปานกลาง", color: "bg-warning" };
  if (score === 3) return { level: 3, label: "ดี", color: "bg-info" };
  return { level: 4, label: "แข็งแรง", color: "bg-success" };
}

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Prototype: no actual submission
    },
    []
  );

  return (
    <div className="flex min-h-screen flex-col bg-bg-secondary">
      <Navbar variant="auth" />

      <main
        id="main-content"
        className="flex flex-1 items-center justify-center px-4 py-12"
      >
        <Card className="w-full max-w-md">
          <form onSubmit={handleSubmit} noValidate>
            <fieldset className="space-y-6">
              <legend className="sr-only">แบบฟอร์มสมัครสมาชิกผู้หางาน</legend>

              {/* Header */}
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">FutureCareer</p>
                <h1 className="mt-3 text-xl font-semibold text-text-primary">
                  สมัครสมาชิกผู้หางาน
                </h1>
                <p className="mt-1 text-sm text-text-secondary">
                  เริ่มค้นหางานที่ตรงกับทักษะของคุณ
                </p>
              </div>

              {/* Fields */}
              <div className="space-y-4">
                <Input
                  label="ชื่อ-นามสกุล"
                  variant="text"
                  placeholder="สมชาย ใจดี"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  label="อีเมล"
                  variant="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="space-y-1.5">
                  <Input
                    label="รหัสผ่าน"
                    variant="password"
                    placeholder="อย่างน้อย 8 ตัวอักษร"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password && (
                    <div className="space-y-1">
                      <div className="flex gap-1" role="meter" aria-label="ความแข็งแรงของรหัสผ่าน" aria-valuenow={strength.level} aria-valuemin={0} aria-valuemax={4}>
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              i <= strength.level ? strength.color : "bg-border-default"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-text-tertiary">
                        ความแข็งแรง: {strength.label}
                      </p>
                    </div>
                  )}
                </div>
                <Input
                  label="ยืนยันรหัสผ่าน"
                  variant="password"
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={
                    confirmPassword && confirmPassword !== password
                      ? "รหัสผ่านไม่ตรงกัน"
                      : undefined
                  }
                />
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-2">
                <input
                  id="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border-default text-primary focus:ring-focus-ring"
                  required
                />
                <label htmlFor="accept-terms" className="text-sm text-text-secondary">
                  ยอมรับ{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-text-link underline hover:text-primary-hover"
                  >
                    ข้อกำหนดและเงื่อนไขการใช้งาน
                  </Link>
                </label>
              </div>

              {/* Submit */}
              <Button type="submit" variant="primary" size="lg" className="w-full">
                สมัครสมาชิก
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3" role="separator">
                <div className="h-px flex-1 bg-border-default" />
                <span className="text-xs text-text-tertiary">หรือดำเนินการผ่าน</span>
                <div className="h-px flex-1 bg-border-default" />
              </div>

              {/* Social buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" variant="outline" size="md" className="flex-1">
                  <GoogleIcon />
                  Google
                </Button>
                <Button type="button" variant="outline" size="md" className="flex-1">
                  <LinkedInIcon />
                  LinkedIn
                </Button>
              </div>

              {/* Footer links */}
              <div className="space-y-2 text-center text-sm">
                <p className="text-text-secondary">
                  มีบัญชีอยู่แล้ว?{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium text-text-link hover:text-primary-hover"
                  >
                    เข้าสู่ระบบ
                  </Link>
                </p>
                <p className="text-text-secondary">
                  ต้องการหาคน?{" "}
                  <Link
                    href="/auth/register-company"
                    className="font-medium text-text-link hover:text-primary-hover"
                  >
                    สมัครในนามบริษัท
                  </Link>
                </p>
              </div>
            </fieldset>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
