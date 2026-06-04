"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import type { EmergencyResource, NearbyResourcesResult } from "@/lib/services/emergency-resources.service";
import "leaflet/dist/leaflet.css";

type EmergencyMapInnerProps = {
  data: NearbyResourcesResult;
};

function MapBoundsHelper({
  userLat,
  userLng,
  resources,
}: {
  userLat: number;
  userLng: number;
  resources: EmergencyResource[];
}) {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = [
      [userLat, userLng],
      ...resources.map((r) => [r.latitude, r.longitude] as [number, number]),
    ];
    if (points.length === 1) {
      map.setView([userLat, userLng], 14);
      return;
    }
    const lats = points.map((p) => p[0]);
    const lngs = points.map((p) => p[1]);
    map.fitBounds(
      [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ],
      { padding: [48, 48], maxZoom: 15 },
    );
  }, [map, userLat, userLng, resources]);

  return null;
}

const MARKER_COLORS: Record<EmergencyResource["type"], string> = {
  hospital: "#dc2626",
  police: "#2563eb",
  ambulance: "#ea580c",
};

export function EmergencyMapInner({ data }: EmergencyMapInnerProps) {
  const allResources = [...data.hospitals, ...data.police, ...data.ambulances];

  return (
    <MapContainer
      center={[data.userLatitude, data.userLongitude]}
      zoom={14}
      scrollWheelZoom
      className="h-full w-full rounded-xl"
      aria-label="Emergency resources map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBoundsHelper
        userLat={data.userLatitude}
        userLng={data.userLongitude}
        resources={allResources}
      />
      <CircleMarker
        center={[data.userLatitude, data.userLongitude]}
        radius={10}
        pathOptions={{ color: "#0d9488", fillColor: "#14b8a6", fillOpacity: 0.9, weight: 2 }}
      >
        <Popup>You are here</Popup>
      </CircleMarker>
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
            {resource.distanceKm} km
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
