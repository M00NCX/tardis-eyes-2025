"use client";

import { Suspense } from "react";
import { MapViewer } from "@/components/map-viewer";
import { useSearchParams } from "next/navigation";

function HomeContent() {
  const searchParams = useSearchParams();
  const planetParam = searchParams.get("planet") as "moon" | "mars" | "earth";
  const currentPlanet = planetParam || "moon";

  return (
    <div className="h-screen overflow-hidden">
      <MapViewer currentPlanet={currentPlanet} />
    </div>
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
