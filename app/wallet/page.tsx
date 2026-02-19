"use client"

import * as React from 'react'
import dynamic from 'next/dynamic'
import {
  useAccount,
  useConnect,
  useConnectors,
  useDisconnect,
  useReadContract,
  useWriteContract,
} from 'wagmi'
import { formatUnits, parseUnits, isAddress } from 'viem'
import { 
  ArrowLeft, 
  Send, 
  QrCode, 
  LogOut, 
  Copy, 
  Check, 
  Shield, 
  Fingerprint,
  Wallet,
  Download,
  ExternalLink,
  Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { clawswiftChain } from "@/lib/wagmi-config"

// Dynamic import QR Scanner to avoid SSR issues
const Scanner = dynamic(
  () => import('@yudiel/react-qr-scanner').then((mod) => mod.Scanner),
  { ssr: false }
)

const erc20Abi = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
] as const

interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
}

const tokens: Token[] = [
  {
    address: "0x20c0000000000000000000000000000000000000",
    symbol: "CLAW",
    name: "ClawSwift Token",
    decimals: 6,
  },
]

// Send Modal Component
function SendModal({
  address,
  onClose,
}: {
  address: string
  onClose: () => void
}) {
  const [recipient, setRecipient] = React.useState('')
  const [amount, setAmount] = React.useState('')
  const [error, setError] = React.useState('')
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [showScanner, setShowScanner] = React.useState(false)

  // Read token info from RPC
  const { data: balance } = useReadContract({
    chainId: clawswiftChain.id,
    address: tokens[0].address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  })

  const { data: decimals } = useReadContract({
    chainId: clawswiftChain.id,
    address: tokens[0].address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'decimals',
  })

  const { data: symbol } = useReadContract({
    chainId: clawswiftChain.id,
    address: tokens[0].address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'symbol',
  })

  const tokenDecimals = decimals ? Number(decimals) : 6
  const tokenSymbol = symbol || 'CLAW'

  const formattedBalance = React.useMemo(() => {
    if (balance === undefined || balance === null) return '0.00'
    return Number(formatUnits(balance as bigint, tokenDecimals)).toFixed(4)
  }, [balance, tokenDecimals])

  const { writeContract, isPending, data: hash } = useWriteContract()

  const handleSend = () => {
    setError('')

    if (!recipient || !amount) {
      setError('Please enter recipient address and amount')
      return
    }

    if (!isAddress(recipient)) {
      setError('Invalid recipient address')
      return
    }

    const amountNum = parseFloat(amount)
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      setError('Invalid amount')
      return
    }

    try {
      const parsedAmount = parseUnits(amount, tokenDecimals)

      writeContract({
        chainId: clawswiftChain.id,
        address: tokens[0].address as `0x${string}`,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, parsedAmount],
      })

      setIsSuccess(true)
    } catch {
      setError('Failed to send transaction')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-auto rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Send {tokenSymbol}</h3>
          <button
            onClick={onClose}
            className="text-2xl text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        </div>

        {isSuccess ? (
          <div className="py-5 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="mb-2 text-base font-semibold">Transaction Sent!</h4>
            {hash && (
              <p className="mb-4 break-all text-xs text-muted-foreground">
                Hash: {hash}
              </p>
            )}
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">
                Balance: {formattedBalance} {tokenSymbol}
              </label>
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">
                Recipient Address
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-sm"
                />
                <Button
                  variant="outline"
                  onClick={() => setShowScanner(true)}
                  className="px-3"
                  title="Scan QR Code"
                >
                  <QrCode className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* QR Scanner */}
            {showScanner && (
              <div
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 p-5"
                onClick={() => setShowScanner(false)}
              >
                <div
                  className="w-full max-w-sm rounded-2xl bg-white p-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-base font-semibold">Scan QR Code</h4>
                    <button
                      onClick={() => setShowScanner(false)}
                      className="text-2xl text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                  <Scanner
                    onScan={(result) => {
                      if (result && result.length > 0) {
                        const scanned = result[0].rawValue

                        if (scanned.startsWith('ethereum:')) {
                          const urlStr = scanned.replace('ethereum:', '')
                          const transferMatch = urlStr.match(
                            /^(0x[a-fA-F0-9]{40})\/transfer\?(.+)$/i,
                          )

                          if (transferMatch) {
                            const queryString = transferMatch[2]
                            const params = new URLSearchParams(queryString)
                            const recipientAddress = params.get('address')

                            if (recipientAddress && isAddress(recipientAddress)) {
                              setRecipient(recipientAddress)
                              setShowScanner(false)
                            }
                          } else {
                            const plainAddress = urlStr
                              .split('@')[0]
                              .split('?')[0]
                            if (isAddress(plainAddress)) {
                              setRecipient(plainAddress)
                              setShowScanner(false)
                            }
                          }
                        } else if (isAddress(scanned)) {
                          setRecipient(scanned)
                          setShowScanner(false)
                        }
                      }
                    }}
                    styles={{
                      container: { borderRadius: '12px', overflow: 'hidden' },
                    }}
                  />
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    Point camera at QR code to scan
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.000001"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
                {error}
              </div>
            )}

            <Button
              onClick={handleSend}
              disabled={isPending}
              className="w-full bg-claw-indigo hover:bg-claw-indigo-dark"
            >
              {isPending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Copy Address Button
function CopyAddressButton({ address }: { address: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="outline"
      onClick={handleCopy}
      className="gap-2"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy Address
        </>
      )}
    </Button>
  )
}

export default function WalletPage() {
  const [showSend, setShowSend] = React.useState(false)
  const [isConnecting, setIsConnecting] = React.useState(false)
  const [qrDataUrl, setQrDataUrl] = React.useState<string>('')
  const [wsStatus, setWsStatus] = React.useState<'connecting' | 'connected' | 'disconnected'>('disconnected')
  const [retryCount, setRetryCount] = React.useState(0)
  const maxRetries = 5
  const retryDelayRef = React.useRef(1000) // Start with 1s, exponential backoff

  const { address, isConnected } = useAccount()
  const { connect, isPending: isConnectPending } = useConnect()
  const { disconnect } = useDisconnect()
  const connectors = useConnectors()

  // Find webAuthn connector
  const webAuthnConnector = React.useMemo(
    () => connectors.find((connector) => connector.id === 'webAuthn'),
    [connectors]
  )

  // Generate QR for receive
  React.useEffect(() => {
    if (address) {
      const generateQR = async () => {
        try {
          const QRCode = await import('qrcode')
          const eip681Url = `ethereum:${tokens[0].address}/transfer?address=${address}`
          // Handle both ESM and CJS exports
          const toDataURL = QRCode.toDataURL || QRCode.default?.toDataURL
          if (!toDataURL) {
            console.error('QRCode toDataURL not found:', QRCode)
            return
          }
          const dataUrl = await toDataURL(eip681Url, {
            width: 280,
            margin: 2,
            color: {
              dark: '#f26641',
              light: '#ffffff',
            },
          })
          setQrDataUrl(dataUrl)
        } catch (err) {
          console.error('QR generation error:', err)
        }
      }
      generateQR()
    }
  }, [address])

  // Handle connect/sign in flow
  const handleConnect = () => {
    if (!webAuthnConnector) return
    setIsConnecting(true)

    connect(
      { connector: webAuthnConnector, chainId: clawswiftChain.id },
      {
        onError: (error) => {
          const errorMessage =
            error instanceof Error ? error.message : String(error)

          if (
            errorMessage.toLowerCase().includes('cancel') ||
            errorMessage.toLowerCase().includes('abort')
          ) {
            setIsConnecting(false)
            return
          }

          if (
            errorMessage.toLowerCase().includes('credential') ||
            errorMessage.toLowerCase().includes('not found') ||
            errorMessage.toLowerCase().includes('discover')
          ) {
            connect(
              {
                connector: webAuthnConnector,
                chainId: clawswiftChain.id,
                capabilities: { type: 'sign-up' },
              },
              {
                onSettled: () => setIsConnecting(false),
              },
            )
          } else {
            setIsConnecting(false)
          }
        },
        onSettled: () => setIsConnecting(false),
      },
    )
  }

  // Read token info from RPC
  const { data: balance } = useReadContract({
    address: tokens[0].address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const { data: decimals } = useReadContract({
    address: tokens[0].address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'decimals',
    query: {
      enabled: !!address,
    },
  })

  const { data: symbol } = useReadContract({
    address: tokens[0].address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'symbol',
    query: {
      enabled: !!address,
    },
  })

  const formattedBalance = React.useMemo(() => {
    if (balance === undefined || balance === null) return '0.00'
    const tokenDecimals = decimals ? Number(decimals) : 6
    return Number(formatUnits(balance as bigint, tokenDecimals)).toFixed(4)
  }, [balance, decimals])

  const tokenSymbol = symbol || 'CLAW'
  const tokenDecimals = decimals ? Number(decimals) : 6

  const isLoading = isConnectPending || isConnecting
  
  // Prevent hydration mismatch
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // WebSocket for incoming transfer notifications
  const [incomingTx, setIncomingTx] = React.useState<{
    hash: string
    amount: string
    symbol: string
  } | null>(null)
  const wsRef = React.useRef<WebSocket | null>(null)
  const seenTxRef = React.useRef<Set<string>>(new Set())

  // Play notification sound
  const playBeep = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch {
      // Ignore audio errors
    }
  }

  // WebSocket connection with auto-retry
  React.useEffect(() => {
    if (!address) return

    let ws: WebSocket | null = null
    let reconnectTimeout: NodeJS.Timeout | null = null
    let isIntentionalClose = false

    const connectWebSocket = () => {
      setWsStatus('connecting')
      const wsUrl = 'wss://exp.clawswift.net/ws'
      ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        setWsStatus('connected')
        setRetryCount(0)
        retryDelayRef.current = 1000 // Reset delay on successful connection
        
        // Subscribe to ERC20 Transfer events for the token
        // Transfer event signature: keccak256("Transfer(address,address,uint256)")
        const transferEventSignature = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
        const addressPadded = `0x${address.toLowerCase().slice(2).padStart(64, '0')}`

        ws?.send(
          JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_subscribe',
            params: [
              'logs',
              {
                address: tokens[0].address,
                topics: [
                  transferEventSignature, // Event signature
                  null, // From: any
                  addressPadded, // To: our address
                ],
              },
            ],
          }),
        )
      }

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.method === 'eth_subscription' && data.params?.result) {
            const log = data.params.result
            const txHash = log.transactionHash

            if (!seenTxRef.current.has(txHash)) {
              seenTxRef.current.add(txHash)

              // Decode amount from data (uint256 at position 0)
              const amountHex = log.data
              const amount = formatUnits(BigInt(amountHex), tokenDecimals)

              setIncomingTx({
                hash: txHash,
                amount: Number(amount).toFixed(4),
                symbol: tokenSymbol,
              })
              playBeep()

              // Clear notification after 10 seconds
              setTimeout(() => {
                setIncomingTx(null)
              }, 10000)
            }
          }
        } catch {
          // Ignore parsing errors
        }
      }

      ws.onerror = () => {
        // Error handled in onclose
      }

      ws.onclose = () => {
        if (isIntentionalClose) return
        
        setWsStatus('disconnected')
        wsRef.current = null

        // Auto-retry with exponential backoff
        if (retryCount < maxRetries) {
          const delay = retryDelayRef.current
          retryDelayRef.current = Math.min(delay * 2, 30000) // Max 30s delay
          
          setRetryCount(prev => prev + 1)
          
          reconnectTimeout = setTimeout(() => {
            connectWebSocket()
          }, delay)
        }
      }
    }

    connectWebSocket()

    return () => {
      isIntentionalClose = true
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
      ws?.close()
      wsRef.current = null
    }
  }, [address, tokenDecimals, tokenSymbol, retryCount])

  // Save QR as PNG
  const handleSaveQR = async () => {
    if (!address) return
    try {
      const QRCode = await import('qrcode')
      // Handle both ESM and CJS exports
      const toDataURL = QRCode.toDataURL || QRCode.default?.toDataURL
      if (!toDataURL) {
        console.error('QRCode toDataURL not found:', QRCode)
        return
      }
      const eip681Url = `ethereum:${tokens[0].address}/transfer?address=${address}`
      const highResDataUrl = await toDataURL(eip681Url, {
        width: 480,
        margin: 2,
        color: {
          dark: '#f26641',
          light: '#ffffff',
        },
      })

      const canvas = document.createElement('canvas')
      canvas.width = 480
      canvas.height = 480
      const ctx = canvas.getContext('2d')

      if (ctx) {
        const qrImg = document.createElement('img')
        qrImg.onload = () => {
          ctx.drawImage(qrImg, 0, 0, 480, 480)
          const logoSize = 90
          const centerX = (480 - logoSize) / 2
          const centerY = (480 - logoSize) / 2

          ctx.beginPath()
          ctx.arc(240, 240, logoSize / 2 + 6, 0, 2 * Math.PI)
          ctx.fillStyle = '#ffffff'
          ctx.fill()

          const logoImg = document.createElement('img')
          logoImg.crossOrigin = 'anonymous'
          logoImg.onload = () => {
            ctx.drawImage(logoImg, centerX, centerY, logoSize, logoSize)
            const link = document.createElement('a')
            link.download = `clawswift-receive-${address.slice(0, 8)}.png`
            link.href = canvas.toDataURL('image/png')
            link.click()
          }
          logoImg.onerror = () => {
            const link = document.createElement('a')
            link.download = `clawswift-receive-${address.slice(0, 8)}.png`
            link.href = canvas.toDataURL('image/png')
            link.click()
          }
          logoImg.src = '/lobster-logo-big.svg'
        }
        qrImg.src = highResDataUrl
      }
    } catch (err) {
      console.error('Save QR error:', err)
    }
  }

  // Prevent hydration mismatch - show simple loading state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-claw-indigo-subtle text-claw-indigo animate-pulse">
            <Wallet className="h-6 w-6" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/lobster-logo-big.svg" 
              alt="Clawswift" 
              width={32} 
              height={32} 
              className="h-8 w-8"
            />
            <span className="text-lg font-bold text-foreground">
              Clawswift Wallet
            </span>
          </Link>
          
          {isConnected && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => disconnect()}
              className="gap-2 text-muted-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6">
        <div className="mx-auto max-w-md">
          {!isConnected ? (
            // Not Connected State
            <div className="py-16 text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-claw-indigo-subtle text-claw-indigo">
                <Wallet className="h-12 w-12" />
              </div>
              
              <h1 className="mb-3 text-2xl font-bold">
                {isLoading ? 'Check your device...' : 'Sign in with Passkey'}
              </h1>
              <p className="mb-8 text-muted-foreground max-w-xs mx-auto">
                {isLoading 
                  ? 'Please authenticate using your biometric' 
                  : 'Use Touch ID, Face ID, or Windows Hello to access your wallet'}
              </p>
              
              {!isLoading && (
                <Button
                  onClick={handleConnect}
                  disabled={!webAuthnConnector}
                  size="lg"
                  className="gap-2 bg-claw-indigo px-8 hover:bg-claw-indigo-dark"
                >
                  <Fingerprint className="h-5 w-5" />
                  {webAuthnConnector ? 'Sign in / Create Wallet' : 'Wallet not available'}
                </Button>
              )}

              <div className="mt-8">
                <Link 
                  href="/" 
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            // Connected State
            <div className="space-y-6">
              {/* Incoming Transfer Notification */}
              {incomingTx && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Bell className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-700">Received!</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    +{incomingTx.amount} {incomingTx.symbol}
                  </div>
                  <a
                    href={`https://exp.clawswift.net/tx/${incomingTx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-claw-indigo hover:underline"
                  >
                    View Transaction ↗
                  </a>
                </div>
              )}

              {/* Wallet Card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {/* Address */}
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700 mb-3">
                    <Fingerprint className="h-4 w-4" />
                    Passkey Connected
                  </div>
                  <p className="font-mono text-sm text-muted-foreground break-all px-2">
                    {address}
                  </p>
                </div>

                {/* Balance */}
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Balance</p>
                  <p className="text-5xl font-bold">
                    {formattedBalance}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <p className="text-xl text-claw-indigo font-medium">{tokenSymbol}</p>
                    {/* WebSocket Status Indicator */}
                    <span 
                      className={`flex h-2 w-2 rounded-full ${
                        wsStatus === 'connected' 
                          ? 'bg-green-500' 
                          : wsStatus === 'connecting' 
                            ? 'bg-yellow-500 animate-pulse' 
                            : 'bg-red-500'
                      }`}
                      title={
                        wsStatus === 'connected' 
                          ? 'Real-time notifications: Connected' 
                          : wsStatus === 'connecting' 
                            ? 'Real-time notifications: Connecting...' 
                            : 'Real-time notifications: Disconnected - Balance may be outdated'
                      }
                    />
                  </div>
                  {wsStatus === 'disconnected' && (
                    <p className="text-xs text-red-500 mt-1">
                      {retryCount >= maxRetries 
                        ? 'Connection failed. Please refresh the page.' 
                        : `Reconnecting... (${retryCount}/${maxRetries})`}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => setShowSend(true)}
                    className="gap-2 bg-claw-indigo hover:bg-claw-indigo-dark"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://exp.clawswift.net/address/${address}`, '_blank')}
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Explorer
                  </Button>
                </div>
              </div>

              {/* Receive Section */}
              {qrDataUrl && (
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-center">Receive {tokenSymbol}</h3>
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Listening for incoming transfers" />
                  </div>
                  <p className="text-center text-xs text-muted-foreground mb-4">
                    Scan to send. You&apos;ll be notified when tokens arrive.
                  </p>
                  
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="bg-white rounded-xl p-3">
                        <img
                          src={qrDataUrl}
                          alt="Receive QR Code"
                          className="h-56 w-56"
                        />
                        {/* Logo overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Image 
                              src="/lobster-logo-big.svg" 
                              alt="Logo" 
                              width={40} 
                              height={40}
                              className="w-10 h-10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <CopyAddressButton address={address || ''} />
                      <Button
                        variant="outline"
                        onClick={handleSaveQR}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <Fingerprint className="h-6 w-6 mx-auto mb-2 text-claw-indigo" />
                  <p className="text-xs text-muted-foreground">Passkey</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-claw-indigo" />
                  <p className="text-xs text-muted-foreground">Secure</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <QrCode className="h-6 w-6 mx-auto mb-2 text-claw-indigo" />
                  <p className="text-xs text-muted-foreground">QR Pay</p>
                </div>
              </div>

              {/* Back Link */}
              <div className="text-center">
                <Link 
                  href="/" 
                  className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Send Modal */}
      {showSend && address && (
        <SendModal address={address} onClose={() => setShowSend(false)} />
      )}
    </div>
  )
}
