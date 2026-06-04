import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLoading() {
  return (
    <div className="min-w-0" aria-busy="true" aria-label="Loading dashboard">
      <Skeleton className="mb-8 h-10 w-56 max-w-full" />

      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-36 rounded-2xl border border-border" />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-72 rounded-2xl border border-border" />
          ))}
        </div>

        <Skeleton className="mt-6 h-48 rounded-2xl border border-border" />
        <Skeleton className="mt-6 h-96 rounded-2xl border border-border" />
      </div>
    </div>
  );
}
