"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { MapPin, User, Calendar, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

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

// --- Componente do Formulário de Criação ---
const CreateAnnotationForm = ({
  onCancel,
  onCreate,
  position,
}: {
  onCancel: () => void;
  onCreate: (data: {
    title: string;
    description: string;
    author: string;
  }) => void;
  position: { lat: number; lng: number } | null;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && author) {
      onCreate({ title, description, author });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="border-b border-border p-4 shrink-0">
        <h2 className="text-lg font-semibold text-foreground">Nova Anotação</h2>
        {position && (
          <p className="text-sm text-muted-foreground font-mono">
            Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
          </p>
        )}
      </div>
      <div className="space-y-4 p-4 flex-1 overflow-y-auto">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            placeholder="Ex: Cratera interessante"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            placeholder="Descreva o que você encontrou..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Seu nome</Label>
          <Input
            id="author"
            placeholder="Como você quer ser chamado?"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="border-t border-border p-4 flex justify-end gap-2 shrink-0">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Criar Anotação</Button>
      </div>
    </form>
  );
};

// --- Painel Principal ---
interface AnnotationPanelProps {
  annotations: Annotation[];
  onSelectAnnotation: (annotation: Annotation) => void;
  open: boolean;
  mode: "list" | "create";
  onModeChange: (mode: "list" | "create") => void;
  onCreateAnnotation: (data: {
    title: string;
    description: string;
    author: string;
  }) => void;
  position: { lat: number; lng: number } | null;
}

export function AnnotationPanel({
  annotations,
  onSelectAnnotation,
  open,
  mode,
  onModeChange,
  onCreateAnnotation,
  position,
}: AnnotationPanelProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "fixed z-[1000] bg-card/95 shadow-2xl backdrop-blur transition-all duration-300 supports-[backdrop-filter]:bg-card/80",
        isMobile
          ? "bottom-0 left-0 right-0 border-t border-border"
          : "top-0 right-0 border-l border-border h-full",
        isMobile ? (open ? "h-[40vh]" : "h-0") : open ? "w-80" : "w-0",
        !open && "border-none"
      )}
    >
      <div
        className={cn(
          "flex h-full flex-col overflow-hidden",
          !open && "invisible"
        )}
      >
        {mode === "list" ? (
          <>
            <div className="border-b border-border p-4 shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Anotações
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {annotations.length}{" "}
                    {annotations.length === 1 ? "anotação" : "anotações"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onModeChange("create")}
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-3 p-4">
                {annotations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MapPin className="mb-3 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Nenhuma anotação ainda.
                      <br />
                      Clique no mapa para adicionar!
                    </p>
                  </div>
                ) : (
                  annotations.map((annotation) => (
                    <Card
                      key={annotation.id}
                      className={cn(
                        "group cursor-pointer border-border bg-card/50 p-4 transition-all",
                        "hover:bg-card hover:shadow-lg hover:scale-[1.02]",
                        "active:scale-[0.98]",
                        "backdrop-blur supports-[backdrop-filter]:bg-card/30"
                      )}
                      onClick={() => onSelectAnnotation(annotation)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary">
                          {annotation.title}
                        </h3>
                        <div className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          {annotation.is_historical
                            ? "Histórico"
                            : "Comunidade"}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {annotation.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{annotation.author}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(
                                annotation.created_at
                              ).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {annotation.lat.toFixed(2)},{" "}
                            {annotation.lng.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <CreateAnnotationForm
            onCancel={() => onModeChange("list")}
            onCreate={onCreateAnnotation}
            position={position}
          />
        )}
      </div>
    </div>
  );
}
