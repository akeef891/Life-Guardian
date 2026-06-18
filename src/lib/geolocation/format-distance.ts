/** Format distance for resource cards — always km with one decimal (e.g. 0.4 km). */
export function formatResourceDistanceKmAway(distanceM: number): string {
  if (!Number.isFinite(distanceM) || distanceM < 0) {
    return "— km";
  }
  return `${(distanceM / 1000).toFixed(1)} km`;
}

/** Format Haversine distance: meters when < 1 km, otherwise km with one decimal. */
export function formatDistanceFromMeters(distanceM: number): string {
  if (!Number.isFinite(distanceM) || distanceM < 0) {
    return "—";
  }
  if (distanceM < 1000) {
    return `${Math.round(distanceM)} m`;
  }
  return `${(distanceM / 1000).toFixed(1)} km`;
}

export function formatDistanceFromKm(distanceKm: number): string {
  return formatDistanceFromMeters(distanceKm * 1000);
}
