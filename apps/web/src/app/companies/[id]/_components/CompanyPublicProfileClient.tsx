"use client";

import { useState } from "react";
import { Card, JobCard } from "@futurecareer/ui";
import type { Company, JobWithTags, CompanyFeedPost } from "@futurecareer/types";

interface Props {
  company: Company;
  positions: JobWithTags[];
  feedPosts: CompanyFeedPost[];
}

type TabKey = "about" | "positions" | "feed";

export default function CompanyPublicProfileClient({ company, positions, feedPosts }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("about");
  const initials = company.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const TABS: { key: TabKey; label: string; count?: number }[] = [
    { key: "about", label: "เกี่ยวกับ" },
    { key: "positions", label: "ตำแหน่งที่เปิดรับ", count: positions.length },
    { key: "feed", label: "ฟีด" },
  ];

  return (
    <main id="main-content" className="flex-1 bg-bg-secondary">
      <div
        className="h-48 sm:h-56 lg:h-64 w-full"
        style={{ background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 50%, #1E3A8A 100%)" }}
        role="img"
        aria-label={`ภาพปกบริษัท ${company.name}`}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
          <span aria-hidden="true" className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-bg-primary text-primary text-3xl font-bold shadow-md border-4 border-bg-primary">
            {initials}
          </span>
          <div className="pb-2">
            <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">{company.name}</h1>
            <p className="mt-1 text-text-secondary">
              {[company.industry, company.size].filter(Boolean).join(" · ")}
            </p>
            {company.shortBio && (
              <p className="mt-2 text-sm text-text-secondary max-w-xl">{company.shortBio}</p>
            )}
          </div>
        </div>

        <div className="mt-8 border-b border-border-default" role="tablist" aria-label="ข้อมูลบริษัท">
          <div className="flex gap-0">
            {TABS.map((tab) => (
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

        <div className="py-8">
          {activeTab === "about" && (
            <div id="company-panel-about" role="tabpanel" aria-labelledby="company-tab-about">
              <Card>
                {company.fullBio ? (
                  <div className="space-y-4">
                    {company.fullBio.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="text-text-secondary leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                ) : company.shortBio ? (
                  <p className="text-text-secondary leading-relaxed">{company.shortBio}</p>
                ) : (
                  <p className="text-text-tertiary">ยังไม่มีข้อมูลเกี่ยวกับบริษัท</p>
                )}
                <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                  {company.industry && (
                    <div>
                      <dt className="text-sm font-medium text-text-tertiary">อุตสาหกรรม</dt>
                      <dd className="mt-1 text-text-primary font-medium">{company.industry}</dd>
                    </div>
                  )}
                  {company.size && (
                    <div>
                      <dt className="text-sm font-medium text-text-tertiary">ขนาดบริษัท</dt>
                      <dd className="mt-1 text-text-primary font-medium">{company.size}</dd>
                    </div>
                  )}
                </dl>
              </Card>
            </div>
          )}

          {activeTab === "positions" && (
            <div id="company-panel-positions" role="tabpanel" aria-labelledby="company-tab-positions">
              {positions.length === 0 ? (
                <p className="text-text-secondary">ไม่มีตำแหน่งที่เปิดรับในขณะนี้</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {positions.map((job) => (
                    <JobCard
                      key={job.id}
                      title={job.title}
                      company={company.name}
                      location={job.location ?? ""}
                      jobType={job.jobType ?? ""}
                      tags={job.tags.map((t) => t.name)}
                      postedDate={job.createdAt}
                      href={`/jobs/${job.id}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "feed" && (
            <div id="company-panel-feed" role="tabpanel" aria-labelledby="company-tab-feed">
              {feedPosts.length === 0 ? (
                <p className="text-text-secondary">ยังไม่มีโพสต์</p>
              ) : (
                <div className="space-y-4">
                  {feedPosts.map((post) => (
                    <Card key={post.id}>
                      <div className="flex items-center gap-3 mb-3">
                        <span aria-hidden="true" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-light text-primary text-sm font-bold">
                          {initials}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{company.name}</p>
                          <time className="text-xs text-text-tertiary">
                            {new Date(post.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })}
                          </time>
                        </div>
                      </div>
                      <h3 className="text-base font-semibold text-text-primary">{post.title}</h3>
                      {post.content && (
                        <p className="mt-2 text-sm text-text-secondary leading-relaxed">{post.content}</p>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
