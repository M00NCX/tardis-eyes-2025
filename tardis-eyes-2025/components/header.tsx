"use client";

import { Rocket, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { InfoModal } from "./info-modal";

interface HeaderProps {
  currentPlanet: "moon" | "mars" | "earth";
}

export function Header({ currentPlanet }: HeaderProps) {
  const [showInfo, setShowInfo] = useState(false);

  const planetNames = {
    moon: "Lua",
    mars: "Marte",
    earth: "Terra"
  };

  return (
    <>
      <header className="relative z-[9999] border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Rocket className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold">TARDIS Eyes - {planetNames[currentPlanet]}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInfo(true)}
              className="rounded-full"
            >
              <Info className="h-5 w-5" />
              <span className="sr-only">Informações</span>
            </Button>
          </div>
        </div>
      </header>
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
    </>
  );
}
