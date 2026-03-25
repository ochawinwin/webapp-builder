"use client";

import React, { useState, useRef, useCallback } from "react";

export interface FileUploadProps {
  accept?: string;
  maxSize?: number; // bytes
  multiple?: boolean;
  onFiles?: (files: File[]) => void;
  progress?: number; // 0-100
  disabled?: boolean;
  className?: string;
  label?: string;
  helperText?: string;
  error?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  accept,
  maxSize,
  multiple = false,
  onFiles,
  progress,
  disabled = false,
  className = "",
  label,
  helperText,
  error: externalError,
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayError = externalError ?? error;

  const validateAndEmit = useCallback(
    (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files);

      if (maxSize) {
        const oversized = fileArray.find((f) => f.size > maxSize);
        if (oversized) {
          setError(
            `ไฟล์ "${oversized.name}" มีขนาด ${formatSize(oversized.size)} เกินขีดจำกัด ${formatSize(maxSize)}`
          );
          return;
        }
      }

      setSelectedFiles(fileArray);
      onFiles?.(fileArray);
    },
    [maxSize, onFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      if (e.dataTransfer.files.length > 0) {
        validateAndEmit(e.dataTransfer.files);
      }
    },
    [disabled, validateAndEmit]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        validateAndEmit(e.target.files);
      }
    },
    [validateAndEmit]
  );

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-sm font-medium text-text-primary">{label}</span>
      )}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label ?? "อัปโหลดไฟล์"}
        aria-disabled={disabled || undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={[
          "flex flex-col items-center justify-center gap-2 rounded-[8px] border-2 border-dashed p-8 transition-colors duration-150 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
          dragOver && !disabled
            ? "border-primary bg-primary-subtle"
            : "border-border-default bg-bg-secondary hover:border-border-strong hover:bg-bg-tertiary",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
      >
        <svg
          className="h-8 w-8 text-text-tertiary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            <span className="font-medium text-primary">คลิกเพื่อเลือกไฟล์</span>{" "}
            หรือลากไฟล์มาวางที่นี่
          </p>
          {helperText && (
            <p className="text-xs text-text-tertiary mt-1">{helperText}</p>
          )}
          {maxSize && (
            <p className="text-xs text-text-tertiary mt-0.5">
              ขนาดไฟล์สูงสุด {formatSize(maxSize)}
            </p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {progress !== undefined && progress >= 0 && progress <= 100 && (
        <div className="w-full bg-bg-tertiary rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="ความคืบหน้าการอัปโหลด"
          />
        </div>
      )}

      {selectedFiles.length > 0 && !displayError && (
        <div className="flex flex-wrap gap-1.5">
          {selectedFiles.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-[6px] border border-border-default bg-bg-primary px-2 py-1 text-xs text-text-secondary"
            >
              {f.name}
              <span className="text-text-tertiary">({formatSize(f.size)})</span>
            </span>
          ))}
        </div>
      )}

      {displayError && (
        <p className="text-xs text-error" role="alert">
          {displayError}
        </p>
      )}
    </div>
  );
}
