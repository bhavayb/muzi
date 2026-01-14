"use client"

import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, X } from "lucide-react"
import Image from "next/image"

interface Song {
  id: string
  videoId: string
  title: string
  thumbnail: string
  votes: number
}

interface SongQueueProps {
  songs: Song[]
  onVote: (songId: string, direction: "up" | "down") => void
  onRemove: (songId: string) => void
}

export default function SongQueue({ songs, onVote, onRemove }: SongQueueProps) {
  return (
    <div className="space-y-3 bg-card border border-border rounded-lg p-4 max-h-[600px] overflow-y-auto">
      {songs.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No songs in queue yet</p>
      ) : (
        songs.map((song, index) => (
          <div
            key={song.id}
            className="flex gap-3 p-3 bg-secondary rounded-lg border border-border hover:border-primary/50 transition-colors"
          >
            {/* Thumbnail */}
            <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-muted">
              <Image src={song.thumbnail || "/placeholder.svg"} alt={song.title} fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground line-clamp-2">{song.title}</p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onVote(song.id, "up")}
                  className="h-6 px-2 text-xs gap-1 hover:bg-primary/10 hover:text-primary"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{song.votes}</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onVote(song.id, "down")}
                  className="h-6 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
                >
                  <ThumbsDown className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Remove Button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemove(song.id)}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))
      )}
    </div>
  )
}
