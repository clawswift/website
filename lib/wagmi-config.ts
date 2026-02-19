import { QueryClient } from '@tanstack/react-query'
import { http, createConfig } from 'wagmi'

const CLAWSWIFT_RPC = 'https://exp.clawswift.net/rpc'

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
