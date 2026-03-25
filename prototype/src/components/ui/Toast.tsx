"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

const typeStyles: Record<ToastType, { bg: string; icon: string; border: string }> = {
  success: { bg: "bg-success-bg", icon: "text-success", border: "border-emerald-300" },
  error: { bg: "bg-error-bg", icon: "text-error", border: "border-red-300" },
  warning: { bg: "bg-warning-bg", icon: "text-warning", border: "border-amber-300" },
  info: { bg: "bg-info-bg", icon: "text-info", border: "border-blue-300" },
};

const typeIcons: Record<ToastType, React.ReactNode> = {
  success: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
};

function ToastMessage({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const style = typeStyles[item.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(item.id);
    }, item.duration ?? 5000);
    return () => clearTimeout(timer);
  }, [item.id, item.duration, onDismiss]);

  return (
    <div
      className={`flex items-start gap-3 rounded-[8px] border px-4 py-3 shadow-md ${style.bg} ${style.border} animate-in slide-in-from-right duration-300`}
      role="alert"
    >
      <span className={style.icon}>{typeIcons[item.type]}</span>
      <p className="text-sm text-text-primary flex-1">{item.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        className="flex items-center justify-center w-5 h-5 rounded text-text-tertiary hover:text-text-primary transition-colors"
        aria-label="ปิดการแจ้งเตือน"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (type: ToastType, message: string, duration?: number) => {
      const id = `toast-${++counterRef.current}`;
      setToasts((prev) => [...prev, { id, type, message, duration }]);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80"
        aria-live="polite"
        aria-label="การแจ้งเตือน"
      >
        {toasts.map((item) => (
          <ToastMessage key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
