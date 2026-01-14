"use client"

import { useEffect, useState } from "react"
import YouTubePlayer from "@/components/youtube-player"
import SubmitSongForm from "@/components/submit-song-form"
import SongQueue from "@/components/song-queue"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import ShareButton from "@/components/share-button"
import { useSession, signIn } from "next-auth/react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Song {
  id: string
  videoId: string
  title: string
  thumbnail: string
  votes: number
  haveUpvoted: boolean
}

const REFRESH_INTERVAL_MS = 10 * 1000 * 1000; // 10 seconds

export default function CreatorStreamPage() {
  const session = useSession()
  const params = useParams()
  const creatorId = params.creatorId as string
  
  const [songs, setSongs] = useState<Song[]>([])
  const [isCreator, setIsCreator] = useState(false)
  const [showAddSongMessage, setShowAddSongMessage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)

  async function refreshStreams() {
    try {
      const res = await fetch(`/api/streams/creator/${creatorId}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.error && !data.error.includes("Unauthorized")) {
        console.error("Error from API:", data.error);
        setLoading(false);
        return;
      }

      if (data.streams) {
        const formattedSongs: Song[] = data.streams.map((stream: {
          id: string;
          extractedId: string;
          title: string;
          bigImg: string;
          smallImg: string;
          upvotesCount: number;
          haveUpvoted: boolean;
        }) => ({
          id: stream.id,
          videoId: stream.extractedId,
          title: stream.title,
          thumbnail: stream.bigImg || stream.smallImg,
          votes: stream.upvotesCount || 0,
          haveUpvoted: stream.haveUpvoted,
        }));
        setSongs(formattedSongs);
        setIsCreator(data.isCreator || false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching streams:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(() => {
      refreshStreams();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatorId])

  // Reset to first song when queue changes significantly
  useEffect(() => {
    if (songs.length > 0 && currentSongIndex >= songs.length) {
      setCurrentSongIndex(0);
    }
  }, [songs.length, currentSongIndex])

  const handleAddSong = async (url: string) => {
    if (!isCreator) {
      setShowAddSongMessage(true);
      setTimeout(() => setShowAddSongMessage(false), 3000);
      return;
    }

    try {
      if (!session.data?.user?.email) {
        alert("Please sign in to add songs");
        return;
      }

      const response = await fetch('/api/streams/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          url: url,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Stream created successfully:", result);
        await refreshStreams();
      } else {
        console.error("Error creating stream:", result);
        alert(result.error || "Failed to add song");
      }
    } catch (error) {
      console.error("Error adding song:", error);
      alert("Failed to add song. Please try again.");
    }
  }

  const handleVote = async (songId: string) => {
    const song = songs.find(s => s.id === songId);
    if (!song) return;

    try {
      if (song.haveUpvoted) {
        const response = await fetch('/api/streams/downvote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            streamId: songId,
          }),
        });

        if (response.ok) {
          setSongs(songs.map(s =>
            s.id === songId
              ? { ...s, votes: Math.max(0, s.votes - 1), haveUpvoted: false }
              : s
          ));
        }
      } else {
        const response = await fetch('/api/streams/upvote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            streamId: songId,
          }),
        });

        if (response.ok) {
          setSongs(songs.map(s =>
            s.id === songId
              ? { ...s, votes: s.votes + 1, haveUpvoted: true }
              : s
          ));
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  }

  const handleRemoveSong = async (songId: string) => {
    if (!isCreator) {
      alert("Only the stream creator can remove songs");
      return;
    }

    const song = songs.find(s => s.id === songId);
    if (!song) return;

    // Show confirmation dialog
    const confirmed = window.confirm(`Are you sure you want to remove "${song.title}" from the queue?`);
    
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch('/api/streams/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          streamId: songId,
        }),
      });

      if (response.ok) {
        // Remove from local state
        setSongs(songs.filter((s) => s.id !== songId));
        
        // Adjust current song index if needed
        if (currentSongIndex >= songs.length - 1) {
          setCurrentSongIndex(Math.max(0, songs.length - 2));
        }
      } else {
        const result = await response.json();
        alert(result.error || "Failed to remove song");
      }
    } catch (error) {
      console.error("Error removing song:", error);
      alert("Failed to remove song. Please try again.");
    }
  }

  const handleSongEnded = () => {
    // Move to next song when current song ends
    const nextIndex = currentSongIndex + 1
    if (nextIndex < sortedSongs.length) {
      setCurrentSongIndex(nextIndex)
    } else {
      // Loop back to first song if at the end
      setCurrentSongIndex(0)
    }
  }

  const sortedSongs = [...songs].sort((a, b) => b.votes - a.votes)
  const currentSong = sortedSongs[currentSongIndex]

  // Show loading state
  if (loading || session.status === "loading") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading stream...</p>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      
      {/* Login Dialog for Unauthenticated Users */}
      {session.status === "unauthenticated" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Login Required</h2>
                <p className="text-muted-foreground mb-6">
                  Please sign in to listen to your streamer and vote for songs!
                </p>
              </div>
              
              <Button 
                onClick={() => signIn("google")}
                className="w-full mb-3 text-lg py-6"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </Button>
              
              <p className="text-xs text-muted-foreground">
                By signing in, you can vote on songs and interact with the stream
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Header */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Vote for the Next Song
                </h1>
                <p className="text-lg text-muted-foreground">
                  {isCreator ? "Manage your stream and let fans vote!" : "Help decide what plays next on the stream"}
                </p>
                {!isCreator && (
                  <p className="text-sm text-muted-foreground mt-2">
                    🎵 You&apos;re viewing someone else&apos;s stream. You can vote but cannot add songs.
                  </p>
                )}
              </div>
              <div className="flex justify-center md:justify-end">
                <ShareButton />
              </div>
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
                <SongQueue 
                  songs={sortedSongs} 
                  onVote={handleVote} 
                  onRemove={handleRemoveSong}
                  isCreator={isCreator}
                />
              </div>
            </div>

            {/* Right Column - Player and Submit Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* YouTube Player */}
              {currentSong && (
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                      <h2 className="text-xl font-bold text-foreground">Now Playing</h2>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentSongIndex + 1} of {sortedSongs.length}
                    </div>
                  </div>
                  <YouTubePlayer 
                    videoId={currentSong.videoId} 
                    title={currentSong.title}
                    onEnded={handleSongEnded}
                    autoplay={currentSongIndex > 0}
                  />
                  
                  {/* Song Navigation Controls */}
                  {sortedSongs.length > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentSongIndex(Math.max(0, currentSongIndex - 1))}
                        disabled={currentSongIndex === 0}
                        className="gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentSongIndex(Math.min(sortedSongs.length - 1, currentSongIndex + 1))}
                        disabled={currentSongIndex === sortedSongs.length - 1}
                        className="gap-2"
                      >
                        Next
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Song Form */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm relative">
                <h2 className="text-xl font-bold text-foreground mb-4">Submit a Song</h2>
                
                {/* Message overlay for non-creators */}
                {showAddSongMessage && (
                  <div className="absolute inset-0 bg-card/95 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                    <div className="bg-destructive/10 border border-destructive text-destructive px-6 py-4 rounded-lg text-center">
                      <p className="font-semibold">⚠️ Cannot Add Songs</p>
                      <p className="text-sm mt-1">Only the stream creator can add songs</p>
                    </div>
                  </div>
                )}

                {isCreator ? (
                  <SubmitSongForm onAddSong={handleAddSong} />
                ) : (
                  <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
                    <p className="text-muted-foreground">
                      🔒 Only the stream creator can add songs to this queue.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      You can vote on existing songs!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
