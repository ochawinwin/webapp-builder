import React from "react";

type Status =
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

interface StatusBadgeProps {
  status: Status;
}

const statusConfig: Record<Status, { label: string; classes: string }> = {
  draft: {
    label: "แบบร่าง",
    classes: "bg-gray-100 text-gray-700",
  },
  active: {
    label: "เปิดรับ",
    classes: "bg-blue-50 text-blue-700",
  },
  paused: {
    label: "หยุดชั่วคราว",
    classes: "bg-amber-50 text-amber-700",
  },
  closed: {
    label: "ปิดแล้ว",
    classes: "bg-red-50 text-red-700",
  },
  new: {
    label: "ใหม่",
    classes: "bg-blue-50 text-blue-700",
  },
  reviewing: {
    label: "กำลังพิจารณา",
    classes: "bg-violet-50 text-violet-700",
  },
  interview: {
    label: "สัมภาษณ์",
    classes: "bg-amber-50 text-amber-700",
  },
  offered: {
    label: "เสนอ",
    classes: "bg-emerald-50 text-emerald-700",
  },
  hired: {
    label: "รับแล้ว",
    classes: "bg-emerald-100 text-emerald-800",
  },
  rejected: {
    label: "ไม่ผ่าน",
    classes: "bg-red-50 text-red-700",
  },
  submitted: {
    label: "ส่งแล้ว",
    classes: "bg-emerald-50 text-emerald-700",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.classes}`}
      role="status"
    >
      {config.label}
    </span>
  );
}
