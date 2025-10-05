'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import { Header } from './header';
import { PlanetNavigation } from './planet-navigation';
import { AnnotationPanel } from './annotation-panel';
import { AnnotationModal } from './annotation-modal';
import { TourControl } from './tour-control';
import { Button } from './ui/button';
import { PanelLeftClose, PanelRightClose } from 'lucide-react';

import { Annotation, TourPoint, PlanetType } from '@/types';

type AnimationState =
  | { status: 'idle' }
  | { status: 'animating'; from: L.LatLng; to: L.LatLng }
  | { status: 'placing_flag'; at: L.LatLng };

const MapComponentWithNoSSR = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p className="text-lg font-semibold text-foreground mb-2">
        Carregando Mapa
      </p>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        Conectando com as APIs da NASA para exibir imagens de alta resolução...
      </p>
    </div>
  ),
});

interface MapViewerProps {
  currentPlanet: 'moon' | 'mars' | 'earth';
}

export function MapViewer({ currentPlanet }: MapViewerProps) {
  const router = useRouter();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [tourPoints, setTourPoints] = useState<TourPoint[]>([]);
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [highlightedAnnotationId, setHighlightedAnnotationId] = useState<
    string | null
  >(null);
  const [roverPosition, setRoverPosition] = useState<L.LatLng | null>(null);
  const [animationState, setAnimationState] = useState<AnimationState>({
    status: 'idle',
  });
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const allPointsToDisplay = [...annotations, ...tourPoints];

  const fetchData = useCallback(async () => {
    try {
      const [annotationsRes, tourPointsRes] = await Promise.all([
        fetch(`/api/annotations?planet=${currentPlanet}`),
        fetch(`/api/tour-points?planet=${currentPlanet}`),
      ]);
      const annotationsData = await annotationsRes.json();
      const tourPointsData: TourPoint[] = await tourPointsRes.json();
      setAnnotations(annotationsData);
      setTourPoints(tourPointsData);
      if (tourPointsData.length > 0 && !roverPosition) {
        const firstPoint = tourPointsData.sort((a, b) => a.order - b.order)[0];
        setRoverPosition(new L.LatLng(firstPoint.lat, firstPoint.lng));
      }
    } catch (error) {
      console.error('Falha ao buscar dados:', error);
    }
  }, [currentPlanet, roverPosition]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePlanetChange = (planet: 'moon' | 'mars' | 'earth') => {
    setRoverPosition(null);
    router.push(`/?planet=${planet}`);
  };

  const handleSelectPositionForAnnotation = (position: L.LatLng) => {
    if (animationState.status !== 'idle') return;
    setAnimationState({
      status: 'placing_flag',
      at: position,
    });
    setShowAnnotationModal(true);
  };

  const onAnimationComplete = (position: L.LatLng) => {
    setAnimationState({ status: 'placing_flag', at: position });
    setAnimationState({ status: 'idle' });
  };

  // 1. CORREÇÃO: A função handleCreateAnnotation foi removida daqui.
  // A responsabilidade de criar a anotação agora é inteiramente do AnnotationModal.

  const handleSelectAnnotation = (annotation: Annotation | TourPoint) => {
    setHighlightedAnnotationId(annotation.id);
    const newPos = new L.LatLng(annotation.lat, annotation.lng);
    if (roverPosition && animationState.status === 'idle') {
      setAnimationState({
        status: 'animating',
        from: roverPosition,
        to: newPos,
      });
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      <Header currentPlanet={currentPlanet} />
      <PlanetNavigation
        currentPlanet={currentPlanet}
        onPlanetChange={handlePlanetChange}
      />

      <div className="w-full h-[calc(100vh-6.1rem)] relative">
        <MapComponentWithNoSSR
          currentPlanet={currentPlanet}
          annotations={allPointsToDisplay}
          onSelectPositionForAnnotation={handleSelectPositionForAnnotation}
          onSelectAnnotation={handleSelectAnnotation}
          highlightedAnnotationId={highlightedAnnotationId}
          roverPosition={roverPosition}
          onRoverPositionChange={setRoverPosition}
          animationState={animationState}
          onAnimationComplete={onAnimationComplete}
        />

        <div className="absolute bottom-4 right-4 z-[1001] flex flex-col gap-3">
          <Button
            onClick={() => {
              setAnimationState({
                status: 'placing_flag',
                at: new L.LatLng(0, 0),
              });
              setShowAnnotationModal(true);
            }}
            className="shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-semibold"
            size="lg"
          >
            Escrever Anotação
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-8 left-7 shadow-lg bg-card/80 backdrop-blur"
            onClick={() => setIsPanelVisible(!isPanelVisible)}
            aria-label={isPanelVisible ? 'Esconder painel' : 'Mostrar painel'}
          >
            {isPanelVisible ? (
              <PanelRightClose className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>
        </div>

        <TourControl
          tourPoints={tourPoints}
          onSelectPoint={handleSelectAnnotation}
        />

        <AnnotationPanel
          annotations={annotations}
          onSelectAnnotation={handleSelectAnnotation}
          open={isPanelVisible}
          onToggleVisibility={() => setIsPanelVisible(false)}
          mode={'list'}
          onModeChange={() => {}}
          onCreateAnnotation={() => {}}
          position={null}
        />
      </div>

      {/* 2. CORREÇÃO: Passando as props corretas para o Modal */}

      <AnnotationModal
        open={showAnnotationModal}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setShowAnnotationModal(false);
            setAnimationState({ status: 'idle' });
          }
        }}
        onCreated={fetchData}
        position={
          animationState.status === 'placing_flag'
            ? { lat: animationState.at.lat, lng: animationState.at.lng }
            : null
        }
        planet={currentPlanet}
      />
    </div>
  );
}
