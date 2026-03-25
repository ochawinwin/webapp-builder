import * as React from "react";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
} from "lucide-react";
import { cn } from "../utils/cn";

interface AlertProps {
  variant?: "info" | "success" | "warning" | "destructive";
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const defaultIcons: Record<string, React.ReactNode> = {
  info: <Info className="w-5 h-5 shrink-0" />,
  success: <CheckCircle2 className="w-5 h-5 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 shrink-0" />,
  destructive: <XCircle className="w-5 h-5 shrink-0" />,
};

const variantClasses = {
  info: "bg-info/10 border-info/30 text-info",
  success: "bg-success/10 border-success/30 text-success",
  warning: "bg-warning/10 border-warning/30 text-warning",
  destructive: "bg-destructive/10 border-destructive/30 text-destructive",
};

export function Alert({
  variant = "info",
  title,
  description,
  icon,
  onDismiss,
  className,
}: AlertProps) {
  const resolvedIcon = icon ?? defaultIcons[variant];

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border",
        variantClasses[variant],
        className
      )}
    >
      {resolvedIcon && (
        <span className="mt-0.5">{resolvedIcon}</span>
      )}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-semibold leading-snug">{title}</p>
        )}
        {description && (
          <p className="text-sm opacity-90 mt-0.5">{description}</p>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="shrink-0 rounded-full p-0.5 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
