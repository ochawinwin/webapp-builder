import Link from "next/link";
import { Badge, Card, cn } from "@futurecareer/ui";
import { MapPin, Briefcase, Star, Clock } from "lucide-react";
import type { JobWithDetails } from "@futurecareer/types";

interface JobCardProps {
  job: JobWithDetails & { applicant_count?: number };
  isNew?: boolean;
  isRecommended?: boolean;
  userTagIds?: string[];
}

function formatSalary(salary: string | null | undefined): string {
  if (!salary) return "ไม่ระบุเงินเดือน";
  return salary;
}

function isNewJob(createdAt: string): boolean {
  const created = new Date(createdAt);
  const diff = Date.now() - created.getTime();
  return diff < 24 * 60 * 60 * 1000; // 24 hours
}

export function JobCard({ job, userTagIds = [] }: JobCardProps) {
  const jobIsNew = job.created_at ? isNewJob(job.created_at) : false;
  const matchCount = userTagIds.length > 0
    ? job.tags.filter((t) => userTagIds.includes(t.id)).length
    : 0;
  const isRecommended = matchCount > 0;

  const statusColorMap: Record<string, string> = {
    full_time: "bg-primary/10 text-primary",
    part_time: "bg-blue-50 text-blue-600",
    contract: "bg-orange-50 text-orange-600",
    internship: "bg-green-50 text-green-600",
  };
  const typeColor = statusColorMap[job.job_type ?? ""] ?? "bg-muted text-muted-foreground";

  return (
    <Link href={`/jobs/${job.id}`} className="block group">
      <Card className="p-6 border border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl border border-border bg-white flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
            {job.company?.logo_url ? (
              <img
                src={job.company.logo_url}
                alt={job.company.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Briefcase className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold font-kanit text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {job.title}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                {jobIsNew && (
                  <Badge className="bg-accent/10 text-accent border-none text-[10px] font-bold uppercase py-0.5 px-2">
                    ใหม่
                  </Badge>
                )}
                {isRecommended && (
                  <Badge className="bg-secondary/20 text-secondary-foreground border-none text-[10px] font-bold uppercase py-0.5 px-2">
                    <Star className="w-2.5 h-2.5 mr-1 fill-current" /> แนะนำ
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {job.company?.name}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {job.location}
            </span>
          )}
          {job.created_at && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />{" "}
              {new Date(job.created_at).toLocaleDateString("th-TH", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-4">
          {job.job_type && (
            <span
              className={cn(
                "text-[10px] font-bold uppercase px-2.5 py-1 rounded-full",
                typeColor
              )}
            >
              {job.job_type.replace("_", "-")}
            </span>
          )}
          {job.level && (
            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              {job.level}
            </span>
          )}
        </div>

        <p className="text-sm font-bold text-primary mb-4">
          {formatSalary(job.salary)}
        </p>

        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.tags.slice(0, 4).map((tag) => (
              <span
                key={tag.id}
                className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  userTagIds.includes(tag.id)
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                #{tag.name}
              </span>
            ))}
            {job.tags.length > 4 && (
              <span className="text-[10px] text-muted-foreground px-1">
                +{job.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </Card>
    </Link>
  );
}
