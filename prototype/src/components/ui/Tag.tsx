"use client";

import React from "react";

type TagCategory = "skill" | "industry" | "level" | "location" | "type";

export interface TagProps {
  category?: TagCategory;
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

const categoryClasses: Record<TagCategory, string> = {
  skill: "bg-blue-50 text-blue-700 border-blue-200",
  industry: "bg-violet-50 text-violet-700 border-violet-200",
  level: "bg-amber-50 text-amber-700 border-amber-200",
  location: "bg-emerald-50 text-emerald-700 border-emerald-200",
  type: "bg-gray-50 text-gray-700 border-gray-200",
};

export function Tag({
  category = "type",
  children,
  onRemove,
  className = "",
}: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[6px] border px-2.5 py-1 text-xs font-medium ${categoryClasses[category]} ${className}`}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/10 transition-colors"
          aria-label="ลบแท็ก"
        >
          <svg
            className="h-3 w-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
