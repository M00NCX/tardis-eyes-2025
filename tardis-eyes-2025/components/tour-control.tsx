'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  order: number;
  planet: 'moon' | 'mars' | 'earth';
}

interface TourControlProps {
  tourPoints: TourPoint[];
  onSelectPoint: (point: TourPoint) => void;
}

export function TourControl({
  tourPoints = [],
  onSelectPoint,
}: TourControlProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sortedPoints = [...tourPoints].sort((a, b) => a.order - b.order);
  const currentPoint = sortedPoints[currentIndex];

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % sortedPoints.length;
    setCurrentIndex(nextIndex);
    onSelectPoint(sortedPoints[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex =
      currentIndex === 0 ? sortedPoints.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    onSelectPoint(sortedPoints[prevIndex]);
  };

  const handleStart = () => {
    if (sortedPoints.length === 0) return;
    setIsActive(true);
    setCurrentIndex(0);
    onSelectPoint(sortedPoints[0]);
  };

  if (sortedPoints.length === 0) {
    return (
      <div className="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2">
        <Button size="lg" className="shadow-lg" disabled>
          <Play className="mr-2 h-4 w-4" />
          Tour Guiado Indisponível
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2">
      {!isActive ? (
        <Button onClick={handleStart} size="lg" className="shadow-lg">
          <Play className="mr-2 h-4 w-4" />
          Iniciar Tour Guiado
        </Button>
      ) : (
        <Card className="w-80 max-w-[80vw] border-border bg-card/95 p-2 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1 pr-2">
              <h3 className="flex  justify-center text-lg font-semibold text-foreground">
                Parada {currentIndex + 1} de {sortedPoints.length}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsActive(false)}
              className="h-8 w-8 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-1">
              {sortedPoints.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-1.5 w-1.5 rounded-full transition-all',
                    index === currentIndex
                      ? 'w-4 bg-primary'
                      : 'bg-muted-foreground/30'
                  )}
                />
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
