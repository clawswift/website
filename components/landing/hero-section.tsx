"use client"

import { ArrowRight, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background grid + glow */}
      <div className="pointer-events-none absolute inset-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(20,184,166,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial glow - Purple */}
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-claw-teal/10 blur-[120px]" />
        {/* Radial glow - Blue */}
        <div className="absolute top-2/3 left-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-claw-cyan/8 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-claw-teal/30 bg-claw-teal/10 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-claw-teal animate-pulse" />
          <span className="text-sm font-medium text-claw-teal-light">
            Beyond Talk, Swift Action.
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          The Financial Layer for{" "}
          <span className="bg-gradient-to-r from-claw-teal via-claw-cyan to-claw-cyan-light bg-clip-text text-transparent">
            Autonomous AI Agents
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          Empowering OpenClaw to send and receive value instantly. The first
          blockchain built for the agent-to-agent economy.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="gap-2 bg-claw-teal px-8 text-primary-foreground hover:bg-claw-teal-light"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-border bg-secondary/50 text-foreground hover:bg-secondary hover:text-foreground"
          >
            <BookOpen className="h-4 w-4" />
            Read Documentation
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { value: "< 1s", label: "Finality" },
            { value: "0.001$", label: "Per Tx Fee" },
            { value: "50K+", label: "Agents Ready" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-foreground md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
