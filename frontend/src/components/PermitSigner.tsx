import { useState } from 'react'
import { useWalletClient, useAccount } from 'wagmi'
import SignatureDecoder from './SignatureDecoder'
import PermitSubmitter from './PermitSubmitter'
import type { PermitView } from '../types/types'
import { Pen, AlertCircle, Loader } from 'lucide-react'
import { parseUnits } from 'viem'

export default function PermitSigner({ view }: { view: PermitView }) {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient({ account: address })
  const [value, setValue] = useState('')
  const [deadline, setDeadline] = useState('')
  const [signature, setSignature] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  async function signPermit() {
    setError('')
    if (!isConnected || !walletClient || !address) {
      setError("Please connect wallet first.")
      return
    }

    if (!value || !deadline) {
      setError("Value and deadline are required")
      return
    }

    try {
      setIsLoading(true)
      const sig = await walletClient.signTypedData({
        domain: {
          name: view.name,
          version: "1",
          chainId: walletClient.chain.id,
          verifyingContract: view.token as `0x${string}`,
        },
        types: {
          Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        primaryType: "Permit",
        message: {
          owner: view.owner as `0x${string}`,
          spender: view.spender as `0x${string}`,
          value: parseUnits(value, 18),
          nonce: view.nonce,
          deadline: BigInt(deadline),
        },
      })
      setSignature(sig)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign permit")
    } finally {
      setIsLoading(false)
    }
  }

  const isValid = value && deadline

  return (
    <div className="space-y-6">
      {/* Sign Section */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
        <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-purple-400 to-blue-500 rounded-full"></span>
          Sign Permit
        </h2>

        <div className="space-y-5">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Value (uint256)</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
              <input
                placeholder="0"
                className="relative w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type="number"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Deadline (Unix Timestamp)</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
              <input
                placeholder="0"
                className="relative w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                type="number"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={signPermit}
            disabled={!isValid || isLoading}
            className={`mt-2 relative group overflow-hidden rounded-xl py-3 px-6 font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${isValid && !isLoading
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:shadow-lg hover:shadow-purple-500/50 cursor-pointer transform hover:scale-105'
              : 'bg-gray-600 cursor-not-allowed opacity-50'
              }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <Pen className="w-4 h-4" />
                  Sign Permit
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      {signature && <SignatureDecoder signature={signature} />}

      {signature && (
        <PermitSubmitter
          view={view}
          value={value}
          deadline={deadline}
          r={signature.slice(0, 66)}
          s={"0x" + signature.slice(66, 130)}
          v={parseInt(signature.slice(130, 132), 16)}
        />
      )}
    </div>
  )
}
