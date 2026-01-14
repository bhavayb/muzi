import { Button } from "@/components/ui/button"
import { Play, Users, Headphones } from "lucide-react"

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Live music, powered by your fans
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Let your fans pick the <span className="text-primary">soundtrack</span> to your stream
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Connect with your audience like never before. Let viewers vote on songs, request tracks, and shape the
              vibe of your live stream in real-time.
            </p>
          <div className="flex flex-col sm:flex-row gap-4">
              
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img
                      src={`/creator-avatar.png?height=40&width=40&query=creator avatar ${i}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold">2,000+</span>
                <span className="text-muted-foreground"> creators streaming</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto relative">
              <div className="absolute inset-0 bg-primary/5 rounded-3xl"></div>
              <div className="absolute inset-4 bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Live Queue</p>
                    <p className="text-xs text-muted-foreground">247 viewers voting</p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { title: "Midnight City", artist: "M83", votes: 142 },
                    { title: "Blinding Lights", artist: "The Weeknd", votes: 98 },
                    { title: "Electric Feel", artist: "MGMT", votes: 76 },
                  ].map((song, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{song.title}</p>
                        <p className="text-xs text-muted-foreground">{song.artist}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{song.votes}</span>
                        <span>votes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
