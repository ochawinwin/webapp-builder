"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useId,
} from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab components must be used within a Tabs provider");
  return ctx;
}

/* --- Tabs root --- */
export interface TabsProps {
  defaultTab: string;
  children: React.ReactNode;
  className?: string;
  onChange?: (tab: string) => void;
}

export function Tabs({ defaultTab, children, className = "", onChange }: TabsProps) {
  const [activeTab, setActiveTabState] = useState(defaultTab);
  const baseId = useId();

  const setActiveTab = useCallback(
    (id: string) => {
      setActiveTabState(id);
      onChange?.(id);
    },
    [onChange]
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

/* --- TabList --- */
export interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabList({ children, className = "" }: TabListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const tabs = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    if (!tabs || tabs.length === 0) return;

    const tabsArray = Array.from(tabs);
    const currentIndex = tabsArray.findIndex((t) => t === document.activeElement);

    let nextIndex: number | null = null;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        nextIndex = (currentIndex + 1) % tabsArray.length;
        break;
      case "ArrowLeft":
        e.preventDefault();
        nextIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
        break;
      case "Home":
        e.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        e.preventDefault();
        nextIndex = tabsArray.length - 1;
        break;
    }

    if (nextIndex !== null) {
      tabsArray[nextIndex].focus();
      tabsArray[nextIndex].click();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      className={`flex border-b border-border-default ${className}`}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

/* --- Tab --- */
export interface TabProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function Tab({ id, children, className = "" }: TabProps) {
  const { activeTab, setActiveTab, baseId } = useTabsContext();
  const isActive = activeTab === id;

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${id}`}
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${id}`}
      tabIndex={isActive ? 0 : -1}
      className={[
        "px-4 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset",
        isActive
          ? "border-primary text-primary"
          : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-strong",
        className,
      ].join(" ")}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

/* --- TabPanel --- */
export interface TabPanelProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ id, children, className = "" }: TabPanelProps) {
  const { activeTab, baseId } = useTabsContext();
  const isActive = activeTab === id;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${id}`}
      aria-labelledby={`${baseId}-tab-${id}`}
      tabIndex={0}
      className={`py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${className}`}
    >
      {children}
    </div>
  );
}
