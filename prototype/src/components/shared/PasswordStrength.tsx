"use client";

import React, { useMemo } from "react";

interface PasswordStrengthProps {
  password: string;
}

type Strength = 0 | 1 | 2 | 3 | 4;

interface StrengthInfo {
  label: string;
  color: string;
  bgColor: string;
}

const strengthMap: Record<Strength, StrengthInfo> = {
  0: { label: "", color: "bg-gray-200", bgColor: "bg-gray-200" },
  1: { label: "อ่อนมาก", color: "bg-red-500", bgColor: "bg-gray-200" },
  2: { label: "อ่อน", color: "bg-amber-500", bgColor: "bg-gray-200" },
  3: { label: "ปานกลาง", color: "bg-amber-400", bgColor: "bg-gray-200" },
  4: { label: "แข็งแรง", color: "bg-green-500", bgColor: "bg-gray-200" },
};

function calculateStrength(password: string): Strength {
  if (!password) return 0;

  let score = 0;

  // Length checks
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character variety checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // Normalize to 1-4 range
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
    <div className="mt-2 space-y-1.5" role="status" aria-live="polite">
      {/* Bar segments */}
      <div className="flex gap-1" aria-hidden="true">
        {([1, 2, 3, 4] as const).map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
              strength >= level ? info.color : info.bgColor
            }`}
          />
        ))}
      </div>

      {/* Label */}
      <p className="text-xs text-gray-500">
        ความแข็งแรงของรหัสผ่าน:{" "}
        <span
          className={`font-medium ${
            strength <= 2
              ? "text-red-600"
              : strength === 3
              ? "text-amber-600"
              : "text-green-600"
          }`}
        >
          {info.label}
        </span>
      </p>
    </div>
  );
}
