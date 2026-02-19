import { QueryClient } from '@tanstack/react-query'
import { http, createConfig } from 'wagmi'
import { KeyManager, webAuthn } from 'wagmi/tempo'

const CLAWSWIFT_RPC = 'https://exp.clawswift.net/rpc'
const KEY_MANAGER_URL = 'https://key-manager.tokenine.workers.dev'

// ClawSwift Blockchain configuration (Chain ID: 7441)
export const clawswiftChain = {
  id: 7441,
  name: 'ClawSwift Blockchain',
  nativeCurrency: { name: 'CLAW', symbol: 'CLAW', decimals: 18 },
  rpcUrls: {
    default: { http: [CLAWSWIFT_RPC] },
  },
  blockExplorers: {
    default: { name: 'ClawSwift Explorer', url: 'https://exp.clawswift.net' },
  },
  testnet: true,
} as const

export const queryClient = new QueryClient()

export const config = createConfig({
  // Disable SSR for proper Next.js hydration
  ssr: true,
  // Disable auto-discovery of injected providers
  multiInjectedProviderDiscovery: false,
  connectors: [
    webAuthn({
      keyManager: KeyManager.http(KEY_MANAGER_URL),
      // Force platform authenticator (Touch ID/Face ID) - no QR code
      createOptions: {
        // @ts-expect-error - authenticatorSelection is supported at runtime
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
      },
    }),
  ],
  chains: [clawswiftChain],
  transports: {
    [clawswiftChain.id]: http(CLAWSWIFT_RPC),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
