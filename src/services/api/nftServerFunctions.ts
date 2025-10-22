import { createServerFn } from "@tanstack/react-start";
import { Wallet } from "ethers";
import { supabase, TABLES } from "@/lib/supabaseClient";

/**
 * Server function to create lazy mint voucher
 * Signs a voucher that can be redeemed on-chain
 */
export const createLazyMintVoucher = createServerFn({ method: "POST"}).inputValidator((data: {
  assetId: string;
  tokenId: number;
  uri: string;
  priceWei: string;
  creatorWallet: string;
  royaltyBps: number;
}) => data ).handler(async ({ data }) => {
  try {
    const signerPrivateKey = process.env.SIGNER_PRIVATE_KEY;
    if (!signerPrivateKey) {
      throw new Error("Signer private key not configured");
    }

    // Create wallet instance for signing
    const wallet = new Wallet(signerPrivateKey);

    // Generate nonce
    const nonce = Date.now();

    // Create voucher hash (must match contract's _getVoucherHash)
    const { ethers } = await import("ethers");
    const voucherHash = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "string", "uint256", "address", "uint96", "uint256"],
        [
          data.tokenId,
          data.uri,
          data.priceWei,
          data.creatorWallet,
          data.royaltyBps,
          nonce,
        ]
      )
    );

    // Sign the hash
    const signature = await wallet.signMessage(ethers.getBytes(voucherHash));

    // Store voucher in database
    const { error } = await supabase
      .from(TABLES.VOUCHERS)
      .insert({
        asset_id: data.assetId,
        token_id: data.tokenId,
        signature,
        nonce,
        creator_wallet: data.creatorWallet,
        uri: data.uri,
        price_wei: data.priceWei,
        royalty_bps: data.royaltyBps,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      tokenId: data.tokenId,
      uri: data.uri,
      price: data.priceWei,
      creator: data.creatorWallet,
      royaltyBps: data.royaltyBps,
      nonce,
      signature,
    };
  } catch (error) {
    console.error("Error creating voucher:", error);
    throw new Error("Failed to create lazy mint voucher" + (error instanceof Error ? ": " + error.message : ""));
  }
});

/**
 * Server function to verify NFT ownership
 * Checks on-chain balance for gated access
 */
export const verifyNFTOwnership = createServerFn({ method: "POST"}).inputValidator((data: {
  tokenId: number;
  walletAddress: string;
  chainId: number;
}) => data).handler(async ({ data }) => {
  try {
    const { getNFTBalance } = await import("@/services/blockchain/walletService");
    
    const balance = await getNFTBalance(data.tokenId, data.walletAddress);
    
    return {
      owns: balance > 0,
      balance,
    };
  } catch (error) {
    console.error("Error verifying ownership:", error);
    return { owns: false, balance: 0 };
  }
});

/**
 * Server function to get signed URL for full asset access
 * Only available to NFT holders
 */
export const getAssetAccessUrl = createServerFn({ method: "POST"}).inputValidator((data: {
  assetId: string;
  walletAddress: string;
}) => data).handler(async ({ data }) => {
  try {
    // Get asset from database
    const { data: asset, error: assetError } = await supabase
      .from(TABLES.NFTS)
      .select("*")
      .eq("id", data.assetId)
      .single();

    if (assetError || !asset) {
      throw new Error("Asset not found");
    }

    // Verify ownership
    if (!asset.token_id) {
      throw new Error("Asset not minted yet");
    }

    const { getNFTBalance } = await import("@/services/blockchain/walletService");
    const balance = await getNFTBalance(asset.token_id, data.walletAddress);

    if (balance === 0) {
      throw new Error("You do not own this NFT");
    }

    // Return IPFS URL for full asset
    const { getIPFSUrl } = await import("@/services/storage/pinataService");
    const fullAssetUrl = getIPFSUrl(asset.full_cid);

    return {
      url: fullAssetUrl,
      cid: asset.full_cid,
      expiresAt: Date.now() + 3600000, // 1 hour
    };
  } catch (error) {
    console.error("Error getting asset access:", error);
    throw error;
  }
});

/**
 * Server function to record transaction in database
 */
export const recordTransaction = createServerFn({ method:"POST"}).inputValidator((data: {
 assetId: string;
  tokenId: number;
  transactionHash: string;
  transactionType: "mint" | "purchase" | "transfer";
  fromWallet?: string;
  toWallet: string;
  amount: number;
  priceWei?: string;
  chainId: number;
}) => data).handler(async ({ data }) => {
  const params = data

  try {
    const { data, error } = await supabase
      .from(TABLES.TRANSACTIONS)
      .insert({
        asset_id: params.assetId,
        token_id: params.tokenId,
        transaction_hash: params.transactionHash,
        transaction_type: params.transactionType,
        from_wallet: params.fromWallet,
        to_wallet: params.toWallet,
        amount: params.amount,
        price_wei: params.priceWei,
        chain_id: params.chainId,
      })
      .select()
      .single();

    if (error) throw error;

    // Also create/update NFT record
    await supabase.from(TABLES.NFTS).upsert({
      asset_id: params.assetId,
      token_id: params.tokenId,
      owner_wallet: params.toWallet,
      mint_transaction_hash: params.transactionHash,
      chain_id: params.chainId,
      amount: params.amount,
    });

    return data;
  } catch (error) {
    console.error("Error recording transaction:", error);
    throw error;
  }
});
