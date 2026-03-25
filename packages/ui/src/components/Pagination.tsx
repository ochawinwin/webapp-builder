"use client";

import React from "react";
import { cn } from "../lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function ChevronLeftIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
    </svg>
  );
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  pages.push(1);

  if (current > 4) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 3) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <nav
      aria-label="การแบ่งหน้า"
      className={cn("flex items-center gap-1", className)}
    >
      {/* Previous */}
      <button
        type="button"
        onClick={() => !isFirst && onPageChange(currentPage - 1)}
        disabled={isFirst}
        aria-label="หน้าก่อนหน้า"
        className={cn(
          "inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
          isFirst
            ? "text-slate-300 cursor-not-allowed"
            : "text-slate-600 hover:bg-slate-100 cursor-pointer"
        )}
      >
        <ChevronLeftIcon />
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="inline-flex items-center justify-center w-8 h-8 text-sm text-slate-400 select-none"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => page !== currentPage && onPageChange(page)}
            aria-label={`หน้า ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
              page === currentPage
                ? "bg-blue-600 text-white cursor-default"
                : "text-slate-700 hover:bg-slate-100 cursor-pointer"
            )}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => !isLast && onPageChange(currentPage + 1)}
        disabled={isLast}
        aria-label="หน้าถัดไป"
        className={cn(
          "inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
          isLast
            ? "text-slate-300 cursor-not-allowed"
            : "text-slate-600 hover:bg-slate-100 cursor-pointer"
        )}
      >
        <ChevronRightIcon />
      </button>
    </nav>
  );
}
