"use client";

import React from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "../lib/utils";

export interface TabsProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.Root> {
  className?: string;
  children: React.ReactNode;
}

export function Tabs({ className, children, ...props }: TabsProps) {
  return (
    <RadixTabs.Root className={cn(className)} {...props}>
      {children}
    </RadixTabs.Root>
  );
}

export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.List> {
  className?: string;
  children: React.ReactNode;
}

export function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <RadixTabs.List
      className={cn("flex border-b border-border-default", className)}
      {...props}
    >
      {children}
    </RadixTabs.List>
  );
}

export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger> {
  className?: string;
  children: React.ReactNode;
}

export function TabsTrigger({ className, children, ...props }: TabsTriggerProps) {
  return (
    <RadixTabs.Trigger
      className={cn(
        "px-4 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset",
        "border-transparent text-text-secondary hover:text-text-primary hover:border-border-strong",
        "data-[state=active]:border-primary data-[state=active]:text-primary",
        className
      )}
      {...props}
    >
      {children}
    </RadixTabs.Trigger>
  );
}

export interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.Content> {
  className?: string;
  children: React.ReactNode;
}

export function TabsContent({ className, children, ...props }: TabsContentProps) {
  return (
    <RadixTabs.Content
      className={cn(
        "py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
        className
      )}
      {...props}
    >
      {children}
    </RadixTabs.Content>
  );
}
