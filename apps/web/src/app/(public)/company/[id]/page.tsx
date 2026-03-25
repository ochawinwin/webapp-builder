import { notFound } from "next/navigation";
import { getCompanyById } from "@/lib/data/companies";
import { getJobs } from "@/lib/data/jobs";
import { CompanyPublicProfileClient } from "@/components/CompanyPublicProfileClient";
import type { Metadata } from "next";

interface CompanyProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CompanyProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const company = await getCompanyById(id);
  if (!company) return { title: "ไม่พบบริษัท" };
  return { title: `${company.name} — โปรไฟล์บริษัท` };
}

export default async function CompanyProfilePage({
  params,
}: CompanyProfilePageProps) {
  const { id } = await params;

  const [company, { jobs }] = await Promise.all([
    getCompanyById(id),
    getJobs({ companyId: id, status: "open", limit: 20 }),
  ]);

  if (!company) notFound();

  return (
    <CompanyPublicProfileClient
      company={company}
      jobs={jobs}
      posts={company.recent_posts ?? []}
    />
  );
}
