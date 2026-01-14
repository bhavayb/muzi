import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your streams?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Join thousands of creators who&apos;ve turned their streams into interactive music experiences. Start free, no
          credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="gap-2">
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            Talk to Sales
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-6">Free for streamers under 100 concurrent viewers</p>
      </div>
    </section>
  )
}
