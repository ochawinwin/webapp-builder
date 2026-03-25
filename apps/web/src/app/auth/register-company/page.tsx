"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header, Footer, Card, Input, Button, PasswordStrength } from "@futurecareer/ui";
import { registerCompanyAction } from "@/app/actions/authActions";

export default function RegisterCompanyPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | Record<string, string[]>>("");
  const [isLoading, setIsLoading] = useState(false);

  const getFieldError = (field: string) => {
    if (typeof error === "object" && field in error) {
      return (error as Record<string, string[]>)[field]?.[0];
    }
    return undefined;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);
      try {
        const result = await registerCompanyAction({ fullName, workEmail, companyName, password, confirmPassword });
        if (result.success) {
          router.push("/auth/verify-email");
        } else {
          setError(result.error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [fullName, workEmail, companyName, password, confirmPassword, router]
  );

  return (
    <div className="flex min-h-screen flex-col bg-bg-secondary">
      <Header variant="auth" />

      <main id="main-content" className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <form onSubmit={handleSubmit} noValidate>
            <fieldset className="space-y-6">
              <legend className="sr-only">แบบฟอร์มลงทะเบียนบริษัท</legend>

              <div className="text-center">
                <p className="text-2xl font-bold text-primary">FutureCareer</p>
                <h1 className="mt-3 text-xl font-semibold text-text-primary">ลงทะเบียนบริษัท</h1>
                <p className="mt-1 text-sm text-text-secondary">เริ่มหาคนที่ใช่ให้องค์กรของคุณวันนี้</p>
              </div>

              {error && typeof error === "string" && (
                <div role="alert" className="rounded-lg bg-error-bg p-3 text-sm text-error">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Input
                  label="ชื่อ-นามสกุล"
                  variant="text"
                  placeholder="สมชาย ใจดี"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={getFieldError("fullName")}
                />
                <Input
                  label="อีเมลที่ทำงาน"
                  variant="email"
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  error={getFieldError("workEmail")}
                />
                <Input
                  label="ชื่อบริษัท"
                  variant="text"
                  placeholder="บริษัท ตัวอย่าง จำกัด"
                  required
                  autoComplete="organization"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  error={getFieldError("companyName")}
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
                    error={getFieldError("password")}
                  />
                  {password && <PasswordStrength password={password} />}
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
                    getFieldError("confirmPassword") ??
                    (confirmPassword && confirmPassword !== password ? "รหัสผ่านไม่ตรงกัน" : undefined)
                  }
                />
              </div>

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
                  <Link href="/terms" className="font-medium text-text-link underline hover:text-primary-hover">
                    ข้อกำหนดและเงื่อนไขการใช้งาน
                  </Link>
                </label>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "กำลังลงทะเบียน..." : "ลงทะเบียนบริษัท"}
              </Button>

              <div className="space-y-2 text-center text-sm">
                <p className="text-text-secondary">
                  มีบัญชีอยู่แล้ว?{" "}
                  <Link href="/auth/login-company" className="font-medium text-text-link hover:text-primary-hover">
                    เข้าสู่ระบบ
                  </Link>
                </p>
                <p className="text-text-secondary">
                  กำลังหางาน?{" "}
                  <Link href="/auth/register" className="font-medium text-text-link hover:text-primary-hover">
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
