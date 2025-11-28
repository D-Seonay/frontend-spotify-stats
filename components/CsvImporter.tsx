"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X, CheckCircle, AlertCircle, Music, Clock, Calendar } from "lucide-react"

interface SpotifyStreamingData {
  endTime: string
  artistName: string
  trackName: string
  msPlayed: number
}

interface ParsedStats {
  totalStreams: number
  totalMinutes: number
  uniqueTracks: number
  uniqueArtists: number
  topTracks: { name: string; artist: string; plays: number; minutes: number }[]
  topArtists: { name: string; plays: number; minutes: number }[]
  listeningByMonth: { month: string; minutes: number }[]
}

export function CsvImporter({ onDataImported }: { onDataImported?: (data: ParsedStats) => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<ParsedStats | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCSV = (text: string): SpotifyStreamingData[] => {
    const lines = text.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    return lines
      .slice(1)
      .map((line) => {
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || []
        const cleanValues = values.map((v) => v.replace(/"/g, "").trim())

        const endTimeIdx = headers.findIndex(
          (h) =>
            h.toLowerCase().includes("endtime") ||
            h.toLowerCase().includes("end_time") ||
            h.toLowerCase().includes("ts"),
        )
        const artistIdx = headers.findIndex((h) => h.toLowerCase().includes("artist"))
        const trackIdx = headers.findIndex(
          (h) => h.toLowerCase().includes("track") || h.toLowerCase().includes("master_metadata_track_name"),
        )
        const msIdx = headers.findIndex(
          (h) => h.toLowerCase().includes("msplayed") || h.toLowerCase().includes("ms_played"),
        )

        return {
          endTime: cleanValues[endTimeIdx] || "",
          artistName: cleanValues[artistIdx] || "",
          trackName: cleanValues[trackIdx] || "",
          msPlayed: Number.parseInt(cleanValues[msIdx]) || 0,
        }
      })
      .filter((item) => item.artistName && item.trackName)
  }

  const parseJSON = (text: string): SpotifyStreamingData[] => {
    const data = JSON.parse(text)
    return data
      .map((item: Record<string, unknown>) => ({
        endTime: (item.endTime || item.ts || "") as string,
        artistName: (item.artistName || item.master_metadata_album_artist_name || "") as string,
        trackName: (item.trackName || item.master_metadata_track_name || "") as string,
        msPlayed: (item.msPlayed || item.ms_played || 0) as number,
      }))
      .filter((item: SpotifyStreamingData) => item.artistName && item.trackName)
  }

  const analyzeData = (data: SpotifyStreamingData[]): ParsedStats => {
    const trackMap = new Map<string, { plays: number; minutes: number; artist: string }>()
    const artistMap = new Map<string, { plays: number; minutes: number }>()
    const monthMap = new Map<string, number>()

    let totalMinutes = 0

    data.forEach((item) => {
      const minutes = item.msPlayed / 60000
      totalMinutes += minutes

      // Track stats
      const trackKey = `${item.trackName}|||${item.artistName}`
      const trackStats = trackMap.get(trackKey) || { plays: 0, minutes: 0, artist: item.artistName }
      trackStats.plays++
      trackStats.minutes += minutes
      trackMap.set(trackKey, trackStats)

      // Artist stats
      const artistStats = artistMap.get(item.artistName) || { plays: 0, minutes: 0 }
      artistStats.plays++
      artistStats.minutes += minutes
      artistMap.set(item.artistName, artistStats)

      // Monthly stats
      if (item.endTime) {
        const date = new Date(item.endTime)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + minutes)
      }
    })

    const topTracks = Array.from(trackMap.entries())
      .map(([key, stats]) => {
        const [name] = key.split("|||")
        return { name, artist: stats.artist, plays: stats.plays, minutes: Math.round(stats.minutes) }
      })
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 10)

    const topArtists = Array.from(artistMap.entries())
      .map(([name, stats]) => ({ name, plays: stats.plays, minutes: Math.round(stats.minutes) }))
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 10)

    const listeningByMonth = Array.from(monthMap.entries())
      .map(([month, minutes]) => ({ month, minutes: Math.round(minutes) }))
      .sort((a, b) => a.month.localeCompare(b.month))

    return {
      totalStreams: data.length,
      totalMinutes: Math.round(totalMinutes),
      uniqueTracks: trackMap.size,
      uniqueArtists: artistMap.size,
      topTracks,
      topArtists,
      listeningByMonth,
    }
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    setError(null)

    try {
      const text = await file.text()
      let data: SpotifyStreamingData[]

      if (file.name.endsWith(".json")) {
        data = parseJSON(text)
      } else {
        data = parseCSV(text)
      }

      if (data.length === 0) {
        throw new Error("Aucune donnée valide trouvée dans le fichier")
      }

      const stats = analyzeData(data)
      setParsedData(stats)
      onDataImported?.(stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du traitement du fichier")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.name.endsWith(".csv") || droppedFile.name.endsWith(".json"))) {
      setFile(droppedFile)
      processFile(droppedFile)
    } else {
      setError("Veuillez importer un fichier CSV ou JSON")
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      processFile(selectedFile)
    }
  }

  const resetImport = () => {
    setFile(null)
    setParsedData(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-[#1DB954]" />
            Importer tes données Spotify
          </CardTitle>
          <CardDescription className="text-gray-400">
            Importe tes fichiers de données personnelles Spotify (CSV ou JSON) obtenus via ta demande de données sur{" "}
            <a
              href="https://www.spotify.com/account/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1DB954] hover:underline"
            >
              privacy.spotify.com
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!parsedData ? (
            <>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                  isDragging
                    ? "border-[#1DB954] bg-[#1DB954]/10"
                    : "border-white/20 hover:border-[#1DB954]/50 hover:bg-white/5"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {isProcessing ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#1DB954] border-t-transparent" />
                    <p className="text-gray-400">Analyse des données en cours...</p>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1DB954]/20">
                      <FileText className="h-8 w-8 text-[#1DB954]" />
                    </div>
                    <p className="mb-2 text-lg font-medium">
                      Glisse ton fichier ici ou <span className="text-[#1DB954]">clique pour parcourir</span>
                    </p>
                    <p className="text-sm text-gray-400">
                      Formats acceptés: StreamingHistory.json, endsong.json, ou fichiers CSV exportés
                    </p>
                  </>
                )}
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-red-400">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Instructions */}
              <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
                <h4 className="mb-3 font-semibold text-white">Comment obtenir tes données Spotify ?</h4>
                <ol className="space-y-2 text-sm text-gray-400">
                  <li className="flex gap-2">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1DB954]/20 text-xs text-[#1DB954]">
                      1
                    </span>
                    Connecte-toi sur{" "}
                    <a
                      href="https://www.spotify.com/account/privacy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1DB954] hover:underline"
                    >
                      spotify.com/account/privacy
                    </a>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1DB954]/20 text-xs text-[#1DB954]">
                      2
                    </span>
                    Demande une copie de tes données (section "Télécharger tes données")
                  </li>
                  <li className="flex gap-2">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1DB954]/20 text-xs text-[#1DB954]">
                      3
                    </span>
                    Tu recevras un email avec un lien de téléchargement sous 30 jours
                  </li>
                  <li className="flex gap-2">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1DB954]/20 text-xs text-[#1DB954]">
                      4
                    </span>
                    Importe les fichiers StreamingHistory ou endsong ici
                  </li>
                </ol>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-[#1DB954]/10 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-[#1DB954]" />
                  <div>
                    <p className="font-medium text-white">Fichier importé avec succès</p>
                    <p className="text-sm text-gray-400">{file?.name}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={resetImport} className="text-gray-400 hover:text-white">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parsed Results */}
      {parsedData && (
        <>
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                  <Music className="h-4 w-4" />
                  Total Streams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#1DB954]">{parsedData.totalStreams.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                  <Clock className="h-4 w-4" />
                  Minutes écoutées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#1DB954]">{parsedData.totalMinutes.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                  <FileText className="h-4 w-4" />
                  Titres uniques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#1DB954]">{parsedData.uniqueTracks.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                  <Calendar className="h-4 w-4" />
                  Artistes uniques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#1DB954]">{parsedData.uniqueArtists.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Tracks & Artists from Import */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-[#1DB954]" />
                  Top 10 Titres (Import)
                </CardTitle>
                <CardDescription className="text-gray-400">Basé sur tes données importées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {parsedData.topTracks.map((track, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-3 transition-all hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1DB954]/20 text-sm font-bold text-[#1DB954]">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{track.name}</p>
                          <p className="truncate text-sm text-gray-400">{track.artist}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#1DB954]">{track.plays} écoutes</p>
                        <p className="text-xs text-gray-500">{track.minutes} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#1DB954]" />
                  Top 10 Artistes (Import)
                </CardTitle>
                <CardDescription className="text-gray-400">Basé sur tes données importées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {parsedData.topArtists.map((artist, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-3 transition-all hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1DB954]/20 text-sm font-bold text-[#1DB954]">
                          {index + 1}
                        </span>
                        <p className="font-medium">{artist.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#1DB954]">{artist.plays} écoutes</p>
                        <p className="text-xs text-gray-500">{artist.minutes} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Listening Chart */}
          {parsedData.listeningByMonth.length > 0 && (
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#1DB954]" />
                  Écoute par mois
                </CardTitle>
                <CardDescription className="text-gray-400">Minutes écoutées par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-48 items-end gap-1">
                  {parsedData.listeningByMonth.slice(-12).map((month, index) => {
                    const maxMinutes = Math.max(...parsedData.listeningByMonth.map((m) => m.minutes))
                    const height = (month.minutes / maxMinutes) * 100
                    return (
                      <div key={index} className="group relative flex flex-1 flex-col items-center">
                        <div className="absolute -top-8 hidden rounded bg-black/80 px-2 py-1 text-xs group-hover:block">
                          {month.minutes.toLocaleString()} min
                        </div>
                        <div
                          className="w-full rounded-t bg-[#1DB954] transition-all hover:bg-[#1ed760]"
                          style={{ height: `${height}%` }}
                        />
                        <span className="mt-2 text-xs text-gray-500">{month.month.split("-")[1]}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
