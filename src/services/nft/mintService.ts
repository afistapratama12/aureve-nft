import { supabase } from '@/lib/supabaseClient'
import { uploadToPinata, uploadJSONToPinata } from '@/services/storage/pinataService'
import type { Hex } from 'viem'

export interface MintFormData {
  file: File
  title: string
  description: string
  price: string
  royalty: string
  assetType: 'image' | 'video' | 'audio' | 'document'
}

export interface NFTMetadata {
  name: string
  description: string
  image: string
  external_url?: string
  attributes?: Array<{ trait_type: string; value: string }>
}

export interface LazyMintVoucher {
  tokenId: number
  minPrice: string
  uri: string
  signature: Hex
  creator: string
}

/**
 * Upload file and metadata to IPFS via Pinata
 */
export async function uploadToIPFS(
  file: File,
  metadata: NFTMetadata
): Promise<{ fileUrl: string; metadataUrl: string }> {
  try {
    // 1. Upload file to IPFS
    console.log('Uploading file to IPFS...')
    const fileHash = await uploadToPinata(file, {
      name: file.name,
      keyvalues: {
        type: 'asset',
        uploadedBy: 'Aureve',
      },
    })
    const fileUrl = `ipfs://${fileHash}`

    // 2. Update metadata with IPFS file URL
    const completeMetadata: NFTMetadata = {
      ...metadata,
      image: fileUrl,
    }

    // 3. Upload metadata JSON to IPFS
    console.log('Uploading metadata to IPFS...')
    const metadataHash = await uploadJSONToPinata(completeMetadata, 'metadata.json')
    const metadataUrl = `ipfs://${metadataHash}`

    return { fileUrl, metadataUrl }
  } catch (error) {
    console.error('IPFS upload error:', error)
    throw new Error('Failed to upload to IPFS')
  }
}

/**
 * Create lazy mint voucher (signature for lazy minting)
 * This will be signed by the backend/creator's wallet
 */
export async function createLazyMintVoucher(
  data: {
    creator: string
    tokenUri: string
    minPrice: string
    chainId: number
  }
): Promise<LazyMintVoucher> {
  try {
    // Generate unique tokenId (timestamp + random)
    const tokenId = Date.now() + Math.floor(Math.random() * 1000)

    // TODO: In production, this should be signed by backend with creator's private key
    // For now, we'll create the voucher structure without signature
    const voucher: LazyMintVoucher = {
      tokenId,
      minPrice: data.minPrice,
      uri: data.tokenUri,
      signature: '0x' as Hex, // Placeholder - should be signed by backend
      creator: data.creator,
    }

    console.log('Created lazy mint voucher:', voucher)
    return voucher
  } catch (error) {
    console.error('Voucher creation error:', error)
    throw new Error('Failed to create mint voucher')
  }
}

/**
 * Save NFT data to Supabase
 */
export async function saveNFTToDatabase(data: {
  tokenId: number
  creator: string
  title: string
  description: string
  price: string
  royalty: string
  assetType: string
  fileUrl: string
  metadataUrl: string
  chainId: number
  voucher: LazyMintVoucher
}): Promise<void> {
  try {
    const { error } = await supabase.from('nfts').insert({
      token_id: data.tokenId,
      creator_address: data.creator.toLowerCase(),
      title: data.title,
      description: data.description,
      price: data.price,
      royalty_percentage: parseFloat(data.royalty),
      asset_type: data.assetType,
      file_url: data.fileUrl,
      metadata_url: data.metadataUrl,
      chain_id: data.chainId,
      voucher_signature: data.voucher.signature,
      is_minted: false,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('NFT saved to database successfully')
  } catch (error) {
    console.error('Database save error:', error)
    throw new Error('Failed to save NFT to database')
  }
}

/**
 * Complete NFT creation process
 */
export async function createNFT(
  formData: MintFormData,
  walletAddress: string,
  chainId: number
): Promise<{ tokenId: number; metadataUrl: string }> {
  try {
    // 1. Prepare metadata
    const metadata: NFTMetadata = {
      name: formData.title,
      description: formData.description,
      image: '', // Will be filled after IPFS upload
      attributes: [
        { trait_type: 'Asset Type', value: formData.assetType },
        { trait_type: 'Creator', value: walletAddress },
      ],
    }

    // 2. Upload to IPFS
    const { fileUrl, metadataUrl } = await uploadToIPFS(formData.file, metadata)

    // 3. Create lazy mint voucher
    const voucher = await createLazyMintVoucher({
      creator: walletAddress,
      tokenUri: metadataUrl,
      minPrice: formData.price,
      chainId,
    })

    // 4. Save to Supabase
    await saveNFTToDatabase({
      tokenId: voucher.tokenId,
      creator: walletAddress,
      title: formData.title,
      description: formData.description,
      price: formData.price,
      royalty: formData.royalty,
      assetType: formData.assetType,
      fileUrl,
      metadataUrl,
      chainId,
      voucher,
    })

    return {
      tokenId: voucher.tokenId,
      metadataUrl,
    }
  } catch (error) {
    console.error('NFT creation error:', error)
    throw error
  }
}
