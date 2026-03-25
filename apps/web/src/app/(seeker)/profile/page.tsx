import { Suspense } from "react";
import { getAuthUser } from "@/lib/data/auth";
import { getProfileByUserId } from "@/lib/data/profiles";
import { getApplicationsByUser } from "@/lib/data/applications";
import { getSavedJobsByUser } from "@/lib/data/saved-jobs";
import { ProfileForm } from "@/components/seeker/ProfileForm";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "โปรไฟล์ของฉัน" };

export default async function ProfilePage() {
  const auth = await getAuthUser();
  if (!auth) redirect("/login");

  const [profile, applications, savedJobs] = await Promise.all([
    getProfileByUserId(auth.user.id),
    getApplicationsByUser(auth.user.id),
    getSavedJobsByUser(auth.user.id),
  ]);

  return (
    <Suspense>
      <ProfileForm
        userId={auth.user.id}
        email={auth.user.email}
        profile={profile}
        applications={applications}
        savedJobs={savedJobs}
      />
    </Suspense>
  );
}
