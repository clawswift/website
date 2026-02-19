import { createConnector } from 'wagmi'
import { http, createPublicClient, custom, toHex } from 'viem'
import { clawswiftChain } from './wagmi-config'

// Passkey utility functions
async function registerPasskey(username: string) {
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
        name: username,
        displayName: username,
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
  }) as PublicKeyCredential

  if (!credential) {
    throw new Error('Failed to create passkey')
  }

  // Store credential ID for later use
  localStorage.setItem('clawswift_passkey_credential_id', credential.id)
  
  // Generate a deterministic address from credential ID
  // In production, this should be done via a key manager service
  const address = generateAddressFromCredential(credential.id)
  localStorage.setItem('clawswift_passkey_address', address)
  
  return {
    credentialId: credential.id,
    address,
  }
}

async function authenticateWithPasskey() {
  const credentialId = localStorage.getItem('clawswift_passkey_credential_id')
  
  if (!credentialId) {
    throw new Error('No passkey found. Please create a wallet first.')
  }

  const challenge = crypto.getRandomValues(new Uint8Array(32))
  
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge,
      allowCredentials: [
        {
          id: base64ToBuffer(credentialId),
          type: 'public-key',
        },
      ],
      userVerification: 'required',
    },
  }) as PublicKeyCredential

  if (!assertion) {
    throw new Error('Authentication failed')
  }

  const address = localStorage.getItem('clawswift_passkey_address')
  if (!address) {
    throw new Error('Wallet address not found')
  }

  return {
    credentialId: assertion.id,
    address,
  }
}

// Helper functions
function generateAddressFromCredential(credentialId: string): `0x${string}` {
  // Generate a mock address from credential ID
  // In production, this should derive from the public key
  const hash = credentialId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0) | 0
  }, 0)
  
  const hex = Math.abs(hash).toString(16).padStart(40, '0')
  return `0x${hex}` as `0x${string}`
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

// Check if user has existing passkey
function hasExistingPasskey(): boolean {
  return !!localStorage.getItem('clawswift_passkey_credential_id')
}

// Clear passkey data (for logout)
function clearPasskey(): void {
  localStorage.removeItem('clawswift_passkey_credential_id')
  localStorage.removeItem('clawswift_passkey_address')
}

// Export passkey functions
export { registerPasskey, authenticateWithPasskey, hasExistingPasskey, clearPasskey }
