import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseHref: string;
  className?: string;
}

function getPageUrl(baseHref: string, page: number): string {
  const separator = baseHref.includes("?") ? "&" : "?";
  return `${baseHref}${separator}page=${page}`;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  if (currentPage <= 3) {
    pages.push(1, 2, 3, 4, "...", totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
  }

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  baseHref,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-1 justify-center", className)}
    >
      {hasPrev ? (
        <Link
          href={getPageUrl(baseHref, currentPage - 1)}
          aria-label="Previous page"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground opacity-40 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(baseHref, page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors",
              page === currentPage
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-foreground hover:bg-muted"
            )}
          >
            {page}
          </Link>
        )
      )}

      {hasNext ? (
        <Link
          href={getPageUrl(baseHref, currentPage + 1)}
          aria-label="Next page"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground opacity-40 cursor-not-allowed">
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
