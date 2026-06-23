import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";

function DashboardPanelSkeleton({ className }: { className?: string }) {
  return <Skeleton className={className ?? "h-72 rounded-2xl border border-border"} />;
}

export const DashboardResourceCenterLazy = dynamic(
  () =>
    import("@/components/dashboard/DashboardResourceCenter").then(
      (mod) => mod.DashboardResourceCenter,
    ),
  { loading: () => <DashboardPanelSkeleton /> },
);

export const CommunityAlertsPanelLazy = dynamic(
  () =>
    import("@/components/dashboard/CommunityAlertsPanel").then(
      (mod) => mod.CommunityAlertsPanel,
    ),
  { loading: () => <DashboardPanelSkeleton className="h-48 rounded-2xl border border-border" /> },
);

export const EmergencyActivityTimelineLazy = dynamic(
  () =>
    import("@/components/dashboard/EmergencyActivityTimeline").then(
      (mod) => mod.EmergencyActivityTimeline,
    ),
  { loading: () => <DashboardPanelSkeleton className="h-96 rounded-2xl border border-border" /> },
);
