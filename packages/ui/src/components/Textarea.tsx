"use client";

import React, { useState, useId } from "react";
import { cn } from "../lib/utils";

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "children"> {
  label?: string;
  helperText?: string;
  error?: string;
  maxCharacters?: number;
  className?: string;
}

export function Textarea({
  label,
  helperText,
  error,
  maxCharacters,
  className,
  id: propId,
  value,
  defaultValue,
  disabled,
  onChange,
  ...rest
}: TextareaProps) {
  const autoId = useId();
  const id = propId ?? autoId;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const hasError = Boolean(error);

  const [internalValue, setInternalValue] = useState(
    (defaultValue as string) ?? ""
  );
  const currentValue = value !== undefined ? String(value) : internalValue;
  const charCount = currentValue.length;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  const textareaClasses = cn(
    "w-full rounded-[6px] border bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary",
    "transition-colors duration-150 resize-y min-h-[80px]",
    "focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    hasError ? "border-error" : "border-border-default",
    className
  );

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={textareaClasses}
        disabled={disabled}
        value={value}
        defaultValue={value !== undefined ? undefined : defaultValue}
        onChange={handleChange}
        aria-invalid={hasError || undefined}
        aria-describedby={
          [hasError ? errorId : "", helperText ? helperId : ""]
            .filter(Boolean)
            .join(" ") || undefined
        }
        maxLength={maxCharacters}
        {...rest}
      />
      <div className="flex items-center justify-between">
        <div>
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
        {maxCharacters !== undefined && (
          <p
            className={cn(
              "text-xs",
              charCount > maxCharacters ? "text-error" : "text-text-tertiary"
            )}
            aria-live="polite"
          >
            {charCount}/{maxCharacters}
          </p>
        )}
      </div>
    </div>
  );
}
