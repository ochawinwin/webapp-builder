"use client";

import React from "react";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

export interface ToasterProps {
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
  richColors?: boolean;
  closeButton?: boolean;
  duration?: number;
}

export function Toaster({
  position = "top-right",
  richColors = true,
  closeButton = true,
  duration = 5000,
}: ToasterProps) {
  return (
    <SonnerToaster
      position={position}
      richColors={richColors}
      closeButton={closeButton}
      duration={duration}
      toastOptions={{
        classNames: {
          toast:
            "flex items-start gap-3 rounded-[8px] border px-4 py-3 shadow-md text-sm font-sans",
          title: "text-text-primary font-medium",
          description: "text-text-secondary",
          success: "bg-success-bg border-emerald-300 text-emerald-700",
          error: "bg-error-bg border-red-300 text-red-700",
          warning: "bg-warning-bg border-amber-300 text-amber-700",
          info: "bg-info-bg border-blue-300 text-blue-700",
          closeButton:
            "text-text-tertiary hover:text-text-primary transition-colors",
        },
      }}
    />
  );
}

export const toast = {
  success: (message: string, options?: Parameters<typeof sonnerToast.success>[1]) =>
    sonnerToast.success(message, options),
  error: (message: string, options?: Parameters<typeof sonnerToast.error>[1]) =>
    sonnerToast.error(message, options),
  warning: (message: string, options?: Parameters<typeof sonnerToast.warning>[1]) =>
    sonnerToast.warning(message, options),
  info: (message: string, options?: Parameters<typeof sonnerToast.info>[1]) =>
    sonnerToast.info(message, options),
};
