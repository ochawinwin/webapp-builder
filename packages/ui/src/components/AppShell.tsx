"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "./Sidebar";
import { cn } from "../lib/utils";

// ---------------------------------------------------------------------------
// Sidebar item definitions
// ---------------------------------------------------------------------------

const seekerItems = [
  {
    label: "โปรไฟล์",
    href: "/dashboard/profile",
    icon: (
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
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
      </svg>
    ),
  },
  {
    label: "เรซูเม่",
    href: "/dashboard/resumes",
    icon: (
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
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
        />
      </svg>
    ),
  },
  {
    label: "งานที่สมัคร",
    href: "/dashboard/applications",
    icon: (
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
          d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    ),
  },
];

const companyItems = [
  {
    label: "โปรไฟล์",
    href: "/company/profile",
    icon: (
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
          d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
        />
      </svg>
    ),
  },
  {
    label: "ฟีด",
    href: "/company/feed",
    icon: (
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
          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5"
        />
      </svg>
    ),
  },
  {
    label: "ทีมงาน",
    href: "/company/team",
    icon: (
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
          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
        />
      </svg>
    ),
  },
  {
    label: "ประกาศงาน",
    href: "/company/jobs",
    icon: (
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
          d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    ),
  },
  {
    label: "ผู้สมัคร",
    href: "/company/candidates",
    icon: (
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
          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
        />
      </svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// AppShell
// ---------------------------------------------------------------------------

export interface AppShellProps {
  role: "seeker" | "company";
  activePath: string;
  children: React.ReactNode;
  user: {
    name: string;
    initials: string;
  };
  onLogout?: () => void;
}

export function AppShell({
  role,
  activePath,
  children,
  user,
  onLogout,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const sidebarItems = role === "seeker" ? seekerItems : companyItems;
  const profileHref =
    role === "seeker" ? "/dashboard/profile" : "/company/profile";

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Close sidebar on Escape
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  // Close avatar dropdown on outside click
  useEffect(() => {
    if (!avatarMenuOpen) return;
    const handleClick = () => setAvatarMenuOpen(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [avatarMenuOpen]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top navbar */}
      <header
        className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6"
        role="banner"
      >
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 md:hidden"
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

          <Link
            href="/"
            className="text-xl font-bold text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
          >
            FutureCareer
          </Link>
        </div>

        {/* Right: role-specific content + bell + avatar */}
        <div className="flex items-center gap-4">
          {role === "seeker" && (
            <Link
              href="/jobs"
              className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 sm:block"
            >
              ค้นหางาน
            </Link>
          )}

          {role === "company" && (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm font-medium text-slate-900">
                {user.name}
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                แอดมิน
              </span>
            </div>
          )}

          {/* Notification bell */}
          <button
            type="button"
            className="relative inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
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
            <span
              className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"
              aria-label="มีการแจ้งเตือนใหม่"
            />
          </button>

          {/* Avatar dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
              aria-expanded={avatarMenuOpen}
              aria-haspopup="true"
              aria-label="เมนูผู้ใช้"
              onClick={(e) => {
                e.stopPropagation();
                setAvatarMenuOpen((prev) => !prev);
              }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
                aria-hidden="true"
              >
                {user.initials}
              </div>
              <span className="hidden text-sm font-medium text-slate-900 sm:block">
                {user.name}
              </span>
              <svg
                className="hidden h-4 w-4 text-slate-400 sm:block"
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

            {avatarMenuOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                role="menu"
                aria-label="เมนูผู้ใช้"
              >
                <Link
                  href={profileHref}
                  className="block px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  role="menuitem"
                >
                  โปรไฟล์
                </Link>
                <hr className="my-1 border-slate-200" />
                <button
                  type="button"
                  className="block w-full px-4 py-2 text-left text-sm text-red-500 transition-colors hover:bg-red-50"
                  role="menuitem"
                  onClick={onLogout}
                >
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Body: sidebar + main */}
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          activePath={activePath}
          open={sidebarOpen}
          onClose={closeSidebar}
        />
        <main
          className={cn("flex-1 p-6")}
          id="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
