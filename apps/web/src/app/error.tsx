"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[Error boundary]", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 bg-background">
      {/* Brand mark */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-2xl font-poppins">F</span>
        </div>
        <span className="text-lg font-bold font-poppins text-foreground tracking-tight">
          FutureCareer
        </span>
      </div>

      {/* Error icon */}
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-destructive"
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

      {/* Message */}
      <div className="text-center space-y-3 max-w-sm">
        <h2 className="text-2xl font-bold font-kanit text-foreground">เกิดข้อผิดพลาด</h2>
        <p className="text-muted-foreground font-sarabun">
          {error.message || "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง"}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/60 font-mono">ID: {error.digest}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold font-kanit text-sm hover:opacity-90 transition-opacity shadow-md"
        >
          ลองใหม่อีกครั้ง
        </button>
        <Link
          href="/"
          className="px-6 py-3 border border-border text-foreground rounded-xl font-bold font-kanit text-sm hover:bg-muted transition-colors text-center"
        >
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}
