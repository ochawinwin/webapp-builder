import * as React from "react";
import { cn } from "../utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "destructive"
    | "outline";
  shape?: "pill" | "square";
}

export function Badge({
  className,
  variant = "default",
  shape = "pill",
  children,
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: "bg-muted text-foreground",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/20 text-secondary-foreground",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    destructive: "bg-destructive/20 text-destructive",
    outline: "border border-border text-foreground bg-transparent",
  };

  const shapeClasses = {
    pill: "rounded-full",
    square: "rounded-md",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        shapeClasses[shape],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
