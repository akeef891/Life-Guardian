import { Skeleton } from "@/components/ui/Skeleton";

export default function ProfileLoading() {
  return (
    <div className="min-w-0" aria-busy="true" aria-label="Loading emergency profile">
      <Skeleton className="mb-8 h-10 w-56 max-w-full" />

      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-3 h-4 w-full max-w-md" />
            <div className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
              <Skeleton className="h-11 w-48" />
            </div>
          </div>

          <div>
            <Skeleton className="mb-4 h-5 w-52" />
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-3 h-4 w-full max-w-lg" />
          <Skeleton className="mt-6 h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
