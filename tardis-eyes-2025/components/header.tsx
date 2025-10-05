"use client"

import { Rocket, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { InfoModal } from "./info-modal"

export function Header() {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <>
      <header className="relative z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Rocket className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">NASA Explorer</h1>
              <p className="text-xs text-muted-foreground">Mars Reconnaissance Orbiter</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowInfo(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <InfoModal open={showInfo} onOpenChange={setShowInfo} />
    </>
  )
}
