"use client"

import { useEffect, useRef } from "react"

interface YouTubePlayerProps {
  videoId: string
  title: string
  onEnded?: () => void
  autoplay?: boolean
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export default function YouTubePlayer({ videoId, title, onEnded, autoplay = false }: YouTubePlayerProps) {
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    // Initialize player when API is ready
    const initPlayer = () => {
      if (window.YT && containerRef.current) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId: videoId,
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onStateChange: (event: any) => {
              // YT.PlayerState.ENDED = 0
              if (event.data === 0 && onEnded) {
                onEnded()
              }
            },
          },
        })
      }
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy()
      }
    }
  }, [videoId, onEnded, autoplay])

  return (
    <div className="space-y-4">
      <div className="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Currently Playing</p>
        <h3 className="text-xl font-semibold text-foreground line-clamp-2">{title}</h3>
      </div>
    </div>
  )
}
