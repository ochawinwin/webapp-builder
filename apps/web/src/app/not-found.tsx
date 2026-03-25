import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <p className="text-6xl font-bold text-primary">404</p>
        <h1 className="text-2xl font-semibold text-text-primary">ไม่พบหน้าที่คุณต้องการ</h1>
        <p className="text-text-secondary">หน้านี้อาจถูกย้าย ลบ หรือไม่มีอยู่แล้ว</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
        >
          กลับสู่หน้าหลัก
        </Link>
        <Link
          href="/jobs"
          className="rounded-xl border border-border-default bg-bg-primary px-6 py-3 text-sm font-medium text-text-primary hover:bg-bg-tertiary transition-colors"
        >
          ค้นหางาน
        </Link>
      </div>
    </div>
  );
}
