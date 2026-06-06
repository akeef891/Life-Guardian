import {
  formatLocationQualityLabel,
  getLocationQuality,
  locationQualityTone,
  type LocationQuality,
} from "@/lib/geolocation/location-quality";

type LocationQualityBadgeProps = {
  accuracyM: number | null | undefined;
  className?: string;
};

const TONE_CLASSES: Record<ReturnType<typeof locationQualityTone>, string> = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
  brand: "border-brand/30 bg-brand/10 text-brand-dark",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  red: "border-red-200 bg-red-50 text-red-800",
};

export function LocationQualityBadge({ accuracyM, className }: LocationQualityBadgeProps) {
  if (accuracyM == null || !Number.isFinite(accuracyM)) {
    return null;
  }

  const quality: LocationQuality = getLocationQuality(accuracyM);
  const tone = locationQualityTone(quality);

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        TONE_CLASSES[tone],
        className ?? "",
      ].join(" ")}
    >
      {formatLocationQualityLabel(accuracyM)}
    </span>
  );
}
