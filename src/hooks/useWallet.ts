import { useAccount, useDisconnect, useBalance, useSwitchChain } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { formatEther } from 'viem'
import { useWalletStore } from '@/stores'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Hook to get wallet connection state
 */
export function useWallet() {
  const { address, isConnected, chain } = useAccount()
  const { open } = useWeb3Modal()
  const { disconnect } = useDisconnect()
  
  const { data: balanceData } = useBalance({
    address: address,
  })

  const formattedBalance = balanceData 
    ? `${parseFloat(formatEther(balanceData.value)).toFixed(4)} ${balanceData.symbol}`
    : '0.0000 ETH'

  return {
    address,
    isConnected,
    chainId: chain?.id,
    chainName: chain?.name,
    balance: formattedBalance,
    openModal: open,
    disconnect,
  }
}

/**
 * Hook to connect wallet
 */
export function useConnectWallet() {
  const { open } = useWeb3Modal()
  
  return {
    connect: () => open(),
  }
}

/**
 * Hook to get current wallet info
 */
export function useWalletInfo() {
  const { address, isConnected, chain } = useAccount()
  const { data: balanceData } = useBalance({
    address: address,
  })

  return {
    address,
    chainId: chain?.id,
    balance: balanceData ? formatEther(balanceData.value) : '0',
    isConnected,
  }
}

/**
 * Hook to switch network
 */
export function useSwitchNetwork() {
  const { switchChain } = useSwitchChain()

  return {
    switchNetwork: (chainId: number) => switchChain({ chainId }),
  }
}

/**
 * Hook to disconnect wallet
 */
export function useDisconnectWallet() {
  const { disconnect } = useWalletStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      disconnect();
      queryClient.clear();
    },
  });
}
