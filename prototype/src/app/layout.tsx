import type { Metadata } from "next";
import { AuthProvider } from "@/lib/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "FutureCareer — ค้นหาอาชีพในฝันของคุณ",
  description: "แพลตฟอร์มจับคู่งานอัจฉริยะ ค้นหางานที่ตรงใจด้วย Smart Tags",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <a href="#main-content" className="skip-link">
          ข้ามไปยังเนื้อหาหลัก
        </a>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
