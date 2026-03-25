"use client";

import { usePathname, useRouter } from "next/navigation";
import { AppShell } from "@futurecareer/ui";
import { logoutAction } from "@/app/actions/authActions";

interface AppShellClientProps {
  role: "seeker" | "company";
  user: { name: string; initials: string };
  children: React.ReactNode;
}

export function AppShellClient({ role, user, children }: AppShellClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/").filter(Boolean);
  const activePath = role === "company" && segments.length >= 2
    ? `/${segments[0]}/${segments[1]}`
    : pathname;

  async function handleLogout() {
    await logoutAction();
    router.push(role === "company" ? "/auth/login-company" : "/auth/login");
  }

  return (
    <AppShell role={role} activePath={activePath} user={user} onLogout={handleLogout}>
      {children}
    </AppShell>
  );
}
