import { Skeleton } from "@/components/ui/Skeleton";

export default function ResourcesLoading() {
  return (
    <div className="min-w-0 space-y-6" aria-busy="true">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-11 w-40" />
      <Skeleton className="h-96 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}
