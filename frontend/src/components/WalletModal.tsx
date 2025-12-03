import { useConnect, useDisconnect, useAccount } from 'wagmi'
import { X } from 'lucide-react'

interface WalletModalProps {
    isOpen: boolean
    onClose: () => void
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
    const { connectors, connect, isPending } = useConnect()
    const { disconnect } = useDisconnect()
    const { isConnected, address } = useAccount()

    if (!isOpen) return null

    const handleConnect = (connectorId: string) => {
        const connector = connectors.find(c => c.id === connectorId)
        if (connector) {
            connect({ connector })
            onClose()
        }
    }

    const handleDisconnect = () => {
        disconnect()
        onClose()
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-white/10 shadow-2xl max-w-sm w-11/12 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">
                            {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-white/60 hover:text-white" />
                        </button>
                    </div>

                    {/* Content */}
                    {isConnected ? (
                        <div className="space-y-4">
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <p className="text-sm text-white/60 mb-2">Connected Address:</p>
                                <p className="text-white font-mono text-sm break-all">{address}</p>
                            </div>
                            <button
                                onClick={handleDisconnect}
                                className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 rounded-lg py-2 px-4 transition-all duration-200"
                            >
                                Disconnect
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {connectors.map((connector) => (
                                <button
                                    key={connector.id}
                                    onClick={() => handleConnect(connector.id)}
                                    disabled={isPending}
                                    className="w-full bg-white/5 hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 text-white rounded-lg py-3 px-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 group"
                                >
                                    <div className="flex-1 text-left">
                                        <p className="font-semibold group-hover:text-purple-300">{connector.name}</p>
                                    </div>
                                    {isPending && (
                                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Info Section */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <h3 className="text-sm font-semibold text-white mb-2">What is a Wallet?</h3>
                        <p className="text-xs text-white/60 leading-relaxed">
                            A crypto wallet is a tool that lets you interact with blockchain networks. It securely stores your keys and allows you to send, receive, and manage digital assets.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
