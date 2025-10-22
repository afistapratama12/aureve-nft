import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { useWallet } from './useWallet'

export interface AureveNFT {
  id: string
  tokenId: number
  title: string
  description: string
  price: string
  royaltyPercentage: number
  assetType: string
  fileUrl: string
  metadataUrl: string
  creatorAddress: string
  chainId: number
  isMinted: boolean
  createdAt: string
  imageUrl?: string // For display
}

/**
 * Fetch user's Aureve NFTs (created by user)
 */
export function useAureveNFTs() {
  const { address, chainId } = useWallet()

  return useQuery({
    queryKey: ['aureve-nfts', address, chainId],
    queryFn: async (): Promise<AureveNFT[]> => {
      if (!address) {
        return []
      }

      // Fetch NFTs created by this user
      const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .eq('creator_address', address.toLowerCase())
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching Aureve NFTs:', error)
        throw error
      }

      // Transform database records to frontend format
      const nfts: AureveNFT[] = (data || []).map((nft) => ({
        id: nft.id || nft.token_id.toString(),
        tokenId: nft.token_id,
        title: nft.title,
        description: nft.description || '',
        price: nft.price,
        royaltyPercentage: nft.royalty_percentage,
        assetType: nft.asset_type,
        fileUrl: nft.file_url,
        metadataUrl: nft.metadata_url,
        creatorAddress: nft.creator_address,
        chainId: nft.chain_id,
        isMinted: nft.is_minted || false,
        createdAt: nft.created_at,
        // Convert IPFS URL to gateway URL for display
        imageUrl: convertIPFSUrl(nft.file_url),
      }))

      return nfts
    },
    enabled: !!address,
    staleTime: 30000, // 30 seconds
    retry: 1,
  })
}

/**
 * Fetch all Aureve NFTs for marketplace (all users)
 */
export function useMarketplaceNFTs() {
  return useQuery({
    queryKey: ['marketplace-nfts'],
    queryFn: async (): Promise<AureveNFT[]> => {
      // Fetch all NFTs that are available for sale
      const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .eq('is_minted', false) // Only show unminted (available for sale)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching marketplace NFTs:', error)
        throw error
      }

      const nfts: AureveNFT[] = (data || []).map((nft) => ({
        id: nft.id || nft.token_id.toString(),
        tokenId: nft.token_id,
        title: nft.title,
        description: nft.description || '',
        price: nft.price,
        royaltyPercentage: nft.royalty_percentage,
        assetType: nft.asset_type,
        fileUrl: nft.file_url,
        metadataUrl: nft.metadata_url,
        creatorAddress: nft.creator_address,
        chainId: nft.chain_id,
        isMinted: nft.is_minted || false,
        createdAt: nft.created_at,
        imageUrl: convertIPFSUrl(nft.file_url),
      }))

      return nfts
    },
    staleTime: 60000, // 1 minute
    retry: 1,
  })
}

/**
 * Fetch user's owned/purchased Aureve NFTs
 */
export function useOwnedNFTs() {
  const { address } = useWallet()

  return useQuery({
    queryKey: ['owned-nfts', address],
    queryFn: async (): Promise<AureveNFT[]> => {
      if (!address) {
        return []
      }

      // In future, this would fetch from smart contract
      // For now, fetch minted NFTs where current owner = address
      // This requires an 'owner_address' field in the database
      
      const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .eq('is_minted', true)
        // .eq('owner_address', address.toLowerCase()) // TODO: Add this field
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching owned NFTs:', error)
        throw error
      }

      const nfts: AureveNFT[] = (data || []).map((nft) => ({
        id: nft.id || nft.token_id.toString(),
        tokenId: nft.token_id,
        title: nft.title,
        description: nft.description || '',
        price: nft.price,
        royaltyPercentage: nft.royalty_percentage,
        assetType: nft.asset_type,
        fileUrl: nft.file_url,
        metadataUrl: nft.metadata_url,
        creatorAddress: nft.creator_address,
        chainId: nft.chain_id,
        isMinted: nft.is_minted || false,
        createdAt: nft.created_at,
        imageUrl: convertIPFSUrl(nft.file_url),
      }))

      return nfts
    },
    enabled: !!address,
    staleTime: 30000,
    retry: 1,
  })
}

/**
 * Convert IPFS URL to gateway URL for display
 */
function convertIPFSUrl(ipfsUrl: string): string {
  if (!ipfsUrl) return ''
  
  if (ipfsUrl.startsWith('ipfs://')) {
    const hash = ipfsUrl.replace('ipfs://', '')
    // Use Pinata gateway or public gateway
    const gateway = import.meta.env.VITE_PINATA_GATEWAY || 'gateway.pinata.cloud'
    return `https://${gateway}/ipfs/${hash}`
  }
  
  return ipfsUrl
}
