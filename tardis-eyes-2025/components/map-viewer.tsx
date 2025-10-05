"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { getPlanetConfig } from "@/lib/planet-config";
import { Header } from "./header";
import { TourControl } from "./tour-control";
import { AnnotationPanel } from "./annotation-panel";
import { AnnotationModal } from "./annotation-modal";
import { RoverAnimation } from "@/lib/rover-animation";

// Importação dinâmica do Leaflet e seus componentes
const MapWithNoSSR = dynamic(
  () => import('./map').then((mod) => mod.Map),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
);

interface MapProps {
  currentPlanet: "moon" | "mars" | "earth";
}

export function MapViewer({ currentPlanet }: MapProps) {
  const [isAddingFlag, setIsAddingFlag] = useState(false);
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [center, setCenter] = useState<any>([0, 0]);
  const planetConfig = getPlanetConfig(currentPlanet);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <Header currentPlanet={currentPlanet} />
      <div className="w-full h-[calc(100vh-4rem)] relative">
        <MapWithNoSSR
          currentPlanet={currentPlanet}
          onPositionSelect={(position) => {
            if (isAddingFlag) {
              setSelectedPosition(position);
              setShowAnnotationModal(true);
              setIsAddingFlag(false);
            }
          }}
          onCenterChange={setCenter}
        />
        
        <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
          <TourControl
            onStartTour={() => {/* Implementar início do tour */}}
            onAddFlag={() => setIsAddingFlag(true)}
          />
        </div>
        
        <div className="absolute top-0 left-4 z-[1000] w-80 max-w-[90vw]">
          <AnnotationPanel center={center} />
        </div>
      </div>

      {showAnnotationModal && selectedPosition && (
        <AnnotationModal
          position={selectedPosition}
          onClose={() => {
            setShowAnnotationModal(false);
            setSelectedPosition(null);
          }}
        />
      )}
    </div>
  );
}
