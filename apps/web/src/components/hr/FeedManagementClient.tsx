"use client";

import { useState, useTransition } from "react";
import { Button, Card, Input } from "@futurecareer/ui";
import { createPostAction, deletePostAction } from "@/app/actions/company.actions";
import {
  PlusCircle,
  Search,
  Trash2,
  Eye,
  Clock,
  Megaphone,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { CompanyPost } from "@futurecareer/types";

interface FeedManagementClientProps {
  initialPosts: CompanyPost[];
  companyId: string;
}

export function FeedManagementClient({ initialPosts, companyId }: FeedManagementClientProps) {
  const [posts, setPosts] = useState<CompanyPost[]>(initialPosts);
  const [isCreating, setIsCreating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createPostAction(formData);
      if (result.success) {
        setIsCreating(false);
        toast.success("สร้างโพสต์ใหม่สำเร็จ!");
        // Optimistically add the post
        const newPost: CompanyPost = {
          id: result.data?.postId ?? Date.now().toString(),
          company_id: companyId,
          created_by: "",
          created_at: new Date().toISOString(),
          content: formData.get("content") as string,
          title: (formData.get("content") as string).split("\n")[0]?.slice(0, 60) ?? "",
          image_url: null,
        };
        setPosts((prev) => [newPost, ...prev]);
      } else {
        setError(result.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    });
  };

  const handleDelete = (postId: string) => {
    if (!confirm("ยืนยันการลบโพสต์นี้?")) return;
    setDeletingId(postId);
    const formData = new FormData();
    formData.set("post_id", postId);

    startTransition(async () => {
      const result = await deletePostAction(formData);
      setDeletingId(null);
      if (result.success) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        toast.success("ลบโพสต์เรียบร้อยแล้ว");
      } else {
        toast.error(result.error ?? "เกิดข้อผิดพลาด");
      }
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "วันนี้";
    if (diffDays === 1) return "เมื่อวาน";
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} สัปดาห์ที่แล้ว`;
    return date.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-kanit mb-2">Company Feed</h1>
            <p className="text-muted-foreground font-sarabun">
              แชร์เรื่องราว กิจกรรม และประกาศต่างๆ ของบริษัทเพื่อดึงดูด Talent
            </p>
          </div>
          {!isCreating && (
            <Button
              className="gap-2 font-bold font-kanit h-12 shadow-lg shadow-primary/20"
              onClick={() => setIsCreating(true)}
            >
              <PlusCircle className="w-5 h-5" /> สร้างโพสต์ใหม่
            </Button>
          )}
        </div>

        {/* Create Form */}
        {isCreating && (
          <div className="mb-8">
            <Card className="p-8 border-none shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-kanit flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-primary" /> รายละเอียดโพสต์ใหม่
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCreating(false);
                    setError(null);
                  }}
                >
                  ยกเลิก
                </Button>
              </div>

              <form onSubmit={handlePost} className="space-y-6 font-sarabun">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">เนื้อหาโพสต์ *</label>
                      <textarea
                        name="content"
                        className="w-full min-h-[150px] p-4 rounded-xl border border-border bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm leading-relaxed"
                        placeholder="เขียนเนื้อหาที่คุณต้องการแชร์กับผู้สมัคร..."
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">รูปภาพประกอบ (ไม่บังคับ)</label>
                    <label className="h-[120px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/30 transition-colors cursor-pointer group">
                      <ImageIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold uppercase">อัปโหลดรูปภาพ</span>
                      <input type="file" name="image" accept="image/jpeg,image/png,image/webp" className="hidden" />
                    </label>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive bg-destructive/5 p-3 rounded-xl">{error}</p>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setError(null);
                    }}
                  >
                    ยกเลิก
                  </Button>
                  <Button className="px-8 font-bold" type="submit" disabled={isPending}>
                    {isPending ? "กำลังเผยแพร่..." : "เผยแพร่ทันที"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาโพสต์ของคุณ..."
              className="pl-10 h-10 border-none shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="p-0 border-none shadow-sm overflow-hidden flex flex-col md:flex-row group"
            >
              {post.image_url ? (
                <div className="md:w-48 h-48 md:h-auto shrink-0 relative overflow-hidden bg-slate-100">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
              ) : (
                <div className="md:w-48 h-48 md:h-auto shrink-0 bg-primary/10 flex flex-col items-center justify-center gap-2 text-primary">
                  <Megaphone className="w-8 h-8 opacity-40" />
                  <span className="text-[10px] font-bold uppercase opacity-60">No Image</span>
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold font-kanit mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 font-sarabun leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-sarabun font-medium mt-3">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {formatDate(post.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border mt-auto">
                  <a
                    href={`/company/${post.company_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="ghost" size="sm" className="w-full h-9 text-xs font-bold gap-2">
                      <Eye className="w-3.5 h-3.5" /> ดูโพสต์
                    </Button>
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-destructive hover:bg-destructive/5 rounded-lg"
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id || isPending}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {/* Add new post card */}
          <button
            onClick={() => setIsCreating(true)}
            className="border-2 border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all group"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <PlusCircle className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold font-kanit">แชร์เรื่องราวใหม่</h3>
              <p className="text-sm text-muted-foreground font-sarabun">
                เพิ่มโพสต์ใหม่เพื่อดึงดูด Candidate
              </p>
            </div>
          </button>
        </div>

        {filteredPosts.length === 0 && !isCreating && (
          <div className="text-center py-20 text-muted-foreground font-sarabun">
            <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-bold font-kanit">ยังไม่มีโพสต์</p>
            <p className="text-sm mt-2">เริ่มแชร์เรื่องราวบริษัทเพื่อดึงดูด Talent ที่ใช่</p>
          </div>
        )}
      </div>
    </div>
  );
}
