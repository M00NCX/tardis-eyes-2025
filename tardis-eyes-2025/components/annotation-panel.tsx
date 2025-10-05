"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { MapPin, User, Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

// --- Tipos de Dados ---
interface Annotation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  author: string;
  created_at: string;
  is_historical?: boolean;
}

// --- Interface de Props Atualizada ---
interface AnnotationPanelProps {
  annotations: Annotation[];
  onSelectAnnotation: (annotation: Annotation) => void;
  open: boolean;
  onToggleVisibility: () => void; // Nova prop para fechar o painel
}

export function AnnotationPanel({
  annotations,
  onSelectAnnotation,
  open,
  onToggleVisibility, // Recebe a função do componente pai
}: AnnotationPanelProps) {
  const sortedAnnotations = [...(annotations || [])].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div
      className={cn(
        "fixed top-[calc(4rem+1rem)] left-4 z-[1000] bg-card/90 shadow-2xl backdrop-blur transition-transform duration-300 ease-in-out supports-[backdrop-filter]:bg-card/70 rounded-lg border border-border",
        "h-[calc(100vh-6rem)] w-80 max-w-[90vw]", // Tamanho e posição
        open ? "translate-x-0" : "-translate-x-[calc(100%+2rem)]" // Animação de entrada/saída
      )}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <div className="border-b border-border p-4 shrink-0 relative">
          <h2 className="text-lg font-semibold text-foreground">
            Anotações e Marcos
          </h2>
          <p className="text-sm text-muted-foreground">
            {sortedAnnotations.length} pontos de interesse
          </p>
          {/* --- NOVO BOTÃO DE FECHAR --- */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleVisibility}
            className="absolute top-3 right-3"
            aria-label="Fechar painel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-3 p-4">
            {sortedAnnotations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MapPin className="mb-3 h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Nenhum ponto encontrado.
                  <br />
                  Clique duas vezes no mapa para adicionar!
                </p>
              </div>
            ) : (
              sortedAnnotations.map((annotation) => (
                <Card
                  key={annotation.id}
                  className="group cursor-pointer border-border bg-card/50 p-3 transition-all hover:bg-card hover:shadow-md hover:border-primary/50"
                  onClick={() => onSelectAnnotation(annotation)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary">
                      {annotation.title}
                    </h3>
                    <div
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        annotation.is_historical
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {annotation.is_historical ? "Marco" : "Comunidade"}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {annotation.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{annotation.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(annotation.created_at).toLocaleDateString(
                          "pt-BR"
                        )}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
