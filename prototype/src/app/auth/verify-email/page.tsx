"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function CheckCircleIcon() {
  return (
    <svg
      className="mx-auto h-16 w-16 text-success"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ExclamationTriangleIcon() {
  return (
    <svg
      className="mx-auto h-16 w-16 text-warning"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );
}

type VerifyState = "success" | "expired";

export default function VerifyEmailPage() {
  const [state, setState] = useState<VerifyState>("success");

  return (
    <div className="flex min-h-screen flex-col bg-bg-secondary">
      <Navbar variant="auth" />

      <main
        id="main-content"
        className="flex flex-1 items-center justify-center px-4 py-12"
      >
        <Card className="w-full max-w-md text-center">
          {state === "success" ? (
            <div className="space-y-6">
              <CheckCircleIcon />
              <div>
                <h1 className="text-xl font-semibold text-text-primary">
                  ยืนยันอีเมลสำเร็จ!
                </h1>
                <p className="mt-2 text-sm text-text-secondary">
                  อีเมลของคุณได้รับการยืนยันเรียบร้อยแล้ว คุณสามารถเข้าสู่ระบบเพื่อเริ่มใช้งานได้ทันที
                </p>
              </div>
              <Button
                href="/auth/login"
                variant="primary"
                size="lg"
                className="w-full"
              >
                ไปหน้าเข้าสู่ระบบ
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <ExclamationTriangleIcon />
              <div>
                <h1 className="text-xl font-semibold text-text-primary">
                  ลิงก์หมดอายุ
                </h1>
                <p className="mt-2 text-sm text-text-secondary">
                  ลิงก์ยืนยันอีเมลของคุณหมดอายุแล้ว กรุณาส่งลิงก์ยืนยันใหม่อีกครั้ง
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => {
                  // Prototype: no actual resend
                }}
              >
                ส่งลิงก์ยืนยันอีกครั้ง
              </Button>
            </div>
          )}

          {/* Demo toggle for prototype */}
          <div className="mt-8 border-t border-border-default pt-4">
            <p className="mb-2 text-xs text-text-tertiary">
              Prototype Demo: สลับสถานะ
            </p>
            <div className="flex justify-center gap-2">
              <Button
                type="button"
                variant={state === "success" ? "primary" : "outline"}
                size="sm"
                onClick={() => setState("success")}
              >
                Success
              </Button>
              <Button
                type="button"
                variant={state === "expired" ? "primary" : "outline"}
                size="sm"
                onClick={() => setState("expired")}
              >
                Expired
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
