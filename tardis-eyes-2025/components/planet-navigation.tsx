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
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[99999] bg-background/95 backdrop-blur-md rounded-full px-3 py-2 shadow-xl border border-border/50 flex items-center gap-3">
      {Object.entries(planetInfo).map(([key, info]) => {
        const isCurrent = currentPlanet === key;
        return (
          <Button
            key={key}
            variant={isCurrent ? "secondary" : "ghost"}
            className={cn(
              "rounded-full h-auto p-2 flex flex-col items-center transition-all hover:scale-110 hover:bg-secondary/50",
              isCurrent &&
                "bg-secondary/80 shadow-inner ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
            onClick={() => onPlanetChange(key as "moon" | "mars" | "earth")}
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-full",
                isCurrent ? "w-14 h-14" : "w-12 h-12"
              )}
            >
              <Image
                src={info.image}
                alt={info.name}
                width={isCurrent ? 56 : 48}
                height={isCurrent ? 56 : 48}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="text-xs mt-1">{info.name}</span>
          </Button>
        );
      })}
    </div>
  );
}
