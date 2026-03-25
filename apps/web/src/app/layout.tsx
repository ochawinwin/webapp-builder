import type { Metadata } from "next";
import { Poppins, Kanit, Sarabun } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins-var",
  display: "swap",
});

const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kanit-var",
  display: "swap",
});

const sarabun = Sarabun({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sarabun-var",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FutureCareer — หางานที่ใช่ สมัครได้เลย",
    template: "%s | FutureCareer",
  },
  description:
    "แพลตฟอร์มหางานที่เชื่อมต่อผู้สมัครกับบริษัทชั้นนำ ค้นหางานตรงสายได้ที่ FutureCareer",
  keywords: [
    "หางาน",
    "สมัครงาน",
    "job",
    "Thailand",
    "FutureCareer",
    "ตำแหน่งงาน",
    "job matching",
    "ATS",
  ],
  authors: [{ name: "FutureCareer" }],
  creator: "FutureCareer",
  metadataBase: new URL("https://futurecareer.app"),
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://futurecareer.app",
    siteName: "FutureCareer",
    title: "FutureCareer — หางานที่ใช่ สมัครได้เลย",
    description:
      "แพลตฟอร์มหางานที่เชื่อมต่อผู้สมัครกับบริษัทชั้นนำ ค้นหางานตรงสายได้ที่ FutureCareer",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "FutureCareer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureCareer — หางานที่ใช่ สมัครได้เลย",
    description:
      "แพลตฟอร์มหางานที่เชื่อมต่อผู้สมัครกับบริษัทชั้นนำ ค้นหางานตรงสายได้ที่ FutureCareer",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${poppins.variable} ${kanit.variable} ${sarabun.variable}`}
    >
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
