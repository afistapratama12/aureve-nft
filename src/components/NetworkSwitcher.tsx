import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet, useSwitchNetwork } from "@/hooks/useWallet";
import { chains } from "@/config/web3";
import { cn } from "@/lib/utils";
import { getNetworkIcon } from "@/components/NetworkIcons";

/**
 * NetworkSwitcher component
 * Allows user to switch between supported networks
 */
export function NetworkSwitcher() {
  const { chainId, isConnected } = useWallet();
  const { switchNetwork } = useSwitchNetwork();
  const [isOpen, setIsOpen] = useState(false);

  const handleNetworkSwitch = async (targetChainId: number) => {
    try {
      switchNetwork(targetChainId);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  if (!isConnected) return null;

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
      >
        <div className="w-5 h-5 flex items-center justify-center">
          {getNetworkIcon(chainId)}
        </div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-64 bg-[#0a0a0a] border border-white/[0.08] rounded-lg shadow-xl z-50"
            >
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Switch Network
                </div>
                <div className="space-y-1">
                  {chains.map((network) => (
                    <button
                      key={network.id}
                      onClick={() => handleNetworkSwitch(network.id)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-lg transition-colors",
                        "hover:bg-white/[0.05]",
                        network.id === chainId && "bg-white/[0.08]"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            network.id === chainId ? "bg-green-500" : "bg-gray-600"
                          )} />
                          <span className="text-sm font-medium text-white">
                            {network.name}
                          </span>
                        </div>
                        {network.id === chainId && (
                          <Check className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 ml-4">
                        {network.nativeCurrency.symbol}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
