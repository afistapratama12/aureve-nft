/**
 * NFT Contract Service
 * Handles all interactions with Aureve NFT smart contract
 */

import { getContract } from 'viem'
import { useWalletClient, usePublicClient } from 'wagmi'

// Contract addresses per network
export const NFT_CONTRACT_ADDRESSES = {
  11155111: import.meta.env.VITE_NFT_CONTRACT_ADDRESS_ETHEREUM_SEPOLIA, // Ethereum Sepolia
  421614: import.meta.env.VITE_NFT_CONTRACT_ADDRESS_ARBITRUM_SEPOLIA, // Arbitrum Sepolia
  10143: import.meta.env.VITE_NFT_CONTRACT_ADDRESS_MONAD_TESTNET, // Monad Testnet
} as const

/**
 * Get contract address for current chain
 */
export function getContractAddress(chainId: number): string | undefined {
  return NFT_CONTRACT_ADDRESSES[chainId as keyof typeof NFT_CONTRACT_ADDRESSES]
}

/**
 * NFT Contract ABI
 * Based on ERC1155 with lazy minting capability
 */
export const NFT_CONTRACT_ABI = [
  // Read functions
  {
    inputs: [],
    name: 'name',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'uri',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'id', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'totalSupply',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getPrice',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Write functions - Lazy Minting
  {
    inputs: [
      {
        components: [
          { name: 'tokenId', type: 'uint256' },
          { name: 'uri', type: 'string' },
          { name: 'price', type: 'uint256' },
          { name: 'creator', type: 'address' },
          { name: 'royaltyBps', type: 'uint96' },
          { name: 'signature', type: 'bytes' },
        ],
        name: 'voucher',
        type: 'tuple',
      },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'redeemVoucher',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'tokenId', type: 'uint256' },
      { indexed: true, name: 'minter', type: 'address' },
      { indexed: true, name: 'creator', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
    ],
    name: 'TokenMinted',
    type: 'event',
  },
] as const

export interface LazyMintVoucher {
  tokenId: bigint
  uri: string
  price: bigint
  creator: `0x${string}`
  royaltyBps: bigint
  signature: `0x${string}`
}

/**
 * Get NFT contract instance
 */
export function useNFTContract(chainId?: number) {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  if (!chainId) return null

  const address = getContractAddress(chainId)
  if (!address) {
    console.warn(`No contract address for chain ${chainId}`)
    return null
  }

  if (!publicClient) return null

  if (!walletClient) {
    // Read-only contract
    return getContract({
      address: address as `0x${string}`,
      abi: NFT_CONTRACT_ABI,
      client: publicClient,
    })
  }

  // Read-write contract
  return getContract({
    address: address as `0x${string}`,
    abi: NFT_CONTRACT_ABI,
    client: walletClient,
  })
}

/**
 * Redeem lazy mint voucher (purchase NFT)
 */
export async function redeemVoucher(
  contract: any,
  voucher: LazyMintVoucher,
  amount: number = 1
) {
  try {
    const value = voucher.price * BigInt(amount)

    const tx = await contract.write.redeemVoucher([voucher, BigInt(amount)], {
      value,
    })

    console.log('Transaction sent:', tx)
    return tx
  } catch (error) {
    console.error('Error redeeming voucher:', error)
    throw error
  }
}

/**
 * Get token URI (metadata URL)
 */
export async function getTokenURI(
  contract: any,
  tokenId: bigint
): Promise<string> {
  try {
    const uri = await contract.read.uri([tokenId])
    return uri
  } catch (error) {
    console.error('Error getting token URI:', error)
    throw error
  }
}

/**
 * Get token balance for an address
 */
export async function getTokenBalance(
  contract: any,
  address: `0x${string}`,
  tokenId: bigint
): Promise<bigint> {
  try {
    const balance = await contract.read.balanceOf([address, tokenId])
    return balance
  } catch (error) {
    console.error('Error getting token balance:', error)
    throw error
  }
}

/**
 * Get token price
 */
export async function getTokenPrice(
  contract: any,
  tokenId: bigint
): Promise<bigint> {
  try {
    const price = await contract.read.getPrice([tokenId])
    return price
  } catch (error) {
    console.error('Error getting token price:', error)
    throw error
  }
}

/**
 * Get total supply of token
 */
export async function getTotalSupply(
  contract: any,
  tokenId: bigint
): Promise<bigint> {
  try {
    const supply = await contract.read.totalSupply([tokenId])
    return supply
  } catch (error) {
    console.error('Error getting total supply:', error)
    throw error
  }
}

/**
 * Check if user owns a specific NFT
 */
export async function checkOwnership(
  contract: any,
  address: `0x${string}`,
  tokenId: bigint
): Promise<boolean> {
  try {
    const balance = await getTokenBalance(contract, address, tokenId)
    return balance > 0n
  } catch (error) {
    console.error('Error checking ownership:', error)
    return false
  }
}
