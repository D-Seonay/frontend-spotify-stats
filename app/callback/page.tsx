"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get("code")
    const errorParam = searchParams.get("error")

    if (errorParam) {
      setError("L'authentification a été annulée ou a échoué.")
      setTimeout(() => router.push("/login"), 3000)
      return
    }

    if (code) {
      // Exchange code for access token
      exchangeCodeForToken(code)
    } else {
      setError("Code d'authentification manquant.")
      setTimeout(() => router.push("/login"), 3000)
    }
  }, [searchParams, router])

  const exchangeCodeForToken = async (code: string) => {
    try {
      // Here you would call your backend API to exchange the code for a token
      // For now, we'll simulate this and redirect to dashboard
      console.log("[v0] Exchanging code for token:", code)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store token (in real app, this would come from your backend)
      // localStorage.setItem("spotify_token", "dummy_token")

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      console.error("[v0] Error exchanging code:", err)
      setError("Erreur lors de l'authentification. Veuillez réessayer.")
      setTimeout(() => router.push("/login"), 3000)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="text-center">
        {error ? (
          <>
            <div className="mb-4 text-6xl">❌</div>
            <h1 className="mb-2 text-2xl font-bold">Erreur d'authentification</h1>
            <p className="text-gray-400">{error}</p>
            <p className="mt-4 text-sm text-gray-500">Redirection vers la page de connexion...</p>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-[#1DB954]" />
            <h1 className="mb-2 text-2xl font-bold">Connexion en cours...</h1>
            <p className="text-gray-400">Authentification avec Spotify</p>
          </>
        )}
      </div>
    </div>
  )
}
