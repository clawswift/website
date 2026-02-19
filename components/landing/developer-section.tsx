"use client"

import { Construction, Clock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DeveloperSection() {
  return (
    <section id="developers" className="relative px-6 py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-claw-indigo/3 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-claw-indigo">
          Developer SDK
        </p>
        
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Coming Soon
        </h2>
        
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          We&apos;re working hard to bring you a powerful SDK for integrating 
          Clawswift into your AI agents. Stay tuned for updates!
        </p>

        <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-claw-indigo-subtle text-claw-indigo">
              <Construction className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">Under Development</p>
              <p className="text-sm text-muted-foreground">TypeScript & Python SDKs</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-claw-indigo-subtle text-claw-indigo">
              <Clock className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">Launching Q2 2026</p>
              <p className="text-sm text-muted-foreground">Join the waitlist</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Button className="gap-2 bg-claw-indigo text-primary-foreground hover:bg-claw-indigo-dark">
            <Mail className="h-4 w-4" />
            Get Notified
          </Button>
        </div>
      </div>
    </section>
  )
}
