import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNFTContract, checkNFTOwnership, getNFTBalance } from "@/services/blockchain/walletService";
import { supabase, TABLES, NFT } from "@/lib/supabaseClient";
import { parseEther } from "ethers";

/**
 * Hook to redeem lazy mint voucher (first purchase)
 */
export function useRedeemVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      voucher: {
        tokenId: number;
        uri: string;
        price: string;
        creator: string;
        royaltyBps: number;
        nonce: number;
        signature: string;
      };
      amount: number;
    }) => {
      const contract = await getNFTContract();
      if (!contract) throw new Error("Contract not available");

      const totalPrice = parseEther(params.voucher.price) * BigInt(params.amount);
      
      const tx = await contract.redeemVoucher(params.voucher, params.amount, {
        value: totalPrice,
      });

      const receipt = await tx.wait();
      return { transaction: receipt, tokenId: params.voucher.tokenId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nfts"] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

/**
 * Hook to purchase existing NFT
 */
export function usePurchaseNFT() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      tokenId: number;
      amount: number;
      priceInEth: string;
    }) => {
      const contract = await getNFTContract();
      if (!contract) throw new Error("Contract not available");

      const totalPrice = parseEther(params.priceInEth) * BigInt(params.amount);

      const tx = await contract.purchaseToken(params.tokenId, params.amount, {
        value: totalPrice,
      });

      const receipt = await tx.wait();
      return { transaction: receipt, tokenId: params.tokenId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nfts"] });
    },
  });
}

/**
 * Hook to check NFT ownership
 */
export function useCheckOwnership(tokenId: number, userAddress: string) {
  return useQuery({
    queryKey: ["nft-ownership", tokenId, userAddress],
    queryFn: () => checkNFTOwnership(tokenId, userAddress),
    enabled: !!tokenId && !!userAddress,
  });
}

/**
 * Hook to get user's NFTs
 */
export function useGetUserNFTs(walletAddress: string) {
  return useQuery({
    queryKey: ["user-nfts", walletAddress],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLES.NFTS)
        .select("*, assets(*)")
        .eq("owner_wallet", walletAddress);

      if (error) throw error;
      return data as NFT[];
    },
    enabled: !!walletAddress,
  });
}

/**
 * Hook to get NFT balance
 */
export function useNFTBalance(tokenId: number, userAddress: string) {
  return useQuery({
    queryKey: ["nft-balance", tokenId, userAddress],
    queryFn: () => getNFTBalance(tokenId, userAddress),
    enabled: !!tokenId && !!userAddress,
  });
}
