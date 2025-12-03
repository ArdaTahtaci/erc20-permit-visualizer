import { http, createConfig } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { metaMask, injected } from '@wagmi/connectors'

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
})
