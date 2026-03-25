"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, cn } from "@futurecareer/ui";
import { JobCard } from "@/components/JobCard";
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Check,
  ChevronDown,
  Star,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { JobWithDetails } from "@futurecareer/types";
import Link from "next/link";

const JOB_TYPES = ["full_time", "part_time", "contract", "internship"];
const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
};
const EXPERIENCE_LEVELS = ["junior", "mid", "senior", "lead"];

interface JobSearchClientProps {
  jobs: JobWithDetails[];
  total: number;
  currentPage: number;
  initialQuery: string;
  initialTypes: string[];
  initialLevels: string[];
  userTagIds: string[];
  isLoggedIn: boolean;
}

export function JobSearchClient({
  jobs,
  total,
  currentPage,
  initialQuery,
  initialTypes,
  initialLevels,
  userTagIds,
  isLoggedIn,
}: JobSearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialTypes);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(initialLevels);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const updateURL = useCallback(
    (params: Record<string, string | string[] | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
          current.delete(key);
        } else if (Array.isArray(value)) {
          current.delete(key);
          value.forEach((v) => current.append(key, v));
        } else {
          current.set(key, value);
        }
      }
      current.set("page", "1");

      startTransition(() => {
        router.push(`/search?${current.toString()}`);
      });
    },
    [router, searchParams]
  );

  const handleSearch = () => {
    updateURL({ q: searchQuery, types: selectedTypes, levels: selectedLevels });
  };

  const toggleType = (type: string) => {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(next);
    updateURL({ types: next });
  };

  const toggleLevel = (level: string) => {
    const next = selectedLevels.includes(level)
      ? selectedLevels.filter((l) => l !== level)
      : [...selectedLevels, level];
    setSelectedLevels(next);
    updateURL({ levels: next });
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedLevels([]);
    setSearchQuery("");
    startTransition(() => {
      router.push("/search");
    });
  };

  const handleTagSearch = (tag: string) => {
    setSearchQuery(tag);
    updateURL({ q: tag });
  };

  const goToPage = (page: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", String(page));
    startTransition(() => {
      router.push(`/search?${current.toString()}`);
    });
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Top Search Banner */}
      <div className="bg-white border-b border-border pt-12 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <h1 className="text-3xl lg:text-4xl font-bold font-kanit">
              ค้นหางานที่ใช่สำหรับคุณ
            </h1>
            <div className="flex flex-col md:flex-row gap-3 p-2 bg-muted rounded-2xl border border-border/50 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <div className="flex-1 relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="ตำแหน่งงาน, ทักษะ หรือ ชื่อบริษัท..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-12 h-12 bg-transparent border-none shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="w-px bg-border/50 hidden md:block"></div>
              <div className="flex-1 relative flex items-center">
                <MapPin className="absolute left-4 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="สถานที่ปฏิบัติงาน..."
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="pl-12 h-12 bg-transparent border-none shadow-none focus-visible:ring-0"
                />
              </div>
              <Button
                size="lg"
                className="h-12 px-8 font-kanit font-bold rounded-xl"
                onClick={handleSearch}
                disabled={isPending}
              >
                ค้นหา
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted-foreground font-medium">
                แท็กยอดนิยม:
              </span>
              {["React", "UI/UX", "Remote", "Senior"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSearch(tag)}
                  className="text-xs px-3 py-1 bg-primary/5 text-primary rounded-full font-bold hover:bg-primary/10 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={cn(
              "lg:w-72 shrink-0 space-y-8 lg:block",
              isSidebarOpen ? "block" : "hidden"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold font-kanit text-lg flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" /> ตัวกรอง
              </h3>
              <button
                onClick={clearFilters}
                className="text-xs text-primary font-bold hover:underline"
              >
                ล้างทั้งหมด
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                ประเภทงาน
              </h4>
              <div className="flex flex-col gap-2">
                {JOB_TYPES.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      onClick={() => toggleType(type)}
                      className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                        selectedTypes.includes(type)
                          ? "bg-primary border-primary"
                          : "border-border group-hover:border-primary"
                      )}
                    >
                      {selectedTypes.includes(type) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{JOB_TYPE_LABELS[type] ?? type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                ระดับประสบการณ์
              </h4>
              <div className="flex flex-col gap-2">
                {EXPERIENCE_LEVELS.map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      onClick={() => toggleLevel(level)}
                      className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                        selectedLevels.includes(level)
                          ? "bg-primary border-primary"
                          : "border-border group-hover:border-primary"
                      )}
                    >
                      {selectedLevels.includes(level) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
              <p className="text-xs font-bold text-primary mb-2 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-current" /> Personalized Match
              </p>
              {isLoggedIn ? (
                <>
                  <p className="text-xs text-primary/80 leading-relaxed font-sarabun mb-2">
                    เรากำลังแสดงงานที่ตรงกับทักษะของคุณ
                  </p>
                  <Link
                    href="/profile"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    ปรับแต่งทักษะของคุณ →
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-xs text-primary/80 leading-relaxed font-sarabun">
                    ลงชื่อเข้าใช้เพื่อดูตำแหน่งงานที่ระบบคัดกรองมาให้ตรงกับทักษะของคุณโดยเฉพาะ
                  </p>
                  <Link
                    href="/login"
                    className="mt-3 block text-xs font-bold text-primary hover:underline"
                  >
                    เข้าสู่ระบบเพื่อใช้งาน →
                  </Link>
                </>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <p className="font-medium text-muted-foreground">
                พบทั้งหมด{" "}
                <span className="text-foreground font-bold">{total}</span>{" "}
                ตำแหน่งงาน
                {isPending && (
                  <span className="ml-2 text-xs text-primary animate-pulse">
                    กำลังโหลด...
                  </span>
                )}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden flex items-center gap-2"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <Filter className="w-4 h-4" /> ตัวกรอง
                </Button>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground hidden sm:block">
                    เรียงตาม:
                  </span>
                  <button className="flex items-center gap-1.5 font-bold hover:text-primary transition-colors">
                    อัปเดตล่าสุด <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <JobCard job={job} userTagIds={userTagIds} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-12 text-center border border-dashed border-border flex flex-col items-center justify-center gap-6"
                >
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                    <Search className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-kanit mb-2">
                      ไม่พบงานที่ค้นหา
                    </h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      ลองใช้คำค้นหาอื่น หรือล้างตัวกรองเพื่อดูงานทั้งหมดในระบบ
                    </p>
                  </div>
                  <Button variant="outline" onClick={clearFilters}>
                    ล้างตัวกรองทั้งหมด
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
