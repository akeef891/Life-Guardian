import { Skeleton } from "@/components/ui/Skeleton";

export default function CheckInLoading() {
  return (
    <div className="min-w-0 space-y-6" aria-busy="true">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}
