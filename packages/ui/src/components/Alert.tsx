"use client";

import React from "react";
import { cn } from "../lib/utils";

export type AlertVariant = "success" | "error" | "warning" | "info";

export interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const variantStyles: Record<
  AlertVariant,
  { container: string; icon: string; title: string; body: string }
> = {
  success: {
    container: "bg-emerald-100 border-emerald-200",
    icon: "text-emerald-600",
    title: "text-emerald-800",
    body: "text-emerald-700",
  },
  error: {
    container: "bg-red-100 border-red-200",
    icon: "text-red-600",
    title: "text-red-800",
    body: "text-red-700",
  },
  warning: {
    container: "bg-amber-100 border-amber-200",
    icon: "text-amber-600",
    title: "text-amber-800",
    body: "text-amber-700",
  },
  info: {
    container: "bg-blue-100 border-blue-200",
    icon: "text-blue-600",
    title: "text-blue-800",
    body: "text-blue-700",
  },
};

function SuccessIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-5 h-5 shrink-0", className)} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  );
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-5 h-5 shrink-0", className)} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-5 h-5 shrink-0", className)} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-5 h-5 shrink-0", className)} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
    </svg>
  );
}

const iconMap: Record<AlertVariant, React.ComponentType<{ className?: string }>> = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

export function Alert({ variant, title, children, onClose, className }: AlertProps) {
  const styles = variantStyles[variant];
  const Icon = iconMap[variant];
  const role = variant === "error" ? "alert" : "status";

  return (
    <div
      role={role}
      className={cn(
        "flex gap-3 rounded-xl border p-4",
        styles.container,
        className
      )}
    >
      <Icon className={styles.icon} />

      <div className="flex-1 min-w-0">
        {title && (
          <p className={cn("text-sm font-semibold", styles.title)}>{title}</p>
        )}
        {children && (
          <div className={cn("text-sm mt-0.5", styles.body, title ? "mt-1" : "")}>
            {children}
          </div>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "shrink-0 rounded p-0.5 opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 transition-opacity",
            styles.title
          )}
          aria-label="ปิด"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
