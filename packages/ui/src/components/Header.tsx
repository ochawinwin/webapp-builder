"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { cn } from "../lib/utils";

export interface HeaderProps {
  variant?: "default" | "auth" | "dashboard";
  children?: React.ReactNode;
  user?: {
    name: string;
    role?: string;
  };
}

const navLinks = [
  { label: "ค้นหางาน", href: "/jobs" },
  { label: "สำหรับบริษัท", href: "/company" },
] as const;

export function Header({ variant = "default", children, user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isAuth = variant === "auth";
  const isDashboard = variant === "dashboard";
  const dashboardHref =
    user?.role === "company" ? "/company/profile" : "/dashboard/profile";

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white"
      role="banner"
    >
      <nav
        className={cn(
          "mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8",
          isAuth ? "max-w-7xl justify-center" : "max-w-7xl justify-between",
          isDashboard && "max-w-none justify-between"
        )}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div
          className={cn(
            "flex shrink-0",
            isAuth && "flex-1 justify-center",
            isDashboard && "items-center gap-3"
          )}
        >
          {/* Dashboard hamburger */}
          {isDashboard && (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 md:hidden"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "ปิดเมนูข้าง" : "เปิดเมนูข้าง"}
              onClick={toggleMenu}
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
          )}

          <Link
            href="/"
            className="text-xl font-bold text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
          >
            FutureCareer
          </Link>
        </div>

        {/* Default variant: nav links */}
        {!isAuth && !isDashboard && (
          <>
            <ul
              className="hidden items-center gap-8 md:flex"
              role="list"
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop auth buttons / logged-in state */}
            <div className="hidden items-center gap-3 md:flex">
              {user ? (
                <Link
                  href={dashboardHref}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                    {user.name.charAt(0)}
                  </span>
                  {user.name}
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                  >
                    สมัครสมาชิก
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger button */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 md:hidden"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
              onClick={toggleMenu}
            >
              {mobileMenuOpen ? (
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
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
              )}
            </button>
          </>
        )}

        {/* Dashboard / right content slot */}
        {(isDashboard || isAuth) && children && (
          <div className="flex items-center gap-4">{children}</div>
        )}
      </nav>

      {/* Mobile slide-out drawer — default variant */}
      {!isAuth && !isDashboard && (
        <>
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
              aria-hidden="true"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          <div
            id="mobile-menu"
            className={cn(
              "fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-72 transform bg-white shadow-lg transition-transform duration-200 ease-in-out md:hidden",
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}
            role="dialog"
            aria-modal="true"
            aria-label="เมนูนำทาง"
          >
            <nav className="flex flex-col gap-2 p-4" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-slate-200" />
              {user ? (
                <Link
                  href={dashboardHref}
                  className="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ไปยัง Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/auth/register"
                    className="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    สมัครสมาชิก
                  </Link>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
