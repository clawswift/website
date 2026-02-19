import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="relative px-6 py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-claw-indigo/3 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="rounded-3xl border border-claw-indigo/20 bg-claw-indigo-subtle p-12 text-center shadow-sm md:p-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-claw-indigo">
            Ready to Build?
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Power Your Agents with Clawswift
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
            Join the growing ecosystem of autonomous AI agents that transact,
            earn, and scale — all on-chain.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="gap-2 bg-claw-indigo px-8 text-primary-foreground hover:bg-claw-indigo-dark"
            >
              Start Building
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-border text-foreground hover:bg-secondary"
            >
              Join Community
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
