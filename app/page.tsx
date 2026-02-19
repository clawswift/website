import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { EconomySection } from "@/components/landing/economy-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { DeveloperSection } from "@/components/landing/developer-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <EconomySection />
      <FeaturesSection />
      <DeveloperSection />
      <CTASection />
      <Footer />
    </main>
  )
}
