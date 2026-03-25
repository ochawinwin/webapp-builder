"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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

export default function RegisterCompanyPage() {
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
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
              <legend className="sr-only">แบบฟอร์มลงทะเบียนบริษัท</legend>

              {/* Header */}
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">FutureCareer</p>
                <h1 className="mt-3 text-xl font-semibold text-text-primary">
                  ลงทะเบียนบริษัท
                </h1>
                <p className="mt-1 text-sm text-text-secondary">
                  เริ่มหาคนที่ใช่ให้องค์กรของคุณวันนี้
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
                  label="อีเมลที่ทำงาน"
                  variant="email"
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                />
                <Input
                  label="ชื่อบริษัท"
                  variant="text"
                  placeholder="บริษัท ตัวอย่าง จำกัด"
                  required
                  autoComplete="organization"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
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
                ลงทะเบียนบริษัท
              </Button>

              {/* Footer links */}
              <div className="space-y-2 text-center text-sm">
                <p className="text-text-secondary">
                  มีบัญชีอยู่แล้ว?{" "}
                  <Link
                    href="/auth/login-company"
                    className="font-medium text-text-link hover:text-primary-hover"
                  >
                    เข้าสู่ระบบ
                  </Link>
                </p>
                <p className="text-text-secondary">
                  กำลังหางาน?{" "}
                  <Link
                    href="/auth/register"
                    className="font-medium text-text-link hover:text-primary-hover"
                  >
                    สมัครสมาชิกผู้หางาน
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
