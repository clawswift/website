"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
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
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <Image 
            src="/lobster-logo-big.svg" 
            alt="Clawswift" 
            width={36} 
            height={36} 
            className="h-9 w-9"
          />
          <span className="text-xl font-bold tracking-tight text-foreground">
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
          <Button
            variant="ghost"
            className="text-sm text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            Read Docs
          </Button>
          <Button className="bg-claw-indigo text-primary-foreground hover:bg-claw-indigo-dark text-sm">
            Get Started
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="text-muted-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
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
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                Read Docs
              </Button>
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
