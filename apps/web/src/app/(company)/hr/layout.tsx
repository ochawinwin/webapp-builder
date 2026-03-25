import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/data/auth";
import { getCompanyByMembership } from "@/lib/data/companies";
import { logoutAction } from "@/app/actions/auth.actions";
import { Sidebar } from "@futurecareer/ui";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Users,
  Building2,
  LogOut,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: { template: "%s | HR — FutureCareer", default: "HR — FutureCareer" } };

const NAV_ITEMS = [
  { href: "/hr/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { href: "/hr/jobs", label: "ประกาศงาน", icon: <Briefcase className="w-5 h-5" /> },
  { href: "/hr/feed", label: "Company Feed", icon: <MessageSquare className="w-5 h-5" /> },
  { href: "/hr/team", label: "จัดการทีม", icon: <Users className="w-5 h-5" /> },
  { href: "/hr/profile", label: "ตั้งค่าบริษัท", icon: <Building2 className="w-5 h-5" /> },
];

export default async function HRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuthUser();
  if (!auth) redirect("/hr/login");
  if (auth.profile.user_type !== "company") redirect("/search");

  const membership = await getCompanyByMembership(auth.user.id);
  if (!membership) redirect("/hr/login");

  const userName = [auth.profile.first_name, auth.profile.last_name]
    .filter(Boolean)
    .join(" ") || auth.user.email || "HR User";

  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden">
      <Sidebar
        items={NAV_ITEMS}
        user={{
          name: userName,
          role: membership.role === "admin" ? "Admin" : "Recruiter",
          avatarUrl: auth.profile.avatar_url ?? undefined,
        }}
        userHref="/hr/account"
        companyName={membership.company.name}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              FutureCareer
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-xs font-semibold text-slate-700">{membership.company.name}</span>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" /> ออกจากระบบ
            </button>
          </form>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
