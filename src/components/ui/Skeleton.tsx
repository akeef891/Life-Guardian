type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={["animate-pulse rounded-lg bg-muted/25", className ?? ""].join(" ")}
      aria-hidden
    />
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return <Skeleton className={["h-36 rounded-2xl border border-border", className ?? ""].join(" ")} />;
}
