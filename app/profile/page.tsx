"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Calendar, Music, Settings, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Utilisateur Spotify",
    email: "user@example.com",
    memberSince: "Janvier 2024",
    spotifyPlan: "Premium",
    privacy: "public",
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would save to backend
    console.log("[v0] Saving profile:", profile)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm text-gray-400">Retour au Dashboard</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB954]">
              <span className="font-mono text-lg font-bold text-black">SLS</span>
            </div>
            <span className="hidden font-bold sm:inline">Spotify Listener Stats</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold">
              Mon{" "}
              <span className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] bg-clip-text text-transparent">Profil</span>
            </h1>
            <p className="text-gray-400">Gère tes informations et préférences</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Card */}
            <Card className="border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent backdrop-blur-sm lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-[#1DB954]" />
                    Informations du profil
                  </CardTitle>
                  <CardDescription className="text-gray-400">Tes informations personnelles</CardDescription>
                </div>
                <Button
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="rounded-full bg-[#1DB954] text-black font-semibold hover:bg-[#1ed760]"
                >
                  {isEditing ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer
                    </>
                  ) : (
                    <>
                      <Settings className="mr-2 h-4 w-4" />
                      Modifier
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Nom d'utilisateur</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-[#1DB954] focus:outline-none"
                    />
                  ) : (
                    <p className="text-lg font-medium">{profile.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-[#1DB954] focus:outline-none"
                    />
                  ) : (
                    <p className="text-lg font-medium">{profile.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    Membre depuis
                  </label>
                  <p className="text-lg font-medium">{profile.memberSince}</p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <Music className="h-4 w-4" />
                    Plan Spotify
                  </label>
                  <p className="text-lg font-medium">{profile.spotifyPlan}</p>
                </div>
              </CardContent>
            </Card>

            {/* Settings Card */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#1DB954]" />
                  Paramètres
                </CardTitle>
                <CardDescription className="text-gray-400">Tes préférences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-gray-400">Confidentialité du profil</label>
                  <select
                    value={profile.privacy}
                    onChange={(e) => setProfile({ ...profile, privacy: e.target.value })}
                    disabled={!isEditing}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white disabled:opacity-50 focus:border-[#1DB954] focus:outline-none"
                  >
                    <option value="public">Public</option>
                    <option value="private">Privé</option>
                    <option value="friends">Amis uniquement</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      disabled={!isEditing}
                      className="h-4 w-4 rounded border-white/10 bg-white/5 text-[#1DB954] disabled:opacity-50 focus:ring-[#1DB954]"
                    />
                    <span className="text-sm text-gray-400">Notifications par email</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      disabled={!isEditing}
                      defaultChecked
                      className="h-4 w-4 rounded border-white/10 bg-white/5 text-[#1DB954] disabled:opacity-50 focus:ring-[#1DB954]"
                    />
                    <span className="text-sm text-gray-400">Partage automatique</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      disabled={!isEditing}
                      defaultChecked
                      className="h-4 w-4 rounded border-white/10 bg-white/5 text-[#1DB954] disabled:opacity-50 focus:ring-[#1DB954]"
                    />
                    <span className="text-sm text-gray-400">Synchronisation auto</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Danger Zone */}
          <Card className="mt-6 border-red-500/20 bg-red-500/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-500">Zone dangereuse</CardTitle>
              <CardDescription className="text-gray-400">Actions irréversibles sur ton compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Déconnecter Spotify</p>
                  <p className="text-sm text-gray-400">Révoque l'accès à ton compte Spotify</p>
                </div>
                <Button variant="destructive" className="rounded-full">
                  Déconnecter
                </Button>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="font-medium">Supprimer le compte</p>
                  <p className="text-sm text-gray-400">Supprime définitivement toutes tes données</p>
                </div>
                <Button variant="destructive" className="rounded-full">
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
