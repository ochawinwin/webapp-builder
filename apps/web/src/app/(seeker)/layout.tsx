import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/data/auth";
import { AuthHeader } from "@/components/AuthHeader";
import { Footer } from "@futurecareer/ui";

export default async function SeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuthUser();
  if (!auth) redirect("/login");
  if (auth.profile.user_type === "company") redirect("/hr/dashboard");

  return (
    <>
      <AuthHeader />
      <main>{children}</main>
      <Footer />
    </>
  );
}
