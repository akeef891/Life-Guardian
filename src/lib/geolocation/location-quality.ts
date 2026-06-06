export type LocationQuality = "excellent" | "good" | "fair" | "poor";

export const LOCATION_QUALITY_THRESHOLDS = {
  excellent: 20,
  good: 50,
  fair: 100,
} as const;

export function getLocationQuality(accuracyM: number): LocationQuality {
  if (!Number.isFinite(accuracyM) || accuracyM <= LOCATION_QUALITY_THRESHOLDS.excellent) {
    return "excellent";
  }
  if (accuracyM <= LOCATION_QUALITY_THRESHOLDS.good) {
    return "good";
  }
  if (accuracyM <= LOCATION_QUALITY_THRESHOLDS.fair) {
    return "fair";
  }
  return "poor";
}

export function formatLocationQualityLabel(accuracyM: number | null | undefined): string {
  if (accuracyM == null || !Number.isFinite(accuracyM)) {
    return "Unknown GPS accuracy";
  }

  const rounded = Math.round(accuracyM);
  const quality = getLocationQuality(accuracyM);

  switch (quality) {
    case "excellent":
      return `Excellent GPS (±${rounded}m)`;
    case "good":
      return `Good GPS (±${rounded}m)`;
    case "fair":
      return `Fair GPS (±${rounded}m)`;
    case "poor":
      return `Poor GPS (±${rounded}m) — move outdoors for a better fix`;
  }
}

export function locationQualityTone(
  quality: LocationQuality,
): "emerald" | "brand" | "amber" | "red" {
  switch (quality) {
    case "excellent":
      return "emerald";
    case "good":
      return "brand";
    case "fair":
      return "amber";
    case "poor":
      return "red";
  }
}
