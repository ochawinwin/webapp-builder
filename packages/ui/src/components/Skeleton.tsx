import React from "react";
import { cn } from "../lib/utils";

type SkeletonVariant = "text" | "circular" | "rectangular";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: "rounded-[4px] h-4 w-full",
  circular: "rounded-full",
  rectangular: "rounded-[6px]",
};

export function Skeleton({ variant = "rectangular", className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-bg-tertiary",
        variantClasses[variant],
        className
      )}
      aria-hidden="true"
    />
  );
}
