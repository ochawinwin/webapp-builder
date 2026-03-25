import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/data/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuthUser();
  if (auth) {
    const role = auth.profile.user_type;
    redirect(role === "company" ? "/hr/dashboard" : "/search");
  }
  return <>{children}</>;
}
