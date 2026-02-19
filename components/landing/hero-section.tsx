"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 sm:px-6 pt-20">
      {/* Background grid + glow */}
      <div className="pointer-events-none absolute inset-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial glow */}
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-claw-indigo/5 blur-[120px]" />
        <div className="absolute top-2/3 left-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-claw-indigo-light/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-claw-indigo/20 bg-claw-indigo-subtle px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-claw-indigo animate-pulse" />
          <span className="text-sm font-medium text-claw-indigo">
            Beyond Talk, Swift Action.
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          The Financial Layer for{" "}
          <span className="bg-gradient-to-r from-claw-indigo via-claw-indigo-light to-claw-indigo bg-clip-text text-transparent">
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
            className="gap-2 bg-claw-indigo px-8 text-primary-foreground hover:bg-claw-indigo-dark w-full sm:w-auto"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
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
