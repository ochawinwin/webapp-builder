"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import DashboardSidebar from "./DashboardSidebar";

interface DashboardLayoutProps {
  role: "seeker" | "company";
  children: React.ReactNode;
  activePath: string;
}

export default function DashboardLayout({
  role,
  children,
  activePath,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const displayName = user?.name ?? (role === "seeker" ? "สมชาย" : "Admin");
  const initials = displayName.charAt(0);

  const handleLogout = useCallback(() => {
    logout();
    router.push("/");
  }, [logout, router]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Close avatar dropdown on outside click
  useEffect(() => {
    if (!avatarMenuOpen) return;
    const handleClick = () => setAvatarMenuOpen(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [avatarMenuOpen]);

  // Close sidebar on Escape
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Dashboard top navbar */}
      <header
        className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border-default bg-bg-primary px-4 sm:px-6"
        role="banner"
      >
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-tertiary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring md:hidden"
            aria-label={sidebarOpen ? "ปิดเมนูข้าง" : "เปิดเมนูข้าง"}
            aria-expanded={sidebarOpen}
            onClick={toggleSidebar}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            FutureCareer
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Seeker: job search link */}
          {role === "seeker" && (
            <Link
              href="/jobs"
              className="hidden text-sm font-medium text-text-secondary transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring sm:block"
            >
              ค้นหางาน
            </Link>
          )}

          {/* Company: company name + role badge */}
          {role === "company" && (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm font-medium text-text-primary">
                TechCorp
              </span>
              <span className="inline-flex items-center rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-medium text-primary">
                แอดมิน
              </span>
            </div>
          )}

          {/* Notification bell */}
          <button
            type="button"
            className="relative inline-flex items-center justify-center rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-tertiary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            aria-label="การแจ้งเตือน"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
            {/* Notification dot */}
            <span
              className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error"
              aria-label="มีการแจ้งเตือนใหม่"
            />
          </button>

          {/* Avatar dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-bg-tertiary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              aria-expanded={avatarMenuOpen}
              aria-haspopup="true"
              aria-label="เมนูผู้ใช้"
              onClick={(e) => {
                e.stopPropagation();
                setAvatarMenuOpen((prev) => !prev);
              }}
            >
              {/* Avatar placeholder */}
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-text-inverse"
                aria-hidden="true"
              >
                {initials}
              </div>
              <span className="hidden text-sm font-medium text-text-primary sm:block">
                {displayName}
              </span>
              <svg
                className="hidden h-4 w-4 text-text-tertiary sm:block"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {/* Dropdown menu */}
            {avatarMenuOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border-default bg-bg-primary py-1 shadow-lg"
                role="menu"
                aria-label="เมนูผู้ใช้"
              >
                <Link
                  href={role === "seeker" ? "/dashboard/profile" : "/company/profile"}
                  className="block px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                  role="menuitem"
                >
                  โปรไฟล์
                </Link>
                <hr className="my-1 border-border-default" />
                <button
                  type="button"
                  className="block w-full px-4 py-2 text-left text-sm text-error transition-colors hover:bg-error-bg"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content area with sidebar */}
      <div className="flex flex-1">
        <DashboardSidebar
          role={role}
          activePath={activePath}
          open={sidebarOpen}
          onClose={closeSidebar}
        />
        <main className="flex-1 p-6" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
