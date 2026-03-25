"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CompanyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[Company error boundary]", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-muted/30">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-2xl font-bold font-kanit mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-muted-foreground font-sarabun text-sm">
            {error.message || "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง"}
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-muted-foreground/60 font-mono">ID: {error.digest}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold font-kanit text-sm hover:bg-primary/90 transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
          <Link
            href="/hr/dashboard"
            className="px-6 py-3 border border-border text-foreground rounded-xl font-bold font-kanit text-sm hover:bg-muted transition-colors text-center"
          >
            กลับ Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
