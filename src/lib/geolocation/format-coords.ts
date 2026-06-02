export function formatCoordDisplay(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) {
    return "N/A";
  }
  return value.toFixed(6);
}
