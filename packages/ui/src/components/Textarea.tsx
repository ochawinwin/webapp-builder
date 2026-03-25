import * as React from "react";
import { cn } from "../utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  errorMessage?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, errorMessage, rows = 4, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-y",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all",
            error &&
              "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive",
            className
          )}
          {...props}
        />
        {errorMessage && (
          <p className="text-xs text-destructive">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
