import { createServerFn } from "@tanstack/react-start";
import { supabase, TABLES } from "@/lib/supabaseClient";

/**
 * Server function to get next available token ID
 * This is used to generate unique token IDs for NFTs
 */
export const getNextTokenId = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.NFTS)
      .select("token_id")
      .order("token_id", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      throw error;
    }

    const nextId = data?.token_id ? data.token_id + 1 : 1;
    return nextId;
  } catch (error) {
    console.error("Error getting next token ID:", error);
    return 1;
  }
});

/**
 * Server function to verify NFT ownership from database
 */
export const verifyNFTOwnershipFromDB = createServerFn({ method: "POST" })
  .inputValidator((data: { tokenId: number; ownerAddress: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { data: nft, error } = await supabase
        .from(TABLES.NFTS)
        .select("*")
        .eq("token_id", data.tokenId)
        .eq("owner_address", data.ownerAddress)
        .single();

      if (error) {
        return { isOwner: false };
      }

      return { isOwner: !!nft };
    } catch (error) {
      console.error("Error verifying NFT ownership:", error);
      return { isOwner: false };
    }
  });
