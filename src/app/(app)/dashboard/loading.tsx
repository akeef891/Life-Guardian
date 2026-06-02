import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-8 h-10 w-48 animate-pulse rounded bg-muted/20" />

      <div className="mx-auto w-full max-w-6xl px-1 sm:px-0">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-36 animate-pulse rounded-2xl border border-border bg-surface p-5"
            >
              <div className="h-4 w-32 rounded bg-muted/20" />
              <div className="mt-3 h-8 w-20 rounded bg-muted/20" />
              <div className="mt-3 h-4 w-28 rounded bg-muted/20" />
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface p-6">
              <div className="h-4 w-56 rounded bg-muted/20" />
              <div className="mt-4 h-12 w-32 rounded bg-muted/20" />
              <div className="mt-6 h-3 w-full rounded bg-muted/20" />
              <div className="mt-4 h-10 w-full rounded bg-muted/20" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface p-6">
              <div className="h-4 w-44 rounded bg-muted/20" />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((__, i) => (
                  <div key={i} className="h-28 rounded-xl bg-background" />
                ))}
              </div>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-1">
            <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface p-6">
              <div className="h-4 w-56 rounded bg-muted/20" />
              <div className="mt-4 h-10 w-full rounded bg-muted/20" />
              <div className="mt-4 h-10 w-full rounded bg-muted/20" />
            </div>
          </div>
        </div>

        <div className="mt-6 h-96 animate-pulse rounded-2xl border border-border bg-surface" />
      </div>
    </div>
  );
}

