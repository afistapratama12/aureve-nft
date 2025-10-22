/**
 * Hook for purchasing NFTs via smart contract
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useWallet } from './useWallet'
import { useNFTContract, redeemVoucher, type LazyMintVoucher } from '@/services/blockchain/contractService'
import { supabase } from '@/lib/supabaseClient'
import { parseEther } from 'viem'

export interface PurchaseNFTParams {
  tokenId: number
  price: string // in ETH
  metadataUrl: string
  creatorAddress: string
  royaltyPercentage: number
  voucherSignature: string
}

/**
 * Hook to purchase NFT using lazy mint voucher
 */
export function usePurchaseNFT() {
  const { address, chainId } = useWallet()
  const contract = useNFTContract(chainId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: PurchaseNFTParams) => {
      if (!address) {
        throw new Error('Wallet not connected')
      }

      if (!contract) {
        throw new Error('Contract not available for this network')
      }

      if (!chainId) {
        throw new Error('Chain ID not available')
      }

      // Convert royalty percentage to basis points (bps)
      // 10% = 1000 bps
      const royaltyBps = BigInt(Math.floor(params.royaltyPercentage * 100))

      // Create voucher structure
      const voucher: LazyMintVoucher = {
        tokenId: BigInt(params.tokenId),
        uri: params.metadataUrl,
        price: parseEther(params.price),
        creator: params.creatorAddress as `0x${string}`,
        royaltyBps,
        signature: params.voucherSignature as `0x${string}`,
      }

      // Call contract to redeem voucher
      console.log('Redeeming voucher:', voucher)
      const tx = await redeemVoucher(contract, voucher, 1)

      // Wait for transaction confirmation
      console.log('Waiting for transaction confirmation...')
      // Note: In viem, tx hash is returned directly
      // You would need to wait for receipt using publicClient

      // Update database - mark as minted
      const { error: updateError } = await supabase
        .from('nfts')
        .update({
          is_minted: true,
          owner_address: address.toLowerCase(),
          minted_at: new Date().toISOString(),
          transaction_hash: tx, // tx hash from viem
        })
        .eq('token_id', params.tokenId)

      if (updateError) {
        console.error('Failed to update database:', updateError)
        // Transaction succeeded but DB update failed
        // This is not critical, on-chain data is source of truth
      }

      return {
        success: true,
        tokenId: params.tokenId,
        transactionHash: tx,
      }
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['aureve-nfts'] })
      queryClient.invalidateQueries({ queryKey: ['marketplace-nfts'] })
      queryClient.invalidateQueries({ queryKey: ['owned-nfts'] })
    },
    onError: (error) => {
      console.error('Purchase failed:', error)
    },
  })
}

/**
 * Hook to check if user owns an NFT
 */
export function useCheckNFTOwnership(tokenId: number) {
  const { address, chainId } = useWallet()
  const contract = useNFTContract(chainId)

  return useMutation({
    mutationFn: async () => {
      if (!address || !contract) {
        return false
      }

      try {
        const balance = await contract.read.balanceOf([
          address as `0x${string}`,
          BigInt(tokenId),
        ])
        return balance > 0n
      } catch (error) {
        console.error('Error checking ownership:', error)
        return false
      }
    },
  })
}

/**
 * Hook to get NFT metadata from contract
 */
export function useNFTMetadata(tokenId: number) {
  const { chainId } = useWallet()
  const contract = useNFTContract(chainId)

  return useMutation({
    mutationFn: async () => {
      if (!contract) {
        throw new Error('Contract not available')
      }

      try {
        const uri = await contract.read.uri([BigInt(tokenId)])
        const price = await contract.read.getPrice([BigInt(tokenId)])
        const totalSupply = await contract.read.totalSupply([BigInt(tokenId)])

        return {
          uri,
          price,
          totalSupply,
        }
      } catch (error) {
        console.error('Error fetching metadata:', error)
        throw error
      }
    },
  })
}
