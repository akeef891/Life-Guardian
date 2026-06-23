import dynamic from "next/dynamic";
import { SkeletonCard } from "@/components/ui/Skeleton";

export const SOSHistoryListLazy = dynamic(
  () => import("@/components/sos/SOSHistoryList").then((mod) => mod.SOSHistoryList),
  {
    loading: () => (
      <div className="mt-6 space-y-3" aria-busy="true" aria-label="Loading SOS history">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    ),
  },
);
