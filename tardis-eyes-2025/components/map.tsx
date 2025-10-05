"use client";

import { useCallback, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getPlanetConfig } from "@/lib/planet-config";
import { RoverAnimation } from "@/lib/rover-animation";

interface MapProps {
  currentPlanet: "moon" | "mars" | "earth";
  onPositionSelect: (position: L.LatLng) => void;
  onCenterChange: (center: L.LatLng) => void;
}

function MapEvents({ onMove, onPositionSelect }: { 
  onMove: (center: L.LatLng) => void;
  onPositionSelect: (position: L.LatLng) => void;
}) {
  const map = useMapEvents({
    move: () => {
      onMove(map.getCenter());
    },
    click: (e) => {
      onPositionSelect(e.latlng);
    },
  });

  return null;
}

export function Map({ currentPlanet, onPositionSelect, onCenterChange }: MapProps) {
  const roverRef = useRef<RoverAnimation | null>(null);
  const planetConfig = getPlanetConfig(currentPlanet);

  const handleMapLoad = useCallback((map: L.Map) => {
    if (!roverRef.current) {
      roverRef.current = new RoverAnimation(map);
    }
  }, []);

  return (
    <MapContainer
      center={[0, 0]}
      zoom={3}
      className="w-full h-full"
      ref={handleMapLoad}
    >
      <TileLayer
        attribution={planetConfig.attribution}
        url={planetConfig.tileUrl}
        maxZoom={planetConfig.maxZoom}
      />
      <MapEvents onMove={onCenterChange} onPositionSelect={onPositionSelect} />
    </MapContainer>
  );
}
