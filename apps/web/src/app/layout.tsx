import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "FutureCareer — ค้นหาอาชีพในฝันของคุณ",
    template: "%s | FutureCareer",
  },
  description: "แพลตฟอร์มจับคู่งานอัจฉริยะ ค้นหางานที่ตรงใจด้วย Smart Tags เชื่อมต่อผู้หางานกับบริษัทชั้นนำ",
  keywords: ["หางาน", "สมัครงาน", "job matching", "recruitment", "FutureCareer"],
  authors: [{ name: "FutureCareer" }],
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://futurecareer.co",
    siteName: "FutureCareer",
    title: "FutureCareer — ค้นหาอาชีพในฝันของคุณ",
    description: "แพลตฟอร์มจับคู่งานอัจฉริยะ ค้นหางานที่ตรงใจด้วย Smart Tags",
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureCareer — ค้นหาอาชีพในฝันของคุณ",
    description: "แพลตฟอร์มจับคู่งานอัจฉริยะ ค้นหางานที่ตรงใจด้วย Smart Tags",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white"
        >
          ข้ามไปยังเนื้อหาหลัก
        </a>
        {children}
      </body>
    </html>
  );
}
