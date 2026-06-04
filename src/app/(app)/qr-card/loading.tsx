import { Skeleton } from "@/components/ui/Skeleton";

export default function QRCardLoading() {
  return (
    <div className="min-w-0" aria-busy="true" aria-label="Loading QR card">
      <Skeleton className="mb-8 h-10 w-64 max-w-full" />

      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center rounded-2xl border border-border bg-surface p-8">
            <Skeleton className="h-56 w-56 rounded-xl" />
            <Skeleton className="mt-6 h-10 w-full max-w-md" />
            <div className="mt-6 flex gap-3">
              <Skeleton className="h-11 w-32" />
              <Skeleton className="h-11 w-32" />
            </div>
          </div>

          <div>
            <Skeleton className="mb-4 h-5 w-36" />
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
