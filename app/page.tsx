"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TrendingUp, Music, Share2, Lock, Menu, X, Check, Heart, Clock, Download } from "lucide-react"

export default function SpotifyListenerStatsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [listeningMinutes, setListeningMinutes] = useState(0)
  const [topArtists, setTopArtists] = useState(0)

  // Animated counters
  useEffect(() => {
    const minutesInterval = setInterval(() => {
      setListeningMinutes((prev) => (prev < 12847 ? prev + 200 : 12847))
    }, 20)
    const artistsInterval = setInterval(() => {
      setTopArtists((prev) => (prev < 143 ? prev + 3 : 143))
    }, 50)

    return () => {
      clearInterval(minutesInterval)
      clearInterval(artistsInterval)
    }
  }, [])

  const handleSpotifyLogin = () => {
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB954]">
              <span className="font-mono text-lg font-bold text-black">SLS</span>
            </div>
            <span className="hidden font-bold sm:inline">Spotify Listener Stats</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <a href="#auditeurs" className="text-sm text-gray-300 transition-colors hover:text-[#1DB954]">
              Pour les auditeurs
            </a>
            <a href="#fonctionnalites" className="text-sm text-gray-300 transition-colors hover:text-[#1DB954]">
              Fonctionnalités
            </a>
            <a href="#partenaires" className="text-sm text-gray-300 transition-colors hover:text-[#1DB954]">
              Partenaires
            </a>
            <a href="#apropos" className="text-sm text-gray-300 transition-colors hover:text-[#1DB954]">
              À propos
            </a>
            <a href="#contact" className="text-sm text-gray-300 transition-colors hover:text-[#1DB954]">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Button
              className="hidden rounded-full bg-[#1DB954] px-6 text-black font-semibold transition-all hover:bg-[#1ed760] hover:scale-105 md:inline-flex"
              onClick={handleSpotifyLogin}
            >
              Se connecter avec Spotify
            </Button>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-black/95 p-4 md:hidden">
            <div className="flex flex-col gap-4">
              <a href="#auditeurs" className="text-sm text-gray-300 hover:text-[#1DB954]">
                Pour les auditeurs
              </a>
              <a href="#fonctionnalites" className="text-sm text-gray-300 hover:text-[#1DB954]">
                Fonctionnalités
              </a>
              <a href="#partenaires" className="text-sm text-gray-300 hover:text-[#1DB954]">
                Partenaires
              </a>
              <a href="#apropos" className="text-sm text-gray-300 hover:text-[#1DB954]">
                À propos
              </a>
              <a href="#contact" className="text-sm text-gray-300 hover:text-[#1DB954]">
                Contact
              </a>
              <Button
                className="w-full rounded-full bg-[#1DB954] text-black font-semibold hover:bg-[#1ed760]"
                onClick={handleSpotifyLogin}
              >
                Se connecter avec Spotify
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-black via-[#0a0a0a] to-black">
        <div className="absolute inset-0">
          <div
            className="absolute left-[10%] top-[15%] h-32 w-32 rotate-[-12deg] overflow-hidden rounded-2xl opacity-40 shadow-2xl shadow-[#1DB954]/20 md:h-40 md:w-40 animate-float"
            style={{ animationDelay: "0s" }}
          >
            <img src="/indie-rock-artist.jpg" alt="" className="h-full w-full object-cover" />
          </div>
          <div
            className="absolute right-[15%] top-[20%] h-28 w-28 rotate-[8deg] overflow-hidden rounded-2xl opacity-40 shadow-2xl shadow-[#1DB954]/20 md:h-36 md:w-36 animate-float"
            style={{ animationDelay: "1s" }}
          >
            <img src="/pop-artist-portrait.jpg" alt="" className="h-full w-full object-cover" />
          </div>
          <div
            className="absolute bottom-[25%] left-[8%] h-36 w-36 rotate-[15deg] overflow-hidden rounded-2xl opacity-40 shadow-2xl shadow-[#1DB954]/20 md:h-44 md:w-44 animate-float"
            style={{ animationDelay: "2s" }}
          >
            <img src="/electronic-music-cover.png" alt="" className="h-full w-full object-cover" />
          </div>
          <div
            className="absolute bottom-[30%] right-[12%] h-40 w-40 rotate-[-8deg] overflow-hidden rounded-2xl opacity-40 shadow-2xl shadow-[#1DB954]/20 md:h-48 md:w-48 animate-float"
            style={{ animationDelay: "1.5s" }}
          >
            <img src="/hip-hop-album-art.jpg" alt="" className="h-full w-full object-cover" />
          </div>
          <div
            className="absolute left-[15%] top-[45%] h-24 w-24 rotate-[20deg] overflow-hidden rounded-2xl opacity-30 shadow-2xl shadow-[#1DB954]/20 md:h-32 md:w-32 animate-float"
            style={{ animationDelay: "0.5s" }}
          >
            <img src="/jazz-musician.png" alt="" className="h-full w-full object-cover" />
          </div>
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

          <div
            className="relative mx-auto mb-8 max-w-sm md:max-w-md lg:max-w-lg animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 to-black/90 p-6 shadow-2xl backdrop-blur-sm">
              <div className="mb-4 grid grid-cols-2 gap-3">
                <Card className="border-[#1DB954]/30 bg-zinc-800/50 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#1DB954]/60 hover:shadow-lg hover:shadow-[#1DB954]/20">
                  <Music className="mb-2 h-6 w-6 text-[#1DB954]" />
                  <p className="text-xs text-gray-400">Top Artiste</p>
                  <p className="text-sm font-bold">The Weeknd</p>
                </Card>
                <Card className="border-red-500/30 bg-zinc-800/50 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-red-500/60 hover:shadow-lg hover:shadow-red-500/20">
                  <Heart className="mb-2 h-6 w-6 text-red-400" />
                  <p className="text-xs text-gray-400">Morceaux joués</p>
                  <p className="text-sm font-bold">1,247</p>
                </Card>
              </div>
              <Card className="border-[#1DB954]/30 bg-zinc-800/50 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#1DB954]/60 hover:shadow-lg hover:shadow-[#1DB954]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <Clock className="mb-2 h-6 w-6 text-[#1DB954]" />
                    <p className="text-xs text-gray-400">Minutes d'écoute</p>
                    <p className="text-xl font-bold">8,432</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Mood de la semaine</p>
                    <p className="text-sm font-semibold text-[#1DB954]">Chill Vibes</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button
              size="lg"
              className="rounded-full bg-[#1DB954] px-8 py-6 text-lg font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-[#1ed760] hover:shadow-2xl hover:shadow-[#1DB954]/40"
              onClick={handleSpotifyLogin}
            >
              Se connecter avec Spotify
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-2 border-white/30 bg-transparent px-8 py-6 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:border-[#1DB954] hover:bg-[#1DB954]/10 hover:shadow-2xl hover:shadow-[#1DB954]/20"
              onClick={() => document.getElementById("apercu")?.scrollIntoView({ behavior: "smooth" })}
            >
              Voir un aperçu
            </Button>
          </div>

          {/* Trust Badges */}
          <div
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-[#1DB954]" />
              <span>Respect de ta vie privée</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-[#1DB954]" />
              <span>Connexion sécurisée via Spotify</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Cards Section */}
      <section id="fonctionnalites" className="py-16 md:py-24 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 p-8 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-[#1DB954]/50 hover:shadow-2xl hover:shadow-[#1DB954]/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1DB954] shadow-lg transition-transform duration-500 group-hover:scale-110">
                  <Music className="h-7 w-7 text-black" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Connecter & Explorer</h3>
                <p className="mb-6 text-gray-300">
                  Connecte ton compte Spotify en un clic et explore tes stats en temps réel.
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 p-8 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-[#1DB954]/50 hover:shadow-2xl hover:shadow-[#1DB954]/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1DB954] shadow-lg transition-transform duration-500 group-hover:scale-110">
                  <TrendingUp className="h-7 w-7 text-black" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Curater ton expérience</h3>
                <p className="mb-6 text-gray-300">
                  Crée des résumés personnalisés par mood, genre, période, et partage des visualisations.
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 p-8 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-[#1DB954]/50 hover:shadow-2xl hover:shadow-[#1DB954]/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1DB954] shadow-lg transition-transform duration-500 group-hover:scale-110">
                  <Lock className="h-7 w-7 text-black" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Débloquer des insights exclusifs</h3>
                <p className="mb-6 text-gray-300">
                  Accède à des comparaisons avancées, des tendances hebdo, et des drops bêta.
                </p>
                <Button
                  className="mt-4 rounded-full bg-[#1DB954] text-black font-semibold transition-all duration-300 hover:bg-[#1ed760] hover:scale-105 hover:shadow-lg hover:shadow-[#1DB954]/30"
                  onClick={handleSpotifyLogin}
                >
                  Créer un compte
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Ownership Section */}
      <section className="py-16 md:py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-balance text-3xl font-bold md:text-5xl">Possède tes données d'écoute</h2>
            <p className="mb-12 text-balance text-lg text-gray-300">
              Tu contrôles tes infos. Import simple, export facile, suppression à tout moment.
            </p>

            <Card className="border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 p-8 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-800/50 p-4 transition-all duration-300 hover:border-[#1DB954]/50 hover:bg-zinc-800/70">
                  <div className="text-left">
                    <p className="font-semibold">Top 50 Morceaux de 2024</p>
                    <p className="text-sm text-gray-400">Généré le 15 déc 2024</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="transition-all duration-300 hover:bg-[#1DB954]/20 hover:text-[#1DB954]"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="transition-all duration-300 hover:bg-[#1DB954]/20 hover:text-[#1DB954]"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-800/50 p-4 transition-all duration-300 hover:border-[#1DB954]/50 hover:bg-zinc-800/70">
                  <div className="text-left">
                    <p className="font-semibold">Historique d'écoute complet</p>
                    <p className="text-sm text-gray-400">Toutes tes données</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="transition-all duration-300 hover:bg-[#1DB954]/20 hover:text-[#1DB954]"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="transition-all duration-300 hover:bg-[#1DB954]/20 hover:text-[#1DB954]"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#0a0a0a] to-black">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-5xl">Ce que disent nos utilisateurs</h2>

          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="group relative border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-[#1DB954]/50 hover:shadow-2xl hover:shadow-[#1DB954]/20">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-[#1DB954]">
                    <img src="/user-profile-illustration.png" alt="Marie L." className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold">Marie L.</p>
                    <p className="text-sm text-gray-400">15 nov</p>
                  </div>
                </div>
                <p className="mb-4 text-gray-300">
                  Je viens de tester SLS, c'est dingue de voir mes moods d'écoute et mes tops évoluer chaque semaine.
                  #MusicLovers
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">💬 12.5k</span>
                  <span className="flex items-center gap-1">🔄 8.2k</span>
                  <span className="flex items-center gap-1">❤️ 34.1k</span>
                </div>
              </Card>

              <Card className="group relative border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-[#1DB954]/50 hover:shadow-2xl hover:shadow-[#1DB954]/20">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-[#1DB954]">
                    <img src="/diverse-person-smiling.png" alt="Thomas B." className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold">Thomas B.</p>
                    <p className="text-sm text-gray-400">22 nov</p>
                  </div>
                </div>
                <p className="mb-4 text-gray-300">
                  Enfin une app qui comprend vraiment mes habitudes musicales ! Les insights sont ultra précis. 🎵
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">💬 8.7k</span>
                  <span className="flex items-center gap-1">🔄 5.3k</span>
                  <span className="flex items-center gap-1">❤️ 28.9k</span>
                </div>
              </Card>

              <Card className="group relative border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-[#1DB954]">
                    <img src="/happy-user.jpg" alt="Sofia R." className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold">Sofia R.</p>
                    <p className="text-sm text-gray-400">1 déc</p>
                  </div>
                </div>
                <p className="mb-4 text-gray-300">
                  Les visualisations sont magnifiques et les comparaisons avec mes amis sont trop fun ! 🔥
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">💬 15.2k</span>
                  <span className="flex items-center gap-1">🔄 11.8k</span>
                  <span className="flex items-center gap-1">❤️ 42.3k</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Preview Section */}
      <section id="apercu" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-5xl">Aperçu interactif</h2>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
            <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-8 backdrop-blur-sm">
              <Clock className="mb-4 h-12 w-12 text-cyan-400" />
              <p className="mb-2 text-sm text-gray-400">Minutes d'écoute totales</p>
              <p className="text-5xl font-bold text-cyan-400">{listeningMinutes.toLocaleString()}</p>
              <p className="mt-2 text-sm text-gray-300">Ce mois-ci</p>
            </Card>

            <Card className="border-orange-500/30 bg-gradient-to-br from-orange-900/20 to-red-900/20 p-8 backdrop-blur-sm">
              <Music className="mb-4 h-12 w-12 text-orange-400" />
              <p className="mb-2 text-sm text-gray-400">Artistes découverts</p>
              <p className="text-5xl font-bold text-orange-400">{topArtists}</p>
              <p className="mt-2 text-sm text-gray-300">Cette année</p>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-300">Et ce n'est qu'un aperçu de ce que tu pourras découvrir avec SLS.</p>
          </div>
        </div>
      </section>

      <section id="spotify-login" className="py-16 md:py-24 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#1DB954] shadow-2xl shadow-[#1DB954]/40 animate-pulse-glow">
              <Music className="h-10 w-10 text-black" />
            </div>

            <h2 className="mb-6 text-balance text-3xl font-bold md:text-5xl">Découvre tes stats maintenant</h2>
            <p className="mb-8 text-balance text-lg text-gray-300">
              Connecte-toi avec ton compte Spotify en un clic et explore tes habitudes d'écoute comme jamais auparavant.
            </p>

            <Card className="border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 p-8 backdrop-blur-sm">
              <div className="space-y-6">
                <Button
                  size="lg"
                  className="w-full rounded-full bg-[#1DB954] px-8 py-6 text-lg font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-[#1ed760] hover:shadow-2xl hover:shadow-[#1DB954]/50 flex items-center justify-center gap-3"
                  onClick={handleSpotifyLogin}
                >
                  <Music className="h-6 w-6" />
                  Se connecter avec Spotify
                </Button>

                <div className="space-y-3 text-left text-sm text-gray-400">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-[#1DB954] flex-shrink-0" />
                    <span>Connexion 100% sécurisée via l'API officielle Spotify</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-[#1DB954] flex-shrink-0" />
                    <span>Accès en lecture seule à tes statistiques d'écoute</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-[#1DB954] flex-shrink-0" />
                    <span>Aucun accès à ton mot de passe ou informations de paiement</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-[#1DB954] flex-shrink-0" />
                    <span>Révoque l'accès à tout moment depuis ton compte Spotify</span>
                  </div>
                </div>
              </div>
            </Card>

            <p className="mt-6 text-sm text-gray-500">
              En te connectant, tu acceptes nos{" "}
              <a href="#" className="text-[#1DB954] hover:underline">
                Conditions d'utilisation
              </a>{" "}
              et notre{" "}
              <a href="#" className="text-[#1DB954] hover:underline">
                Politique de confidentialité
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-16 md:py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#1DB954]/50 hover:shadow-2xl hover:shadow-[#1DB954]/20">
                <p className="mb-2 text-5xl font-extrabold text-[#1DB954] md:text-6xl">
                  {listeningMinutes.toLocaleString()}
                </p>
                <p className="text-lg text-gray-300">Minutes écoutées par nos utilisateurs</p>
              </Card>
              <Card className="border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#1DB954]/50 hover:shadow-2xl hover:shadow-[#1DB954]/20">
                <p className="mb-2 text-5xl font-extrabold text-[#1DB954] md:text-6xl">{topArtists}+</p>
                <p className="text-lg text-gray-300">Artistes découverts cette semaine</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB954]">
                  <span className="font-mono text-lg font-bold text-black">SLS</span>
                </div>
                <span className="font-bold">Spotify Listener Stats</span>
              </div>
              <p className="text-sm text-gray-400">Découvre, partage et possède tes stats d'écoute Spotify.</p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Produit</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-[#1DB954]">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-[#1DB954]">
                    Tarifs
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-[#1DB954]">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Entreprise</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-[#1DB954]">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-[#1DB954]">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-[#1DB954]">
                    Carrières
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Légal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-[#1DB954]">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-[#1DB954]">
                    Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-[#1DB954]">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Spotify Listener Stats. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
