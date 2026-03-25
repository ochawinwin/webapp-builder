'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../utils/cn";
import { Button } from "../components/Button";
import { Avatar } from "../components/Avatar";

interface NavUser {
  name: string;
  role?: string;
  avatarUrl?: string;
}

export interface HeaderProps {
  user?: NavUser | null;
  onLogout?: () => void;
}

interface NavLink {
  href: string;
  label: string;
}

function getNavLinks(user: NavUser | null | undefined): NavLink[] {
  if (!user) return [{ href: "/search", label: "ค้นหางาน" }];
  if (user.role === "company") {
    return [
      { href: "/hr/dashboard", label: "แดชบอร์ด" },
      { href: "/hr/jobs", label: "จัดการประกาศงาน" },
      { href: "/hr/feed", label: "Company Feed" },
    ];
  }
  if (user.role === "seeker") {
    return [
      { href: "/search", label: "ค้นหางาน" },
      { href: "/profile", label: "โปรไฟล์ของฉัน" },
    ];
  }
  return [{ href: "/search", label: "ค้นหางาน" }];
}

export function Header({ user, onLogout }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();
  const navLinks = getNavLinks(user);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-border h-16">
      <div className="flex h-full items-center justify-between px-4 max-w-[1200px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-poppins text-xl font-bold text-foreground">
            Future<span className="text-primary">Career</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? "bg-primary/5 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Avatar
                src={user.avatarUrl}
                fallback={user.name}
                size="sm"
                aria-label={user.name}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                aria-label="Logout"
              >
                ออกจากระบบ
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/hr/login">สำหรับบริษัท</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">เข้าสู่ระบบ</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link href="/register">สมัครสมาชิก</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-foreground" />
          ) : (
            <Menu className="w-5 h-5 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-border shadow-lg z-40"
          >
            <div className="flex flex-col p-4 gap-2 max-w-[1200px] mx-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href || pathname.startsWith(`${link.href}/`)
                      ? "bg-primary/5 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="h-px bg-border my-1" />

              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={user.avatarUrl}
                      fallback={user.name}
                      size="sm"
                    />
                    <span className="text-sm font-medium text-foreground">{user.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                  >
                    ออกจากระบบ
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/hr/login">สำหรับบริษัท</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login">เข้าสู่ระบบ</Link>
                  </Button>
                  <Button variant="primary" size="sm" asChild>
                    <Link href="/register">สมัครสมาชิก</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
