export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { Footer } from "@futurecareer/ui";
import { AuthHeader } from "@/components/AuthHeader";
import { getCompany } from "@/lib/data/companies";
import { getJobsByCompany } from "@/lib/data/jobs";
import { getFeedPosts } from "@/lib/data/feed";
import CompanyPublicProfileClient from "./_components/CompanyPublicProfileClient";

interface CompanyPublicProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyPublicProfilePage({ params }: CompanyPublicProfilePageProps) {
  const { id } = await params;

  const [company, positions, feedPosts] = await Promise.all([
    getCompany(id),
    getJobsByCompany(id),
    getFeedPosts(id),
  ]);

  if (!company) notFound();

  return (
    <div className="flex flex-col min-h-full">
      <AuthHeader />
      <CompanyPublicProfileClient company={company} positions={positions} feedPosts={feedPosts} />
      <Footer />
    </div>
  );
}
