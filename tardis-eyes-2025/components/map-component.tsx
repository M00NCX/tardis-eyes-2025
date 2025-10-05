'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RoverAnimation } from '@/lib/rover-animation';
import { getPlanetConfig } from '@/lib/planet-config';
import { useMapLayers } from '@/hooks/use-map-layers';

// --- Tipos de Dados ---
interface Annotation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  author: string;
  is_historical?: boolean;
  planet: string;
}
type AnimationState =
  | { status: 'idle' }
  | { status: 'animating'; from: L.LatLng; to: L.LatLng }
  | { status: 'placing_flag'; at: L.LatLng };

interface Props {
  highlightedAnnotationId?: string | null;
  currentPlanet: 'moon' | 'mars' | 'earth';
  onSelectPositionForAnnotation: (position: L.LatLng) => void;
  onSelectAnnotation: (annotation: Annotation) => void;
  annotations: Annotation[];
  roverPosition: L.LatLng | null;
  onRoverPositionChange: (position: L.LatLng) => void;
  animationState: AnimationState;
  onAnimationComplete: (position: L.LatLng) => void;
}

// --- Ícones Customizados ---
const createIcon = (url: string, className: string = '') =>
  L.divIcon({
    html: `<img src="${url}" alt="marker" />`,
    className: `custom-marker ${className}`,
    iconSize: [40, 40],
    iconAnchor: url.includes('rover') ? [20, 20] : [12, 40],
    popupAnchor: [0, -40],
  });

const roverIcon = createIcon('/rover.png', 'custom-rover-marker');
const flagMarkerIcon = createIcon('/flag-marker.png', 'custom-flag-marker');
const flagFixedIcon = createIcon('/flag-fixed.png', 'custom-flag-fixed');

// Estilos movidos para globals.css

export default function MapComponent({
  highlightedAnnotationId,
  currentPlanet,
  onSelectPositionForAnnotation,
  onSelectAnnotation,
  annotations,
  roverPosition,
  onRoverPositionChange,
  animationState,
  onAnimationComplete,
}: Props) {
  // Estado para controlar o carregamento das camadas
  const [layersLoaded, setLayersLoaded] = useState(false);
  const [lastTileUrl, setLastTileUrl] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const roverMarkerRef = useRef<L.Marker | null>(null);
  const roverAnimationRef = useRef<RoverAnimation | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const config = getPlanetConfig(currentPlanet);
      console.debug(
        '[MapComponent] Initializing map for',
        currentPlanet,
        config
      );
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        preferCanvas: true,
        minZoom: config.minZoom,
        maxZoom: config.maxZoom,

        // Controle de zoom
        zoomSnap: 0.5, // zoom em passos inteiros
        zoomDelta: 0.5, // cada rolagem do scroll
        wheelPxPerZoomLevel: 180, // suavidade do zoom

        maxBounds: config.bounds ? L.latLngBounds(config.bounds) : undefined,
        maxBoundsViscosity: 1.0,
      }).setView(config.center, config.zoom);

      map.on('dblclick', (e) => onSelectPositionForAnnotation(e.latlng));
      mapRef.current = map;
      roverAnimationRef.current = new RoverAnimation(map);
      // small timeout to ensure container sizing
      setTimeout(() => {
        try {
          map.invalidateSize();
        } catch (e) {}
      }, 50);
    }
  }, [onSelectPositionForAnnotation, currentPlanet]);

  // Gerenciamento de camadas do mapa (passa TMS e callback)
  useMapLayers({
    map: mapRef.current,
    currentPlanet,
    onTileRequest: (url) => setLastTileUrl(url),
  });

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (roverPosition && !roverMarkerRef.current) {
      roverMarkerRef.current = L.marker(roverPosition, {
        icon: roverIcon,
        zIndexOffset: 1000,
      }).addTo(map);
      roverAnimationRef.current?.setMarker(roverMarkerRef.current);
    }
    if (roverMarkerRef.current) {
      if (animationState.status === 'idle')
        roverMarkerRef.current.setIcon(roverIcon);
      if (roverPosition && animationState.status !== 'animating')
        roverMarkerRef.current.setLatLng(roverPosition);
    }
  }, [roverPosition, animationState.status]);

  useEffect(() => {
    const rover = roverMarkerRef.current;
    if (!rover || !roverAnimationRef.current) return;

    if (animationState.status === 'animating') {
      rover.setIcon(roverIcon);
      rover.getPane()?.classList.remove('marker-pulse');
      roverAnimationRef.current.start({
        startPosition: animationState.from,
        endPosition: animationState.to,
        duration: 2000,
        onComplete: () => {
          onRoverPositionChange(animationState.to);
          onAnimationComplete(animationState.to);
        },
      });
    } else if (animationState.status === 'placing_flag') {
      rover.setIcon(flagMarkerIcon);
      rover.setLatLng(animationState.at);
      rover.getPane()?.classList.add('marker-pulse');

      const timer = setTimeout(() => {
        if (roverMarkerRef.current?.getLatLng().equals(animationState.at)) {
          roverMarkerRef.current.setIcon(flagFixedIcon);
          roverMarkerRef.current.getPane()?.classList.remove('marker-pulse');
        }
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      rover.getPane()?.classList.remove('marker-pulse');
    }
  }, [animationState, onAnimationComplete, onRoverPositionChange]);

  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();
    annotations.forEach((annotation) => {
      const icon = annotation.is_historical ? flagFixedIcon : flagMarkerIcon;
      const marker = L.marker([annotation.lat, annotation.lng], { icon }).addTo(
        mapRef.current!
      ).bindPopup(`
          <div class="p-1 max-w-xs">
            <h3 class="font-semibold text-base mb-1">${annotation.title}</h3>
            <p class="text-sm text-muted-foreground mb-2">${annotation.description}</p>
            <p class="text-xs text-muted-foreground">Por: ${annotation.author}</p>
          </div>
        `);
      marker.on('click', () => onSelectAnnotation(annotation));
      markersRef.current.set(annotation.id, marker);
    });
  }, [annotations, onSelectAnnotation]);

  useEffect(() => {
    if (highlightedAnnotationId && mapRef.current) {
      const point = annotations.find((a) => a.id === highlightedAnnotationId);
      if (point) {
        mapRef.current.flyTo([point.lat, point.lng], 5, { duration: 1 });
        setTimeout(() => {
          const marker = markersRef.current.get(point.id);
          marker?.openPopup();
        }, 1100);
      }
    }
  }, [highlightedAnnotationId, annotations]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
