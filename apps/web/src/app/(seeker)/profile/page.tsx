import { getAuthUser } from "@/lib/data/auth";
import { getProfileByUserId } from "@/lib/data/profiles";
import { getApplicationsByUser } from "@/lib/data/applications";
import { ProfileForm } from "@/components/seeker/ProfileForm";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "โปรไฟล์ของฉัน" };

export default async function ProfilePage() {
  const auth = await getAuthUser();
  if (!auth) redirect("/login");

  const [profile, applications] = await Promise.all([
    getProfileByUserId(auth.user.id),
    getApplicationsByUser(auth.user.id),
  ]);

  return (
    <ProfileForm
      userId={auth.user.id}
      email={auth.user.email}
      profile={profile}
      applications={applications}
    />
  );
}
