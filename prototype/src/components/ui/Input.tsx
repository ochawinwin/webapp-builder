"use client";

import React, { useState, useId } from "react";

type InputVariant = "text" | "email" | "password" | "search";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: string;
  helperText?: string;
  error?: string;
  variant?: InputVariant;
  className?: string;
}

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4 text-text-tertiary"
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
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        className="h-4 w-4 text-text-tertiary"
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
          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    );
  }
  return (
    <svg
      className="h-4 w-4 text-text-tertiary"
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
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
}

export function Input({
  label,
  helperText,
  error,
  variant = "text",
  className = "",
  id: propId,
  disabled,
  ...rest
}: InputProps) {
  const autoId = useId();
  const id = propId ?? autoId;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    variant === "password" ? (showPassword ? "text" : "password") : variant === "search" ? "search" : variant;

  const hasError = Boolean(error);

  const inputClasses = [
    "w-full rounded-[6px] border bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary",
    "transition-colors duration-150",
    "focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    hasError ? "border-error" : "border-border-default",
    variant === "search" ? "pl-9" : "",
    variant === "password" ? "pr-10" : "",
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
        {variant === "search" && (
          <span className="pointer-events-none flex items-center pl-3" style={{ position: "absolute", left: 0 }}>
            <SearchIcon />
          </span>
        )}
        <input
          id={id}
          type={inputType}
          className={inputClasses}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={
            [hasError ? errorId : "", helperText ? helperId : ""].filter(Boolean).join(" ") || undefined
          }
          {...rest}
        />
        {variant === "password" && (
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-[4px] hover:bg-bg-tertiary transition-colors"
            style={{ position: "absolute", right: 4 }}
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            tabIndex={-1}
          >
            <EyeIcon open={showPassword} />
          </button>
        )}
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
