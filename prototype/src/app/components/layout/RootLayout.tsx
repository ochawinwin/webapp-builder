import { Outlet, ScrollRestoration } from "react-router";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";
import { Toaster } from "sonner";
import { AuthProvider } from "../../context/AuthContext";

export function RootLayout() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen font-sarabun text-foreground bg-background">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        <Toaster position="top-right" richColors closeButton />
        <ScrollRestoration />
      </div>
    </AuthProvider>
  );
}
