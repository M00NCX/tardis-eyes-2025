'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Rocket, Users, MapPin, Star } from 'lucide-react';

interface InfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InfoModal({ open, onOpenChange }: InfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Rocket className="h-6 w-6 text-primary" />
            Bem-vindo ao TARDIS Voyager
          </DialogTitle>
          <DialogDescription className="text-base">
            Explore imagens de alta resolução de Marte, da Lua e da Terra
            capturadas pela NASA
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 ">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Navegue pelo Mapa
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use o mouse para arrastar e a roda para dar zoom. Explore
                  diferentes regiões em alta resolução.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Crie Anotações
                </h3>
                <p className="text-sm text-muted-foreground">
                  Clique no mapa para adicionar anotações colaborativas.
                  Compartilhe descobertas e observações com outros exploradores.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                <Star className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Descubra Easter Eggs
                </h3>
                <p className="text-sm text-muted-foreground">
                  Explore o mapa para encontrar easter eggs escondidos com
                  curiosidades e as missões da NASA.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Sobre as imagens:</strong> As
              imagens são provenientes da Mars Reconnaissance Orbiter (MRO) da
              NASA, que orbita Marte desde 2006 capturando imagens de alta
              resolução da superfície marciana. Assim como Lunar Reconnaissance
              Orbiter e Earth Observatory
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
