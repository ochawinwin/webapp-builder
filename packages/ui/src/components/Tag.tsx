import React from "react";
import { cn } from "../lib/utils";

export type TagCategory = "skill" | "industry" | "level" | "location" | "type";
export type TagSize = "sm" | "md";

export interface TagProps {
  label: string;
  category?: TagCategory;
  onRemove?: () => void;
  size?: TagSize;
  className?: string;
}

const categoryStyles: Record<TagCategory, string> = {
  skill: "bg-blue-50 text-blue-700 border-blue-200",
  industry: "bg-violet-50 text-violet-700 border-violet-200",
  level: "bg-amber-100 text-amber-800 border-amber-300",
  location: "bg-emerald-50 text-emerald-800 border-emerald-200",
  type: "bg-slate-100 text-slate-700 border-slate-300",
};

const sizeStyles: Record<TagSize, string> = {
  sm: "h-7 px-2.5 py-1 text-xs gap-1",
  md: "h-8 px-3 py-1.5 text-sm gap-1.5",
};

const closeIconSizes: Record<TagSize, string> = {
  sm: "w-3 h-3",
  md: "w-3.5 h-3.5",
};

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3.17 3.17a.75.75 0 011.06 0L6 4.94l1.77-1.77a.75.75 0 111.06 1.06L7.06 6l1.77 1.77a.75.75 0 11-1.06 1.06L6 7.06 4.23 8.83a.75.75 0 01-1.06-1.06L4.94 6 3.17 4.23a.75.75 0 010-1.06z" />
    </svg>
  );
}

export function Tag({
  label,
  category = "skill",
  onRemove,
  size = "sm",
  className,
}: TagProps) {
  const colorClasses = categoryStyles[category];
  const sizeClasses = sizeStyles[size];
  const iconSize = closeIconSizes[size];

  const baseClasses = cn(
    "inline-flex items-center rounded-md border font-medium transition-colors",
    colorClasses,
    sizeClasses,
    className
  );

  if (onRemove) {
    return (
      <span className={baseClasses}>
        {label}
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center justify-center rounded hover:bg-black/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 shrink-0"
          aria-label={`ลบ ${label}`}
        >
          <CloseIcon className={iconSize} />
        </button>
      </span>
    );
  }

  return <span className={baseClasses}>{label}</span>;
}
