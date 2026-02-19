import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'Clawswift - The Financial Layer for Autonomous AI Agents',
  description:
    'Empowering OpenClaw to send and receive value instantly. The first blockchain payment infrastructure built for the agent-to-agent economy.',
  keywords: ['blockchain', 'AI agents', 'payments', 'OpenClaw', 'Web3', 'fintech', 'autonomous economy'],
  openGraph: {
    title: 'Clawswift - Beyond Talk, Swift Action.',
    description: 'The first blockchain payment infrastructure built for the agent-to-agent economy.',
    siteName: 'Clawswift',
    type: 'website',
    url: 'https://clawswift.net',
  },
}

export const viewport: Viewport = {
  themeColor: '#06060e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
