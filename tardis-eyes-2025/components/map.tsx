"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getPlanetConfig } from "@/lib/planet-config";

interface MapProps {
  currentPlanet: "moon" | "mars" | "earth";
  onPositionSelect: (position: L.LatLng) => void;
  onCenterChange: (center: L.LatLng) => void;
}

// Componente para atualizar a camada do mapa dinamicamente
function MapLayer({
  currentPlanet,
}: {
  currentPlanet: MapProps["currentPlanet"];
}) {
  const map = useMap();
  const planetConfig = getPlanetConfig(currentPlanet);

  useEffect(() => {
    const tileLayer = L.tileLayer(planetConfig.tileUrl, {
      attribution: planetConfig.attribution,
      maxZoom: planetConfig.maxZoom,
      noWrap: planetConfig.noWrap,
    });

    // Limpa camadas antigas e adiciona a nova
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });
    tileLayer.addTo(map);

    map.setZoom(planetConfig.zoom);
    map.panTo(planetConfig.center);

    if (planetConfig.bounds) {
      map.setMaxBounds(planetConfig.bounds);
    } else {
      map.setMaxBounds(null);
    }
  }, [currentPlanet, map, planetConfig]);

  return null;
}

function MapEvents({
  onMove,
  onPositionSelect,
}: {
  onMove: (center: L.LatLng) => void;
  onPositionSelect: (position: L.LatLng) => void;
}) {
  const map = useMapEvents({
    move: () => onMove(map.getCenter()),
    click: (e) => onPositionSelect(e.latlng),
  });

  return null;
}

export function Map({
  currentPlanet,
  onPositionSelect,
  onCenterChange,
}: MapProps) {
  const planetConfig = getPlanetConfig(currentPlanet);

  return (
    <MapContainer
      center={planetConfig.center}
      zoom={planetConfig.zoom}
      className="w-full h-full"
    >
      <MapLayer currentPlanet={currentPlanet} />
      <MapEvents onMove={onCenterChange} onPositionSelect={onPositionSelect} />
    </MapContainer>
  );
}
