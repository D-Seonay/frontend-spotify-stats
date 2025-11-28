"use client"

import type React from "react"

import { useState, useCallback, useRef, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Music,
  Clock,
  Calendar,
  Files,
  Trash2,
  Filter,
  Search,
  User,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

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

interface FileInfo {
  file: File
  status: "pending" | "processing" | "success" | "error"
  error?: string
  recordCount?: number
}

interface DailyActivity {
  date: string
  minutes: number
  streams: number
}

interface Filters {
  artist: string
  track: string
  dateFrom: string
  dateTo: string
}

export function CsvImporter({ onDataImported }: { onDataImported?: (data: ParsedStats) => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<FileInfo[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<ParsedStats | null>(null)
  const [allRawData, setAllRawData] = useState<SpotifyStreamingData[]>([])
  const [filters, setFilters] = useState<Filters>({
    artist: "",
    track: "",
    dateFrom: "",
    dateTo: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [activeChart, setActiveChart] = useState<"area" | "bar" | "pie">("area")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredData = useMemo(() => {
    if (allRawData.length === 0) return []

    return allRawData.filter((item) => {
      const matchesArtist = filters.artist ? item.artistName.toLowerCase().includes(filters.artist.toLowerCase()) : true
      const matchesTrack = filters.track ? item.trackName.toLowerCase().includes(filters.track.toLowerCase()) : true

      let matchesDate = true
      if (filters.dateFrom || filters.dateTo) {
        const itemDate = new Date(item.endTime)
        if (filters.dateFrom) {
          matchesDate = matchesDate && itemDate >= new Date(filters.dateFrom)
        }
        if (filters.dateTo) {
          matchesDate = matchesDate && itemDate <= new Date(filters.dateTo)
        }
      }

      return matchesArtist && matchesTrack && matchesDate
    })
  }, [allRawData, filters])

  const filteredStats = useMemo(() => {
    if (filteredData.length === 0) return null
    return analyzeData(filteredData)
  }, [filteredData])

  const dailyActivity = useMemo((): DailyActivity[] => {
    if (filteredData.length === 0) return []

    const dailyMap = new Map<string, { minutes: number; streams: number }>()

    filteredData.forEach((item) => {
      if (item.endTime) {
        const date = new Date(item.endTime)
        const dateKey = date.toISOString().split("T")[0]
        const existing = dailyMap.get(dateKey) || { minutes: 0, streams: 0 }
        existing.minutes += item.msPlayed / 60000
        existing.streams++
        dailyMap.set(dateKey, existing)
      }
    })

    return Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date,
        minutes: Math.round(data.minutes),
        streams: data.streams,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [filteredData])

  const heatmapData = useMemo(() => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 364)

    const dailyMap = new Map<string, number>()
    dailyActivity.forEach((d) => dailyMap.set(d.date, d.minutes))

    const weeks: { date: Date; minutes: number }[][] = []
    let currentWeek: { date: Date; minutes: number }[] = []

    // Start from the first Sunday before or on startDate
    const currentDate = new Date(startDate)
    currentDate.setDate(currentDate.getDate() - currentDate.getDay())

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split("T")[0]
      currentWeek.push({
        date: new Date(currentDate),
        minutes: dailyMap.get(dateStr) || 0,
      })

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return weeks
  }, [dailyActivity])

  const uniqueArtistsList = useMemo(() => {
    const artists = new Set<string>()
    allRawData.forEach((item) => artists.add(item.artistName))
    return Array.from(artists).sort()
  }, [allRawData])

  const dateRange = useMemo(() => {
    if (allRawData.length === 0) return { min: "", max: "" }
    const dates = allRawData.map((item) => new Date(item.endTime)).filter((d) => !isNaN(d.getTime()))
    if (dates.length === 0) return { min: "", max: "" }
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())))
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())))
    return {
      min: minDate.toISOString().split("T")[0],
      max: maxDate.toISOString().split("T")[0],
    }
  }, [allRawData])

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

  function analyzeData(data: SpotifyStreamingData[]): ParsedStats {
    const trackMap = new Map<string, { plays: number; minutes: number; artist: string }>()
    const artistMap = new Map<string, { plays: number; minutes: number }>()
    const monthMap = new Map<string, number>()

    let totalMinutes = 0

    data.forEach((item) => {
      const minutes = item.msPlayed / 60000
      totalMinutes += minutes

      const trackKey = `${item.trackName}|||${item.artistName}`
      const trackStats = trackMap.get(trackKey) || { plays: 0, minutes: 0, artist: item.artistName }
      trackStats.plays++
      trackStats.minutes += minutes
      trackMap.set(trackKey, trackStats)

      const artistStats = artistMap.get(item.artistName) || { plays: 0, minutes: 0 }
      artistStats.plays++
      artistStats.minutes += minutes
      artistMap.set(item.artistName, artistStats)

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

  const processSingleFile = async (file: File): Promise<SpotifyStreamingData[]> => {
    const text = await file.text()
    if (file.name.endsWith(".json")) {
      return parseJSON(text)
    } else {
      return parseCSV(text)
    }
  }

  const processAllFiles = async () => {
    if (files.length === 0) return

    setIsProcessing(true)
    setError(null)

    const updatedFiles = [...files]
    const combinedData: SpotifyStreamingData[] = []

    for (let i = 0; i < updatedFiles.length; i++) {
      const fileInfo = updatedFiles[i]
      if (fileInfo.status === "success") {
        continue
      }

      updatedFiles[i] = { ...fileInfo, status: "processing" }
      setFiles([...updatedFiles])

      try {
        const data = await processSingleFile(fileInfo.file)
        if (data.length === 0) {
          updatedFiles[i] = {
            ...fileInfo,
            status: "error",
            error: "Aucune donnée valide trouvée",
          }
        } else {
          combinedData.push(...data)
          updatedFiles[i] = {
            ...fileInfo,
            status: "success",
            recordCount: data.length,
          }
        }
      } catch (err) {
        updatedFiles[i] = {
          ...fileInfo,
          status: "error",
          error: err instanceof Error ? err.message : "Erreur de traitement",
        }
      }
      setFiles([...updatedFiles])
    }

    const allData = [...allRawData, ...combinedData]
    setAllRawData(allData)

    if (allData.length > 0) {
      const stats = analyzeData(allData)
      setParsedData(stats)
      onDataImported?.(stats)
    } else if (combinedData.length === 0 && allRawData.length === 0) {
      setError("Aucune donnée valide trouvée dans les fichiers importés")
    }

    setIsProcessing(false)
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

    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles = droppedFiles.filter((f) => f.name.endsWith(".csv") || f.name.endsWith(".json"))

    if (validFiles.length === 0) {
      setError("Veuillez importer des fichiers CSV ou JSON")
      return
    }

    const newFiles: FileInfo[] = validFiles.map((file) => ({
      file,
      status: "pending" as const,
    }))

    setFiles((prev) => [...prev, ...newFiles])
    setError(null)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      const newFiles: FileInfo[] = selectedFiles.map((file) => ({
        file,
        status: "pending" as const,
      }))
      setFiles((prev) => [...prev, ...newFiles])
      setError(null)
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const clearAllFiles = () => {
    setFiles([])
    setError(null)
  }

  const resetImport = () => {
    setFiles([])
    setParsedData(null)
    setError(null)
    setAllRawData([])
    setFilters({ artist: "", track: "", dateFrom: "", dateTo: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const clearFilters = () => {
    setFilters({ artist: "", track: "", dateFrom: "", dateTo: "" })
  }

  const hasActiveFilters = filters.artist || filters.track || filters.dateFrom || filters.dateTo

  const getStatusBadge = (status: FileInfo["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "processing":
        return "bg-blue-500/20 text-blue-400"
      case "success":
        return "bg-[#1DB954]/20 text-[#1DB954]"
      case "error":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getStatusText = (status: FileInfo["status"]) => {
    switch (status) {
      case "pending":
        return "En attente"
      case "processing":
        return "Traitement..."
      case "success":
        return "Importé"
      case "error":
        return "Erreur"
      default:
        return status
    }
  }

  const getHeatmapColor = (minutes: number): string => {
    if (minutes === 0) return "bg-white/5"
    const maxMinutes = Math.max(...dailyActivity.map((d) => d.minutes), 1)
    const intensity = minutes / maxMinutes
    if (intensity < 0.25) return "bg-[#1DB954]/25"
    if (intensity < 0.5) return "bg-[#1DB954]/50"
    if (intensity < 0.75) return "bg-[#1DB954]/75"
    return "bg-[#1DB954]"
  }

  const pendingCount = files.filter((f) => f.status === "pending").length
  const successCount = files.filter((f) => f.status === "success").length
  const errorCount = files.filter((f) => f.status === "error").length

  const CHART_COLORS = ["#1DB954", "#1ed760", "#169c46", "#12753a", "#0f5d30"]

  const displayStats = hasActiveFilters ? filteredStats : parsedData

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
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1DB954]/20">
              <Files className="h-8 w-8 text-[#1DB954]" />
            </div>
            <p className="mb-2 text-lg font-medium">
              Glisse tes fichiers ici ou <span className="text-[#1DB954]">clique pour parcourir</span>
            </p>
            <p className="text-sm text-gray-400">
              Sélection multiple activée - StreamingHistory.json, endsong.json, ou fichiers CSV
            </p>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h4 className="font-semibold text-white">Fichiers sélectionnés ({files.length})</h4>
                  {successCount > 0 && (
                    <span className="rounded-full bg-[#1DB954]/20 px-2 py-1 text-xs text-[#1DB954]">
                      {successCount} importé{successCount > 1 ? "s" : ""}
                    </span>
                  )}
                  {errorCount > 0 && (
                    <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-400">
                      {errorCount} erreur{errorCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={clearAllFiles} className="text-gray-400 hover:text-red-400">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Tout effacer
                </Button>
              </div>

              <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border border-white/10 bg-white/5 p-3">
                {files.map((fileInfo, index) => (
                  <div
                    key={`${fileInfo.file.name}-${index}`}
                    className="flex items-center justify-between rounded-lg bg-white/5 p-3 transition-all hover:bg-white/10"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <FileText className="h-5 w-5 flex-shrink-0 text-[#1DB954]" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-white">{fileInfo.file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(fileInfo.file.size / 1024).toFixed(1)} KB
                          {fileInfo.recordCount && ` • ${fileInfo.recordCount.toLocaleString()} entrées`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2 py-1 text-xs ${getStatusBadge(fileInfo.status)}`}>
                        {fileInfo.status === "processing" ? (
                          <span className="flex items-center gap-1">
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            {getStatusText(fileInfo.status)}
                          </span>
                        ) : (
                          getStatusText(fileInfo.status)
                        )}
                      </span>
                      {fileInfo.status !== "processing" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile(index)
                          }}
                          className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {pendingCount > 0 && (
                <Button
                  onClick={processAllFiles}
                  disabled={isProcessing}
                  className="w-full bg-[#1DB954] text-black hover:bg-[#1ed760] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Importer {pendingCount} fichier{pendingCount > 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Instructions */}
          {files.length === 0 && !parsedData && (
            <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
              <h4 className="mb-3 font-semibold text-white">Comment obtenir tes données Spotify ?</h4>
              <ol className="space-y-2 text-sm text-gray-400">
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1DB954]/20 text-xs text-[#1DB954]">
                    1
                  </span>
                  <span>
                    Connecte-toi sur{" "}
                    <a
                      href="https://www.spotify.com/account/privacy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1DB954] hover:underline"
                    >
                      spotify.com/account/privacy
                    </a>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1DB954]/20 text-xs text-[#1DB954]">
                    2
                  </span>
                  <span>Demande une copie de tes données (section "Télécharger tes données")</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1DB954]/20 text-xs text-[#1DB954]">
                    3
                  </span>
                  <span>Tu recevras un email avec un lien de téléchargement sous 30 jours</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1DB954]/20 text-xs text-[#1DB954]">
                    4
                  </span>
                  <span>Importe tous les fichiers StreamingHistory ou endsong en une seule fois</span>
                </li>
              </ol>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parsed Results */}
      {parsedData && (
        <>
          <Card className="border-[#1DB954]/30 bg-[#1DB954]/10 backdrop-blur-sm">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-[#1DB954]" />
                <div>
                  <p className="font-medium text-white">
                    {successCount} fichier{successCount > 1 ? "s" : ""} importé{successCount > 1 ? "s" : ""} avec succès
                  </p>
                  <p className="text-sm text-gray-400">
                    {allRawData.length.toLocaleString()} entrées totales analysées
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetImport}
                className="border-white/20 bg-transparent hover:bg-white/10"
              >
                Nouvelle importation
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5 text-[#1DB954]" />
                  Filtres avancés
                </CardTitle>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-400 hover:text-white">
                      <X className="mr-1 h-4 w-4" />
                      Effacer
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-gray-400 hover:text-white"
                  >
                    {showFilters ? "Masquer" : "Afficher"}
                  </Button>
                </div>
              </div>
              {hasActiveFilters && (
                <p className="text-sm text-[#1DB954]">
                  {filteredData.length.toLocaleString()} résultats sur {allRawData.length.toLocaleString()}
                </p>
              )}
            </CardHeader>
            {showFilters && (
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                      <User className="h-4 w-4" />
                      Artiste
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        type="text"
                        placeholder="Rechercher un artiste..."
                        value={filters.artist}
                        onChange={(e) => setFilters((f) => ({ ...f, artist: e.target.value }))}
                        className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-500"
                        list="artists-list"
                      />
                      <datalist id="artists-list">
                        {uniqueArtistsList.slice(0, 50).map((artist) => (
                          <option key={artist} value={artist} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                      <Music className="h-4 w-4" />
                      Titre
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        type="text"
                        placeholder="Rechercher un titre..."
                        value={filters.track}
                        onChange={(e) => setFilters((f) => ({ ...f, track: e.target.value }))}
                        className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                      <Calendar className="h-4 w-4" />
                      Date début
                    </label>
                    <Input
                      type="date"
                      value={filters.dateFrom}
                      min={dateRange.min}
                      max={dateRange.max}
                      onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                      <Calendar className="h-4 w-4" />
                      Date fin
                    </label>
                    <Input
                      type="date"
                      value={filters.dateTo}
                      min={dateRange.min}
                      max={dateRange.max}
                      onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Stats Overview */}
          {displayStats && (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                      <Music className="h-4 w-4" />
                      Total Streams
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-[#1DB954]">{displayStats.totalStreams.toLocaleString()}</p>
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
                    <p className="text-3xl font-bold text-[#1DB954]">{displayStats.totalMinutes.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">
                      ~{Math.round(displayStats.totalMinutes / 60).toLocaleString()} heures
                    </p>
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
                    <p className="text-3xl font-bold text-[#1DB954]">{displayStats.uniqueTracks.toLocaleString()}</p>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                      <User className="h-4 w-4" />
                      Artistes uniques
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-[#1DB954]">{displayStats.uniqueArtists.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#1DB954]" />
                    Activité d'écoute
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Visualise ton activité quotidienne sur les 12 derniers mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto pb-2">
                    <div className="inline-flex flex-col gap-1">
                      <div className="mb-1 flex gap-1 text-xs text-gray-500">
                        <span className="w-8"></span>
                        {["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"].map(
                          (month) => (
                            <span key={month} className="w-[52px] text-center">
                              {month}
                            </span>
                          ),
                        )}
                      </div>
                      <div className="flex gap-1">
                        <div className="flex w-8 flex-col justify-around text-xs text-gray-500">
                          <span>Lun</span>
                          <span>Mer</span>
                          <span>Ven</span>
                        </div>
                        <div className="flex gap-[3px]">
                          {heatmapData.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-[3px]">
                              {week.map((day, dayIndex) => (
                                <div
                                  key={dayIndex}
                                  className={`group relative h-3 w-3 rounded-sm transition-all hover:ring-1 hover:ring-white/50 ${getHeatmapColor(day.minutes)}`}
                                  title={`${day.date}: ${day.minutes} minutes`}
                                >
                                  <div className="pointer-events-none absolute -top-10 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-xs text-white shadow-lg group-hover:block">
                                    <div className="font-medium">{day.date}</div>
                                    <div className="text-[#1DB954]">{day.minutes} min</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-end gap-2 text-xs text-gray-500">
                        <span>Moins</span>
                        <div className="flex gap-1">
                          <div className="h-3 w-3 rounded-sm bg-white/5" />
                          <div className="h-3 w-3 rounded-sm bg-[#1DB954]/25" />
                          <div className="h-3 w-3 rounded-sm bg-[#1DB954]/50" />
                          <div className="h-3 w-3 rounded-sm bg-[#1DB954]/75" />
                          <div className="h-3 w-3 rounded-sm bg-[#1DB954]" />
                        </div>
                        <span>Plus</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-[#1DB954]" />
                        Visualisations
                      </CardTitle>
                      <CardDescription className="text-gray-400">Analyse interactive de tes données</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={activeChart === "area" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveChart("area")}
                        className={
                          activeChart === "area"
                            ? "bg-[#1DB954] text-black hover:bg-[#1ed760]"
                            : "border-white/20 bg-transparent hover:bg-white/10"
                        }
                      >
                        <TrendingUp className="mr-1 h-4 w-4" />
                        Évolution
                      </Button>
                      <Button
                        variant={activeChart === "bar" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveChart("bar")}
                        className={
                          activeChart === "bar"
                            ? "bg-[#1DB954] text-black hover:bg-[#1ed760]"
                            : "border-white/20 bg-transparent hover:bg-white/10"
                        }
                      >
                        <BarChart3 className="mr-1 h-4 w-4" />
                        Barres
                      </Button>
                      <Button
                        variant={activeChart === "pie" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveChart("pie")}
                        className={
                          activeChart === "pie"
                            ? "bg-[#1DB954] text-black hover:bg-[#1ed760]"
                            : "border-white/20 bg-transparent hover:bg-white/10"
                        }
                      >
                        Top Artistes
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {activeChart === "area" && displayStats.listeningByMonth.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={displayStats.listeningByMonth}>
                          <defs>
                            <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#1DB954" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#1DB954" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis
                            dataKey="month"
                            stroke="#888"
                            tick={{ fill: "#888", fontSize: 12 }}
                            tickFormatter={(value) => {
                              const [, month] = value.split("-")
                              const months = [
                                "Jan",
                                "Fév",
                                "Mar",
                                "Avr",
                                "Mai",
                                "Jun",
                                "Jul",
                                "Aoû",
                                "Sep",
                                "Oct",
                                "Nov",
                                "Déc",
                              ]
                              return months[Number.parseInt(month) - 1] || month
                            }}
                          />
                          <YAxis stroke="#888" tick={{ fill: "#888", fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1a1a1a",
                              border: "1px solid #333",
                              borderRadius: "8px",
                            }}
                            labelStyle={{ color: "#fff" }}
                            itemStyle={{ color: "#1DB954" }}
                            formatter={(value: number) => [`${value.toLocaleString()} min`, "Écoute"]}
                          />
                          <Area
                            type="monotone"
                            dataKey="minutes"
                            stroke="#1DB954"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorMinutes)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}

                    {activeChart === "bar" && displayStats.listeningByMonth.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={displayStats.listeningByMonth}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis
                            dataKey="month"
                            stroke="#888"
                            tick={{ fill: "#888", fontSize: 12 }}
                            tickFormatter={(value) => {
                              const [, month] = value.split("-")
                              const months = [
                                "Jan",
                                "Fév",
                                "Mar",
                                "Avr",
                                "Mai",
                                "Jun",
                                "Jul",
                                "Aoû",
                                "Sep",
                                "Oct",
                                "Nov",
                                "Déc",
                              ]
                              return months[Number.parseInt(month) - 1] || month
                            }}
                          />
                          <YAxis stroke="#888" tick={{ fill: "#888", fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1a1a1a",
                              border: "1px solid #333",
                              borderRadius: "8px",
                            }}
                            labelStyle={{ color: "#fff" }}
                            itemStyle={{ color: "#1DB954" }}
                            formatter={(value: number) => [`${value.toLocaleString()} min`, "Écoute"]}
                          />
                          <Bar dataKey="minutes" fill="#1DB954" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}

                    {activeChart === "pie" && displayStats.topArtists.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={displayStats.topArtists.slice(0, 5)}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="plays"
                            nameKey="name"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {displayStats.topArtists.slice(0, 5).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1a1a1a",
                              border: "1px solid #333",
                              borderRadius: "8px",
                            }}
                            labelStyle={{ color: "#fff" }}
                            formatter={(value: number, name: string) => [`${value.toLocaleString()} écoutes`, name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Tracks & Artists */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Music className="h-5 w-5 text-[#1DB954]" />
                      Top 10 Titres
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {hasActiveFilters ? "Basé sur les données filtrées" : "Basé sur tes données importées"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {displayStats.topTracks.map((track, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-3 transition-all hover:bg-white/10"
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1DB954]/20 text-sm font-bold text-[#1DB954]">
                              {index + 1}
                            </span>
                            <div className="min-w-0 flex-1">
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
                      <User className="h-5 w-5 text-[#1DB954]" />
                      Top 10 Artistes
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {hasActiveFilters ? "Basé sur les données filtrées" : "Basé sur tes données importées"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {displayStats.topArtists.map((artist, index) => (
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
            </>
          )}
        </>
      )}
    </div>
  )
}
