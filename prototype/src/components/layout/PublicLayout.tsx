import Navbar from "./Navbar";
import Footer from "./Footer";

interface PublicLayoutProps {
  children: React.ReactNode;
  navbarVariant?: "default" | "auth";
}

export default function PublicLayout({
  children,
  navbarVariant = "default",
}: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        ข้ามไปยังเนื้อหาหลัก
      </a>
      <Navbar variant={navbarVariant} />
      <main className="flex-1" id="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
