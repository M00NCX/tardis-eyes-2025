'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { MapPin, User, Calendar, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

// --- Tipos de Dados ---
interface Annotation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  author: string;
  created_at: string;
}

// --- Componente do Formulário de Criação (extraído do antigo modal) ---
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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && author) {
      onCreate({ title, description, author });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="border-b border-border p-4 shrink-0">
        <h2 className="text-lg font-semibold text-foreground">Nova Anotação</h2>
        {/* ALTERAÇÃO: Exibe as coordenadas do ponto clicado */}
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
  mode: 'list' | 'create';
  onModeChange: (mode: 'list' | 'create') => void;
  onCreateAnnotation: (data: {
    title: string;
    description: string;
    author: string;
  }) => void;
  position: { lat: number; lng: number } | null; // ALTERAÇÃO: Recebe a posição
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
  return (
    <div
      className={cn(
        'h-full border-l border-border bg-card/95 shadow-2xl backdrop-blur transition-all duration-300 supports-[backdrop-filter]:bg-card/80',
        open ? 'w-80' : 'w-0 p-0 border-none'
      )}
    >
      <div
        className={cn(
          'flex h-full flex-col overflow-hidden',
          !open && 'invisible'
        )}
      >
        {/* Renderização Condicional: ou a lista ou o formulário */}
        {mode === 'list' ? (
          <>
            <div className="border-b border-border p-4 shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Anotações
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {annotations.length}{' '}
                    {annotations.length === 1 ? 'anotação' : 'anotações'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onModeChange('create')}
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
                      className="cursor-pointer border-border bg-card p-3 transition-all hover:border-primary hover:shadow-lg"
                      onClick={() => onSelectAnnotation(annotation)}
                    >
                      <h3 className="mb-2 font-semibold text-foreground">
                        {annotation.title}
                      </h3>
                      <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                        {annotation.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{annotation.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(annotation.created_at).toLocaleDateString(
                              'pt-BR'
                            )}
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
            onCancel={() => onModeChange('list')}
            onCreate={onCreateAnnotation}
            position={position} // ALTERAÇÃO: Passa a posição para o formulário
          />
        )}
      </div>
    </div>
  );
}
