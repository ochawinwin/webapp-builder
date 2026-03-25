import React from "react";
import { cn } from "../lib/utils";

export interface JobCardProps {
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  jobType: string;
  tags: string[];
  matchPercent?: number;
  postedDate: string;
  href: string;
  className?: string;
}

function CompanyAvatar({
  company,
  companyLogo,
}: {
  company: string;
  companyLogo?: string;
}) {
  const initials = company
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (companyLogo) {
    return (
      <img
        src={companyLogo}
        alt={`${company} logo`}
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 text-slate-600 text-sm font-semibold shrink-0"
    >
      {initials}
    </span>
  );
}

function PinIcon() {
  return (
    <svg
      className="w-4 h-4 text-slate-400 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433a19.695 19.695 0 002.683-2.006c1.9-1.7 3.945-4.236 3.945-7.343a7 7 0 10-14 0c0 3.107 2.044 5.643 3.945 7.343a19.695 19.695 0 002.683 2.006 12.296 12.296 0 001.038.573l.018.008.006.003zM10 11a2 2 0 100-4 2 2 0 000 4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function JobCard({
  title,
  company,
  companyLogo,
  location,
  jobType,
  tags,
  matchPercent,
  postedDate,
  href,
  className,
}: JobCardProps) {
  return (
    <a
      href={href}
      className={cn(
        "block rounded-xl border border-slate-200 bg-white p-4 transition-all duration-150 hover:shadow-md hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2",
        className
      )}
    >
      <article aria-label={`${title} ที่ ${company}`}>
        {/* Header row */}
        <div className="flex items-start gap-3">
          <CompanyAvatar company={company} companyLogo={companyLogo} />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-slate-900 truncate leading-snug">
                  {title}
                </h3>
                <p className="text-sm text-slate-600">{company}</p>
              </div>

              {matchPercent != null && (
                <span className="inline-flex items-center shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  {matchPercent}% ตรงกัน
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            <PinIcon />
            {location}
          </span>
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
            {jobType}
          </span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="ทักษะที่เกี่ยวข้อง">
            {tags.map((tag) => (
              <li
                key={tag}
                className="inline-flex items-center rounded-md bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-medium text-blue-700"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <p className="mt-3 text-xs text-slate-400">โพสต์เมื่อ {postedDate}</p>
      </article>
    </a>
  );
}
