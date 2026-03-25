"use client";

import React, { useId } from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { cn } from "../lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  helperText?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

function ChevronDownIcon() {
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export function Select({
  label,
  helperText,
  error,
  placeholder,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  id: propId,
}: SelectProps) {
  const autoId = useId();
  const id = propId ?? autoId;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          id={`${id}-label`}
          className="text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}
      <RadixSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <RadixSelect.Trigger
          id={id}
          aria-labelledby={label ? `${id}-label` : undefined}
          aria-invalid={hasError || undefined}
          aria-describedby={
            [hasError ? errorId : "", helperText ? helperId : ""]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={cn(
            "w-full rounded-[6px] border bg-bg-primary px-3 py-2 pr-8 text-sm text-text-primary appearance-none",
            "inline-flex items-center justify-between",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            hasError ? "border-error" : "border-border-default",
            className
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className="ml-2 flex-shrink-0">
            <ChevronDownIcon />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[8px] border border-border-default bg-bg-primary shadow-lg"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-[6px] px-3 py-2 text-sm text-text-primary outline-none",
                    "data-[highlighted]:bg-bg-tertiary data-[highlighted]:text-text-primary",
                    "data-[state=checked]:text-primary"
                  )}
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="absolute right-3">
                    <CheckIcon />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

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
