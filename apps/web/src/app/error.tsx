"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <p className="text-6xl font-bold text-primary">500</p>
        <h2 className="text-2xl font-semibold text-text-primary">เกิดข้อผิดพลาด</h2>
        <p className="text-text-secondary">ขออภัย เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง</p>
      </div>
      <button
        onClick={reset}
        className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
      >
        ลองใหม่
      </button>
    </div>
  );
}
