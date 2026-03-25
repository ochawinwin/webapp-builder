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

export default function LoginPage() {
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
      if (user.role === "seeker") {
        router.push("/dashboard/profile");
      } else {
        router.push("/company/profile");
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
              <legend className="sr-only">แบบฟอร์มเข้าสู่ระบบผู้หางาน</legend>

              {/* Header */}
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">FutureCareer</p>
                <h1 className="mt-3 text-xl font-semibold text-text-primary">
                  ยินดีต้อนรับกลับ
                </h1>
                <p className="mt-1 text-sm text-text-secondary">
                  เข้าสู่ระบบบัญชีผู้หางาน
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
                <p>อีเมล: <code className="font-mono">test@seeker.com</code></p>
                <p>รหัสผ่าน: <code className="font-mono">password</code></p>
              </div>

              {/* Fields */}
              <div className="space-y-4">
                <Input
                  label="อีเมล"
                  variant="email"
                  placeholder="you@example.com"
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
                  ยังไม่มีบัญชี?{" "}
                  <Link
                    href="/auth/register"
                    className="font-medium text-text-link hover:text-primary-hover"
                  >
                    สมัครสมาชิก
                  </Link>
                </p>
                <p className="text-text-secondary">
                  ต้องการหาคน?{" "}
                  <Link
                    href="/auth/login-company"
                    className="font-medium text-text-link hover:text-primary-hover"
                  >
                    เข้าสู่ระบบในนามบริษัท
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
