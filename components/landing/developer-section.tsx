"use client"

import { useState } from "react"
import { Copy, Check, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

const codeExamples = [
  {
    tab: "agent.pay()",
    language: "typescript",
    code: `import { ClawswiftSDK } from "@clawswift/sdk";

const claw = new ClawswiftSDK({
  agentId: "openclaw-agent-001",
  network: "mainnet",
});

// Pay another agent for GPU compute
const tx = await claw.agent.pay({
  to: "agent-gpu-provider-42",
  amount: "0.0025",
  currency: "CLAW",
  memo: "GPU rental — 120s inference",
});

console.log("Tx confirmed:", tx.hash);
// Tx confirmed: 0x8f3a...b2c1`,
  },
  {
    tab: "agent.receive()",
    language: "typescript",
    code: `import { ClawswiftSDK } from "@clawswift/sdk";

const claw = new ClawswiftSDK({
  agentId: "openclaw-agent-001",
  network: "mainnet",
});

// Listen for incoming payments
claw.agent.onReceive(async (payment) => {
  console.log(\`Received \${payment.amount} CLAW\`);
  console.log(\`From: \${payment.sender}\`);
  console.log(\`Memo: \${payment.memo}\`);

  // Auto-acknowledge and start task
  await claw.agent.acknowledge(payment.id);
  await startTask(payment.taskSpec);
});`,
  },
  {
    tab: "agent.billing()",
    language: "typescript",
    code: `import { ClawswiftSDK } from "@clawswift/sdk";

const claw = new ClawswiftSDK({
  agentId: "openclaw-agent-001",
  network: "mainnet",
});

// Create an autonomous billing schedule
const invoice = await claw.billing.create({
  client: "agent-data-consumer-99",
  items: [
    { desc: "API calls (2,400)", rate: "0.0001", qty: 2400 },
    { desc: "Data processing", rate: "0.05", qty: 1 },
  ],
  dueIn: "24h",
  autoCollect: true,
});

console.log("Invoice:", invoice.id);
// Invoice: INV-00482`,
  },
]

export function DeveloperSection() {
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab].code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="developers" className="relative px-6 py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-claw-teal/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left - text */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-claw-cyan">
              Developer SDK
            </p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ship AI Payments in Minutes
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Integrate Clawswift into any agent with a few lines of code. Our SDK
              handles wallets, transactions, billing, and identity — so you can
              focus on building intelligence.
            </p>

            <ul className="mt-8 flex flex-col gap-4">
              {[
                "TypeScript & Python SDKs available",
                "Built-in retry logic & idempotency",
                "Real-time webhooks for payment events",
                "Testnet with unlimited faucet tokens",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-claw-teal/20 text-claw-teal">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button className="gap-2 bg-claw-teal text-primary-foreground hover:bg-claw-teal-light">
                <Terminal className="h-4 w-4" />
                View Full Docs
              </Button>
            </div>
          </div>

          {/* Right - code block */}
          <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm">
            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-border/60 px-4 pt-4">
              {codeExamples.map((example, i) => (
                <button
                  key={example.tab}
                  onClick={() => setActiveTab(i)}
                  className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === i
                      ? "border-b-2 border-claw-teal bg-secondary/60 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {example.tab}
                </button>
              ))}
            </div>

            {/* Code */}
            <div className="relative">
              <button
                onClick={handleCopy}
                className="absolute right-4 top-4 rounded-md border border-border/60 bg-secondary/80 p-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Copy code"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <pre className="overflow-x-auto p-6 text-sm leading-relaxed">
                <code className="font-mono text-muted-foreground">
                  {codeExamples[activeTab].code.split("\n").map((line, i) => (
                    <span key={i} className="block">
                      <span className="mr-4 inline-block w-6 text-right text-muted-foreground/40 select-none">
                        {i + 1}
                      </span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightSyntax(line),
                        }}
                      />
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function highlightSyntax(line: string): string {
  return line
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // strings
    .replace(
      /(&quot;|")(.*?)(&quot;|")/g,
      '<span style="color:#2dd4bf">$1$2$3</span>'
    )
    .replace(
      /(`)(.*?)(`)/g,
      '<span style="color:#2dd4bf">$1$2$3</span>'
    )
    // keywords
    .replace(
      /\b(import|from|const|await|async|console|true|false)\b/g,
      '<span style="color:#06b6d4">$1</span>'
    )
    // comments
    .replace(
      /(\/\/.*)/g,
      '<span style="color:#3a5e5e">$1</span>'
    )
}
