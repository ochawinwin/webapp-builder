"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never;
  };

type ButtonAsAnchor = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-focus-ring",
  secondary:
    "bg-secondary text-white hover:bg-secondary-light focus-visible:ring-2 focus-visible:ring-focus-ring",
  accent:
    "bg-accent text-white hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-focus-ring",
  ghost:
    "bg-transparent text-text-primary hover:bg-bg-tertiary focus-visible:ring-2 focus-visible:ring-focus-ring",
  danger:
    "bg-error text-white hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-red-300",
  outline:
    "bg-transparent border border-border-default text-text-primary hover:bg-bg-tertiary focus-visible:ring-2 focus-visible:ring-focus-ring",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-[4px] gap-1.5",
  md: "px-4 py-2 text-sm rounded-[6px] gap-2",
  lg: "px-6 py-3 text-base rounded-[8px] gap-2.5",
};

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin h-4 w-4 ${className ?? ""}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    children,
    className = "",
    ...rest
  } = props;

  const isDisabled = disabled || loading;

  const classes = [
    "inline-flex items-center justify-center font-medium transition-colors duration-150",
    "focus-visible:outline-none",
    variantClasses[variant],
    sizeClasses[size],
    isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in rest && rest.href) {
    const { href, ...anchorProps } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <a
        href={href}
        className={classes}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : undefined}
        {...anchorProps}
      >
        {loading && <Spinner />}
        {children}
      </a>
    );
  }

  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      type={buttonProps.type ?? "button"}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
