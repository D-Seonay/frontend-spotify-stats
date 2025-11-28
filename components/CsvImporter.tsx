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

// Types
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
  monthlyData: { month: string; minutes: number; streams: number }[]
  hourlyData: { hour: string; streams: number }[]
  weekdayData: { day: string; streams: number }[]
  dailyData: { date: string; minutes: number; streams: number }[]
}

interface FileInfo {
  file: File
  name: string
  size: number
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

function analyzeData(data: SpotifyStreamingData[]): ParsedStats {
  const totalMinutes = Math.round(data.reduce((sum, item) => sum + item.msPlayed, 0) / 60000)
  const uniqueTracks = new Set(data.map((item) => `${item.trackName}-${item.artistName}`)).size
  const uniqueArtists = new Set(data.map((item) => item.artistName)).size

  // Top tracks
  const trackMap = new Map<string, { name: string; artist: string; plays: number; ms: number }>()
  data.forEach((item) => {
    const key = `${item.trackName}-${item.artistName}`
    const existing = trackMap.get(key)
    if (existing) {
      existing.plays++
      existing.ms += item.msPlayed
    } else {
      trackMap.set(key, { name: item.trackName, artist: item.artistName, plays: 1, ms: item.msPlayed })
    }
  })
  const topTracks = Array.from(trackMap.values())
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 10)
    .map((t) => ({ ...t, minutes: Math.round(t.ms / 60000) }))

  // Top artists
  const artistMap = new Map<string, { plays: number; ms: number }>()
  data.forEach((item) => {
    const existing = artistMap.get(item.artistName)
    if (existing) {
      existing.plays++
      existing.ms += item.msPlayed
    } else {
      artistMap.set(item.artistName, { plays: 1, ms: item.msPlayed })
    }
  })
  const topArtists = Array.from(artistMap.entries())
    .sort((a, b) => b[1].plays - a[1].plays)
    .slice(0, 10)
    .map(([name, data]) => ({ name, plays: data.plays, minutes: Math.round(data.ms / 60000) }))

  // Monthly data
  const monthMap = new Map<string, { minutes: number; streams: number }>()
  data.forEach((item) => {
    if (item.endTime) {
      const date = new Date(item.endTime)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const existing = monthMap.get(monthKey)
      if (existing) {
        existing.minutes += item.msPlayed / 60000
        existing.streams++
      } else {
        monthMap.set(monthKey, { minutes: item.msPlayed / 60000, streams: 1 })
      }
    }
  })
  const monthlyData = Array.from(monthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, d]) => ({ month, minutes: Math.round(d.minutes), streams: d.streams }))

  // Hourly data
  const hourMap = new Map<number, number>()
  data.forEach((item) => {
    if (item.endTime) {
      const hour = new Date(item.endTime).getHours()
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1)
    }
  })
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}h`,
    streams: hourMap.get(i) || 0,
  }))

  // Weekday data
  const weekdays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
  const weekdayMap = new Map<number, number>()
  data.forEach((item) => {
    if (item.endTime) {
      const day = new Date(item.endTime).getDay()
      weekdayMap.set(day, (weekdayMap.get(day) || 0) + 1)
    }
  })
  const weekdayData = weekdays.map((day, i) => ({
    day,
    streams: weekdayMap.get(i) || 0,
  }))

  // Daily data for heatmap
  const dailyMap = new Map<string, { minutes: number; streams: number }>()
  data.forEach((item) => {
    if (item.endTime) {
      const dateKey = item.endTime.split("T")[0] || item.endTime.split(" ")[0]
      const existing = dailyMap.get(dateKey)
      if (existing) {
        existing.minutes += item.msPlayed / 60000
        existing.streams++
      } else {
        dailyMap.set(dateKey, { minutes: item.msPlayed / 60000, streams: 1 })
      }
    }
  })
  const dailyData = Array.from(dailyMap.entries())
    .map(([date, d]) => ({ date, minutes: Math.round(d.minutes), streams: d.streams }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    totalStreams: data.length,
    totalMinutes,
    uniqueTracks,
    uniqueArtists,
    topTracks,
    topArtists,
    monthlyData,
    hourlyData,
    weekdayData,
    dailyData,
  }
}

// Activity Heatmap Component (GitHub-style)
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

  if (weeks.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-gray-500">
        Aucune donnée disponible pour la heatmap
      </div>
    )
  }

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
      <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
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
  )
}

// Chart colors
const CHART_COLORS = ["#1DB954", "#1ed760", "#169c46", "#0d7a35", "#095c28"]

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

  // Filter data based on current filters
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

  // Recalculate stats based on filtered data
  const filteredStats = useMemo(() => {
    if (filteredData.length === 0) return null
    return analyzeData(filteredData)
  }, [filteredData])

  const parseCSV = (text: string): SpotifyStreamingData[] => {
    const lines = text.trim().split("\n")
    if (lines.length < 2) return []

    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    return lines
      .slice(1)
      .map((line) => {
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || []
        const cleanValues = values.map((v) => v.replace(/"/g, "").trim())

        const obj: Record<string, string> = {}
        headers.forEach((header, index) => {
          obj[header] = cleanValues[index] || ""
        })

        return {
          endTime: obj["endTime"] || obj["ts"] || "",
          artistName: obj["artistName"] || obj["master_metadata_album_artist_name"] || "",
          trackName: obj["trackName"] || obj["master_metadata_track_name"] || "",
          msPlayed: Number.parseInt(obj["msPlayed"] || obj["ms_played"] || "0", 10),
        }
      })
      .filter((item) => item.artistName && item.trackName && item.msPlayed > 0)
  }

  const parseJSON = (text: string): SpotifyStreamingData[] => {
    try {
      const data = JSON.parse(text)
      const items = Array.isArray(data) ? data : []

      return items
        .map((item: Record<string, unknown>) => ({
          endTime: String(item.endTime || item.ts || ""),
          artistName: String(item.artistName || item.master_metadata_album_artist_name || ""),
          trackName: String(item.trackName || item.master_metadata_track_name || ""),
          msPlayed: Number(item.msPlayed || item.ms_played || 0),
        }))
        .filter((item) => item.artistName && item.trackName && item.msPlayed > 0)
    } catch {
      return []
    }
  }

  const processSingleFile = async (file: File): Promise<SpotifyStreamingData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        let data: SpotifyStreamingData[] = []

        if (file.name.endsWith(".json")) {
          data = parseJSON(text)
        } else if (file.name.endsWith(".csv")) {
          data = parseCSV(text)
        } else {
          // Try JSON first, then CSV
          data = parseJSON(text)
          if (data.length === 0) {
            data = parseCSV(text)
          }
        }

        if (data.length === 0) {
          reject(new Error("Format non reconnu ou fichier vide"))
        } else {
          resolve(data)
        }
      }
      reader.onerror = () => reject(new Error("Erreur de lecture du fichier"))
      reader.readAsText(file)
    })
  }

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    const validFiles = fileArray.filter(
      (file) => file.name.endsWith(".json") || file.name.endsWith(".csv") || file.type === "application/json",
    )

    if (validFiles.length === 0) {
      setError("Veuillez sélectionner des fichiers JSON ou CSV valides")
      return
    }

    const fileInfos: FileInfo[] = validFiles.map((file) => ({
      file,
      name: file.name,
      size: file.size,
      status: "pending",
    }))

    setFiles((prev) => [...prev, ...fileInfos])
    setError(null)
  }, [])

  const processAllFiles = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending")
    if (pendingFiles.length === 0) return

    setIsProcessing(true)
    setError(null)

    const combinedData: SpotifyStreamingData[] = []
    const updatedFiles = [...files]

    for (let i = 0; i < files.length; i++) {
      const fileInfo = files[i]
      if (fileInfo.status !== "pending") continue

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
    }

    setIsProcessing(false)
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true)
    } else if (e.type === "dragleave") {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files)
      }
    },
    [handleFiles],
  )

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const clearAllFiles = () => {
    setFiles([])
    setParsedData(null)
    setAllRawData([])
    setError(null)
  }

  const resetFilters = () => {
    setFilters({
      artistSearch: "",
      trackSearch: "",
      dateFrom: "",
      dateTo: "",
      minPlaytime: 0,
    })
  }

  const getStatusColor = (status: FileInfo["status"]) => {
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
  const isFiltered =
    filters.artistSearch || filters.trackSearch || filters.dateFrom || filters.dateTo || filters.minPlaytime > 0

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Upload className="h-5 w-5 text-[#1DB954]" />
            Importer vos données Spotify
          </CardTitle>
          <CardDescription className="text-gray-400">
            Glissez-déposez ou sélectionnez plusieurs fichiers JSON/CSV de votre historique Spotify
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
              isDragging
                ? "border-[#1DB954] bg-[#1DB954]/10"
                : "border-white/20 hover:border-[#1DB954]/50 hover:bg-white/5"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.csv"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-[#1DB954]/20 p-4">
                <Files className="h-8 w-8 text-[#1DB954]" />
              </div>
              <div>
                <p className="text-lg font-medium text-white">
                  {isDragging ? "Déposez vos fichiers ici" : "Glissez vos fichiers ou cliquez pour sélectionner"}
                </p>
                <p className="mt-1 text-sm text-gray-400">Sélection multiple supportée · Formats acceptés: JSON, CSV</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 rounded-lg bg-white/5 p-4">
            <h4 className="mb-2 font-medium text-white">Comment obtenir vos données Spotify ?</h4>
            <ol className="space-y-1 text-sm text-gray-400">
              <li>1. Rendez-vous sur privacy.spotify.com</li>
              <li>2. Connectez-vous et demandez vos données</li>
              <li>3. Attendez l'email avec le lien de téléchargement</li>
              <li>4. Importez les fichiers StreamingHistory*.json ou endsong*.json</li>
            </ol>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* File List */}
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

              <div className="max-h-48 space-y-2 overflow-y-auto">
                {files.map((fileInfo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-[#1DB954]" />
                      <div>
                        <p className="text-sm font-medium text-white">{fileInfo.name}</p>
                        <p className="text-xs text-gray-400">
                          {(fileInfo.size / 1024).toFixed(1)} KB
                          {fileInfo.recordCount && ` · ${fileInfo.recordCount} entrées`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-1 text-xs ${getStatusColor(fileInfo.status)}`}>
                        {getStatusText(fileInfo.status)}
                      </span>
                      {fileInfo.status === "pending" && (
                        <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-400">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      {fileInfo.status === "success" && <CheckCircle className="h-4 w-4 text-[#1DB954]" />}
                      {fileInfo.status === "error" && <AlertCircle className="h-4 w-4 text-red-400" />}
                    </div>
                  </div>
                ))}
              </div>

              {pendingCount > 0 && (
                <Button
                  onClick={processAllFiles}
                  disabled={isProcessing}
                  className="w-full bg-[#1DB954] text-black hover:bg-[#1ed760]"
                >
                  {isProcessing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
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
        </CardContent>
      </Card>

      {/* Results Section */}
      {displayStats && (
        <>
          {/* Filters */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader className="cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-[#1DB954]" />
                  Filtres avancés
                  {isFiltered && (
                    <span className="rounded-full bg-[#1DB954]/20 px-2 py-1 text-xs text-[#1DB954]">Actifs</span>
                  )}
                </div>
                {showFilters ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
            {showFilters && (
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">
                      <User className="mr-1 inline h-4 w-4" />
                      Artiste
                    </label>
                    <Input
                      placeholder="Rechercher un artiste..."
                      value={filters.artistSearch}
                      onChange={(e) => setFilters({ ...filters, artistSearch: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">
                      <Music className="mr-1 inline h-4 w-4" />
                      Titre
                    </label>
                    <Input
                      placeholder="Rechercher un titre..."
                      value={filters.trackSearch}
                      onChange={(e) => setFilters({ ...filters, trackSearch: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">
                      <Clock className="mr-1 inline h-4 w-4" />
                      Durée minimum (min)
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.minPlaytime || ""}
                      onChange={(e) => setFilters({ ...filters, minPlaytime: Number.parseInt(e.target.value) || 0 })}
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">
                      <Calendar className="mr-1 inline h-4 w-4" />
                      Date de début
                    </label>
                    <Input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">
                      <Calendar className="mr-1 inline h-4 w-4" />
                      Date de fin
                    </label>
                    <Input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="w-full border-white/10 text-white bg-transparent"
                    >
                      Réinitialiser
                    </Button>
                  </div>
                </div>
                {isFiltered && (
                  <p className="mt-4 text-sm text-gray-400">
                    {filteredData.length} écoutes correspondent aux filtres (sur {allRawData.length} total)
                  </p>
                )}
              </CardContent>
            )}
          </Card>

          {/* Stats Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent">
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

            <Card className="border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                  <Clock className="h-4 w-4" />
                  Minutes écoutées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#1DB954]">{displayStats.totalMinutes.toLocaleString()}</p>
                <p className="text-sm text-gray-400">{Math.round(displayStats.totalMinutes / 60)} heures</p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                  <TrendingUp className="h-4 w-4" />
                  Titres uniques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#1DB954]">{displayStats.uniqueTracks.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-gradient-to-br from-[#1DB954]/20 to-transparent">
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

          {/* Charts Section */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-5 w-5 text-[#1DB954]" />
                  Visualisations
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={activeChart === "area" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveChart("area")}
                    className={activeChart === "area" ? "bg-[#1DB954] text-black" : "border-white/10 text-white"}
                  >
                    Tendance
                  </Button>
                  <Button
                    variant={activeChart === "bar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveChart("bar")}
                    className={activeChart === "bar" ? "bg-[#1DB954] text-black" : "border-white/10 text-white"}
                  >
                    Par heure
                  </Button>
                  <Button
                    variant={activeChart === "pie" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveChart("pie")}
                    className={activeChart === "pie" ? "bg-[#1DB954] text-black" : "border-white/10 text-white"}
                  >
                    Par jour
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {activeChart === "area" && displayStats.monthlyData.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={displayStats.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                      <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="minutes"
                        stroke="#1DB954"
                        fill="url(#colorGradient)"
                        name="Minutes"
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1DB954" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#1DB954" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                )}

                {activeChart === "bar" && displayStats.hourlyData.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayStats.hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="hour" stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                      <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Bar dataKey="streams" fill="#1DB954" name="Écoutes" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {activeChart === "pie" && displayStats.weekdayData.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={displayStats.weekdayData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ day, percent }) => `${day} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="streams"
                        nameKey="day"
                      >
                        {displayStats.weekdayData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Heatmap */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="h-5 w-5 text-[#1DB954]" />
                Activité d'écoute (12 derniers mois)
              </CardTitle>
              <CardDescription className="text-gray-400">
                Visualisation de votre activité quotidienne style GitHub
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityHeatmap data={displayStats.dailyData} />
            </CardContent>
          </Card>

          {/* Top Tracks & Artists */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Music className="h-5 w-5 text-[#1DB954]" />
                  Top 10 Titres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {displayStats.topTracks.map((track, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1DB954]/20 text-sm font-bold text-[#1DB954]">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-white">{track.name}</p>
                          <p className="text-sm text-gray-400">{track.artist}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#1DB954]">{track.plays} écoutes</p>
                        <p className="text-xs text-gray-400">{track.minutes} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5 text-[#1DB954]" />
                  Top 10 Artistes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {displayStats.topArtists.map((artist, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1DB954]/20 text-sm font-bold text-[#1DB954]">
                          {index + 1}
                        </span>
                        <p className="font-medium text-white">{artist.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#1DB954]">{artist.plays} écoutes</p>
                        <p className="text-xs text-gray-400">{artist.minutes} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
