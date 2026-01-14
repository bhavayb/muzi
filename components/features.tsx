import { Vote, Music, Zap, Shield, BarChart3, Radio } from "lucide-react"

const features = [
  {
    icon: Vote,
    title: "Real-time Voting",
    description: "Fans vote on which songs play next, creating a truly interactive experience",
  },
  {
    icon: Music,
    title: "Vast Music Library",
    description: "Access millions of licensed tracks from all genres and eras",
  },
  {
    icon: Zap,
    title: "Instant Integration",
    description: "Connect to Twitch, YouTube, or Kick in minutes with our simple setup",
  },
  {
    icon: Shield,
    title: "DMCA Safe",
    description: "All tracks are fully licensed for streaming, so you're always protected",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track engagement, popular songs, and viewer activity in real-time",
  },
  {
    icon: Radio,
    title: "Custom Playlists",
    description: "Curate the vibe with approved song lists your fans can vote from",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to engage</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to create unforgettable streaming experiences
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="p-6 rounded-xl bg-card border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
