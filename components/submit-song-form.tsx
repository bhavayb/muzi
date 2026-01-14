"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SubmitSongFormProps {
  onAddSong: (url: string) => Promise<void>
}

export default function SubmitSongForm({ onAddSong }: SubmitSongFormProps) {
  const [url, setUrl] = useState("")
  const [preview, setPreview] = useState<{ videoId: string; title: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const extractVideoId = (youtubeUrl: string) => {
    const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/, /^([a-zA-Z0-9_-]{11})$/]

    for (const pattern of patterns) {
      const match = youtubeUrl.match(pattern)
      if (match) {
        return match[1]
      }
    }
    return null
  }

  const handleUrlChange = async (value: string) => {
    setUrl(value)
    setError("")
    setPreview(null)

    if (!value.trim()) return

    const videoId = extractVideoId(value)
    if (!videoId) {
      setError("Invalid YouTube URL")
      return
    }

    setLoading(true)
    try {
      // Fetch video metadata from YouTube
      const response = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      )

      if (!response.ok) {
        setError("Video not found")
        setLoading(false)
        return
      }

      const data = await response.json()
      setPreview({
        videoId,
        title: data.title,
      })
    } catch {
      setError("Could not load video preview")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!preview) {
      setError("Please enter a valid YouTube URL")
      return
    }

    setLoading(true)
    try {
      // Pass the full YouTube URL to onAddSong
      const fullUrl = `https://www.youtube.com/watch?v=${preview.videoId}`;
      await onAddSong(fullUrl)
      setUrl("")
      setPreview(null)
    } catch (e) {
      console.error("Error adding song:", e);
      setError("Failed to add song")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 bg-card p-4 rounded-lg border border-border">
      <div className="space-y-2">
        <label htmlFor="youtube-url" className="text-sm font-medium text-foreground">
          YouTube Link
        </label>
        <Input
          id="youtube-url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="bg-background"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {/* Preview */}
      {preview && (
        <div className="space-y-2">
          <div className="relative w-full pb-[56.25%] bg-black rounded overflow-hidden">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${preview.videoId}?autoplay=0`}
              title={preview.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div>
            <p className="text-sm text-foreground font-medium line-clamp-2">{preview.title}</p>
          </div>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!preview || loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {loading ? "Loading..." : "Add to Queue"}
      </Button>
    </div>
  )
}
