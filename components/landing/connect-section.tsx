"use client"

import { useState } from "react"
import { Link2, Check, Copy, Database, Globe, Zap, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const chainDetails = [
  { label: "Network Name", value: "ClawSwift Blockchain", icon: Database },
  { label: "Currency", value: "CLAW", icon: Zap },
  { label: "Chain ID", value: "7441", icon: Globe },
  { label: "HTTP URL", value: "https://exp.clawswift.net/rpc", icon: Link2, isLink: true },
  { label: "WebSocket URL", value: "wss://exp.clawswift.net/ws", icon: Link2 },
  { label: "Block Explorer", value: "https://exp.clawswift.net", icon: ExternalLink, isLink: true },
]

const CLAWSWIFT_CHAIN = {
  chainId: "0x1D11", // 7441 in hex
  chainName: "ClawSwift Blockchain",
  nativeCurrency: {
    name: "CLAW",
    symbol: "CLAW",
    decimals: 18,
  },
  rpcUrls: ["https://exp.clawswift.net/rpc"],
  blockExplorerUrls: ["https://exp.clawswift.net"],
}

export function ConnectSection() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)

  const handleCopy = (value: string, index: number) => {
    navigator.clipboard.writeText(value)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const addToMetaMask = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      alert("Please install MetaMask to add ClawSwift Blockchain")
      return
    }

    setIsAdding(true)
    try {
      await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [CLAWSWIFT_CHAIN],
      })
      setAddSuccess(true)
      setTimeout(() => setAddSuccess(false), 3000)
    } catch (error) {
      console.error("Failed to add chain:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <section id="connect" className="relative px-6 py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-claw-indigo/3 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-claw-indigo">
            Network
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Connect to the Clawswift
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Add ClawSwift Blockchain to your wallet and start building on the 
            agent-to-agent economy.
          </p>
        </div>

        {/* Chain Details Card */}
        <div className="mt-12 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            {chainDetails.map((detail, index) => (
              <div
                key={detail.label}
                className="group rounded-xl border border-border bg-secondary/50 p-4 transition-colors hover:border-claw-indigo/30"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-claw-indigo-subtle text-claw-indigo">
                    <detail.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground">{detail.label}</p>
                    <div className="mt-1 flex items-center gap-2">
                      {detail.isLink ? (
                        <a
                          href={detail.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-sm font-medium text-claw-indigo hover:underline"
                        >
                          {detail.value}
                        </a>
                      ) : (
                        <p className="truncate text-sm font-medium text-foreground">
                          {detail.value}
                        </p>
                      )}
                      <button
                        onClick={() => handleCopy(detail.value, index)}
                        className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={`Copy ${detail.label}`}
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add to MetaMask Button */}
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              onClick={addToMetaMask}
              disabled={isAdding}
              className="gap-2 bg-claw-indigo px-8 text-primary-foreground hover:bg-claw-indigo-dark"
            >
              {addSuccess ? (
                <>
                  <Check className="h-5 w-5" />
                  Added to MetaMask
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {isAdding ? "Adding..." : "Add to MetaMask"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
