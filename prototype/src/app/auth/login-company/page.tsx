"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/AuthContext";

export default function LoginCompanyPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      const user = login(email, password);
      if (!user) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        return;
      }
      if (user.role === "company") {
        router.push("/company/profile");
      } else {
        router.push("/dashboard/profile");
      }
    },
    [email, password, login, router]
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
              <legend className="sr-only">แบบฟอร์มเข้าสู่ระบบบริษัท</legend>

              {/* Header */}
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">FutureCareer</p>
                <h1 className="mt-3 text-xl font-semibold text-text-primary">
                  เข้าสู่ระบบบริษัท
                </h1>
                <p className="mt-1 text-sm text-text-secondary">
                  จัดการประกาศรับสมัครงานและผู้สมัคร
                </p>
              </div>

              {/* Error */}
              {error && (
                <div role="alert" className="rounded-lg bg-error-bg p-3 text-sm text-error">
                  {error}
                </div>
              )}

              {/* Test credentials hint */}
              <div className="rounded-lg bg-info-bg p-3 text-sm text-info">
                <p className="font-medium">บัญชีทดสอบ:</p>
                <p>อีเมล: <code className="font-mono">test@company.com</code></p>
                <p>รหัสผ่าน: <code className="font-mono">password</code></p>
              </div>

              {/* Fields */}
              <div className="space-y-4">
                <Input
                  label="อีเมลที่ทำงาน"
                  variant="email"
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="รหัสผ่าน"
                  variant="password"
                  placeholder="กรอกรหัสผ่าน"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Remember me + forgot password */}
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
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-text-link hover:text-primary-hover"
                >
                  ลืมรหัสผ่าน?
                </Link>
              </div>

              {/* Submit */}
              <Button type="submit" variant="primary" size="lg" className="w-full">
                เข้าสู่ระบบ
              </Button>

              {/* Footer links */}
              <div className="space-y-2 text-center text-sm">
                <p className="text-text-secondary">
                  ยังไม่มีบัญชีบริษัท?{" "}
                  <Link
                    href="/auth/register-company"
                    className="font-medium text-text-link hover:text-primary-hover"
                  >
                    ลงทะเบียนบริษัท
                  </Link>
                </p>
                <p className="text-text-secondary">
                  กำลังหางาน?{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium text-text-link hover:text-primary-hover"
                  >
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
