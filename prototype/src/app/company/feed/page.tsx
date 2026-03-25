"use client";

import { useState } from "react";

interface Post {
  id: number;
  date: string;
  title: string;
  content: string;
}

const initialPosts: Post[] = [
  {
    id: 1,
    date: "20 มี.ค. 2026",
    title: "เปิดรับสมัคร Senior Frontend Developer",
    content:
      "เรากำลังมองหา Senior Frontend Developer ที่มีประสบการณ์ React/Next.js เพื่อร่วมทีมพัฒนาผลิตภัณฑ์ใหม่ สนใจดูรายละเอียดเพิ่มเติมที่หน้า Jobs ได้เลย!",
  },
  {
    id: 2,
    date: "15 มี.ค. 2026",
    title: "TechCorp ได้รับรางวัล Best Workplace 2026",
    content:
      "เราภูมิใจที่ได้รับรางวัลสถานที่ทำงานยอดเยี่ยมประจำปี 2026 จาก Thailand HR Awards ขอบคุณทีมงานทุกคนที่ร่วมสร้างวัฒนธรรมการทำงานที่ดี",
  },
];

export default function CompanyFeedPage() {
  const [posts] = useState<Post[]>(initialPosts);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <h1 className="mb-6 text-2xl font-bold text-text-primary">ฟีดบริษัท</h1>

      {/* Compose card */}
      <section
        className="mb-6 rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm"
        aria-label="สร้างโพสต์ใหม่"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="post-title"
              className="mb-2 block text-sm font-medium text-text-primary"
            >
              หัวข้อ
            </label>
            <input
              id="post-title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="หัวข้อโพสต์"
              className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
            />
          </div>

          <div>
            <label
              htmlFor="post-content"
              className="mb-2 block text-sm font-medium text-text-primary"
            >
              เนื้อหา
            </label>
            <textarea
              id="post-content"
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="แชร์อัปเดต ประกาศ หรือเรื่องราว..."
              className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-sm text-text-primary shadow-sm transition-colors placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-bg-primary px-4 py-2 text-sm font-medium text-text-secondary shadow-sm transition-colors hover:bg-bg-tertiary"
            >
              <span aria-hidden="true">&#128206;</span>
              แนบรูปภาพ
            </button>
            <button
              type="button"
              className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-text-inverse shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              เผยแพร่
            </button>
          </div>
        </div>
      </section>

      {/* Existing posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-xl border border-border-default bg-bg-primary p-6 shadow-sm"
          >
            <p className="mb-1 text-xs text-text-tertiary">{post.date}</p>
            <h2 className="mb-2 text-lg font-semibold text-text-primary">
              {post.title}
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-text-secondary">
              {post.content}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-lg border border-border-default bg-bg-primary px-4 py-1.5 text-sm font-medium text-text-secondary shadow-sm transition-colors hover:bg-bg-tertiary"
              >
                แก้ไข
              </button>
              <button
                type="button"
                className="rounded-lg border border-error bg-bg-primary px-4 py-1.5 text-sm font-medium text-error shadow-sm transition-colors hover:bg-error-bg"
              >
                ลบ
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
