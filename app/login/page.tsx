"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, TrendingUp, Users, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const handleSpotifyLogin = () => {
    // Redirect to Spotify OAuth
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || `${window.location.origin}/callback`
    const scopes = [
      "user-read-private",
      "user-read-email",
      "user-top-read",
      "user-read-recently-played",
      "user-library-read",
    ].join(" ")

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`

    window.location.href = authUrl
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB954]">
              <span className="font-mono text-lg font-bold text-black">SLS</span>
            </div>
            <span className="hidden font-bold sm:inline">Spotify Listener Stats</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">
              Connecte-toi à{" "}
              <span className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] bg-clip-text text-transparent">
                Spotify
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
              Découvre tes statistiques d'écoute personnalisées, tes artistes préférés, et bien plus encore.
              Authentification sécurisée via OAuth 2.0.
            </p>

            <Button
              onClick={handleSpotifyLogin}
              size="lg"
              className="group rounded-full bg-[#1DB954] px-8 py-6 text-lg font-semibold text-black transition-all hover:scale-105 hover:bg-[#1ed760] hover:shadow-[0_0_40px_rgba(29,185,84,0.6)]"
            >
              <Music className="mr-2 h-5 w-5" />
              Se connecter avec Spotify
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:scale-105 hover:border-[#1DB954]/50">
              <CardHeader>
                <TrendingUp className="mb-2 h-8 w-8 text-[#1DB954]" />
                <CardTitle>Statistiques en temps réel</CardTitle>
                <CardDescription className="text-gray-400">
                  Accède à tes données d'écoute actualisées en temps réel
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:scale-105 hover:border-[#1DB954]/50">
              <CardHeader>
                <Users className="mb-2 h-8 w-8 text-[#1DB954]" />
                <CardTitle>Top Artistes</CardTitle>
                <CardDescription className="text-gray-400">
                  Découvre tes artistes les plus écoutés sur différentes périodes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:scale-105 hover:border-[#1DB954]/50">
              <CardHeader>
                <Music className="mb-2 h-8 w-8 text-[#1DB954]" />
                <CardTitle>Historique d'écoute</CardTitle>
                <CardDescription className="text-gray-400">
                  Explore ton historique complet de titres écoutés
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:scale-105 hover:border-[#1DB954]/50">
              <CardHeader>
                <BarChart3 className="mb-2 h-8 w-8 text-[#1DB954]" />
                <CardTitle>Analyses détaillées</CardTitle>
                <CardDescription className="text-gray-400">
                  Visualise tes tendances et habitudes d'écoute
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Security Notice */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
            <p className="text-sm text-gray-400">
              🔒 Connexion sécurisée par Spotify OAuth 2.0. Nous ne stockons jamais ton mot de passe.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
