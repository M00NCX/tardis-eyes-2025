"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getPlanetConfig } from "@/lib/planet-config";

interface MapProps {
  currentPlanet: "moon" | "mars" | "earth";
  onPositionSelect: (position: L.LatLng) => void;
  onCenterChange: (center: L.LatLng) => void;
}

// 🪐 Atualiza dinamicamente a camada de tiles quando o planeta muda
function MapLayer({
  currentPlanet,
}: {
  currentPlanet: MapProps["currentPlanet"];
}) {
  const map = useMap();
  const planetConfig = getPlanetConfig(currentPlanet);

  useEffect(() => {
    // ✅ Criamos o tile layer com parâmetros ajustados para desempenho e suavidade
    const tileLayer = L.tileLayer(planetConfig.tileUrl, {
      attribution: planetConfig.attribution,
      maxZoom: planetConfig.maxZoom,
      maxNativeZoom: planetConfig.maxZoom,
      noWrap: planetConfig.noWrap,
      crossOrigin: true,

      // ⚡️ Ajustes que reduzem piscadas e recarregamentos
      keepBuffer: 8,             // mantém tiles em cache fora da tela
      updateWhenIdle: true,      // só atualiza após parar de mover
      updateWhenZooming: false,  // não recarrega durante o zoom
      reuseTiles: true,          // reaproveita imagens já carregadas
      unloadInvisibleTiles: false, // não descarrega tiles fora da tela
    });

    // 🔄 Remove camadas antigas, adiciona a nova
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });
    tileLayer.addTo(map);

    // 🔧 Ajusta centro, zoom e limites
    map.setZoom(planetConfig.zoom);
    map.panTo(planetConfig.center);
    if (planetConfig.bounds) {
      map.setMaxBounds(planetConfig.bounds);
    } else {
      map.setMaxBounds(null);
    }

    // 🧹 Limpeza opcional ao desmontar
    return () => {
      if (map.hasLayer(tileLayer)) {
        map.removeLayer(tileLayer);
      }
    };
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
      minZoom={planetConfig.minZoom}
      maxZoom={planetConfig.maxZoom}
      className="w-full h-full"

      // 🚀 Ajustes de comportamento do mapa
      fadeAnimation={false}        // desativa animação de fade ao trocar tiles
      zoomAnimation={true}         // mantém animação de zoom fluida
      zoomAnimationThreshold={4}   // evita recarregar em pequenos zooms
      markerZoomAnimation={false}  // evita piscar marcadores
      preferCanvas={true}          // melhora performance e cache
    >
      <MapLayer currentPlanet={currentPlanet} />
      <MapEvents onMove={onCenterChange} onPositionSelect={onPositionSelect} />
    </MapContainer>
  );
}
