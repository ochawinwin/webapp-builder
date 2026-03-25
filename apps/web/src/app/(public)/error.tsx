"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      <h2 className="text-2xl font-bold font-kanit text-destructive">
        เกิดข้อผิดพลาด
      </h2>
      <p className="text-muted-foreground font-sarabun text-center max-w-sm">
        {error.message || "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง"}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-primary text-white rounded-xl font-bold font-kanit hover:bg-primary/90 transition-colors"
      >
        ลองใหม่
      </button>
    </div>
  );
}
