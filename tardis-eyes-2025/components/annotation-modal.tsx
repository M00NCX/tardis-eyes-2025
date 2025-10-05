'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AnnotationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    description: string;
    author: string;
  }) => void;
  position?: { lat: number; lng: number } | null;
}

export function AnnotationModal({
  open,
  onOpenChange,
  onSubmit,
  position,
}: AnnotationModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');

  // Limpa os campos quando o modal é fechado
  useEffect(() => {
    if (!open) {
      setTitle('');
      setDescription('');
      setAuthor('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && author) {
      onSubmit({ title, description, author });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[50%] translate-y-[-50%] max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            {/* CORREÇÃO: Textos mais diretos e claros */}
            <DialogTitle className="text-2xl">
              Registre sua Descoberta
            </DialogTitle>
            <DialogDescription>
              Detalhe o que você encontrou neste local. Sua anotação será
              marcada com a bandeira no mapa.
              {position && (
                <div className="mt-2 p-2 bg-muted rounded text-sm font-mono">
                  📍 Posição: {position.lat.toFixed(4)},{' '}
                  {position.lng.toFixed(4)}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Descoberta</Label>
              <Input
                id="title"
                placeholder="Ex: Formação rochosa curiosa"
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
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Seu Nome de Explorador(a)</Label>
              <Input
                id="author"
                placeholder="Como você quer ser creditado(a)?"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Plantar Bandeira</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
