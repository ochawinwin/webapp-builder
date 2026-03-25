"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DashboardRootLayout({
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

  if (!user || user.role !== "seeker") {
    router.push("/auth/login");
    return null;
  }

  return (
    <DashboardLayout role="seeker" activePath={pathname}>
      {children}
    </DashboardLayout>
  );
}
