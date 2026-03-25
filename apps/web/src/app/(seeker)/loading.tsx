import { Skeleton } from "@futurecareer/ui";

export default function SeekerLoading() {
  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="container mx-auto max-w-5xl space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid gap-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
