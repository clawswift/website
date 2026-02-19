import type { Metadata } from 'next'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'Clawswift Wallet - Web3 Wallet with Passkey',
  description:
    'Secure, passwordless wallet using biometric authentication. Create and manage your CLAW tokens with just your fingerprint or Face ID.',
  keywords: ['wallet', 'web3', 'passkey', 'clawswift', 'blockchain', 'crypto'],
}

export default function WalletLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      {children}
    </Providers>
  )
}
