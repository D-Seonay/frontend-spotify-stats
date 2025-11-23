"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock, Heart, Music, Check } from "lucide-react"

type Props = {
  onLogin: () => void
}

export default function HeroSection({ onLogin }: Props) {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      {/* Décor flottant */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingImage className="left-[10%] top-[15%] h-32 w-32 rotate-[-12deg] md:h-40 md:w-40" src="/floatingImage/tate-mcrae.png" />
        <FloatingImage className="right-[15%] top-[20%] h-28 w-28 rotate-[8deg] md:h-36 md:w-36" src="/floatingImage/nessa-barrett.png" delay="1s" />
        <FloatingImage className="bottom-[25%] left-[8%] h-36 w-36 rotate-[15deg] md:h-44 md:w-44" src="/floatingImage/gazo.png" delay="2s" />
        <FloatingImage className="bottom-[30%] right-[12%] h-40 w-40 rotate-[-8deg] md:h-48 md:w-48" src="/floatingImage/the-weeknd.png" delay="1.5s" />
        <FloatingImage className="left-[15%] top-[45%] h-24 w-24 rotate-[20deg] md:h-32 md:w-32 opacity-30" src="/floatingImage/werenoi.png" delay="0.5s" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="mb-6 text-balance text-4xl font-extrabold leading-tight md:text-6xl lg:text-7xl animate-slide-up">
          Les stats Spotify qui donnent vie à ta musique.
        </h1>
        <p
          className="mb-8 text-balance text-lg text-gray-300 md:text-xl lg:text-2xl animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          Découvre tes habitudes d'écoute, partage tes tendances, et accède en avant‑première aux insights exclusifs.
        </p>

        {/* Mini dashboard */}
        <div
          className="relative mx-auto mb-8 max-w-sm md:max-w-md lg:max-w-lg animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-black/90 p-6 shadow-2xl backdrop-blur-sm">
            <div className="mb-4 grid grid-cols-2 gap-3">
              {/* Card Top Artiste */}
              <Card className="border-white/15 bg-zinc-800/50 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-[#1DB954]/50 hover:shadow-lg hover:shadow-[#1DB954]/20">
                <div className="flex items-start gap-3">
                  <IconBadge>
                    <Music className="h-5 w-5" />
                  </IconBadge>
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-400">Top Artiste</p>
                    <p className="text-sm font-bold text-white">Tate McRae</p>
                  </div>
                </div>
              </Card>

              {/* Card Morceaux joués */}
              <Card className="border-white/15 bg-zinc-800/50 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-[#1DB954]/50 hover:shadow-lg hover:shadow-[#1DB954]/20">
                <div className="flex items-start gap-3">
                  <IconBadge>
                    <Heart className="h-5 w-5" />
                  </IconBadge>
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-400">Morceaux joués</p>
                    <p className="text-sm font-bold text-white">1,247</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Card Minutes + Mood */}
            <Card className="border-white/15 bg-zinc-800/50 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-[#1DB954]/50 hover:shadow-lg hover:shadow-[#1DB954]/20">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <IconBadge>
                    <Clock className="h-5 w-5" />
                  </IconBadge>
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-400">Minutes d'écoute</p>
                    <p className="text-xl font-bold text-white">8,432</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400">Mood de la semaine</p>
                  <p className="text-sm font-semibold text-[#1DB954]">Chill Vibes</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Button
            size="lg"
            className="rounded-full bg-[#1DB954] px-8 py-6 text-lg font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-[#1ed760] hover:shadow-2xl hover:shadow-[#1DB954]/40"
            onClick={onLogin}
          >
            Se connecter avec Spotify
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-2 border-white/20 bg-transparent px-8 py-6 text-lg font-semibold text-white hover:text-white transition-all duration-300 hover:scale-105 hover:border-[#1DB954] hover:bg-[#1DB954]/10 hover:shadow-2xl hover:shadow-[#1DB954]/20"
            onClick={() => document.getElementById("apercu")?.scrollIntoView({ behavior: "smooth" })}
          >
            Voir un aperçu
          </Button>
        </div>

        {/* Badges de confiance */}
        <div
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <IconRow text="Respect de ta vie privée" />
          <IconRow text="Connexion sécurisée via Spotify" />
        </div>
      </div>
    </section>
  )
}

/**
 * Badge d’icône: cercle vert, icône centrée, taille uniforme.
 * Garantit un alignement vertical/net des icônes avec le texte adjacent.
 */
function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#1DB954] text-black shadow-md">
      <span className="inline-flex items-center justify-center text-black">{children}</span>
    </span>
  )
}

/**
 * Ligne de badge + texte pour les trusts badges, alignée proprement.
 */
function IconRow({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#1DB954] text-black">
        <Check className="h-4 w-4" />
      </span>
      <span className="align-middle">{text}</span>
    </div>
  )
}

function FloatingImage({
  src,
  className,
  delay = "0s",
}: {
  src: string
  className?: string
  delay?: string
}) {
  return (
    <div
      className={`absolute overflow-hidden rounded-2xl opacity-40 shadow-2xl shadow-[#1DB954]/20 animate-float ${className ?? ""}`}
      style={{ animationDelay: delay }}
    >
      <img src={src} alt="" className="h-full w-full object-cover" />
    </div>
  )
}
