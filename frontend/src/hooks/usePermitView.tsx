import { useState } from 'react'
import { createPublicClient, http } from 'viem'
import { baseSepolia } from 'wagmi/chains'
import { lensAbi } from "../abi/lensAbi";
import type { PermitView } from '../types/types';


const LENS_ADDRESS = "0xAce360Ef4E7f41540eACe13f999595FBDcebD174" // Base Sepolia AllowanceLens

const client = createPublicClient({
  chain: baseSepolia,
  transport: http()
})

export function usePermitView() {
  const [data, setData] = useState<PermitView | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function fetchView(token: `0x${string}`, owner: `0x${string}`, spender: `0x${string}`) {
    setLoading(true)
    setError("")
    setData(null)

    try {
      const result = await client.readContract({
        address: LENS_ADDRESS,
        abi: lensAbi,
        functionName: 'getView',
        args: [token, owner, spender],
      })

      setData(result)
    } catch (err: any) {
      console.error(err)
      setError(err.shortMessage || err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    fetchView
  }
}
