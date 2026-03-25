import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tag } from "@/components/ui/Tag";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

const jobData = {
  title: "Senior Frontend Developer",
  company: "TechCorp",
  location: "กรุงเทพฯ",
  type: "Full-time",
  postedAt: "2 วันที่แล้ว",
  matchPercent: 92,
  tags: [
    { label: "React", category: "skill" as const },
    { label: "TypeScript", category: "skill" as const },
    { label: "Next.js", category: "skill" as const },
    { label: "Senior", category: "level" as const },
    { label: "Full-time", category: "type" as const },
  ],
  responsibilities: [
    "พัฒนาและดูแล Frontend Application ด้วย React และ TypeScript",
    "ออกแบบ Component Architecture ที่สามารถ Reuse และ Scale ได้",
    "ทำงานร่วมกับทีม UX/UI และ Backend เพื่อส่งมอบ Feature ใหม่",
  ],
  qualifications: [
    "มีประสบการณ์ทำงาน Frontend Development อย่างน้อย 5 ปี",
    "เชี่ยวชาญ React, TypeScript และ Modern CSS (Tailwind/CSS Modules)",
    "มีประสบการณ์กับ State Management, Testing และ CI/CD Pipelines",
  ],
  benefits: [
    "ประกันสุขภาพกลุ่มสำหรับพนักงานและครอบครัว",
    "Flexible Working Hours และ Remote 2 วัน/สัปดาห์",
    "งบพัฒนาตัวเอง 50,000 บาท/ปี สำหรับคอร์สและ Conference",
  ],
  companyInfo: {
    name: "TechCorp",
    industry: "Technology",
    size: "51-200",
    bio: "TechCorp เป็นบริษัทเทคโนโลยีชั้นนำที่มุ่งเน้นการพัฒนาโซลูชัน Digital สำหรับองค์กร ก่อตั้งมาแล้วกว่า 10 ปี",
  },
};

function CompanyAvatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-light text-primary text-lg font-bold shrink-0"
    >
      {initials}
    </span>
  );
}

function SidebarCompanyAvatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-light text-primary text-2xl font-bold shrink-0"
    >
      {initials}
    </span>
  );
}

export default function JobDetailPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Navbar />

      <main id="main-content" className="flex-1 bg-bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-text-secondary" role="list">
              <li>
                <Link href="/jobs" className="hover:text-primary transition-colors">งาน</Link>
              </li>
              <li aria-hidden="true">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </li>
              <li>
                <Link href="/jobs?category=engineering" className="hover:text-primary transition-colors">Engineering</Link>
              </li>
              <li aria-hidden="true">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </li>
              <li aria-current="page" className="text-text-primary font-medium">
                {jobData.title}
              </li>
            </ol>
          </nav>

          {/* Two Column Layout */}
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* LEFT Column */}
            <div>
              {/* Job Header */}
              <Card>
                <div className="flex items-start gap-4">
                  <CompanyAvatar name={jobData.company} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h1 className="text-2xl font-bold text-text-primary">{jobData.title}</h1>
                        <p className="mt-1 text-text-secondary">
                          <Link href="/companies/1" className="font-medium hover:text-primary transition-colors">
                            {jobData.company}
                          </Link>
                        </p>
                        <p className="mt-1 text-sm text-text-tertiary">
                          {jobData.location} · {jobData.type} · โพสต์เมื่อ {jobData.postedAt}
                        </p>
                      </div>
                      <Badge variant="success" size="md">
                        ตรงกัน: {jobData.matchPercent}%
                      </Badge>
                    </div>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-2" aria-label="แท็ก">
                      {jobData.tags.map((tag) => (
                        <Tag key={tag.label} category={tag.category}>
                          {tag.label}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Responsibilities */}
              <Card className="mt-6">
                <h2 className="text-lg font-semibold text-text-primary">หน้าที่รับผิดชอบ</h2>
                <ul className="mt-4 space-y-3" role="list">
                  {jobData.responsibilities.map((item, i) => (
                    <li key={i} className="flex gap-3 text-text-secondary">
                      <svg className="h-5 w-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Qualifications */}
              <Card className="mt-6">
                <h2 className="text-lg font-semibold text-text-primary">คุณสมบัติ</h2>
                <ul className="mt-4 space-y-3" role="list">
                  {jobData.qualifications.map((item, i) => (
                    <li key={i} className="flex gap-3 text-text-secondary">
                      <svg className="h-5 w-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Benefits */}
              <Card className="mt-6">
                <h2 className="text-lg font-semibold text-text-primary">สวัสดิการ</h2>
                <ul className="mt-4 space-y-3" role="list">
                  {jobData.benefits.map((item, i) => (
                    <li key={i} className="flex gap-3 text-text-secondary">
                      <svg className="h-5 w-5 text-warning shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* RIGHT Sidebar */}
            <aside className="flex flex-col gap-6">
              {/* Company Mini Card */}
              <Card>
                <div className="flex flex-col items-center text-center">
                  <SidebarCompanyAvatar name={jobData.companyInfo.name} />
                  <h3 className="mt-4 text-lg font-semibold text-text-primary">{jobData.companyInfo.name}</h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {jobData.companyInfo.industry} · {jobData.companyInfo.size} พนักงาน
                  </p>
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                    {jobData.companyInfo.bio}
                  </p>
                  <Link
                    href="/companies/1"
                    className="mt-4 text-sm font-medium text-text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded"
                  >
                    ดูข้อมูลบริษัท
                  </Link>
                </div>
              </Card>

              {/* Actions */}
              <Card>
                <div className="flex flex-col gap-3">
                  <Button href="/auth/login" variant="accent" size="lg" className="w-full">
                    สมัครงาน
                  </Button>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-tertiary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                      บันทึกงาน
                    </button>
                    <button
                      type="button"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-tertiary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                      </svg>
                      แชร์
                    </button>
                  </div>
                </div>
              </Card>

              {/* Pre-screen Notice */}
              <Card className="bg-warning-bg border-amber-200">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-warning shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <p className="text-sm text-amber-800">
                    การสมัครนี้มีคำถามคัดกรอง 3 ข้อ
                  </p>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
