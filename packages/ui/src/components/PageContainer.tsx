import { cn } from "../lib/utils";

const maxWidthMap: Record<NonNullable<PageContainerProps["maxWidth"]>, string> =
  {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    full: "max-w-none",
  };

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

export function PageContainer({
  children,
  className,
  maxWidth = "xl",
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        maxWidthMap[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}
