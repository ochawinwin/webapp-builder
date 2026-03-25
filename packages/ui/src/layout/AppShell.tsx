import * as React from "react";
import { cn } from "../utils/cn";

interface AppShellProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AppShell({
  header,
  sidebar,
  footer,
  children,
  className,
}: AppShellProps) {
  return (
    <div className={cn("flex flex-col min-h-screen", className)}>
      {header && <div className="shrink-0">{header}</div>}
      <div className="flex flex-1">
        {sidebar && (
          <aside className="w-64 shrink-0 hidden md:block">
            {sidebar}
          </aside>
        )}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      {footer && <div className="shrink-0">{footer}</div>}
    </div>
  );
}
