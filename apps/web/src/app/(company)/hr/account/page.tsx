import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/data/auth";
import { HRAccountForm } from "@/components/hr/HRAccountForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "บัญชีของฉัน" };

export default async function HRAccountPage() {
  const auth = await getAuthUser();
  if (!auth) redirect("/hr/login");

  return (
    <HRAccountForm
      profile={auth.profile}
      email={auth.user.email ?? ""}
    />
  );
}
