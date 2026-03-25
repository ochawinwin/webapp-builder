"use client";

import React from "react";
import { cn } from "../lib/utils";

export interface CandidateCardProps {
  name: string;
  avatarUrl?: string;
  appliedDate: string;
  tags: string[];
  onMenuClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

function CandidateAvatar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string;
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        width={32}
        height={32}
        className="w-8 h-8 rounded-full object-cover shrink-0"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold shrink-0"
    >
      {initials}
    </span>
  );
}

function KebabIcon() {
  return (
    <svg
      className="w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  );
}

export function CandidateCard({
  name,
  avatarUrl,
  appliedDate,
  tags,
  onMenuClick,
  className,
}: CandidateCardProps) {
  const visibleTags = tags.slice(0, 3);

  return (
    <article
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-3 cursor-grab active:cursor-grabbing transition-shadow duration-150 hover:shadow-md",
        className
      )}
      aria-label={`ผู้สมัคร: ${name}`}
    >
      <div className="flex items-start gap-2">
        <CandidateAvatar name={name} avatarUrl={avatarUrl} />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-900 truncate">{name}</p>
          <p className="text-xs text-slate-400">สมัครเมื่อ {appliedDate}</p>
        </div>

        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 transition-colors"
            aria-label={`เมนูสำหรับ ${name}`}
          >
            <KebabIcon />
          </button>
        )}
      </div>

      {visibleTags.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="ทักษะ">
          {visibleTags.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs font-medium text-blue-700"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
