// components/sls/Header.tsx
"use client"

import { Button } from "@/components/ui/button"

type Props = {
  onLogin: () => void
}

export default function Header({ onLogin }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB954]">
            <span className="font-mono text-lg font-bold text-black">SLS</span>
          </div>
          <span className="hidden font-bold sm:inline">Spotify Listener Stats</span>
        </div>

        {/* Login only */}
        <Button
          className="rounded-full bg-[#1DB954] px-6 text-black font-semibold transition-all hover:bg-[#1ed760] hover:scale-105"
          onClick={onLogin}
        >
          Se connecter avec Spotify
        </Button>
      </nav>
    </header>
  )
}
