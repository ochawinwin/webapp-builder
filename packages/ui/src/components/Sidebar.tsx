"use client";

import Link from "next/link";
import { cn } from "../lib/utils";

export interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface SidebarProps {
  items: SidebarItem[];
  activePath: string;
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  items,
  activePath,
  open = false,
  onClose,
}: SidebarProps) {
  const sidebarContent = (
    <nav aria-label="Dashboard navigation" className="flex flex-col gap-1 p-4">
      {items.map((item) => {
        const isActive = activePath === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300",
              isActive
                ? "border-l-[3px] border-blue-600 bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
            aria-current={isActive ? "page" : undefined}
            onClick={onClose}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar — always visible at md+ */}
      <aside
        className="hidden w-[250px] shrink-0 border-r border-slate-200 bg-white md:block"
        aria-label="Sidebar"
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-[250px] transform bg-white shadow-lg transition-transform duration-200 ease-in-out md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Sidebar"
        role="dialog"
        aria-modal={open}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
