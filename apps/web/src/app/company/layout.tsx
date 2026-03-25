export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { AppShellClient } from "@/components/AppShellClient";

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login-company");
  }

  const { data: membershipRaw } = await supabase
    .from("company_members")
    .select("role, companies(name)")
    .eq("user_id", user.id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const membership = membershipRaw as any;
  const companyName = (membership?.companies?.name as string | undefined) ?? "บริษัท";
  const initials = companyName
    .split(" ")
    .map((part: string) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AppShellClient role="company" user={{ name: companyName, initials }}>
      {children}
    </AppShellClient>
  );
}
