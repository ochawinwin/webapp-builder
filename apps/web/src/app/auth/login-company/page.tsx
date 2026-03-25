"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header, Footer, Card, Input, Button } from "@futurecareer/ui";
import { loginAction } from "@/app/actions/authActions";

export default function LoginCompanyPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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
        const result = await loginAction({ email, password });
        if (result.success) {
          router.push("/company/profile");
        } else {
          setError(result.error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, router]
  );

  return (
    <div className="flex min-h-screen flex-col bg-bg-secondary">
      <Header variant="auth" />

      <main id="main-content" className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <form onSubmit={handleSubmit} noValidate>
            <fieldset className="space-y-6">
              <legend className="sr-only">แบบฟอร์มเข้าสู่ระบบบริษัท</legend>

              <div className="text-center">
                <p className="text-2xl font-bold text-primary">FutureCareer</p>
                <h1 className="mt-3 text-xl font-semibold text-text-primary">เข้าสู่ระบบบริษัท</h1>
                <p className="mt-1 text-sm text-text-secondary">จัดการประกาศรับสมัครงานและผู้สมัคร</p>
              </div>

              {error && typeof error === "string" && (
                <div role="alert" className="rounded-lg bg-error-bg p-3 text-sm text-error">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Input
                  label="อีเมลที่ทำงาน"
                  variant="email"
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={getFieldError("email")}
                />
                <Input
                  label="รหัสผ่าน"
                  variant="password"
                  placeholder="กรอกรหัสผ่าน"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={getFieldError("password")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-border-default text-primary focus:ring-focus-ring"
                  />
                  <label htmlFor="remember-me" className="text-sm text-text-secondary">
                    จดจำฉัน
                  </label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm font-medium text-text-link hover:text-primary-hover">
                  ลืมรหัสผ่าน?
                </Link>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </Button>

              <div className="space-y-2 text-center text-sm">
                <p className="text-text-secondary">
                  ยังไม่มีบัญชีบริษัท?{" "}
                  <Link href="/auth/register-company" className="font-medium text-text-link hover:text-primary-hover">
                    ลงทะเบียนบริษัท
                  </Link>
                </p>
                <p className="text-text-secondary">
                  กำลังหางาน?{" "}
                  <Link href="/auth/login" className="font-medium text-text-link hover:text-primary-hover">
                    เข้าสู่ระบบผู้หางาน
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
