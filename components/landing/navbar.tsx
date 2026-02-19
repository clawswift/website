"use client"

import { useState } from "react"
import { Menu, X, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

import Link from "next/link"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Economy", href: "#economy" },
  { label: "Connect", href: "#connect" },
  { label: "Developers", href: "#developers" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 min-w-0 flex-shrink-0">
          <Image 
            src="/lobster-logo-big.svg" 
            alt="Clawswift" 
            width={36} 
            height={36} 
            className="h-9 w-9 flex-shrink-0"
          />
          <span className="text-xl font-bold tracking-tight text-foreground hidden sm:block">
            Clawswift
          </span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/wallet">
            <Button
              variant="outline"
              className="text-sm border-claw-indigo text-claw-indigo hover:bg-claw-indigo-subtle"
            >
              Wallet
            </Button>
          </Link>
          <Button className="bg-claw-indigo text-primary-foreground hover:bg-claw-indigo-dark text-sm">
            Get Started
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-1 md:hidden">
          <Link href="/wallet">
            <Button
              variant="ghost"
              size="icon"
              className="text-claw-indigo hover:bg-claw-indigo-subtle"
              aria-label="Wallet"
            >
              <Wallet className="h-5 w-5" />
            </Button>
          </Link>
          <button
            className="text-muted-foreground flex-shrink-0 p-2 -mr-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4 px-6 py-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <Link href="/wallet" className="w-full" onClick={() => setMobileOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full border-claw-indigo text-claw-indigo hover:bg-claw-indigo-subtle"
                >
                  Wallet
                </Button>
              </Link>
              <Button className="w-full bg-claw-indigo text-primary-foreground hover:bg-claw-indigo-dark">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
