"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

interface NavbarProps {
  variant?: "default" | "auth";
}

const navLinks = [
  { label: "ค้นหางาน", href: "/jobs" },
  { label: "สำหรับบริษัท", href: "/company" },
] as const;

export default function Navbar({ variant = "default" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
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
  const { user } = useAuth();
  const dashboardHref = user?.role === "company" ? "/company/profile" : "/dashboard/profile";

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border-default bg-bg-primary"
      role="banner"
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className={isAuth ? "flex flex-1 justify-center" : "flex shrink-0"}>
          <Link
            href="/"
            className="text-xl font-bold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            FutureCareer
          </Link>
        </div>

        {!isAuth && (
          <>
            {/* Desktop nav links */}
            <ul className="hidden items-center gap-8 md:flex" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-text-secondary transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
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
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
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
                    className="inline-flex items-center justify-center rounded-lg border border-border-strong px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-tertiary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    สมัครสมาชิก
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger button */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-tertiary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring md:hidden"
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
      </nav>

      {/* Mobile slide-out drawer */}
      {!isAuth && (
        <>
          {/* Overlay */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 z-40 bg-bg-overlay md:hidden"
              aria-hidden="true"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Drawer */}
          <div
            id="mobile-menu"
            className={`fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-72 transform bg-bg-primary shadow-lg transition-transform duration-200 ease-in-out md:hidden ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="เมนูนำทาง"
          >
            <nav className="flex flex-col gap-2 p-4" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-border-default" />
              {user ? (
                <Link
                  href={dashboardHref}
                  className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-text-inverse transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ไปยัง Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="rounded-lg border border-border-strong px-4 py-3 text-center text-sm font-medium text-text-primary transition-colors hover:bg-bg-tertiary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/auth/register"
                    className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-text-inverse transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
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
