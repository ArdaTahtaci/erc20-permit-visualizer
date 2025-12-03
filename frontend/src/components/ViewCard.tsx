import type { PermitView } from '../types/types'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { formatUnits } from 'viem'

interface Props {
  data: PermitView
}

function AddressBadge({ address }: { address: string }) {
  const [copied, setCopied] = useState(false)
  const short = `${address.slice(0, 6)}...${address.slice(-4)}`

  const handleCopy = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openEtherscan = () => {
    window.open(`https://etherscan.io/address/${address}`, '_blank')
  }

  return (
    <div className="flex items-center gap-2">
      <code className="text-sm font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-purple-300 group hover:bg-white/10 transition-colors">
        {short}
      </code>
      <button
        onClick={handleCopy}
        className="p-1.5 hover:bg-white/10 rounded text-white/50 hover:text-white/80 transition-colors"
        title="Copy full address"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </button>
      <button
        onClick={openEtherscan}
        className="p-1.5 hover:bg-white/10 rounded text-white/50 hover:text-white/80 transition-colors"
        title="View on Etherscan"
      >
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function ViewCard({ data }: Props) {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopyField = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatNumber = (num: bigint) => {
    const formatted = formatUnits(num, 18) // Standard ERC20 decimals
    // Remove trailing zeros and decimal point if not needed
    return parseFloat(formatted).toLocaleString('en-US', {
      maximumFractionDigits: 4,
      minimumFractionDigits: 0
    })
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-white/10">
        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span className="w-1.5 h-8 bg-gradient-to-b from-purple-400 to-blue-500 rounded-full"></span>
          {data.symbol} Token Details
        </h3>
        <p className="text-white/60 text-sm">{data.name}</p>
      </div>

      {/* Grid layout for data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Token Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Token Contract</p>
          <AddressBadge address={data.token} />
        </div>

        {/* Owner Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Owner Address</p>
          <AddressBadge address={data.owner} />
        </div>

        {/* Spender Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Spender Address</p>
          <AddressBadge address={data.spender} />
        </div>

        {/* Nonce Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Nonce</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-300">{data.nonce.toString()}</span>
            <button
              onClick={() => handleCopyField(data.nonce.toString(), 'nonce')}
              className="p-1.5 hover:bg-white/10 rounded text-white/50 hover:text-white/80 transition-colors"
            >
              {copied === 'nonce' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Allowance Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all duration-300 hover:bg-white/10 md:col-span-2">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Current Allowance</p>
          <div className="flex items-center gap-3 justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-300">{formatNumber(data.allowance)}</p>
              <p className="text-xs text-white/40 mt-1">Raw value in wei</p>
            </div>
            <button
              onClick={() => handleCopyField(data.allowance.toString(), 'allowance')}
              className="p-2 hover:bg-white/10 rounded text-white/50 hover:text-white/80 transition-colors flex-shrink-0"
            >
              {copied === 'allowance' ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Domain Separator Section */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 hover:bg-gradient-to-br hover:from-white/15 hover:to-white/10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Domain Separator</p>
          <button
            onClick={() => handleCopyField(data.domainSeparator, 'domain')}
            className="p-1.5 hover:bg-white/10 rounded text-white/50 hover:text-white/80 transition-colors"
          >
            {copied === 'domain' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <code className="block text-xs font-mono text-blue-300 break-all p-3 bg-white/5 rounded-lg border border-white/5 overflow-auto max-h-20">
          {data.domainSeparator}
        </code>
        <p className="text-xs text-white/40 mt-3">Used for EIP-712 typed data signing</p>
      </div>

      {/* Footer info */}
      <div className="mt-6 p-4 mb-4 bg-blue-500/10 border border-blue-400/20 rounded-lg text-xs text-white/70">
        <p className="font-semibold text-blue-300 mb-1">ℹ️ About this data</p>
        <p>These values represent the current state of permit allowances on the blockchain. The nonce is incremented with each permit signature.</p>
      </div>
    </div>
  )
}
