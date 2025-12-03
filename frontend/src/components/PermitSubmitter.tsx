import { useWriteContract } from 'wagmi'
import type { PermitView } from '../types/types'
import { erc20PermitAbi } from '../abi/erc20PermitAbi'
import { Send, CheckCircle2, AlertCircle, Loader, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { parseUnits } from 'viem'

export const permitAbi = erc20PermitAbi[0].abi;

interface Props {
  view: PermitView
  r: string
  s: string
  v: number | null
  value: string
  deadline: string
}

export default function PermitSubmitter({ view, r, s, v, value, deadline }: Props) {
  const { writeContract, data, error, isPending, isSuccess } = useWriteContract()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    console.log("FUNCTION NAMES:", permitAbi.map((x: any) => x.name)
    )


  }, [])

  function submit() {
    if (v === null) {
      return
    }

    if (!value || !deadline) {
      return
    }

    writeContract({
      address: view.token as `0x${string}`,
      abi: permitAbi,
      functionName: "permit",
      args: [
        view.owner,
        view.spender,
        parseUnits(value, 18),
        BigInt(deadline),
        v,
        r,
        s,
      ]
    })
  }

  const handleCopyTxHash = () => {
    if (data) {
      navigator.clipboard.writeText(data)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isValid = v !== null && value && deadline

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
      <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></span>
        Submit Transaction
      </h3>

      <button
        onClick={submit}
        disabled={isPending || !isValid}
        className={`w-full relative group overflow-hidden rounded-xl py-3 px-6 font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${isValid && !isPending
          ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-lg hover:shadow-green-500/50 cursor-pointer transform hover:scale-105'
          : 'bg-gray-600 cursor-not-allowed opacity-50'
          }`}
      >
        <span className="relative z-10 flex items-center gap-2">
          {isPending ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Permit Transaction
            </>
          )}
        </span>
      </button>

      {error && (
        <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 font-semibold text-sm mb-1">Error</p>
            <p className="text-red-200 text-xs">{error.message}</p>
          </div>
        </div>
      )}

      {isSuccess && data && (
        <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-green-300 font-semibold text-sm mb-2">Permit Transaction Sent!</p>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono text-green-200/70 bg-black/30 px-3 py-2 rounded flex-1 break-all overflow-auto">
                  {data}
                </code>
                <button
                  onClick={handleCopyTxHash}
                  className="p-2 hover:bg-green-500/20 rounded text-green-400 hover:text-green-300 transition-colors flex-shrink-0"
                  title="Copy tx hash"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
