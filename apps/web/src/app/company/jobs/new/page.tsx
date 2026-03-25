import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function CompanyJobsNewPage() {
  redirect("/company/jobs/new/edit");
}
