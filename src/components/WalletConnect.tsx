import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";

/**
 * WalletConnect component
 * Handles wallet connection and displays address/balance
 */
export function WalletConnect() {
  const { address, balance, isConnected, openModal, disconnect } = useWallet();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Button disabled>Loading...</Button>;
  }

  const handleConnect = async () => {
    try {
      openModal();
    } catch (error) {
      console.error("Failed to connect:", error);
      toast.error("Failed to connect wallet", {
        description: "Please make sure you have a Web3 wallet installed.",
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success("Wallet disconnected");
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end text-sm">
          <span className="font-mono">{formatAddress(address)}</span>
          {balance && (
            <span className="text-xs text-gray-500">
              {parseFloat(balance).toFixed(4)} ETH
            </span>
          )}
        </div>
        <Button onClick={handleDisconnect} variant="outline" size="sm">
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      className="bg-blue-600 hover:bg-blue-700"
    >
      Connect Wallet
    </Button>
  );
}

/**
 * Format wallet address for display
 */
function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
