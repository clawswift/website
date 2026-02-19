import { createConnector } from 'wagmi'
import { http, createPublicClient, toHex, Address, custom } from 'viem'
import { clawswiftChain } from './wagmi-config'

// Storage keys
const STORAGE_KEY = 'clawswift_passkey_wallet'

// Types
interface PasskeyWallet {
  credentialId: string
  address: Address
  createdAt: number
}

// Check if we're in browser
const isBrowser = typeof window !== 'undefined'

// Generate deterministic address from credential ID
function generateAddress(credentialId: string): Address {
  // Simple hash function for demo - in production use proper key derivation
  let hash = 0
  for (let i = 0; i < credentialId.length; i++) {
    const char = credentialId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  
  // Create 20-byte address
  const hex = Math.abs(hash).toString(16).padStart(40, '0')
  return `0x${hex}` as Address
}

// Register new passkey
async function registerPasskey(): Promise<PasskeyWallet> {
  if (!isBrowser) throw new Error('Passkey only works in browser')
  
  const challenge = crypto.getRandomValues(new Uint8Array(32))
  
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: {
        name: 'Clawswift Wallet',
        id: window.location.hostname,
      },
      user: {
        id: crypto.getRandomValues(new Uint8Array(16)),
        name: 'Clawswift User',
        displayName: 'Clawswift User',
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 }, // ES256
        { type: 'public-key', alg: -257 }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
      },
      attestation: 'none',
    },
  }) as PublicKeyCredential | null

  if (!credential) {
    throw new Error('Passkey creation was cancelled')
  }

  // Convert rawId to base64 string for storage
  const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
  const address = generateAddress(credentialId)
  
  const wallet: PasskeyWallet = {
    credentialId,
    address,
    createdAt: Date.now(),
  }
  
  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet))
  
  return wallet
}

// Authenticate with existing passkey
async function authenticatePasskey(): Promise<PasskeyWallet> {
  if (!isBrowser) throw new Error('Passkey only works in browser')
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    throw new Error('No wallet found. Please create a wallet first.')
  }
  
  const wallet: PasskeyWallet = JSON.parse(stored)
  const challenge = crypto.getRandomValues(new Uint8Array(32))
  
  // Convert base64 credentialId back to ArrayBuffer
  const credentialIdBytes = Uint8Array.from(atob(wallet.credentialId), c => c.charCodeAt(0))
  
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge,
      allowCredentials: [
        {
          id: credentialIdBytes.buffer,
          type: 'public-key',
        },
      ],
      userVerification: 'required',
    },
  }) as PublicKeyCredential | null

  if (!assertion) {
    throw new Error('Authentication was cancelled')
  }
  
  return wallet
}

// Get stored wallet without authentication (for checking if exists)
function getStoredWallet(): PasskeyWallet | null {
  if (!isBrowser) return null
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

// Clear wallet data
function clearWallet(): void {
  if (!isBrowser) return
  localStorage.removeItem(STORAGE_KEY)
}

// Check if wallet exists
function hasWallet(): boolean {
  if (!isBrowser) return false
  return !!getStoredWallet()
}

// Create the custom connector
export function clawswiftPasskeyConnector() {
  return createConnector((config) => ({
    id: 'clawswiftPasskey',
    name: 'Clawswift Passkey',
    type: 'clawswiftPasskey',
    
    async setup() {
      // Setup if needed
    },
    
    async connect({ chainId } = {}) {
      // Try to authenticate with existing passkey, or create new one
      let wallet: PasskeyWallet
      
      if (hasWallet()) {
        try {
          wallet = await authenticatePasskey()
        } catch (error) {
          // If authentication fails, try to create new wallet
          wallet = await registerPasskey()
        }
      } else {
        wallet = await registerPasskey()
      }
      
      // Return the connection result
      return {
        accounts: [wallet.address],
        chainId: chainId || clawswiftChain.id,
      }
    },
    
    async disconnect() {
      clearWallet()
    },
    
    async getAccounts() {
      const wallet = getStoredWallet()
      if (!wallet) return []
      return [wallet.address]
    },
    
    async getChainId() {
      return clawswiftChain.id
    },
    
    async isAuthorized() {
      return hasWallet()
    },
    
    async switchChain({ chainId }) {
      // Only support Clawswift chain
      if (chainId !== clawswiftChain.id) {
        throw new Error('Only Clawswift chain is supported')
      }
      return clawswiftChain
    },
    
    async getProvider({ chainId } = {}) {
      // Return a mock provider for read operations
      const publicClient = createPublicClient({
        chain: clawswiftChain,
        transport: http(),
      })
      return publicClient as any
    },
    
    onAccountsChanged(accounts) {
      // Passkey accounts don't change without re-authentication
    },
    
    onChainChanged(chainId) {
      // Only support one chain
    },
    
    onDisconnect() {
      // Handle disconnect
    },
    
    onMessage(message) {
      // Handle messages
    },
  }))
}

// Export utility functions
export { hasWallet, getStoredWallet, clearWallet, registerPasskey, authenticatePasskey }
