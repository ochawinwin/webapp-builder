"use client";

import { useState, useEffect } from "react";
import { useRealtime } from "@/hooks/useRealtime";
import { Button } from "@futurecareer/ui";
import { createBrowserClient } from "@/lib/supabase/browser";
import { createFeedPostAction, deleteFeedPostAction } from "@/app/actions/feedActions";

interface Post {
  id: string;
  date: string;
  title: string;
  content: string;
}

type FeedPostRow = {
  id: string;
  created_at: string;
  title: string;
  content: string;
};

function formatThaiDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CompanyFeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeed() {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: membership } = await supabase.from("company_members").select("company_id").eq("user_id", user.id).single();
      if (!membership?.company_id) return;
      const cid = membership.company_id;
      setCompanyId(cid);
      const { data } = await supabase.from("company_feed_posts").select("*").eq("company_id", cid).order("created_at", { ascending: false });
      if (data) setPosts(data.map((p) => ({ id: p.id, date: formatThaiDate(p.created_at ?? new Date().toISOString()), title: p.title, content: p.content ?? "" })));
      setLoading(false);
    }
    fetchFeed();
  }, []);

  useRealtime<FeedPostRow>({
    table: "company_feed_posts",
    event: "INSERT",
    callback: (payload) => {
      const post: Post = {
        id: payload.new.id,
        date: formatThaiDate(payload.new.created_at),
        title: payload.new.title,
        content: payload.new.content,
      };
      setPosts((prev) => {
        // Replace optimistic post (temp-*) with the real one, or prepend if not found
        const hasOptimistic = prev.some((p) => p.id.startsWith("temp-") && p.title === post.title);
        if (hasOptimistic) return prev.map((p) => p.id.startsWith("temp-") && p.title === post.title ? post : p);
        // Avoid duplicate if already in list
        if (prev.some((p) => p.id === post.id)) return prev;
        return [post, ...prev];
      });
    },
  });

  useRealtime<FeedPostRow>({
    table: "company_feed_posts",
    event: "UPDATE",
    callback: (payload) => {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === payload.new.id
            ? { ...p, title: payload.new.title, content: payload.new.content }
            : p
        )
      );
    },
  });

  useRealtime<FeedPostRow>({
    table: "company_feed_posts",
    event: "DELETE",
    callback: (payload) => {
      setPosts((prev) => prev.filter((p) => p.id !== payload.old.id));
    },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-text-primary">ฟีดบริษัท</h1>

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
            <Button variant="outline" size="sm">
              แนบรูปภาพ
            </Button>
            <Button variant="primary" size="md" onClick={async () => {
              if (!newTitle.trim()) return;
              const optimistic: Post = { id: `temp-${Date.now()}`, date: formatThaiDate(new Date().toISOString()), title: newTitle, content: newContent };
              setPosts((prev) => [optimistic, ...prev]);
              setNewTitle(""); setNewContent("");
              const result = await createFeedPostAction(companyId!, { title: optimistic.title, content: optimistic.content });
              if (!result.success) { setPosts((prev) => prev.filter((p) => p.id !== optimistic.id)); }
            }}>
              เผยแพร่
            </Button>
          </div>
        </div>
      </section>

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
              <Button variant="outline" size="sm">แก้ไข</Button>
              <Button variant="danger" size="sm" onClick={async () => {
                await deleteFeedPostAction(post.id);
                setPosts((prev) => prev.filter((p) => p.id !== post.id));
              }}>ลบ</Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
