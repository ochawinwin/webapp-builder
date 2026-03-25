import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Card, Tag, Badge, Button } from "@futurecareer/ui";
import { AuthHeader } from "@/components/AuthHeader";
import { getJobById, getJobWithPrescreen } from "@/lib/data/jobs";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;

  const [job, jobWithPrescreen] = await Promise.all([
    getJobById(id),
    getJobWithPrescreen(id),
  ]);

  if (!job) notFound();

  const initials = job.company.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const prescreenCount = (jobWithPrescreen?.prescreenQuestions ?? []).length;

  const tagItems = job.tags.map((t) => ({
    label: t.name,
    category: (t.category as "skill" | "level" | "type" | "industry" | "location") ?? "skill",
  }));

  return (
    <div className="flex flex-col min-h-full">
      <AuthHeader />

      <main id="main-content" className="flex-1 bg-bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-text-secondary" role="list">
              <li><Link href="/jobs" className="hover:text-primary transition-colors">งาน</Link></li>
              <li aria-hidden="true">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </li>
              <li aria-current="page" className="text-text-primary font-medium">{job.title}</li>
            </ol>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* LEFT */}
            <div>
              <Card>
                <div className="flex items-start gap-4">
                  <span aria-hidden="true" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-light text-primary text-lg font-bold shrink-0">
                    {initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h1 className="text-2xl font-bold text-text-primary">{job.title}</h1>
                        <p className="mt-1 text-text-secondary">
                          <Link href={`/companies/${job.companyId}`} className="font-medium hover:text-primary transition-colors">
                            {job.company.name}
                          </Link>
                        </p>
                        <p className="mt-1 text-sm text-text-tertiary">
                          {job.location} {job.jobType && `· ${job.jobType}`}
                        </p>
                      </div>
                      {job.level && <Badge variant="info" size="md">{job.level}</Badge>}
                    </div>
                    {tagItems.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2" aria-label="แท็ก">
                        {tagItems.map((tag) => (
                          <Tag key={tag.label} label={tag.label} category={tag.category} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {job.description && (
                <Card className="mt-6">
                  <h2 className="text-lg font-semibold text-text-primary">รายละเอียดงาน</h2>
                  <p className="mt-4 text-text-secondary leading-relaxed whitespace-pre-line">{job.description}</p>
                </Card>
              )}

              {job.qualifications && (
                <Card className="mt-6">
                  <h2 className="text-lg font-semibold text-text-primary">คุณสมบัติ</h2>
                  <p className="mt-4 text-text-secondary leading-relaxed whitespace-pre-line">{job.qualifications}</p>
                </Card>
              )}

              {job.benefits && (
                <Card className="mt-6">
                  <h2 className="text-lg font-semibold text-text-primary">สวัสดิการ</h2>
                  <p className="mt-4 text-text-secondary leading-relaxed whitespace-pre-line">{job.benefits}</p>
                </Card>
              )}
            </div>

            {/* RIGHT Sidebar */}
            <aside className="flex flex-col gap-6">
              <Card>
                <div className="flex flex-col items-center text-center">
                  <span aria-hidden="true" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-light text-primary text-2xl font-bold shrink-0">
                    {initials}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-text-primary">{job.company.name}</h3>
                  {(job.company.industry || job.company.size) && (
                    <p className="mt-1 text-sm text-text-secondary">
                      {[job.company.industry, job.company.size && `${job.company.size} พนักงาน`].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {job.company.shortBio && (
                    <p className="mt-3 text-sm text-text-secondary leading-relaxed">{job.company.shortBio}</p>
                  )}
                  <Link href={`/companies/${job.companyId}`} className="mt-4 text-sm font-medium text-text-link hover:underline rounded">
                    ดูข้อมูลบริษัท
                  </Link>
                </div>
              </Card>

              <Card>
                <div className="flex flex-col gap-3">
                  <Button href={`/dashboard/apply/${job.id}`} variant="accent" size="lg" className="w-full">
                    สมัครงาน
                  </Button>
                  <div className="flex gap-3">
                    <button type="button" className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-tertiary transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                      บันทึกงาน
                    </button>
                    <button type="button" className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-tertiary transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                      </svg>
                      แชร์
                    </button>
                  </div>
                </div>
              </Card>

              {prescreenCount > 0 && (
                <Card className="bg-warning-bg border-amber-200">
                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-warning shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <p className="text-sm text-amber-800">การสมัครนี้มีคำถามคัดกรอง {prescreenCount} ข้อ</p>
                  </div>
                </Card>
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
