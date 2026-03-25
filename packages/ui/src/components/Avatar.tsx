"use client";

import React, { useState } from "react";
import * as RadixAvatar from "@radix-ui/react-avatar";
import { cn } from "../lib/utils";

type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-lg",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0] ?? "";
  const last = parts[parts.length - 1] ?? "";
  if (parts.length === 1) return first.charAt(0).toUpperCase();
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
}

function GenericUserIcon() {
  return (
    <svg
      className="w-1/2 h-1/2 text-primary"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

export function Avatar({
  src,
  alt = "",
  fallback,
  name,
  size = "md",
  className,
}: AvatarProps) {
  const displayAlt = alt || name || "avatar";
  const initials = fallback ?? (name ? getInitials(name) : null);

  return (
    <RadixAvatar.Root
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-primary-light text-primary font-semibold overflow-hidden flex-shrink-0",
        sizeClasses[size],
        className
      )}
      role="img"
      aria-label={displayAlt}
    >
      {src && (
        <RadixAvatar.Image
          src={src}
          alt={displayAlt}
          className="w-full h-full object-cover"
        />
      )}
      <RadixAvatar.Fallback
        className="flex items-center justify-center w-full h-full"
        delayMs={src ? 600 : 0}
      >
        {initials ? initials : <GenericUserIcon />}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
