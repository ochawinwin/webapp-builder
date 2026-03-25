"use client";

import React, { useMemo } from "react";

export interface PasswordStrengthProps {
  password: string;
}

type Strength = 0 | 1 | 2 | 3 | 4;

interface StrengthInfo {
  label: string;
  filledColor: string;
  emptyColor: string;
  labelColor: string;
}

const strengthMap: Record<Strength, StrengthInfo> = {
  0: { label: "", filledColor: "bg-slate-200", emptyColor: "bg-slate-200", labelColor: "" },
  1: { label: "อ่อนมาก", filledColor: "bg-red-500", emptyColor: "bg-slate-200", labelColor: "text-red-600" },
  2: { label: "อ่อน", filledColor: "bg-amber-500", emptyColor: "bg-slate-200", labelColor: "text-amber-600" },
  3: { label: "ปานกลาง", filledColor: "bg-amber-400", emptyColor: "bg-slate-200", labelColor: "text-amber-600" },
  4: { label: "แข็งแรง", filledColor: "bg-emerald-500", emptyColor: "bg-slate-200", labelColor: "text-emerald-600" },
};

function calculateStrength(password: string): Strength {
  if (!password) return 0;

  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return 1;
  if (score === 2) return 2;
  if (score === 3) return 3;
  return 4;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => calculateStrength(password), [password]);
  const info = strengthMap[strength];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5" aria-live="polite" aria-atomic="true">
      {/* Bar segments */}
      <div className="flex gap-1" aria-hidden="true">
        {([1, 2, 3, 4] as const).map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
              strength >= level ? info.filledColor : info.emptyColor
            }`}
          />
        ))}
      </div>

      {/* Label */}
      <p className="text-xs text-slate-500">
        ความแข็งแรงของรหัสผ่าน:{" "}
        <span className={`font-medium ${info.labelColor}`}>{info.label}</span>
      </p>
    </div>
  );
}
