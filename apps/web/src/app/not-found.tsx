import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ไม่พบหน้า (404)" };

export default function NotFound() {
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

      {/* 404 display */}
      <div className="text-center space-y-3">
        <p className="text-8xl font-extrabold font-poppins text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-purple-600 leading-none">
          404
        </p>
        <h1 className="text-2xl font-bold font-kanit text-foreground">ไม่พบหน้าที่คุณต้องการ</h1>
        <p className="text-muted-foreground font-sarabun max-w-sm mx-auto">
          หน้าที่คุณกำลังค้นหาอาจถูกย้ายไป ลบออก หรือไม่มีอยู่ในระบบ
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold font-kanit text-sm hover:opacity-90 transition-opacity text-center shadow-md"
        >
          กลับหน้าหลัก
        </Link>
        <Link
          href="/search"
          className="px-6 py-3 border border-border text-foreground rounded-xl font-bold font-kanit text-sm hover:bg-muted transition-colors text-center"
        >
          ค้นหางาน
        </Link>
      </div>
    </div>
  );
}
