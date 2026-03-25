import { Skeleton } from "@futurecareer/ui";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-20 space-y-8">
      <Skeleton className="h-12 w-1/2 rounded-xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
