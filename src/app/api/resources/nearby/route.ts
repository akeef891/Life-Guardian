import { NextResponse } from "next/server";
import {
  createEmptyNearbyResult,
  toNearbyResourcesApiResponse,
} from "@/lib/services/emergency-resources-api";
import { getNearbyEmergencyResources } from "@/lib/services/emergency-resources.service";

const LOG_PREFIX = "[api/resources/nearby]";

export async function GET(request: Request) {
  const started = Date.now();
  const { searchParams } = new URL(request.url);
  const lat = Number.parseFloat(searchParams.get("lat") ?? "");
  const lng = Number.parseFloat(searchParams.get("lng") ?? "");
  const radius = Number.parseInt(searchParams.get("radius") ?? "12000", 10);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    console.warn(`${LOG_PREFIX} invalid coordinates`, {
      lat: searchParams.get("lat"),
      lng: searchParams.get("lng"),
    });
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }

  const safeRadius = Number.isFinite(radius) && radius > 0 ? radius : 12000;

  try {
    const result = await getNearbyEmergencyResources(lat, lng, safeRadius);
    const body = toNearbyResourcesApiResponse(result);

    console.info(`${LOG_PREFIX} success`, {
      lat,
      lng,
      radius: safeRadius,
      unavailable: Boolean(result.unavailable),
      hospitals: result.hospitals.length,
      police: result.police.length,
      ambulances: result.ambulances.length,
      elementCount: result.meta?.elementCount ?? 0,
      endpoint: result.meta?.endpoint,
      attempts: result.meta?.attempts,
      durationMs: Date.now() - started,
    });

    return NextResponse.json(body, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.warn(`${LOG_PREFIX} unexpected failure`, {
      lat,
      lng,
      message,
      durationMs: Date.now() - started,
    });
    return NextResponse.json(toNearbyResourcesApiResponse(createEmptyNearbyResult(lat, lng)), {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
