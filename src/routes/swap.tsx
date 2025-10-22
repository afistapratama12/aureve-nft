import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/hooks/useWallet";
import { useStargateSwap } from "@/hooks/useStargateSwap";
import { ArrowDownUp, Loader2, AlertCircle, CheckCircle2, ExternalLink, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { formatEther, parseEther } from "viem";
import { useBalance, useSwitchChain } from "wagmi";
import { Network } from "@/types/network";
import { allNetworks } from "@/data/network";

export const Route = createFileRoute("/swap")({
  component: SwapPage,
});

// Currently supported networks (for actual swapping)
const networks: Network[] = allNetworks.filter((n) => n.isSupported);

function SwapPage() {
  const { address, isConnected, chainId, openModal } = useWallet();
  const { switchChain } = useSwitchChain();
  const stargate = useStargateSwap();
  
  const [fromNetwork, setFromNetwork] = useState<Network>(networks[0]);
  const [toNetwork, setToNetwork] = useState<Network>(networks[1]);
  const [amount, setAmount] = useState("");
  const [swapStatus, setSwapStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  const { data: balanceData } = useBalance({
    address: address,
    chainId: fromNetwork.id,
  });

  // Auto-fetch quote when amount changes
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const timer = setTimeout(() => {
        stargate.getQuote(fromNetwork.id, toNetwork.id, amount);
      }, 500); // Debounce 500ms
      
      return () => clearTimeout(timer);
    }
  }, [amount, fromNetwork.id, toNetwork.id]);

  // Update from network when chain changes
  useEffect(() => {
    if (chainId) {
      const currentNetwork = networks.find((n) => n.id === chainId);
      if (currentNetwork && currentNetwork.id !== fromNetwork.id) {
        setFromNetwork(currentNetwork);
        // Ensure toNetwork is different
        if (currentNetwork.id === toNetwork.id) {
          const otherNetwork = networks.find((n) => n.id !== currentNetwork.id);
          if (otherNetwork) setToNetwork(otherNetwork);
        }
      }
    }
  }, [chainId]);

  const handleFlipNetworks = () => {
    const temp = fromNetwork;
    setFromNetwork(toNetwork);
    setToNetwork(temp);
    // Switch wallet to new from network
    if (switchChain) {
      switchChain({ chainId: toNetwork.id });
      toast.info("Switching network", {
        description: `Switching to ${toNetwork.name}`,
      });
    }
  };

  const handleMaxAmount = () => {
    if (balanceData) {
      // Leave some for gas fees (0.01 ETH for safety)
      const maxAmount = balanceData.value - parseEther("0.01");
      if (maxAmount > 0n) {
        setAmount(formatEther(maxAmount));
      }
    }
  };

  const handleSwap = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (!stargate.quote) {
      toast.error("Please wait for quote to load");
      return;
    }

    setSwapStatus("pending");
    
    // Execute Stargate swap (toast notifications handled in hook)
    const result = await stargate.executeSwap(
      fromNetwork.id,
      toNetwork.id,
      amount
    );
    
    if (result) {
      setSwapStatus("success");
      // Reset after 5 seconds
      setTimeout(() => {
        setSwapStatus("idle");
        setAmount("");
        stargate.reset();
      }, 5000);
    } else {
      setSwapStatus("error");
      setTimeout(() => setSwapStatus("idle"), 3000);
    }
  };  if (!isConnected) {
    return (
      <div className="bg-[#09090b] py-20">
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        </div>

        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="bg-white/[0.03] border-white/[0.08]">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <ArrowDownUp className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Connect Your Wallet</CardTitle>
              <CardDescription className="text-gray-300">
                Please connect your wallet to use the swap feature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => openModal()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25"
              >
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#09090b] py-12 min-h-[calc(100vh-80px)]">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </div>

      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-white">Cross-Chain Swap</h1>
          <p className="text-gray-300">
            Bridge assets between networks seamlessly with zero fees
          </p>
        </div>

        {/* Swap Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/[0.03] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ArrowDownUp className="w-5 h-5" />
                Swap
              </CardTitle>
              <CardDescription className="text-gray-400">
                Transfer tokens between networks using decentralized bridges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Network */}
              <div className="space-y-3">
                <Label className="text-white">From</Label>
                <div className="p-4 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <div className="flex items-center justify-between mb-3">
                    <select
                      value={fromNetwork.id}
                      onChange={(e) => {
                        const network = networks.find((n) => n.id === parseInt(e.target.value));
                        if (network) {
                          setFromNetwork(network);
                          if (switchChain) {
                            switchChain({ chainId: network.id });
                          }
                        }
                      }}
                      className="bg-white/[0.05] border border-white/[0.08] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    >
                      {networks.map((network) => (
                        <option key={network.id} value={network.id} disabled={network.id === toNetwork.id}>
                          {network.logo} {network.name}
                        </option>
                      ))}
                    </select>
                    {balanceData && (
                      <span className="text-sm text-gray-400">
                        Balance: {parseFloat(formatEther(balanceData.value)).toFixed(4)} {balanceData.symbol}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-transparent border-none text-2xl text-white placeholder:text-gray-500 focus:outline-none p-0"
                      step="0.000001"
                      min="0"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleMaxAmount}
                      className="shrink-0 border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                    >
                      MAX
                    </Button>
                  </div>
                </div>
              </div>

              {/* Flip Button */}
              <div className="flex justify-center -my-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleFlipNetworks}
                  className="rounded-full w-10 h-10 border-white/[0.08] bg-white/[0.05] hover:bg-white/[0.1] text-white"
                >
                  <ArrowDownUp className="w-4 h-4" />
                </Button>
              </div>

              {/* To Network */}
              <div className="space-y-3">
                <Label className="text-white">To</Label>
                <div className="p-4 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                  <div className="flex items-center justify-between mb-3">
                    <select
                      value={toNetwork.id}
                      onChange={(e) => {
                        const network = networks.find((n) => n.id === parseInt(e.target.value));
                        if (network) setToNetwork(network);
                      }}
                      className="bg-white/[0.05] border border-white/[0.08] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    >
                      {networks.map((network) => (
                        <option key={network.id} value={network.id} disabled={network.id === fromNetwork.id}>
                          {network.logo} {network.name}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-400">
                      You'll receive: ~{amount || "0.0"} {toNetwork.nativeCurrency.symbol}
                    </span>
                  </div>
                  <div className="text-2xl text-white">
                    {amount || "0.0"}
                  </div>
                </div>
              </div>

              {/* Quote Display */}
              {stargate.quote && amount && parseFloat(amount) > 0 && (
                <div className="p-4 rounded-xl bg-white/[0.05] border border-white/[0.08] space-y-2">
                  <h4 className="text-white font-semibold text-sm mb-3">Estimated Costs</h4>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Bridge Amount:</span>
                    <span className="text-white font-medium">{amount} {fromNetwork.nativeCurrency.symbol}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">LayerZero Messaging Fee:</span>
                    <span className="text-white">{formatEther(stargate.quote.nativeFee)} {fromNetwork.nativeCurrency.symbol}</span>
                  </div>
                  
                  <div className="border-t border-white/[0.08] pt-2 mt-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-gray-300">Total Cost:</span>
                      <span className="text-white">{formatEther(stargate.quote.totalCost)} {fromNetwork.nativeCurrency.symbol}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/[0.08] pt-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">You'll Receive:</span>
                      <div className="text-right">
                        <span className="text-green-400 font-semibold">{stargate.quote.estimatedOutput} {toNetwork.nativeCurrency.symbol}</span>
                        <p className="text-xs text-green-400/60 mt-0.5">1:1 swap, no slippage</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-500">Estimated Time:</span>
                      <span className="text-gray-400">{stargate.quote.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading Quote */}
              {stargate.isQuoting && (
                <div className="p-4 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  <span className="text-sm text-gray-400">Getting Stargate quote...</span>
                </div>
              )}

              {/* Info Banner */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-300">
                    <p className="font-semibold mb-1">Powered by Stargate Finance</p>
                    <p className="text-blue-200/80">
                      Secure cross-chain bridging via LayerZero V2. 1:1 swaps with no slippage for native tokens.
                    </p>
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <Button
                onClick={handleSwap}
                disabled={stargate.isSwapping || !amount || parseFloat(amount) <= 0 || !stargate.quote}
                className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg font-semibold disabled:opacity-50"
              >
                {stargate.isSwapping ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Bridging...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Bridge via Stargate
                  </>
                )}
              </Button>

              {/* Status Messages */}
              {swapStatus === "success" && stargate.result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-green-500/10 border border-green-500/30"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-1" />
                    <div className="text-sm text-green-300 flex-1">
                      <p className="font-semibold mb-2">Bridge Initiated Successfully!</p>
                      <div className="space-y-1 text-xs text-green-200/80">
                        <p>Your tokens are being bridged via Stargate Finance.</p>
                        <p className="font-mono break-all">Tx: {stargate.result.txHash.slice(0, 10)}...{stargate.result.txHash.slice(-8)}</p>
                      </div>
                      <a
                        href={stargate.getTrackingUrl(stargate.result.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 text-green-400 hover:text-green-300 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="text-xs">Track on LayerZero Scan</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Cards */}
        {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/[0.03] border-white/[0.08]">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-white font-semibold mb-1">Fast Bridging</h3>
              <p className="text-gray-400 text-sm">Average time: 5-10 minutes</p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.03] border-white/[0.08]">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="text-white font-semibold mb-1">Secure</h3>
              <p className="text-gray-400 text-sm">Powered by decentralized protocols</p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.03] border-white/[0.08]">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="text-white font-semibold mb-1">Zero Fees</h3>
              <p className="text-gray-400 text-sm">Only network gas costs</p>
            </CardContent>
          </Card>
        </div> */}

        {/* Disclaimer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            This is a demo implementation for testnet only. For production, integrate with{" "}
            <a href="https://chain.link/ccip" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
              Chainlink CCIP
            </a>
            {" "}or{" "}
            <a href="https://layerzero.network" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
              LayerZero
            </a>
          </p>
        </div>

        {/* All Supported Networks */}
        <div className="mt-12">
          <Card className="bg-white/[0.03] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white">Supported Networks via LayerZero</CardTitle>
              <CardDescription className="text-gray-400">
                We leverage LayerZero's omnichain infrastructure to enable cross-chain swaps across 30+ networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Active Networks */}
                <div>
                  <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Currently Active (Testnet)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {allNetworks.filter(n => n.isSupported).map((network) => (
                      <div
                        key={network.id}
                        className="p-4 rounded-lg bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-green-500/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${network.color} flex items-center justify-center text-xl`}>
                            {network.logo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate">{network.name}</p>
                            <p className="text-gray-400 text-xs">LZ ID: {network.layerZeroId}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mainnet Networks */}
                <div>
                  <h3 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4" />
                    Mainnet (Coming Soon)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {allNetworks.filter(n => !n.isSupported && n.id < 1000000).map((network) => (
                      <div
                        key={network.id}
                        className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${network.color} flex items-center justify-center text-sm`}>
                              {network.logo}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-xs truncate">{network.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-500">LZ: {network.layerZeroId}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                              Soon
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other Testnets */}
                <div>
                  <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Other Testnets (Coming Soon)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {allNetworks.filter(n => !n.isSupported && n.id >= 1000000).map((network) => (
                      <div
                        key={network.id}
                        className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${network.color} flex items-center justify-center text-sm`}>
                              {network.logo}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-xs truncate">{network.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-500">LZ: {network.layerZeroId}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                              Soon
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-white/[0.08]">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-white">{allNetworks.filter(n => n.isSupported).length}</p>
                    <p className="text-xs text-gray-400">Active Networks</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{allNetworks.filter(n => !n.isSupported && n.id < 1000000).length}</p>
                    <p className="text-xs text-gray-400">Mainnet Coming</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{allNetworks.length}</p>
                    <p className="text-xs text-gray-400">Total Networks</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
