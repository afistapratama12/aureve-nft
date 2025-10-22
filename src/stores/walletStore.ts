import { create } from "zustand";

/**
 * Wallet store for managing wallet connection state
 * Handles address, chain ID, balance, and connection status
 */

export interface WalletState {
  // State
  address: string | null;
  chainId: number | null;
  balance: string | null;
  isConnected: boolean;
  isConnecting: boolean;

  // Actions
  setAddress: (address: string | null) => void;
  setChainId: (chainId: number | null) => void;
  setBalance: (balance: string | null) => void;
  setIsConnected: (isConnected: boolean) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  disconnect: () => void;
  connect: (data: { address: string; chainId: number }) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  // Initial state
  address: null,
  chainId: null,
  balance: null,
  isConnected: false,
  isConnecting: false,

  // Actions
  setAddress: (address) => set({ address }),
  setChainId: (chainId) => set({ chainId }),
  setBalance: (balance) => set({ balance }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setIsConnecting: (isConnecting) => set({ isConnecting }),
  
  disconnect: () =>
    set({
      address: null,
      chainId: null,
      balance: null,
      isConnected: false,
      isConnecting: false,
    }),

  connect: ({ address, chainId }) =>
    set({
      address,
      chainId,
      isConnected: true,
      isConnecting: false,
    }),
}));
