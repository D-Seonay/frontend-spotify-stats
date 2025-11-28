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
  ChevronDown,
  ChevronUp,
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
  listeningByDay: { date: string; minutes: number; streams: number }[]
  listeningByHour: { hour: number; minutes: number }[]
  listeningByWeekday: { day: string; minutes: number }[]
}

interface FileInfo {
  file: File
  status: "pending" | "processing" | "success" | "error"
  error?: string
  recordCount?: number
}

interface Filters {
  artistSearch: string
  trackSearch: string
  dateFrom: string
  dateTo: string
  minPlaytime: number
}

function ActivityHeatmap({ data }: { data: { date: string; minutes: number; streams: number }[] }) {
  const weeks = useMemo(() => {
    if (data.length === 0) return []

    const dataMap = new Map(data.map((d) => [d.date, d]))
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 364)

    const allDays: { date: string; minutes: number; streams: number; weekday: number }[] = []
    const current = new Date(startDate)

    while (current <= endDate) {
      const dateStr = current.toISOString().split("T")[0]
      const existing = dataMap.get(dateStr)
      allDays.push({
        date: dateStr,
        minutes: existing?.minutes || 0,
        streams: existing?.streams || 0,
        weekday: current.getDay(),
      })
      current.setDate(current.getDate() + 1)
    }

    const weeksArray: (typeof allDays)[] = []
    let currentWeek: typeof allDays = []

    allDays.forEach((day, index) => {
      if (index === 0) {
        for (let i = 0; i < day.weekday; i++) {
          currentWeek.push({ date: "", minutes: 0, streams: 0, weekday: i })
        }
      }
      currentWeek.push(day)
      if (day.weekday === 6 || index === allDays.length - 1) {
        weeksArray.push(currentWeek)
        currentWeek = []
      }
    })

    return weeksArray
  }, [data])

  const maxMinutes = useMemo(() => Math.max(...data.map((d) => d.minutes), 1), [data])

  const getIntensity = (minutes: number) => {
    if (minutes === 0) return "bg-white/5"
    const ratio = minutes / maxMinutes
    if (ratio < 0.25) return "bg-[#1DB954]/30"
    if (ratio < 0.5) return "bg-[#1DB954]/50"
    if (ratio < 0.75) return "bg-[#1DB954]/70"
    return "bg-[#1DB954]"
  }

  const dayLabels = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
  const monthLabels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]

  return (
    <div className="space-y-2">
      <div className="flex gap-1 overflow-x-auto pb-2">
        <div className="flex flex-col gap-1 pr-2 text-xs text-gray-500">
          {dayLabels.map((day, i) => (
            <div key={i} className="h-3 leading-3">
              {i % 2 === 1 ? day : ""}
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`group relative h-3 w-3 rounded-sm transition-all hover:ring-1 hover:ring-white/50 ${
                    day.date ? getIntensity(day.minutes) : "bg-transparent"
                  }`}
                >
                  {day.date && day.minutes > 0 && (
                    <div className="pointer-events-none absolute -top-12 left-1/2 z-50 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-xs group-hover:block">
                      <p className="font-medium">{day.date}</p>
                      <p className="text-gray-400">
                        {day.minutes} min · {day.streams} écoutes
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex gap-4">
          {monthLabels.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span>Moins</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-sm bg-white/5" />
            <div className="h-3 w-3 rounded-sm bg-[#1DB954]/30" />
            <div className="h-3 w-3 rounded-sm bg-[#1DB954]/50" />
            <div className="h-3 w-3 rounded-sm bg-[#1DB954]/70" />
            <div className="h-3 w-3 rounded-sm bg-[#1DB954]" />
          </div>
          <span>Plus</span>
        </div>
      </div>
    </div>
  )
}

export function CsvImporter({ onDataImported }: { onDataImported?: (data: ParsedStats) => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<FileInfo[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<ParsedStats | null>(null)
  const [allRawData, setAllRawData] = useState<SpotifyStreamingData[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    artistSearch: "",
    trackSearch: "",
    dateFrom: "",
    dateTo: "",
    minPlaytime: 0,
  })
  const [activeChart, setActiveChart] = useState<"area" | "bar" | "pie">("area")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredData = useMemo(() => {
    if (allRawData.length === 0) return []

    return allRawData.filter((item) => {
      if (filters.artistSearch && !item.artistName.toLowerCase().includes(filters.artistSearch.toLowerCase())) {
        return false
      }
      if (filters.trackSearch && !item.trackName.toLowerCase().includes(filters.trackSearch.toLowerCase())) {
        return false
      }
      if (filters.dateFrom && item.endTime) {
        const itemDate = new Date(item.endTime)
        const fromDate = new Date(filters.dateFrom)
        if (itemDate < fromDate) return false
      }
      if (filters.dateTo && item.endTime) {
        const itemDate = new Date(item.endTime)
        const toDate = new Date(filters.dateTo)
        if (itemDate > toDate) return false
      }
      if (filters.minPlaytime > 0 && item.msPlayed / 60000 < filters.minPlaytime) {
        return false
      }
      return true
    })
  }, [allRawData, filters])

  const filteredStats = useMemo(() => {
    if (filteredData.length === 0) return null
    return analyzeData(filteredData)
  }, [filteredData])

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
    const dayMap = new Map<string, { minutes: number; streams: number }>()
    const hourMap = new Map<number, number>()
    const weekdayMap = new Map<number, number>()

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

        const dayKey = date.toISOString().split("T")[0]
        const dayStats = dayMap.get(dayKey) || { minutes: 0, streams: 0 }
        dayStats.minutes += minutes
        dayStats.streams++
        dayMap.set(dayKey, dayStats)

        const hour = date.getHours()
        hourMap.set(hour, (hourMap.get(hour) || 0) + minutes)

        const weekday = date.getDay()
        weekdayMap.set(weekday, (weekdayMap.get(weekday) || 0) + minutes)
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

    const listeningByDay = Array.from(dayMap.entries())
      .map(([date, stats]) => ({ date, minutes: Math.round(stats.minutes), streams: stats.streams }))
      .sort((a, b) => a.date.localeCompare(b.date))

    const listeningByHour = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      minutes: Math.round(hourMap.get(hour) || 0),
    }))

    const weekdayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
    const listeningByWeekday = weekdayNames.map((day, index) => ({
      day,
      minutes: Math.round(weekdayMap.get(index) || 0),
    }))

    return {
      totalStreams: data.length,
      totalMinutes: Math.round(totalMinutes),
      uniqueTracks: trackMap.size,
      uniqueArtists: artistMap.size,
      topTracks,
      topArtists,
      listeningByMonth,
      listeningByDay,
      listeningByHour,
      listeningByWeekday,
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
    setFilters({
      artistSearch: "",
      trackSearch: "",
      dateFrom: "",
      dateTo: "",
      minPlaytime: 0,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const clearFilters = () => {
    setFilters({
      artistSearch: "",
      trackSearch: "",
      dateFrom: "",
      dateTo: "",
      minPlaytime: 0,
    })
  }

  const hasActiveFilters =
    filters.artistSearch || filters.trackSearch || filters.dateFrom || filters.dateTo || filters.minPlaytime > 0

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

  const pendingCount = files.filter((f) => f.status === "pending").length
  const successCount = files.filter((f) => f.status === "success").length
  const errorCount = files.filter((f) => f.status === "error").length

  const displayStats = filteredStats || parsedData
  const CHART_COLORS = ["#1DB954", "#1ed760", "#169c46", "#14833b", "#0f5c2a", "#0a4420", "#063116", "#021f0d"]

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

      {/* Parsed Results with Filters and Visualizations */}
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
                    {allRawData.length.toLocaleString()} entrées totales
                    {hasActiveFilters && ` • ${filteredData.length.toLocaleString()} après filtrage`}
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
            <CardHeader
              className="cursor-pointer transition-colors hover:bg-white/5"
              onClick={() => setShowFilters(!showFilters)}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-[#1DB954]" />
                  Filtres avancés
                  {hasActiveFilters && (
                    <span className="rounded-full bg-[#1DB954]/20 px-2 py-1 text-xs text-[#1DB954]">Actifs</span>
                  )}
                </div>
                {showFilters ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </CardTitle>
            </CardHeader>
            {showFilters && (
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <User className="h-4 w-4" />
                      Artiste
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        placeholder="Rechercher un artiste..."
                        value={filters.artistSearch}
                        onChange={(e) => setFilters((f) => ({ ...f, artistSearch: e.target.value }))}
                        className="border-white/10 bg-white/5 pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <Music className="h-4 w-4" />
                      Titre
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        placeholder="Rechercher un titre..."
                        value={filters.trackSearch}
                        onChange={(e) => setFilters((f) => ({ ...f, trackSearch: e.target.value }))}
                        className="border-white/10 bg-white/5 pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      Date de début
                    </label>
                    <Input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                      className="border-white/10 bg-white/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      Date de fin
                    </label>
                    <Input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
                      className="border-white/10 bg-white/5"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      Durée minimum (min)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={filters.minPlaytime || ""}
                      onChange={(e) => setFilters((f) => ({ ...f, minPlaytime: Number(e.target.value) || 0 }))}
                      className="w-24 border-white/10 bg-white/5"
                      placeholder="0"
                    />
                  </div>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-400 hover:text-white">
                      <X className="mr-2 h-4 w-4" />
                      Effacer les filtres
                    </Button>
                  )}
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
                    <p className="text-sm text-gray-500">{Math.round(displayStats.totalMinutes / 60)} heures</p>
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
                    Ton historique d'écoute sur les 12 derniers mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityHeatmap data={displayStats.listeningByDay} />
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-[#1DB954]" />
                        Visualisations
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Explore tes données d'écoute de différentes manières
                      </CardDescription>
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
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Tendance
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
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Heures
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
                        <Calendar className="mr-2 h-4 w-4" />
                        Jours
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
                          <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} />
                          <YAxis stroke="#888" fontSize={12} tickLine={false} tickFormatter={(v) => `${v}m`} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1a1a1a",
                              border: "1px solid #333",
                              borderRadius: "8px",
                              color: "#fff",
                            }}
                            formatter={(value: number) => [`${value.toLocaleString()} minutes`, "Écoute"]}
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

                    {activeChart === "bar" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={displayStats.listeningByHour}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis
                            dataKey="hour"
                            stroke="#888"
                            fontSize={12}
                            tickLine={false}
                            tickFormatter={(h) => `${h}h`}
                          />
                          <YAxis stroke="#888" fontSize={12} tickLine={false} tickFormatter={(v) => `${v}m`} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1a1a1a",
                              border: "1px solid #333",
                              borderRadius: "8px",
                              color: "#fff",
                            }}
                            formatter={(value: number) => [`${value.toLocaleString()} minutes`, "Écoute"]}
                            labelFormatter={(label) => `${label}h00`}
                          />
                          <Bar dataKey="minutes" fill="#1DB954" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}

                    {activeChart === "pie" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={displayStats.listeningByWeekday}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={2}
                            dataKey="minutes"
                            nameKey="day"
                            label={({ day, percent }) => `${day} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {displayStats.listeningByWeekday.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1a1a1a",
                              border: "1px solid #333",
                              borderRadius: "8px",
                              color: "#fff",
                            }}
                            formatter={(value: number) => [`${value.toLocaleString()} minutes`, "Écoute"]}
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
                            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1DB954]/20 text-sm font-bold text-[#1DB954]">
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
