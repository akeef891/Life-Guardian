import dynamic from "next/dynamic";
import { SkeletonCard } from "@/components/ui/Skeleton";

export const ResourcesExplorerLazy = dynamic(
  () => import("@/components/resources/ResourcesExplorer").then((mod) => mod.ResourcesExplorer),
  {
    loading: () => (
      <div className="space-y-3" aria-busy="true" aria-label="Loading resources">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    ),
  },
);
