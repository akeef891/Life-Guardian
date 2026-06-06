"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import { formatDistanceFromMeters } from "@/lib/geolocation/format-distance";
import type { EmergencyResource, NearbyResourcesResult } from "@/lib/services/emergency-resources.service";
import "leaflet/dist/leaflet.css";

type EmergencyMapInnerProps = {
  data: NearbyResourcesResult;
  accuracyM?: number | null;
};

function MapCenterHelper({
  userLat,
  userLng,
  accuracyM,
}: {
  userLat: number;
  userLng: number;
  accuracyM?: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    const zoom =
      accuracyM != null && accuracyM <= 50 ? 16 : accuracyM != null && accuracyM <= 100 ? 15 : 14;
    map.setView([userLat, userLng], zoom, { animate: true });
  }, [map, userLat, userLng, accuracyM]);

  return null;
}

const MARKER_COLORS: Record<EmergencyResource["type"], string> = {
  hospital: "#dc2626",
  police: "#2563eb",
  ambulance: "#ea580c",
};

function resourceDistanceM(resource: EmergencyResource): number {
  return (
    resource.distanceM ??
    (Number.isFinite(resource.distanceKm) ? Math.round(resource.distanceKm * 1000) : 0)
  );
}

export function EmergencyMapInner({ data, accuracyM }: EmergencyMapInnerProps) {
  const allResources = [...data.hospitals, ...data.police, ...data.ambulances];

  return (
    <MapContainer
      center={[data.userLatitude, data.userLongitude]}
      zoom={15}
      scrollWheelZoom
      className="h-full w-full rounded-xl"
      aria-label="Emergency resources map centered on your GPS position"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapCenterHelper
        userLat={data.userLatitude}
        userLng={data.userLongitude}
        accuracyM={accuracyM}
      />
      <CircleMarker
        center={[data.userLatitude, data.userLongitude]}
        radius={12}
        pathOptions={{ color: "#0d9488", fillColor: "#14b8a6", fillOpacity: 0.95, weight: 3 }}
      >
        <Popup>
          <strong>Your GPS position</strong>
          <br />
          {data.userLatitude.toFixed(6)}, {data.userLongitude.toFixed(6)}
        </Popup>
      </CircleMarker>
      {accuracyM != null && Number.isFinite(accuracyM) ? (
        <CircleMarker
          center={[data.userLatitude, data.userLongitude]}
          radius={Math.min(Math.max(accuracyM / 2, 8), 80)}
          pathOptions={{
            color: "#0d9488",
            fillColor: "#14b8a6",
            fillOpacity: 0.12,
            weight: 1,
            dashArray: "4 4",
          }}
        />
      ) : null}
      {allResources.map((resource) => (
        <CircleMarker
          key={resource.id}
          center={[resource.latitude, resource.longitude]}
          radius={8}
          pathOptions={{
            color: MARKER_COLORS[resource.type],
            fillColor: MARKER_COLORS[resource.type],
            fillOpacity: 0.85,
            weight: 2,
          }}
        >
          <Popup>
            <strong>{resource.name}</strong>
            <br />
            {formatDistanceFromMeters(resourceDistanceM(resource))}
            <br />
            <a
              href={resource.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-brand underline"
            >
              Directions
            </a>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
