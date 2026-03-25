// Layout components
export { AppShell } from "./components/AppShell";
export type { AppShellProps } from "./components/AppShell";

export { Footer } from "./components/Footer";

export { Header } from "./components/Header";
export type { HeaderProps } from "./components/Header";

export { PageContainer } from "./components/PageContainer";
export type { PageContainerProps } from "./components/PageContainer";

export { Sidebar } from "./components/Sidebar";
export type { SidebarProps, SidebarItem } from "./components/Sidebar";

// UI Primitives
export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";

export { Input } from "./components/Input";
export type { InputProps } from "./components/Input";

export { Textarea } from "./components/Textarea";
export type { TextareaProps } from "./components/Textarea";

export { Select } from "./components/Select";
export type { SelectProps, SelectOption } from "./components/Select";

export { Card } from "./components/Card";
export type { CardProps } from "./components/Card";

export { Badge } from "./components/Badge";
export type { BadgeProps } from "./components/Badge";

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogCloseButton,
} from "./components/Dialog";
export type {
  DialogContentProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogBodyProps,
  DialogFooterProps,
  DialogCloseButtonProps,
} from "./components/Dialog";

export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/Tabs";
export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from "./components/Tabs";

export { Toaster, toast } from "./components/Toast";
export type { ToasterProps } from "./components/Toast";

export { Avatar } from "./components/Avatar";
export type { AvatarProps } from "./components/Avatar";

export { FileUpload } from "./components/FileUpload";
export type { FileUploadProps } from "./components/FileUpload";

export { Skeleton } from "./components/Skeleton";
export type { SkeletonProps } from "./components/Skeleton";

// Domain Components
export { Tag } from "./components/Tag";
export type { TagProps, TagCategory, TagSize } from "./components/Tag";

export { TagAutocomplete } from "./components/TagAutocomplete";
export type { TagAutocompleteProps, TagOption } from "./components/TagAutocomplete";

export { JobCard } from "./components/JobCard";
export type { JobCardProps } from "./components/JobCard";

export { CandidateCard } from "./components/CandidateCard";
export type { CandidateCardProps } from "./components/CandidateCard";

export { StatusBadge } from "./components/StatusBadge";
export type { StatusBadgeProps, StatusValue } from "./components/StatusBadge";

export { PasswordStrength } from "./components/PasswordStrength";
export type { PasswordStrengthProps } from "./components/PasswordStrength";

// Feedback Components
export { Alert } from "./components/Alert";
export type { AlertProps, AlertVariant } from "./components/Alert";

export { EmptyState } from "./components/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState";

export { Loading } from "./components/Loading";
export type { LoadingProps, LoadingSize } from "./components/Loading";

// Navigation Components
export { Breadcrumb } from "./components/Breadcrumb";
export type { BreadcrumbProps, BreadcrumbItem } from "./components/Breadcrumb";

export { Pagination } from "./components/Pagination";
export type { PaginationProps } from "./components/Pagination";

// Utilities
export { cn } from "./lib/utils";
