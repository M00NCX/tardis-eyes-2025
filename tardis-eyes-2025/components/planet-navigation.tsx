"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface PlanetNavigationProps {
  currentPlanet: "moon" | "mars" | "earth";
  onPlanetChange: (planet: "moon" | "mars" | "earth") => void;
}

const planetInfo = {
  moon: {
    name: "Lua",
    image: "/Lua.png",
  },
  mars: {
    name: "Marte",
    image: "/Marte.png",
  },
  earth: {
    name: "Terra",
    image: "/Terra.png",
  },
};

export function PlanetNavigation({
  currentPlanet,
  onPlanetChange,
}: PlanetNavigationProps) {
  return (
    // CORREÇÃO: Aumentado o z-index para um valor muito alto (z-[99999])
    // para garantir que ele fique sobreposto a todos os outros elementos.
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[99999] bg-background/95 backdrop-blur-md rounded-full px-3 py-2 shadow-xl border border-border/50 flex items-center gap-3">
      {Object.entries(planetInfo).map(([key, info]) => (
        <Button
          key={key}
          variant={currentPlanet === key ? "secondary" : "ghost"}
          className={cn(
            "rounded-full p-1 transition-all hover:scale-110 hover:bg-secondary/50",
            currentPlanet === key &&
              "bg-secondary/80 shadow-inner ring-2 ring-primary ring-offset-2 ring-offset-background"
          )}
          onClick={() => onPlanetChange(key as "moon" | "mars" | "earth")}
        >
          <div className="relative w-12 h-12 overflow-hidden">
            <Image
              src={info.image}
              alt={info.name}
              width={48}
              height={48}
              className="w-full h-full object-cover rounded-full"
              priority
            />
            <span className="sr-only">{info.name}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}
