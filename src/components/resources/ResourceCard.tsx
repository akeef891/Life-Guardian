import { formatResourceDistanceKmAway } from "@/lib/geolocation/format-distance";
import type { EmergencyResource } from "@/lib/services/emergency-resources.service";

type ResourceCardProps = {
  resource: EmergencyResource;
  openMapsLabel?: string;
};

export function ResourceCard({
  resource,
  openMapsLabel = "Open in Google Maps",
}: ResourceCardProps) {
  const distanceM =
    resource.distanceM ??
    (Number.isFinite(resource.distanceKm) ? Math.round(resource.distanceKm * 1000) : 0);

  return (
    <article className="min-w-0 rounded-xl border border-border bg-background p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{resource.name}</h3>
          <p className="mt-1 break-words text-xs text-muted">{resource.address}</p>
          <p className="mt-2 text-xs font-medium text-brand">
            Distance: {formatResourceDistanceKmAway(distanceM)} away
          </p>
        </div>
        <a
          href={resource.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-brand/30"
        >
          {openMapsLabel}
        </a>
      </div>
    </article>
  );
}
