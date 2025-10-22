import { useState } from "react";
import { SUPPORTED_NETWORKS, DEFAULT_NETWORK } from "@/lib/networkConfig";
import { useSwitchNetwork } from "@/hooks/useWallet";
import { useWalletStore } from "@/stores/walletStore";

/**
 * NetworkSwitcher component
 * Allows user to switch between supported networks
 */
export function NetworkSwitcher() {
  const { chainId } = useWalletStore();
  const { switchNetwork } = useSwitchNetwork();
  const [isOpen, setIsOpen] = useState(false);

  const currentNetwork = SUPPORTED_NETWORKS.find((n) => n.chainId === chainId);

  const handleNetworkSwitch = async (targetChainId: number) => {
    try {
      await switchNetwork(targetChainId);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to switch network:", error);
      alert("Failed to switch network. Please try again.");
    }
  };

  if (!chainId) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
      >
        <div
          className={`w-2 h-2 rounded-full ${
            currentNetwork ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span>{currentNetwork?.name || "Unknown Network"}</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500">
              Switch Network
            </div>
            {SUPPORTED_NETWORKS.map((network) => (
              <button
                key={network.chainId}
                onClick={() => handleNetworkSwitch(network.chainId)}
                className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                  network.chainId === chainId ? "bg-blue-50 text-blue-600" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{network.name}</span>
                  {network.chainId === DEFAULT_NETWORK.chainId && (
                    <span className="text-xs text-gray-500">Default</span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {network.nativeCurrency.symbol}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
