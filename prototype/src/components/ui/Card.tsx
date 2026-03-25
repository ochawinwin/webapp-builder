import React from "react";

type CardVariant = "default" | "interactive";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-bg-primary border border-border-default rounded-[12px] shadow-sm",
  interactive:
    "bg-bg-primary border border-border-default rounded-[12px] shadow-sm transition-all duration-200 hover:shadow-md hover:border-border-strong hover:-translate-y-0.5 cursor-pointer",
};

export function Card({
  variant = "default",
  children,
  className = "",
  ...rest
}: CardProps) {
  return (
    <div className={`${variantClasses[variant]} p-6 ${className}`} {...rest}>
      {children}
    </div>
  );
}
