import * as React from "react";
import { cn } from "../utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "ghost" | "bordered";
  asChild?: boolean;
}

export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  const variantClasses = {
    default: "bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow",
    elevated: "bg-card rounded-xl shadow-lg border border-border",
    ghost: "bg-transparent border-none shadow-none",
    bordered: "bg-card rounded-xl border-2 border-border shadow-sm",
  };

  return (
    <div
      className={cn(variantClasses[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
