import React from "react";
import { cn } from "../lib/utils";

export type StatusValue =
  | "draft"
  | "active"
  | "paused"
  | "closed"
  | "new"
  | "reviewing"
  | "interview"
  | "offered"
  | "hired"
  | "rejected"
  | "submitted";

export interface StatusBadgeProps {
  status: StatusValue;
  className?: string;
}

const statusConfig: Record<StatusValue, { label: string; classes: string }> = {
  draft: {
    label: "แบบร่าง",
    classes: "bg-slate-100 text-slate-500",
  },
  active: {
    label: "เปิดรับ",
    classes: "bg-emerald-100 text-emerald-700",
  },
  paused: {
    label: "หยุดชั่วคราว",
    classes: "bg-amber-100 text-amber-700",
  },
  closed: {
    label: "ปิดแล้ว",
    classes: "bg-red-100 text-red-700",
  },
  new: {
    label: "ใหม่",
    classes: "bg-blue-100 text-blue-700",
  },
  reviewing: {
    label: "กำลังพิจารณา",
    classes: "bg-violet-100 text-violet-700",
  },
  interview: {
    label: "สัมภาษณ์",
    classes: "bg-amber-100 text-amber-700",
  },
  offered: {
    label: "เสนองาน",
    classes: "bg-emerald-100 text-emerald-700",
  },
  hired: {
    label: "รับแล้ว",
    classes: "bg-emerald-200 text-emerald-800",
  },
  rejected: {
    label: "ไม่ผ่าน",
    classes: "bg-red-100 text-red-700",
  },
  submitted: {
    label: "ส่งแล้ว",
    classes: "bg-emerald-100 text-emerald-700",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        config.classes,
        className
      )}
      role="status"
    >
      {config.label}
    </span>
  );
}
