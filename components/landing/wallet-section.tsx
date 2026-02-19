"use client"

import * as React from 'react'
import { toCanvas } from 'qrcode'
import { Scanner } from '@yudiel/react-qr-scanner'
import {
  useAccount,
  useConnect,
  useConnectors,
  useDisconnect,
  useReadContract,
  useWriteContract,
} from 'wagmi'
import { formatUnits, parseUnits, isAddress } from 'viem'
import { Wallet, Send, QrCode, LogOut, Copy, Check, Shield, Fingerprint } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    name: "ClawSwift",
    decimals: 18,
  },
]

// Receive Modal Component
function ReceiveModal({
  address,
  onClose,
}: {
  address: string
  onClose: () => void
}) {
  const [qrDataUrl, setQrDataUrl] = React.useState<string>('')
  const [isGenerating, setIsGenerating] = React.useState(true)
  const [error, setError] = React.useState<string>('')

  React.useEffect(() => {
    const generateQR = async () => {
      try {
        const { toDataURL } = await import('qrcode')
        const eip681Url = `ethereum:${tokens[0].address}/transfer?address=${address}`
        
        const dataUrl = await toDataURL(eip681Url, {
          width: 320,
          margin: 2,
          color: {
            dark: '#0a0a0a',
            light: '#ffffff',
          },
        })
        
        setQrDataUrl(dataUrl)
        setIsGenerating(false)
      } catch (err) {
        console.error('QR generation error:', err)
        setError('Failed to generate QR code')
        setIsGenerating(false)
      }
    }

    generateQR()
  }, [address])

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
          <h3 className="text-lg font-semibold">Receive CLAW</h3>
          <button
            onClick={onClose}
            className="text-2xl text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-4 rounded-xl bg-white p-4">
            {isGenerating ? (
              <div className="flex h-64 w-64 items-center justify-center">
                <span className="text-muted-foreground">Generating...</span>
              </div>
            ) : error ? (
              <div className="flex h-64 w-64 items-center justify-center text-red-500 text-center px-4">
                <span>{error}</span>
              </div>
            ) : (
              <img
                src={qrDataUrl}
                alt="Receive QR Code"
                className="h-64 w-64"
              />
            )}
          </div>

          <p className="mb-2 text-sm text-muted-foreground">Wallet Address</p>
          <p className="mb-4 break-all text-center font-mono text-sm">
            {address}
          </p>

          <CopyAddressButton address={address} />
        </div>
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

// Send Modal Component
function SendModal({
  address,
  onClose,
  initialRecipient = '',
  initialAmount = '',
}: {
  address: string
  onClose: () => void
  initialRecipient?: string
  initialAmount?: string
}) {
  const [selectedToken, setSelectedToken] = React.useState<Token>(tokens[0])
  const [recipient, setRecipient] = React.useState(initialRecipient)
  const [amount, setAmount] = React.useState(initialAmount)
  const [error, setError] = React.useState('')
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [showScanner, setShowScanner] = React.useState(false)

  const { data: balance } = useReadContract({
    address: selectedToken.address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  })

  const formattedBalance = React.useMemo(() => {
    if (balance === undefined || balance === null) return '0.00'
    return Number(
      formatUnits(balance as bigint, selectedToken.decimals),
    ).toFixed(4)
  }, [balance, selectedToken])

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
      const parsedAmount = parseUnits(amount, selectedToken.decimals)

      writeContract({
        address: selectedToken.address as `0x${string}`,
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
          <h3 className="text-lg font-semibold">Send CLAW</h3>
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
                Balance: {formattedBalance} {selectedToken.symbol}
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
                            const amountParam = params.get('uint256')

                            if (recipientAddress && isAddress(recipientAddress)) {
                              setRecipient(recipientAddress)
                              if (amountParam) {
                                try {
                                  const amountBigInt = BigInt(amountParam)
                                  const amountFormatted = formatUnits(amountBigInt, selectedToken.decimals)
                                  setAmount(amountFormatted)
                                } catch {
                                  // ignore
                                }
                              }
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

// Main Wallet Section
export function WalletSection() {
  const [showReceive, setShowReceive] = React.useState(false)
  const [showSend, setShowSend] = React.useState(false)
  const [initialRecipient, setInitialRecipient] = React.useState('')
  const [initialAmount, setInitialAmount] = React.useState('')
  const [isConnecting, setIsConnecting] = React.useState(false)

  const { address, isConnected } = useAccount()
  const { connect, isPending: isConnectPending } = useConnect()
  const { disconnect } = useDisconnect()
  const connectors = useConnectors()

  // Find webAuthn connector
  const webAuthnConnector = React.useMemo(
    () => connectors.find((connector) => connector.id === 'webAuthn'),
    [connectors]
  )

  // Handle connect/sign in flow
  const handleConnect = () => {
    if (!webAuthnConnector) return
    setIsConnecting(true)

    // Try sign in first - if no credential, will auto create
    connect(
      { connector: webAuthnConnector },
      {
        onError: (error) => {
          const errorMessage =
            error instanceof Error ? error.message : String(error)

          // User cancelled - stop
          if (
            errorMessage.toLowerCase().includes('cancel') ||
            errorMessage.toLowerCase().includes('abort')
          ) {
            setIsConnecting(false)
            return
          }

          // No credential found - auto create new wallet
          if (
            errorMessage.toLowerCase().includes('credential') ||
            errorMessage.toLowerCase().includes('not found') ||
            errorMessage.toLowerCase().includes('discover')
          ) {
            connect(
              {
                connector: webAuthnConnector,
                // @ts-expect-error - capabilities is supported at runtime
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

  // Handle scan QR for send
  const handleScan = (recipient: string, amount?: string) => {
    setInitialRecipient(recipient)
    if (amount) setInitialAmount(amount)
    setShowSend(true)
  }

  const { data: balance } = useReadContract({
    address: tokens[0].address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const formattedBalance = React.useMemo(() => {
    if (balance === undefined || balance === null) return '0.00'
    return Number(formatUnits(balance as bigint, tokens[0].decimals)).toFixed(4)
  }, [balance])

  const isLoading = isConnectPending || isConnecting

  return (
    <section id="wallet" className="relative px-6 py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-claw-indigo/3 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-claw-indigo">
            Web3 Wallet
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Clawswift Wallet
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Secure, passwordless wallet using biometric authentication.
            Create and manage your CLAW tokens with just your fingerprint or Face ID.
          </p>
        </div>

        {/* Wallet Card */}
        <div className="mt-12 rounded-2xl border border-border bg-card p-8 shadow-sm">
          {!isConnected ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-claw-indigo-subtle text-claw-indigo">
                <Shield className="h-10 w-10" />
              </div>
              
              <h3 className="mb-2 text-xl font-semibold">
                {isLoading ? 'Check your device...' : 'Sign in with Passkey'}
              </h3>
              <p className="mb-6 text-sm text-muted-foreground">
                {isLoading 
                  ? 'Please authenticate using your biometric' 
                  : 'Use Touch ID, Face ID, or Windows Hello to access your wallet'}
              </p>
              
              {!isLoading && (
                <Button
                  onClick={handleConnect}
                  disabled={!webAuthnConnector}
                  className="gap-2 bg-claw-indigo px-8 hover:bg-claw-indigo-dark"
                >
                  <Fingerprint className="h-5 w-5" />
                  {webAuthnConnector ? 'Sign in / Create Wallet' : 'Wallet not available'}
                </Button>
              )}
            </div>
          ) : (
            <div>
              {/* Wallet Header */}
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Fingerprint className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Passkey Connected</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disconnect()}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>

              {/* Balance Display */}
              <div className="mb-8 text-center">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-4xl font-bold text-foreground">
                  {formattedBalance} <span className="text-2xl text-claw-indigo">CLAW</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => {
                    setInitialRecipient('')
                    setInitialAmount('')
                    setShowSend(true)
                  }}
                  className="gap-2 bg-claw-indigo hover:bg-claw-indigo-dark"
                >
                  <Send className="h-4 w-4" />
                  Send
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReceive(true)}
                  className="gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  Receive
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-claw-indigo-subtle text-claw-indigo">
              <Fingerprint className="h-6 w-6" />
            </div>
            <h4 className="mb-2 font-semibold">Passkey Security</h4>
            <p className="text-sm text-muted-foreground">
              No passwords to remember. Use your device&apos;s biometric authentication.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-claw-indigo-subtle text-claw-indigo">
              <Shield className="h-6 w-6" />
            </div>
            <h4 className="mb-2 font-semibold">Non-Custodial</h4>
            <p className="text-sm text-muted-foreground">
              You own your keys. Keys are securely managed by Key Manager service.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-claw-indigo-subtle text-claw-indigo">
              <QrCode className="h-6 w-6" />
            </div>
            <h4 className="mb-2 font-semibold">QR Payments</h4>
            <p className="text-sm text-muted-foreground">
              Send and receive CLAW by scanning QR codes. Fast and easy.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showReceive && address && (
        <ReceiveModal address={address} onClose={() => setShowReceive(false)} />
      )}
      {showSend && address && (
        <SendModal 
          address={address} 
          onClose={() => setShowSend(false)}
          initialRecipient={initialRecipient}
          initialAmount={initialAmount}
        />
      )}
    </section>
  )
}
