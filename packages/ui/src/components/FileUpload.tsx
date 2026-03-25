'use client';

import * as React from "react";
import { FileText, Upload, X, CheckCircle2 } from "lucide-react";
import { cn } from "../utils/cn";

interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  onFile?: (file: File) => void;
  currentFile?: string;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function FileUpload({
  accept,
  maxSize = 5,
  onFile,
  currentFile,
  disabled,
  label,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [localFile, setLocalFile] = React.useState<string | undefined>(currentFile);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const validateAndSet = (file: File) => {
    setError(null);
    const maxBytes = maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`File size exceeds ${maxSize}MB limit.`);
      return;
    }
    setLocalFile(file.name);
    onFile?.(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) validateAndSet(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSet(file);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalFile(undefined);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const hasFile = !!localFile;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <p className="text-sm font-medium text-foreground">{label}</p>
      )}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="File upload area"
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            inputRef.current?.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
          !hasFile && !isDragging && "border-border hover:border-primary/40 hover:bg-muted/30",
          isDragging && "border-primary bg-primary/5",
          hasFile && "border-success/40 bg-success/5 cursor-default",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-destructive/40 bg-destructive/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />

        {hasFile ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle2 className="w-10 h-10 text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">{localFile}</p>
              <p className="text-xs text-muted-foreground mt-1">File selected</p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              aria-label="Remove file"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-3 h-3" />
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              {isDragging ? (
                <Upload className="w-6 h-6 text-primary" />
              ) : (
                <FileText className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {isDragging ? "Drop file here" : "Drag and Drop or Browse"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {accept ? `Accepted: ${accept}` : "Any file type"} • Max {maxSize}MB
              </p>
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
