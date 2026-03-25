import { Skeleton } from "@futurecareer/ui";

export default function CompanyLoading() {
  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="container mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>

        {/* Main content skeleton */}
        <Skeleton className="h-80 w-full rounded-2xl" />

        {/* Secondary content */}
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
