import type { ReadinessStatus } from "@/lib/dashboard/calculate-emergency-readiness";

type CircularProgressProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

function strokeColorForStatus(value: number): string {
  if (value >= 80) {
    return "stroke-emerald-500";
  }
  if (value >= 50) {
    return "stroke-brand";
  }
  return "stroke-amber-500";
}

export function CircularProgress({
  value,
  size = 112,
  strokeWidth = 10,
  className,
}: CircularProgressProps) {
  const percent = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const center = size / 2;

  return (
    <div
      className={["relative inline-flex shrink-0 items-center justify-center", className ?? ""].join(
        " ",
      )}
      role="img"
      aria-label={`${percent} percent readiness`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted/20"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={[strokeColorForStatus(percent), "transition-[stroke-dashoffset] duration-500"].join(
            " ",
          )}
        />
      </svg>
      <span className="absolute text-2xl font-bold text-foreground">{percent}</span>
    </div>
  );
}

type ReadinessStatusBadgeProps = {
  status: ReadinessStatus;
  label: string;
};

export function ReadinessStatusBadge({ status, label }: ReadinessStatusBadgeProps) {
  const toneClasses =
    status === "emergency_ready"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : status === "good"
        ? "border-brand/20 bg-brand/10 text-brand"
        : "border-amber-200 bg-amber-50 text-amber-900";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        toneClasses,
      ].join(" ")}
    >
      {label}
    </span>
  );
}
