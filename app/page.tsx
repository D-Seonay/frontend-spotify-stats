// app/spotify-listener-stats/page.tsx
"use client"

import { useEffect, useState } from "react"
import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import FeatureCards from "@/components/FeatureCards"
import DataOwnershipSection from "@/components/DataOwnershipSection"
import TestimonialsSection from "@/components/TestimonialsCarousel"
import PreviewSection from "@/components/PreviewSection"
import LoginCTASection from "@/components/LoginCTASection"
import StatsCounterSection from "@/components/StatsCounterSection"
import Footer from "@/components/Footer"

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
    // IMPORTANT: Rediriger vers une route serveur qui initie l'OAuth Spotify
    // Évite de mettre directement une URL externe ici si tu dois ajouter state/PKCE.
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header
        onLogin={handleSpotifyLogin}
      />

      <HeroSection onLogin={handleSpotifyLogin} />

      <FeatureCards onLogin={handleSpotifyLogin} />

      {/* <DataOwnershipSection /> */}

      <TestimonialsSection />

      <PreviewSection listeningMinutes={listeningMinutes} topArtists={topArtists} />

      <LoginCTASection onLogin={handleSpotifyLogin} />

      {/* <StatsCounterSection listeningMinutes={listeningMinutes} topArtists={topArtists} /> */}

      <Footer />
    </div>
  )
}
