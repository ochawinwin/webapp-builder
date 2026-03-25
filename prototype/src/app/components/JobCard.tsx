import { Link } from "react-router";
import { Card, Badge, Button, cn } from "./UI";
import { MapPin, Briefcase, Clock, DollarSign, Building2, ChevronRight, Star } from "lucide-react";
import { motion } from "motion/react";

export interface Job {
  id: string;
  title: string;
  companyName: string;
  logo?: string;
  location: string;
  salary: string;
  type: string;
  level: string;
  tags: string[];
  postedAt: string;
  isNew?: boolean;
  isRecommended?: boolean;
}

interface JobCardProps {
  job: Job;
  compact?: boolean;
}

export function JobCard({ job, compact = false }: JobCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link to={`/jobs/${job.id}`}>
        <Card className={cn(
          "p-6 h-full flex flex-col gap-4 group relative overflow-hidden",
          job.isRecommended && "border-primary/20 bg-primary/[0.02]"
        )}>
          {job.isRecommended && (
            <div className="absolute top-0 right-0">
              <div className="bg-secondary text-secondary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
                <Star className="w-3 h-3 fill-current" /> RECOMMENDED
              </div>
            </div>
          )}

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl border border-border bg-white flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
              {job.logo ? (
                <img src={job.logo} alt={job.companyName} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{job.title}</h3>
                {job.isNew && <Badge variant="accent" className="text-[10px] h-4">NEW</Badge>}
              </div>
              <p className="text-muted-foreground font-medium flex items-center gap-1.5 text-sm">
                <Building2 className="w-4 h-4" /> {job.companyName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary/60" /> {job.location}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Briefcase className="w-4 h-4 text-primary/60" /> {job.type}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4 text-primary/60" /> {job.salary}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-primary/60" /> {job.postedAt}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {job.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="bg-muted text-foreground border-none font-medium px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {job.tags.length > 3 && (
              <span className="text-xs text-muted-foreground self-center">+{job.tags.length - 3}</span>
            )}
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50 group-hover:border-primary/20">
             <span className="text-xs text-muted-foreground">ผู้สมัครแล้ว 12 คน</span>
             <div className="text-primary font-bold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
               ดูรายละเอียด <ChevronRight className="w-4 h-4" />
             </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
