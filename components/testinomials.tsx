import { Star } from "lucide-react"

const testimonials = [
  {
    quote: "StreamTune completely changed how I interact with my chat. The energy when fans pick the music is unreal.",
    author: "Alex Chen",
    role: "Twitch Partner, 50k followers",
    avatar: "/streamer-alex.jpg",
  },
  {
    quote: "Finally, a music solution that's DMCA-safe AND keeps my viewers engaged. Game changer for my streams.",
    author: "Sarah Martinez",
    role: "YouTube Gaming Creator",
    avatar: "/streamer-sarah.jpg",
  },
  {
    quote: "My subscriber count jumped 30% in the first month. Viewers love having control over the playlist.",
    author: "Mike Thompson",
    role: "Kick Streamer",
    avatar: "/streamer-mike.jpg",
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by creators</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">See what streamers are saying about StreamTune</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="p-6 rounded-xl bg-card border border-border">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-sm">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
