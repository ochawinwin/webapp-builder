import * as React from "react";
import { cn } from "../utils/cn";

interface SkeletonProps {
  variant?: "line" | "circle" | "rect";
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = "line",
  className,
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    line: "h-4 rounded",
    circle: "rounded-full",
    rect: "rounded-xl",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={cn("bg-muted animate-pulse", variantClasses[variant], className)}
      style={style}
      aria-hidden="true"
    />
  );
}
