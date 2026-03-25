"use client";

import React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { cn } from "../lib/utils";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogPortal = RadixDialog.Portal;
export const DialogClose = RadixDialog.Close;

export interface DialogOverlayProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Overlay> {
  className?: string;
}

export function DialogOverlay({ className, ...props }: DialogOverlayProps) {
  return (
    <RadixDialog.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-bg-overlay animate-in fade-in duration-200",
        className
      )}
      {...props}
    />
  );
}

export interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Content> {
  className?: string;
  children: React.ReactNode;
}

export function DialogContent({ className, children, ...props }: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <RadixDialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
          "bg-bg-primary rounded-[12px] shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]",
          "animate-in zoom-in-95 duration-200",
          "focus:outline-none",
          className
        )}
        {...props}
      >
        {children}
      </RadixDialog.Content>
    </DialogPortal>
  );
}

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export function DialogHeader({ className, children, ...props }: DialogHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-4 border-b border-border-default",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface DialogTitleProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Title> {
  className?: string;
}

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <RadixDialog.Title
      className={cn("text-lg font-semibold text-text-primary", className)}
      {...props}
    />
  );
}

export interface DialogDescriptionProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Description> {
  className?: string;
}

export function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <RadixDialog.Description
      className={cn("text-sm text-text-secondary", className)}
      {...props}
    />
  );
}

export interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export function DialogBody({ className, children, ...props }: DialogBodyProps) {
  return (
    <div className={cn("px-6 py-4 overflow-y-auto flex-1", className)} {...props}>
      {children}
    </div>
  );
}

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export function DialogFooter({ className, children, ...props }: DialogFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 px-6 py-4 border-t border-border-default",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface DialogCloseButtonProps {
  className?: string;
}

export function DialogCloseButton({ className }: DialogCloseButtonProps) {
  return (
    <RadixDialog.Close
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-[6px] hover:bg-bg-tertiary transition-colors text-text-tertiary hover:text-text-primary",
        className
      )}
      aria-label="ปิด"
    >
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </RadixDialog.Close>
  );
}
