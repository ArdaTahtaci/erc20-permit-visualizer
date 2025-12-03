import { useEffect, useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface Props {
  signature: string
}

export default function SignatureDecoder({ signature }: Props) {
  const [r, setR] = useState('')
  const [s, setS] = useState('')
  const [v, setV] = useState<number | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (!signature || signature.length < 132) return

    // Remove 0x prefix
    const sig = signature.startsWith('0x') ? signature.slice(2) : signature

    const rHex = sig.slice(0, 64)
    const sHex = sig.slice(64, 128)
    const vHex = sig.slice(128, 130)

    const vNum = parseInt(vHex, 16)
    const normalizedV = vNum === 27 || vNum === 28 ? vNum - 27 : vNum

    setR(`0x${rHex}`)
    setS(`0x${sHex}`)
    setV(normalizedV)
  }, [signature])

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!signature) return null

  const shortR = `${r.slice(0, 10)}...${r.slice(-8)}`
  const shortS = `${s.slice(0, 10)}...${s.slice(-8)}`

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
      <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full"></span>
        Decoded Signature
      </h3>

      <div className="space-y-4">
        {/* r value */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">r Component</p>
          <div className="flex items-center gap-2 justify-between">
            <code className="text-sm font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-indigo-300 hover:bg-white/10 transition-colors truncate">
              {shortR}
            </code>
            <button
              onClick={() => handleCopy(r, 'r')}
              className="p-1.5 hover:bg-white/10 rounded text-white/50 hover:text-white/80 transition-colors flex-shrink-0"
              title="Copy r value"
            >
              {copied === 'r' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* s value */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">s Component</p>
          <div className="flex items-center gap-2 justify-between">
            <code className="text-sm font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-purple-300 hover:bg-white/10 transition-colors truncate">
              {shortS}
            </code>
            <button
              onClick={() => handleCopy(s, 's')}
              className="p-1.5 hover:bg-white/10 rounded text-white/50 hover:text-white/80 transition-colors flex-shrink-0"
              title="Copy s value"
            >
              {copied === 's' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* v value */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">v Component (Recovery ID)</p>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{v}</span>
              </div>
              <span className="text-white/60 text-sm font-mono">Recovery ID</span>
            </div>
            <button
              onClick={() => handleCopy(v?.toString() || '', 'v')}
              className="p-1.5 hover:bg-white/10 rounded text-white/50 hover:text-white/80 transition-colors"
              title="Copy v value"
            >
              {copied === 'v' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-400/20 rounded-lg text-xs text-white/70">
        <p className="font-semibold text-indigo-300 mb-1">ℹ️ Signature Components</p>
        <p>These components (r, s, v) make up the ECDSA signature and are required for on-chain transaction submission.</p>
      </div>
    </div>
  )
}
