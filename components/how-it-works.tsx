import { ArrowRight } from "lucide-react"

const steps = [
  {
    step: "01",
    title: "Connect Your Stream",
    description: "Link Muzi to your Twitch, YouTube, or Kick channel with one click",
  },
  {
    step: "02",
    title: "Set Up Your Queue",
    description: "Create playlists or let fans suggest from our full licensed library",
  },
  {
    step: "03",
    title: "Go Live",
    description: "Start streaming and watch your fans interact through song requests and votes",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Get started in minutes, not hours</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="text-6xl font-bold text-primary/10 mb-4">{step.step}</div>
              <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute top-8 -right-4 h-6 w-6 text-muted-foreground/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
