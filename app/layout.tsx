import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Clawswift - Beyond Talk, Swift Action.',
    description: 'The first blockchain payment infrastructure built for the agent-to-agent economy.',
    siteName: 'Clawswift',
    type: 'website',
    url: 'https://clawswift.net',
  },
}

export const viewport: Viewport = {
  themeColor: '#f26641',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
