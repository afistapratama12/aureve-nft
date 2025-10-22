import { useState, useEffect } from "react";
import { useWalletStore } from "@/stores/walletStore";
import { useConnectWallet, useDisconnectWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { formatAddress } from "@/lib/utils";

/**
 * WalletConnect component
 * Handles wallet connection and displays address/balance
 */
export function WalletConnect() {
  const { address, balance, isConnected, chainId } = useWalletStore();
  const connectMutation = useConnectWallet();
  const disconnectMutation = useDisconnectWallet();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Button disabled>Loading...</Button>;
  }

  const handleConnect = async () => {
    try {
      await connectMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to connect:", error);
      alert("Failed to connect wallet. Please make sure MetaMask is installed.");
    }
  };

  const handleDisconnect = () => {
    disconnectMutation.mutate();
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
      disabled={connectMutation.isPending}
      className="bg-blue-600 hover:bg-blue-700"
    >
      {connectMutation.isPending ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}

/**
 * Format wallet address for display
 */
function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
