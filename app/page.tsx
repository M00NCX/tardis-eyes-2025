"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

// Importação dinâmica para evitar problemas de SSR
const MapViewer = dynamic(
  () =>
    import("@/components/map-viewer").then((mod) => ({
      default: mod.MapViewer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-foreground mb-2">
            Carregando NASA Explorer
          </p>
          <p className="text-sm text-muted-foreground">
            Inicializando sistema de mapas...
          </p>
        </div>
      </div>
    ),
  }
);

function HomeContent() {
  const searchParams = useSearchParams();
  const planetParam = searchParams.get("planet") as "moon" | "mars" | "earth";
  const currentPlanet = planetParam || "moon";

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80 overflow-hidden flex flex-col items-center justify-center p-4">
      <MapViewer currentPlanet={currentPlanet} />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Carregando...</p>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
