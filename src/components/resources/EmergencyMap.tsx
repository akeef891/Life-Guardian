"use client";

import dynamic from "next/dynamic";
import type { NearbyResourcesResult } from "@/lib/services/emergency-resources.service";

const EmergencyMapInner = dynamic(
  () => import("./EmergencyMapInner").then((m) => m.EmergencyMapInner),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-72 items-center justify-center rounded-xl border border-border bg-muted/10 sm:h-96"
        aria-busy="true"
      >
        <p className="text-sm text-muted">Loading map…</p>
      </div>
    ),
  },
);

type EmergencyMapProps = {
  data: NearbyResourcesResult | null;
};

export function EmergencyMap({ data }: EmergencyMapProps) {
  if (!data) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-border bg-background sm:h-96">
        <p className="text-sm text-muted">Enable location to view the emergency map.</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 h-72 overflow-hidden rounded-xl border border-border sm:h-96">
      <EmergencyMapInner data={data} />
    </div>
  );
}
