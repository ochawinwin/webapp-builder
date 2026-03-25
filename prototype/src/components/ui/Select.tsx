"use client";

import React, { useId } from "react";

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

export function Select({
  label,
  helperText,
  error,
  placeholder,
  children,
  className = "",
  id: propId,
  disabled,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const id = propId ?? autoId;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const hasError = Boolean(error);

  const selectClasses = [
    "w-full rounded-[6px] border bg-bg-primary px-3 py-2 pr-8 text-sm text-text-primary appearance-none",
    "transition-colors duration-150",
    "focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    hasError ? "border-error" : "border-border-default",
    className,
  ].join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={id}
          className={selectClasses}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={
            [hasError ? errorId : "", helperText ? helperId : ""]
              .filter(Boolean)
              .join(" ") || undefined
          }
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <svg
          className="pointer-events-none h-4 w-4 text-text-tertiary"
          style={{ position: "absolute", right: 8 }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
      {hasError && (
        <p id={errorId} className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
      {!hasError && helperText && (
        <p id={helperId} className="text-xs text-text-tertiary">
          {helperText}
        </p>
      )}
    </div>
  );
}
