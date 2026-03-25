'use client';

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../utils/cn";

interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({
  items,
  defaultValue,
  value,
  onValueChange,
  className,
}: TabsProps) {
  const resolvedDefault = defaultValue ?? items[0]?.value;

  return (
    <TabsPrimitive.Root
      defaultValue={resolvedDefault}
      value={value}
      onValueChange={onValueChange}
      className={cn("w-full", className)}
    >
      <TabsPrimitive.List className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground",
              "transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
              "data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            )}
          >
            {item.icon && (
              <span className="w-4 h-4 shrink-0">{item.icon}</span>
            )}
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      {items.map((item) => (
        <TabsPrimitive.Content
          key={item.value}
          value={item.value}
          className="mt-4 focus-visible:outline-none"
        >
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
