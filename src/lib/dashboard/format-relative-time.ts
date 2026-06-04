const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

export function formatRelativeTime(value: Date, now = new Date()): string {
  const diffMs = now.getTime() - value.getTime();
  const absDiff = Math.abs(diffMs);

  if (absDiff < MINUTE_MS) {
    return "Just now";
  }
  if (absDiff < HOUR_MS) {
    const minutes = Math.round(absDiff / MINUTE_MS);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  if (absDiff < DAY_MS) {
    const hours = Math.round(absDiff / HOUR_MS);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (absDiff < DAY_MS * 7) {
    const days = Math.round(absDiff / DAY_MS);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return value.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
