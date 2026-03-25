"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-secondary">กำลังโหลด...</p>
      </div>
    );
  }

  if (!user || user.role !== "company") {
    router.push("/auth/login-company");
    return null;
  }

  // Determine active path by matching the first two segments
  const segments = pathname.split("/").filter(Boolean);
  const activePath =
    segments.length >= 2 ? `/${segments[0]}/${segments[1]}` : pathname;

  return (
    <DashboardLayout role="company" activePath={activePath}>
      {children}
    </DashboardLayout>
  );
}
