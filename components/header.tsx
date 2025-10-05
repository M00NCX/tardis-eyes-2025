'use client';

// 1. Importe o ícone 'Github' aqui
import { Rocket, Info, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { InfoModal } from './info-modal';
import Image from 'next/image';

interface HeaderProps {
  currentPlanet: 'moon' | 'mars' | 'earth';
}

export function Header({ currentPlanet }: HeaderProps) {
  const [showInfo, setShowInfo] = useState(false);

  const planetNames = {
    moon: 'Lua',
    mars: 'Marte',
    earth: 'Terra',
  };

  return (
    <>
      <header className="relative z-[40] border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary p-1">
              <Image src="/logo.png" width={40} height={40} alt="logo" />
            </div>
            <h1 className="text-lg font-semibold">
              TARDIS Voyager - {planetNames[currentPlanet]}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInfo(true)}
              className="rounded-full"
              aria-label="Informações do projeto"
            >
              <Info className="h-5 w-5" />
              <span className="sr-only">Informações</span>
            </Button>

            <a
              href="https://github.com/M00NCX/tardis-voyager"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver código fonte no GitHub"
            >
              <Button variant="ghost" size="icon" className="rounded-full">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </a>
          </div>
        </div>
      </header>
      <InfoModal open={showInfo} onOpenChange={setShowInfo} />
    </>
  );
}
