"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

interface Props {
  highlightedAnnotationId?: string | null;
  currentPlanet: "moon" | "mars" | "earth";
  onSelectPosition: (position: { lat: number; lng: number }) => void;
  annotations: any[];
  tourPoints: any[];
  onSelectAnnotation: (annotation: any) => void;
}

const createRoverIcon = (rotation: number = 0) =>
  L.divIcon({
    className: "custom-rover-marker",
    html: `<img src="/rover.png" alt="Rover" class="h-10 w-10" style="transform: rotate(${rotation}deg); transition: transform 0.3s ease-in-out;" />`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

const createFlagIcon = (isFixed: boolean) =>
  L.divIcon({
    className: isFixed ? "custom-flag-fixed" : "custom-flag-marker",
    html: `<img src="${
      isFixed ? "/flag-fixed.png" : "/flag-marker.png"
    }" alt="Bandeira" class="h-10 w-10" style="transition: all 0.3s ease-in-out;" />`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

export default function MapComponent({
  highlightedAnnotationId,
  currentPlanet,
  onSelectPosition,
  annotations,
  tourPoints,
  onSelectAnnotation,
}: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const roverMarkerRef = useRef<L.Marker | null>(null);
  const isAnimating = useRef<boolean>(false);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Effect para inicializar o mapa
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        preferCanvas: true,
      });

      mapRef.current.on("click", (e) => {
        if (e.originalEvent.ctrlKey || e.originalEvent.metaKey) {
          onSelectPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onSelectPosition]);

  // Effect para atualizar o mapa quando mudar de planeta
  useEffect(() => {
    if (!mapRef.current) return;

    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    let tileUrl = "";
    let attribution = "";

    switch (currentPlanet) {
      case "mars":
        tileUrl =
          "https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.png";
        attribution = "© NASA/JPL/USGS";
        break;
      case "earth":
        tileUrl =
          "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/EPSG3857_500m/{z}/{y}/{x}.jpeg";
        attribution = "© NASA Earth Observatory";
        break;
      case "moon":
      default:
        tileUrl =
          "https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{y}/{x}.jpg";
        attribution = "© NASA/GSFC/ASU";
        break;
    }

    const bounds = L.latLngBounds([
      [-90, -180],
      [90, 180],
    ]);

    tileLayerRef.current = L.tileLayer(tileUrl, {
      bounds,
      noWrap: true,
      attribution,
      minZoom: 1,
      maxZoom: 8,
      tileSize: 256,
    }).addTo(mapRef.current);

    mapRef.current.fitBounds(bounds);
    mapRef.current.setZoom(currentPlanet === "earth" ? 3 : 2);
  }, [currentPlanet]);

  // Effect para atualizar marcadores quando annotations mudarem
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    annotations.forEach((annotation) => {
      const marker = L.marker([annotation.lat, annotation.lng], {
        icon: createFlagIcon(!!annotation.is_historical),
      })
        .bindPopup(
          `
        <div class="p-2 max-w-xs">
          <h3 class="font-semibold text-base mb-1">${annotation.title} ${
            annotation.is_historical ? "(Marco Histórico)" : ""
          }</h3>
          <p class="text-sm text-muted-foreground mb-2">${
            annotation.description
          }</p>
          <p class="text-xs text-muted-foreground">Por: ${annotation.author}</p>
        </div>
      `
        )
        .addTo(mapRef.current!);

      marker.on("click", () => onSelectAnnotation(annotation));
      markersRef.current.set(annotation.id, marker);
    });

    if (tourPoints.length > 0) {
      const firstPoint = tourPoints.sort((a, b) => a.order - b.order)[0];
      if (roverMarkerRef.current) {
        roverMarkerRef.current.setLatLng([firstPoint.lat, firstPoint.lng]);
      } else {
        roverMarkerRef.current = L.marker([firstPoint.lat, firstPoint.lng], {
          icon: createRoverIcon(0),
          zIndexOffset: 1000,
        }).addTo(mapRef.current);
      }
    } else if (roverMarkerRef.current) {
      roverMarkerRef.current.remove();
      roverMarkerRef.current = null;
    }
  }, [annotations, tourPoints, onSelectAnnotation]);

  // Effect para destacar anotação selecionada
  useEffect(() => {
    if (highlightedAnnotationId && annotations.length > 0 && mapRef.current) {
      const annotationToHighlight = annotations.find(
        (ann) => ann.id === highlightedAnnotationId
      );
      if (annotationToHighlight) {
        mapRef.current.flyTo(
          [annotationToHighlight.lat, annotationToHighlight.lng],
          5,
          { duration: 1.5 }
        );
        setTimeout(() => {
          const marker = markersRef.current.get(annotationToHighlight.id);
          marker?.openPopup();
        }, 1600);
      }
    }
  }, [highlightedAnnotationId, annotations]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
}
