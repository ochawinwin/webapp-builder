"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { JobCard } from "@/components/shared/JobCard";

const companyData = {
  name: "TechCorp",
  industry: "Technology",
  size: "51-200 พนักงาน",
  bio: "TechCorp เป็นบริษัทเทคโนโลยีชั้นนำที่มุ่งเน้นการพัฒนาโซลูชัน Digital สำหรับองค์กร ก่อตั้งมาแล้วกว่า 10 ปี",
  aboutFull: [
    "TechCorp ก่อตั้งขึ้นในปี 2559 ด้วยวิสัยทัศน์ที่จะเปลี่ยนแปลงวิธีการทำงานขององค์กรผ่านเทคโนโลยีที่ทันสมัย เราเชี่ยวชาญในการพัฒนาแพลตฟอร์ม SaaS สำหรับการจัดการทรัพยากรบุคคล การเงิน และการบริหารโครงการ โดยมีลูกค้ากว่า 500 องค์กรทั่วประเทศ",
    "ทีมงานของเรามากกว่า 120 คนทำงานร่วมกันในสภาพแวดล้อมที่เปิดกว้างและส่งเสริมนวัตกรรม เราเชื่อว่าคนเก่งคือหัวใจของบริษัท จึงให้ความสำคัญกับการพัฒนาทักษะ Work-Life Balance และวัฒนธรรมองค์กรที่แข็งแกร่ง เรากำลังมองหาคนรุ่นใหม่ที่มีใจรักเทคโนโลยีเพื่อร่วมสร้างอนาคตไปด้วยกัน",
  ],
};

const openPositions = [
  {
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "กรุงเทพฯ",
    type: "Full-time",
    tags: ["React", "TypeScript", "Senior"],
    matchPercent: 92,
    postedAt: "2 วันที่แล้ว",
    href: "/jobs/1",
  },
  {
    title: "Backend Engineer",
    company: "TechCorp",
    location: "กรุงเทพฯ",
    type: "Full-time",
    tags: ["Go", "PostgreSQL", "Mid-level"],
    matchPercent: 78,
    postedAt: "5 วันที่แล้ว",
    href: "/jobs/3",
  },
  {
    title: "DevOps Engineer",
    company: "TechCorp",
    location: "กรุงเทพฯ",
    type: "Full-time",
    tags: ["AWS", "Docker", "K8s"],
    matchPercent: 71,
    postedAt: "1 สัปดาห์ที่แล้ว",
    href: "/jobs/4",
  },
];

const feedPosts = [
  {
    date: "18 มี.ค. 2569",
    title: "TechCorp จัดงาน Tech Meetup ครั้งที่ 5",
    content:
      "เราจัดงาน Meetup หัวข้อ \"Modern Frontend Architecture\" ที่สำนักงานใหญ่ กรุงเทพฯ มีผู้เข้าร่วมกว่า 80 คน ขอบคุณทุกคนที่มาแบ่งปันความรู้และประสบการณ์กัน งานหน้าเจอกันนะครับ!",
  },
  {
    date: "10 มี.ค. 2569",
    title: "เปิดตัว TechCorp Platform V3",
    content:
      "พร้อมเปิดตัว Platform เวอร์ชัน 3 อย่างเป็นทางการ มาพร้อม AI-Powered Analytics, Real-time Dashboard และ UX ที่ปรับปรุงใหม่ทั้งหมด ลูกค้าปัจจุบันจะได้รับอัปเกรดฟรีภายในเดือนนี้",
  },
];

type TabKey = "about" | "positions" | "feed";

const tabs: { key: TabKey; label: string; count?: number }[] = [
  { key: "about", label: "เกี่ยวกับ" },
  { key: "positions", label: "ตำแหน่งที่เปิดรับ", count: 3 },
  { key: "feed", label: "ฟีด" },
];

function CompanyLogoLarge({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-bg-primary text-primary text-3xl font-bold shadow-md border-4 border-bg-primary"
    >
      {initials}
    </span>
  );
}

export default function CompanyProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("about");

  return (
    <div className="flex flex-col min-h-full">
      <Navbar />

      <main id="main-content" className="flex-1 bg-bg-secondary">
        {/* Cover Image Placeholder */}
        <div
          className="h-48 sm:h-56 lg:h-64 w-full"
          style={{
            background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 50%, #1E3A8A 100%)",
          }}
          role="img"
          aria-label="ภาพปกบริษัท TechCorp"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Company Header */}
          <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <CompanyLogoLarge name={companyData.name} />
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">{companyData.name}</h1>
              <p className="mt-1 text-text-secondary">
                {companyData.industry} · {companyData.size}
              </p>
              <p className="mt-2 text-sm text-text-secondary max-w-xl">{companyData.bio}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-border-default" role="tablist" aria-label="ข้อมูลบริษัท">
            <div className="flex gap-0">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  role="tab"
                  id={`company-tab-${tab.key}`}
                  aria-selected={activeTab === tab.key}
                  aria-controls={`company-panel-${tab.key}`}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                    activeTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-strong"
                  }`}
                >
                  {tab.label}
                  {tab.count != null && (
                    <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Panels */}
          <div className="py-8">
            {/* About Panel */}
            {activeTab === "about" && (
              <div
                id="company-panel-about"
                role="tabpanel"
                aria-labelledby="company-tab-about"
              >
                <Card>
                  <div className="space-y-4">
                    {companyData.aboutFull.map((paragraph, i) => (
                      <p key={i} className="text-text-secondary leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                  <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-text-tertiary">อุตสาหกรรม</dt>
                      <dd className="mt-1 text-text-primary font-medium">{companyData.industry}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-text-tertiary">ขนาดบริษัท</dt>
                      <dd className="mt-1 text-text-primary font-medium">{companyData.size}</dd>
                    </div>
                  </dl>
                </Card>
              </div>
            )}

            {/* Positions Panel */}
            {activeTab === "positions" && (
              <div
                id="company-panel-positions"
                role="tabpanel"
                aria-labelledby="company-tab-positions"
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {openPositions.map((job) => (
                    <JobCard key={job.href} {...job} />
                  ))}
                </div>
              </div>
            )}

            {/* Feed Panel */}
            {activeTab === "feed" && (
              <div
                id="company-panel-feed"
                role="tabpanel"
                aria-labelledby="company-tab-feed"
              >
                <div className="space-y-4">
                  {feedPosts.map((post, i) => (
                    <Card key={i}>
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          aria-hidden="true"
                          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-light text-primary text-sm font-bold"
                        >
                          TC
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{companyData.name}</p>
                          <time className="text-xs text-text-tertiary">{post.date}</time>
                        </div>
                      </div>
                      <h3 className="text-base font-semibold text-text-primary">{post.title}</h3>
                      <p className="mt-2 text-sm text-text-secondary leading-relaxed">{post.content}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
