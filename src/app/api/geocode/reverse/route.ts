import { NextResponse } from "next/server";
import { reverseGeocodePlace } from "@/lib/geolocation/reverse-geocode";

const LOG_PREFIX = "[api/geocode/reverse]";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number.parseFloat(searchParams.get("lat") ?? "");
  const lng = Number.parseFloat(searchParams.get("lng") ?? "");

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }

  const place = await reverseGeocodePlace(lat, lng);

  console.info(LOG_PREFIX, "resolved", {
    lat,
    lng,
    locality: place.nearestLocality,
    district: place.district,
    state: place.state,
  });

  return NextResponse.json(place, {
    status: 200,
    headers: { "Cache-Control": "private, max-age=120" },
  });
}
