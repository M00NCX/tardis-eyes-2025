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
  position?: { lat: number; lng: number } | null;
  planet: string;
  onCreated?: () => void;
}

export function AnnotationModal({
  open,
  onOpenChange,
  position,
  planet,
  onCreated,
}: AnnotationModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setTitle('');
      setDescription('');
      setAuthor('');
    }
    setError(null);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/annotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: position.lat,
          lng: position.lng,
          title,
          description,
          author,
          planet,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        // O frontend já está preparado para lidar com o objeto de erro do Zod!
        // O `details` que você tinha vai ser populado automaticamente.
        if (errorData.details) {
          const allErrors = Object.values(errorData.details).flat().join('\n');
          throw new Error(allErrors);
        }

        const errorMessage = errorData.error || 'Erro ao salvar anotação';
        throw new Error(errorMessage);
      }

      onOpenChange(false);
      if (onCreated) onCreated();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Não foi possível registrar sua descoberta.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // DICA: Desabilitar o botão de submit se os campos estiverem vazios
  // melhora a experiência do usuário.
  const isFormInvalid = !title || !description || !author || loading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[50%] translate-y-[-50%] max-w-md mx-auto">
        {/* Usar `noValidate` é uma boa prática quando você controla a validação via JS */}
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Registre sua Descoberta
            </DialogTitle>
            <DialogDescription>
              Detalhe o que você encontrou. Sua anotação será marcada no mapa.
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

          {error && (
            <div className="mb-4 p-3 bg-destructive/20 text-destructive text-sm rounded-md text-center whitespace-pre-line">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            {/* O botão agora usa a variável `isFormInvalid` */}
            <Button type="submit" disabled={isFormInvalid}>
              {loading ? 'Salvando...' : 'Plantar Bandeira'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
