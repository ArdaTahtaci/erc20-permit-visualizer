import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface Props {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export default function AddressInput({ label, value, onChange, placeholder }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">{label}</label>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
        <input
          type="text"
          className="relative w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || '0x...'}
        />
        {value && (
          <button
            onClick={handleCopy}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-white/80 transition-colors duration-200"
            title="Copy address"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
