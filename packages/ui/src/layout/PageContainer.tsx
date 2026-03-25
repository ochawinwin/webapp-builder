import * as React from "react";
import { cn } from "../utils/cn";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-[1200px]",
};

export function PageContainer({
  children,
  className,
  size = "xl",
}: PageContainerProps) {
  return (
    <div className={cn("container mx-auto px-4", sizeClasses[size], className)}>
      {children}
    </div>
  );
}
