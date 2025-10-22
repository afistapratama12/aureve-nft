import { useState } from "react";
import { toast } from "sonner";
import { useWallet } from "./useWallet";
import { BrowserProvider } from "ethers";
import {
  getStargateQuote,
  executeStargateSwap,
  getLayerZeroScanUrl,
  getMinSwapAmount,
  type StargateQuote,
  type StargateSwapResult,
} from "@/services/blockchain/stargateService";
import { parseEther } from "viem";

export interface SwapState {
  isQuoting: boolean;
  isSwapping: boolean;
  quote: StargateQuote | null;
  error: string | null;
  result: StargateSwapResult | null;
}

export function useStargateSwap() {
  const { provider, address } = useWallet();
  
  const [state, setState] = useState<SwapState>({
    isQuoting: false,
    isSwapping: false,
    quote: null,
    error: null,
    result: null,
  });

  const [minSwapAmount] = useState<bigint>(getMinSwapAmount());

  /**
   * Get quote for Stargate swap
   */
  const getQuote = async (
    fromChainId: number,
    toChainId: number,
    amount: string
  ): Promise<StargateQuote | null> => {
    if (!provider || !address) {
      const errorMsg = "Please connect your wallet first";
      setState(prev => ({ ...prev, error: errorMsg }));
      toast.error(errorMsg);
      return null;
    }

    setState(prev => ({ ...prev, isQuoting: true, error: null }));

    try {
      const amountWei = parseEther(amount);
      
      // Check minimum amount
      if (amountWei < minSwapAmount) {
        throw new Error(`Minimum swap amount is 0.01 ETH`);
      }

      const quote = await getStargateQuote(
        provider as unknown as BrowserProvider,
        fromChainId,
        toChainId,
        amountWei,
        address
      );

      setState(prev => ({ ...prev, quote, isQuoting: false }));
      return quote;
    } catch (error: any) {
      console.error("Quote error:", error);
      const errorMsg = error.message || "Failed to get quote";
      setState(prev => ({
        ...prev,
        error: errorMsg,
        isQuoting: false,
      }));
      toast.error(errorMsg);
      return null;
    }
  };

  /**
   * Execute Stargate swap
   */
  const executeSwap = async (
    fromChainId: number,
    toChainId: number,
    amount: string
  ): Promise<StargateSwapResult | null> => {
    if (!provider || !address) {
      const errorMsg = "Please connect your wallet first";
      setState(prev => ({ ...prev, error: errorMsg }));
      toast.error(errorMsg);
      return null;
    }

    setState(prev => ({ ...prev, isSwapping: true, error: null, result: null }));

    // Show loading toast
    const loadingToast = toast.loading("Initiating cross-chain swap...");

    try {
      const amountWei = parseEther(amount);

      const result = await executeStargateSwap(
        provider as unknown as BrowserProvider,
        fromChainId,
        toChainId,
        amountWei,
        address
      );

      setState(prev => ({
        ...prev,
        result,
        isSwapping: false,
      }));

      // Dismiss loading and show success
      toast.dismiss(loadingToast);
      toast.success("Swap initiated successfully!", {
        description: "Track your transaction on LayerZero Scan",
        duration: 5000,
      });

      return result;
    } catch (error: any) {
      console.error("Swap error:", error);
      const errorMsg = error.message || "Swap transaction failed";
      
      setState(prev => ({
        ...prev,
        error: errorMsg,
        isSwapping: false,
      }));

      // Dismiss loading and show error
      toast.dismiss(loadingToast);
      toast.error("Swap failed", {
        description: errorMsg,
        duration: 5000,
      });

      return null;
    }
  };

  /**
   * Reset state
   */
  const reset = () => {
    setState({
      isQuoting: false,
      isSwapping: false,
      quote: null,
      error: null,
      result: null,
    });
  };

  /**
   * Get LayerZero Scan URL for tracking
   */
  const getTrackingUrl = (txHash: string): string => {
    return getLayerZeroScanUrl(txHash);
  };

  return {
    ...state,
    minSwapAmount,
    getQuote,
    executeSwap,
    reset,
    getTrackingUrl,
  };
}
