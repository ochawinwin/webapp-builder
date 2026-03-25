import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-medium rounded-full",
  {
    variants: {
      variant: {
        success: "bg-success-bg text-emerald-700",
        error: "bg-error-bg text-red-700",
        warning: "bg-warning-bg text-amber-700",
        info: "bg-info-bg text-blue-700",
        default: "bg-bg-tertiary text-text-secondary",
        violet: "bg-violet-100 text-violet-700",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, size, children, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)}>
      {children}
    </span>
  );
}
