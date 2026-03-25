import React from "react";

type BadgeVariant = "success" | "error" | "warning" | "info" | "default" | "violet";
type BadgeSize = "sm" | "md";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-success-bg text-emerald-700",
  error: "bg-error-bg text-red-700",
  warning: "bg-warning-bg text-amber-700",
  info: "bg-info-bg text-blue-700",
  default: "bg-bg-tertiary text-text-secondary",
  violet: "bg-violet-100 text-violet-700",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

export function Badge({
  variant = "default",
  size = "md",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}
