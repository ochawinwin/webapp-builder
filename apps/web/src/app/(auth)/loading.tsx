import { Skeleton } from "@futurecareer/ui";

export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-4 p-8">
        <Skeleton className="h-10 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
