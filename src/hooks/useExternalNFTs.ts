import { useQuery } from '@tanstack/react-query'
import { useWallet } from '@/hooks/useWallet'
import { Alchemy, Network, OwnedNft } from 'alchemy-sdk'

// Alchemy configuration per network
const getAlchemyConfig = (chainId: number | undefined) => {
  switch (chainId) {
    case 11155111: // Ethereum Sepolia
      return {
        apiKey: import.meta.env.VITE_ALCHEMY_API_KEY_SEPOLIA || 'demo',
        network: Network.ETH_SEPOLIA,
      }
    case 421614: // Arbitrum Sepolia
      return {
        apiKey: import.meta.env.VITE_ALCHEMY_API_KEY_SEPOLIA || 'demo',
        network: Network.ARB_SEPOLIA,
      }
    case 10143: // Monad Testnet
      return {
        apiKey: import.meta.env.VITE_ALCHEMY_API_KEY_SEPOLIA || 'demo',
        network: Network.MONAD_TESTNET,
      }
    default:
      // Fallback to Ethereum Sepolia
      return {
        apiKey: import.meta.env.VITE_ALCHEMY_API_KEY_SEPOLIA || 'demo',
        network: Network.ETH_SEPOLIA,
      }
  }
}

export interface ExternalNFT {
  id: string
  title: string
  description?: string
  image: string
  collection: string
  contractAddress: string
  tokenId: string
  network: string
}

/**
 * Hook to fetch NFTs owned by user from other contracts (not Aureve NFTs)
 * Uses Alchemy API to get all NFTs for the connected wallet
 */
export function useExternalNFTs() {
  const { address, chainId, isConnected } = useWallet()

  return useQuery({
    queryKey: ['external-nfts', address, chainId],
    queryFn: async (): Promise<ExternalNFT[]> => {
      if (!address) return []

      try {
        const config = getAlchemyConfig(chainId)
        const alchemy = new Alchemy(config)

        // Get NFTs owned by this address
        const nftsResponse = await alchemy.nft.getNftsForOwner(address, {
          excludeFilters: [], // Get all NFTs
          omitMetadata: false,
        })

        // Aureve contract address - filter these out
        const aureveContractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS_ETHEREUM_SEPOLIA?.toLowerCase()

        // Transform to our NFT format and exclude Aureve NFTs
        const externalNFTs: ExternalNFT[] = nftsResponse.ownedNfts
          .filter((nft: OwnedNft) => {
            // Exclude Aureve contract NFTs
            if (aureveContractAddress && nft.contract.address.toLowerCase() === aureveContractAddress) {
              return false
            }
            return true
          })
          .map((nft: OwnedNft) => {
            // Get image URL - check multiple possible fields
            const imageUrl = 
              nft.image?.thumbnailUrl ||
              nft.image?.cachedUrl ||
              nft.image?.originalUrl ||
              (nft as any).rawMetadata?.image ||
              '/placeholder.png'

            return {
              id: `${nft.contract.address}-${nft.tokenId}`,
              title: nft.name || nft.contract.name || `#${nft.tokenId}`,
              description: nft.description || '',
              image: imageUrl,
              collection: nft.contract.name || 'Unknown Collection',
              contractAddress: nft.contract.address,
              tokenId: nft.tokenId,
              network: config.network,
            }
          })

        return externalNFTs
      } catch (error) {
        console.error('Error fetching external NFTs:', error)
        // Return empty array instead of throwing to prevent UI breaks
        return []
      }
    },
    enabled: isConnected && !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}
