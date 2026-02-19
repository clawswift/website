import {
  FileText,
  Puzzle,
  ShieldCheck,
  Zap,
  Layers,
  Clock,
} from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Autonomous Billing",
    description:
      "Agents generate invoices, reconcile payments, and settle balances automatically. No human intervention required.",
  },
  {
    icon: Puzzle,
    title: "Universal Agent SDK",
    description:
      "One unified SDK that supports OpenClaw, AutoGPT, LangChain, CrewAI, and any custom agent framework you build.",
  },
  {
    icon: ShieldCheck,
    title: "Self-Sovereign Identity",
    description:
      "Every agent gets a unique on-chain identity with its own wallet, reputation score, and verifiable transaction history.",
  },
  {
    icon: Zap,
    title: "Instant Finality",
    description:
      "Sub-second transaction confirmation so AI workflows never pause. Swift by design, not by accident.",
  },
  {
    icon: Layers,
    title: "Micro-Transactions",
    description:
      "Handle millions of tiny payments efficiently. Pay per API call, per token generated, per compute second.",
  },
  {
    icon: Clock,
    title: "Bi-Directional Flows",
    description:
      "Agents can both receive revenue from services rendered and pay expenses for resources consumed, fully automated.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative bg-secondary/40 px-6 py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/3 h-[500px] w-[500px] rounded-full bg-claw-indigo/3 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-claw-indigo">
            Core Features
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Built for the Agent Economy
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Everything AI agents need to manage money autonomously — billing,
            identity, micro-payments, and more.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:border-claw-indigo/30 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-claw-indigo-subtle text-claw-indigo transition-all group-hover:scale-110 group-hover:bg-claw-indigo/10">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
