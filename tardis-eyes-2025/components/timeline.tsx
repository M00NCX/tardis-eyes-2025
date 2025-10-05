"use client";

import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  lat: number;
  lng: number;
}

interface TimelineProps {
  events: TimelineEvent[];
  currentEventId?: string;
  onEventClick: (event: TimelineEvent) => void;
}

export function Timeline({
  events,
  currentEventId,
  onEventClick,
}: TimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-[900] max-h-[60vh] w-64">
      <Card className="h-full bg-background/80 backdrop-blur">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Linha do Tempo</h3>
          <p className="text-sm text-muted-foreground">
            {events.length} eventos
          </p>
        </div>
        <ScrollArea className="h-[calc(60vh-4rem)]">
          <div className="p-4 space-y-3">
            {sortedEvents.map((event) => (
              <Button
                key={event.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left p-3 h-auto space-y-1",
                  currentEventId === event.id && "bg-secondary"
                )}
                onClick={() => onEventClick(event)}
              >
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto flex-shrink-0" />
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
