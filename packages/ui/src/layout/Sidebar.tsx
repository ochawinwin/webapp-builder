'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";
import { Avatar } from "../components/Avatar";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavUser {
  name: string;
  role?: string;
  avatarUrl?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  user?: NavUser;
  companyName?: string;
  isCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
}

export function Sidebar({
  items,
  user,
  companyName,
  isCollapsed: controlledCollapsed,
  onCollapse,
  className,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = React.useState(false);
  const pathname = usePathname();

  const isCollapsed = controlledCollapsed ?? internalCollapsed;

  const handleToggle = () => {
    const next = !isCollapsed;
    setInternalCollapsed(next);
    onCollapse?.(next);
  };

  return (
    <aside
      className={cn(
        "h-full bg-white border-r border-border flex flex-col transition-all duration-200",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* User info */}
      {user && (
        <div
          className={cn(
            "flex items-center gap-3 p-4 border-b border-border",
            isCollapsed && "justify-center"
          )}
        >
          <Avatar
            src={user.avatarUrl}
            fallback={user.name}
            size="sm"
          />
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
              {(user.role || companyName) && (
                <p className="text-xs text-muted-foreground truncate">
                  {companyName ?? user.role}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    isCollapsed && "justify-center px-2",
                    isActive
                      ? "bg-primary/5 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-border">
        <button
          type="button"
          onClick={handleToggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
            isCollapsed && "justify-center px-2"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
