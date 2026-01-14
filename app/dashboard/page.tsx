"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import YouTubePlayer from "@/components/youtube-player"
import SubmitSongForm from "@/components/submit-song-form"
import SongQueue from "@/components/song-queue"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Redirect } from "@/components/Redirect"
import { Footer } from "@/components/footer"

interface Song {
  id: string
  videoId: string
  title: string
  thumbnail: string
  votes: number
}

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [songs, setSongs] = useState<Song[]>([
    {
      id: "1",
      videoId: "dQw4w9WgXcQ",
      title: "Never Gonna Give You Up",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      votes: 12,
    },
    {
      id: "2",
      videoId: "9bZkp7q19f0",
      title: "PSY - GANGNAM STYLE",
      thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg",
      votes: 8,
    },
    {
      id: "3",
      videoId: "jNQXAC9IVRw",
      title: "Me at the zoo",
      thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg",
      votes: 5,
    },
  ])

  const [currentSongIndex, setCurrentSongIndex] = useState(0)

  const handleAddSong = (videoId: string, title: string) => {
    const newSong: Song = {
      id: Date.now().toString(),
      videoId,
      title,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      votes: 1,
    }
    setSongs([...songs, newSong])
  }

  const handleVote = (songId: string, direction: "up" | "down") => {
    setSongs(
      songs.map((song) =>
        song.id === songId ? { ...song, votes: Math.max(0, song.votes + (direction === "up" ? 1 : -1)) } : song,
      ),
    )
  }

  const handleRemoveSong = (songId: string) => {
    setSongs(songs.filter((song) => song.id !== songId))
  }

  const sortedSongs = [...songs].sort((a, b) => b.votes - a.votes)
  const currentSong = sortedSongs[0]

  return (
    <>
        <Navbar />
    <Redirect   />
    <main className="min-h-screen bg-background pt-20">
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-10">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Vote for the Next Song
            </h1>
            <p className="text-lg text-muted-foreground">Help decide what plays next on the stream</p>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Song Queue */}
          <div className="space-y-4 lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Song Queue</h2>
                <span className="bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full">
                  {sortedSongs.length} {sortedSongs.length === 1 ? 'song' : 'songs'}
                </span>
              </div>
              <SongQueue songs={sortedSongs} onVote={handleVote} onRemove={handleRemoveSong} />
            </div>
          </div>

          {/* Right Column - Player and Submit Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* YouTube Player */}
            {currentSong && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                  <h2 className="text-xl font-bold text-foreground">Now Playing</h2>
                </div>
                <YouTubePlayer videoId={currentSong.videoId} title={currentSong.title} />
              </div>
            )}

            {/* Submit Song Form */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-4">Submit a Song</h2>
              <SubmitSongForm onAddSong={handleAddSong} />
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
    </>
  )
}
