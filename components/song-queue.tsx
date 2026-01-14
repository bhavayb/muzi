"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import Image from "next/image"

interface Song {
  id: string
  videoId: string
  title: string
  thumbnail: string
  votes: number
  haveUpvoted: boolean
}

interface SongQueueProps {
  songs: Song[]
  onVote: (songId: string) => void
  onRemove: (songId: string) => void
  isCreator?: boolean
}

export default function SongQueue({ songs, onVote, onRemove, isCreator = true }: SongQueueProps) {
  return (
    <div className="space-y-3 bg-card border border-border rounded-lg p-4 max-h-150 overflow-y-auto">
      {songs.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No songs in queue yet</p>
      ) : (
        songs.map((song, index) => (
          <div
            key={song.id}
            className="flex gap-3 p-3 bg-secondary rounded-lg border border-border hover:border-primary/50 transition-colors"
          >
            {/* Thumbnail */}
            <div className="relative w-12 h-12 rounded overflow-hidden shrink-0 bg-muted">
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
                  onClick={() => onVote(song.id)}
                  className={`h-6 px-2 text-xs gap-1 transition-colors ${
                    song.haveUpvoted 
                      ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                      : 'hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {song.haveUpvoted ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                  <span>{song.votes}</span>
                </Button>
              </div>
            </div>

            {/* Remove Button - Only for creators */}
            {isCreator && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemove(song.id)}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))
      )}
    </div>
  )
}
