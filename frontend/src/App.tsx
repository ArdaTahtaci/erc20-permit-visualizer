import { useState } from 'react'
import AddressInput from './components/AddressInput'
import ViewCard from './components/ViewCard'
import { usePermitView } from './hooks/usePermitView'
import { Loader, AlertCircle, CheckCircle2 } from 'lucide-react'
import PermitSigner from './components/PermitSigner'
import { WalletModal } from './components/WalletModal'
import { useAccount } from 'wagmi'

function App() {
  const [token, setToken] = useState('')
  const [owner, setOwner] = useState('')
  const [spender, setSpender] = useState('')
  const [walletModalOpen, setWalletModalOpen] = useState(false)

  const { data, loading, error, fetchView } = usePermitView()
  const { isConnected } = useAccount()

  function handleFetch() {
    if (!token || !owner || !spender) return
    fetchView(token as `0x${string}`, owner as `0x${string}`, spender as `0x${string}`)
  }
  //1764837000
  const isValid = token && owner && spender

  return (
    <>
      {/* Background layers - Completely separate from layout flow */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 z-0 pointer-events-none" />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Wallet Modal */}
      <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />

      {/* Main app content - Above background, below modal */}
      <div className="relative min-h-screen flex flex-col text-white">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Permit Visualizer
                </h1>
              </div>
              <button
                onClick={() => setWalletModalOpen(true)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${isConnected
                  ? 'bg-green-500/20 text-green-300 border border-green-500/40 hover:bg-green-500/30'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
                  }`}
              >
                {isConnected ? '✓ Connected' : 'Connect Wallet'}
              </button>
            </div>
            <p className="text-white/60 text-sm">Explore ERC20 permit data with precision</p>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left panel - Input form */}
              <div className="lg:col-span-2">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 shadow-2xl">
                  <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-purple-400 to-blue-500 rounded-full"></span>
                    Query Permit Data
                  </h2>

                  <div className="flex flex-col gap-5">
                    <AddressInput
                      label="Token Address"
                      value={token}
                      onChange={setToken}
                      placeholder="0x..."
                    />
                    <AddressInput
                      label="Owner Address"
                      value={owner}
                      onChange={setOwner}
                      placeholder="0x..."
                    />
                    <AddressInput
                      label="Spender Address"
                      value={spender}
                      onChange={setSpender}
                      placeholder="0x..."
                    />

                    <button
                      onClick={handleFetch}
                      disabled={!isValid || loading}
                      className={`mt-2 relative group overflow-hidden rounded-xl py-3 px-6 font-semibold text-white transition-all duration-300 ${isValid && !loading
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:shadow-lg hover:shadow-purple-500/50 cursor-pointer transform hover:scale-105'
                        : 'bg-gray-600 cursor-not-allowed opacity-50'
                        }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Fetching...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Fetch Permit View
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </button>
                  </div>

                  {/* Info box */}
                  <div className="mt-6 p-4 bg-white/5 border border-blue-400/20 rounded-lg text-xs text-white/70">
                    <p className="font-semibold text-blue-300 mb-1">💡 Quick Tip</p>
                    <p>Enter valid Ethereum addresses to query permit data from the blockchain.</p>
                  </div>
                </div>
              </div>

              {/* Right panel - Results */}
              <div className="lg:col-span-3">
                {loading && (
                  <div className="flex flex-col items-center justify-center h-96">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-75 animate-pulse"></div>
                      <div className="absolute inset-0 bg-slate-950 rounded-lg flex items-center justify-center">
                        <Loader className="w-8 h-8 text-purple-400 animate-spin" />
                      </div>
                    </div>
                    <p className="text-white/60 text-sm">Fetching permit data...</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex gap-4">
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-red-300 mb-1">Error</p>
                      <p className="text-red-200/80 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {data && (
                  <>
                    <ViewCard data={data} />
                    <PermitSigner view={data} />
                  </>
                )}

                {!loading && !error && !data && (
                  <div className="flex flex-col items-center justify-center h-96 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                      <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-white/60 text-sm">Enter addresses and fetch permit data to see results</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 backdrop-blur-xl bg-white/5 mt-auto">
          <div className="max-w-6xl mx-auto px-6 py-6 text-center text-white/40 text-xs">
            <p>Permit Visualizer • Built for Web3 Community</p>
          </div>
        </footer>
      </div>

      {/* RainbowKit Modal Portal renders here - Always on top */}
    </>
  )
}

export default App
