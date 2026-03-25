export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { AppShellClient } from "@/components/AppShellClient";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name ?? user.email ?? "ผู้ใช้งาน";
  const initials = fullName
    .split(" ")
    .map((part: string) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AppShellClient role="seeker" user={{ name: fullName, initials }}>
      {children}
    </AppShellClient>
  );
}
