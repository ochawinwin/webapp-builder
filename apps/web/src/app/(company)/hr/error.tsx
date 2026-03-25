"use client";

import { Button } from "@futurecareer/ui";
import { AlertCircle } from "lucide-react";

export default function HRError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-kanit mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-muted-foreground font-sarabun text-sm">{error.message}</p>
        </div>
        <Button onClick={reset} className="font-kanit">
          ลองใหม่อีกครั้ง
        </Button>
      </div>
    </div>
  );
}
