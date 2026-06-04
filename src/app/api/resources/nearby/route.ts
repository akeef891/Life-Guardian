import { NextResponse } from "next/server";
import {
  createEmptyNearbyResult,
  toNearbyResourcesApiResponse,
} from "@/lib/services/emergency-resources-api";
import { getNearbyEmergencyResources } from "@/lib/services/emergency-resources.service";

const LOG_PREFIX = "[api/resources/nearby]";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number.parseFloat(searchParams.get("lat") ?? "");
  const lng = Number.parseFloat(searchParams.get("lng") ?? "");
  const radius = Number.parseInt(searchParams.get("radius") ?? "8000", 10);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }

  const safeRadius = Number.isFinite(radius) && radius > 0 ? radius : 8000;

  try {
    const result = await getNearbyEmergencyResources(lat, lng, safeRadius);
    return NextResponse.json(toNearbyResourcesApiResponse(result), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.warn(`${LOG_PREFIX} upstream failure, returning empty resources`, {
      lat,
      lng,
      message,
    });
    return NextResponse.json(toNearbyResourcesApiResponse(createEmptyNearbyResult(lat, lng)), {
      status: 200,
    });
  }
}
