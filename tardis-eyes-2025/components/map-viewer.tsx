'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AnnotationPanel } from './annotation-panel';
import { TourControl } from './tour-control';
// O AnnotationModal foi removido
import { Button } from './ui/button';
import { Layers } from 'lucide-react';

// --- Tipos de Dados (sem alterações) ---
interface Annotation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  author: string;
  created_at: string;
}

interface TourPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  order: number;
}

// Props para o componente
interface MapViewerProps {
  highlightedAnnotationId?: string | null;
}

export function MapViewer({ highlightedAnnotationId }: MapViewerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [tourPoints, setTourPoints] = useState<TourPoint[]>([]);
  // Estado do modal removido
  const [selectedPosition, setSelectedPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showPanel, setShowPanel] = useState(true);
  const [panelMode, setPanelMode] = useState<'list' | 'create'>('list'); // NOVO: Estado para controlar o modo do painel
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
    });
    mapRef.current = map;
    const bounds = L.latLngBounds([
      [-90, -180],
      [90, 180],
    ]);
    L.tileLayer(
      'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{x}/{y}.jpg',
      {
        bounds: bounds,
        noWrap: true,
        attribution: '© NASA Moon Trek',
      }
    ).addTo(map);
    map.fitBounds(bounds);

    // ALTERADO: Lógica do clique no mapa
    map.on('click', (e) => {
      setSelectedPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      setShowPanel(true); // Garante que o painel está visível
      setPanelMode('create'); // Muda o painel para o modo de criação
    });

    loadAnnotations();
    loadTourPoints();

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      const timer = setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 310);
      return () => clearTimeout(timer);
    }
  }, [showPanel]);

  const loadAnnotations = async () => {
    try {
      const response = await fetch('/api/annotations');
      if (response.ok) {
        const data = await response.json();
        setAnnotations(data);
      }
    } catch (error) {
      console.error('[v0] Error loading annotations:', error);
    }
  };

  const loadTourPoints = async () => {
    try {
      const response = await fetch('/api/tour-points');
      if (response.ok) {
        const data = await response.json();
        setTourPoints(data);
      }
    } catch (error) {
      console.error('[v0] Error loading tour points:', error);
    }
  };

  // ALTERADO: Lógica de criação de anotação
  const handleCreateAnnotation = async (data: {
    title: string;
    description: string;
    author: string;
  }) => {
    if (!selectedPosition) return;
    try {
      const response = await fetch('/api/annotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          lat: selectedPosition.lat,
          lng: selectedPosition.lng,
        }),
      });
      if (response.ok) {
        await loadAnnotations();
        setPanelMode('list'); // Retorna o painel para o modo de lista
        setSelectedPosition(null);
      }
    } catch (error) {
      console.error('[v0] Error creating annotation:', error);
    }
  };

  const flyToAnnotation = (annotation: Annotation) => {
    if (mapRef.current) {
      mapRef.current.flyTo([annotation.lat, annotation.lng], 2, {
        duration: 1.5,
      });
    }
  };

  const flyToTourPoint = (point: TourPoint) => {
    if (mapRef.current) {
      mapRef.current.flyTo([point.lat, point.lng], 2, {
        duration: 1.5,
      });
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    annotations.forEach((annotation) => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg ring-2 ring-primary/20 transition-transform hover:scale-110">
            <svg class="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      const marker = L.marker([annotation.lat, annotation.lng], { icon })
        .bindPopup(
          `<div class="p-2"><h3 class="font-semibold text-base mb-1">${annotation.title}</h3><p class="text-sm text-muted-foreground mb-2">${annotation.description}</p><p class="text-xs text-muted-foreground">Por ${annotation.author}</p></div>`
        )
        .addTo(mapRef.current);
      markersRef.current.push(marker);
    });
  }, [annotations]);

  useEffect(() => {
    if (highlightedAnnotationId && annotations.length > 0 && mapRef.current) {
      const annotationToHighlight = annotations.find(
        (ann) => ann.id === highlightedAnnotationId
      );
      if (annotationToHighlight) {
        flyToAnnotation(annotationToHighlight);
        const markerToOpen = markersRef.current.find(
          (m) =>
            m.getLatLng().lat === annotationToHighlight.lat &&
            m.getLatLng().lng === annotationToHighlight.lng
        );
        if (markerToOpen) {
          setTimeout(() => {
            markerToOpen.openPopup();
          }, 1500);
        }
      }
    }
  }, [highlightedAnnotationId, annotations]);

  return (
    // O Fragment <> é importante para o modal não interferir no layout flex
    <>
      <div className="flex h-full w-full overflow-hidden">
        {/* Contentor principal do mapa e controlos flutuantes */}
        <div className="relative h-full flex-1">
          <div ref={mapContainerRef} className="h-full w-full" />
          <div className="absolute left-4 top-4 z-[1000] flex flex-col gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => setShowPanel(!showPanel)}
              className="shadow-lg"
            >
              <Layers className="h-4 w-4" />
            </Button>
            {/* Este botão foi removido pois clicar no mapa agora abre o painel */}
          </div>
          <TourControl tourPoints={tourPoints} onSelectPoint={flyToTourPoint} />
        </div>

        {/* Painel de anotações (Sidebar) */}
        <AnnotationPanel
          annotations={annotations}
          onSelectAnnotation={flyToAnnotation}
          open={showPanel}
          // NOVAS PROPS
          mode={panelMode}
          onCreateAnnotation={handleCreateAnnotation}
          onModeChange={(mode) => {
            setPanelMode(mode);
            if (mode === 'list') {
              setSelectedPosition(null); // Limpa a posição ao cancelar
            }
          }}
        />
      </div>
      {/* O AnnotationModal já não é renderizado aqui */}
    </>
  );
}
