import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/data/auth";

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuthUser();
  if (!auth) redirect("/hr/login");
  if (auth.profile.user_type !== "company") redirect("/search");

  return <>{children}</>;
}
