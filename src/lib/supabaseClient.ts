import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client configuration
 * Used for database operations and storage
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Public client (anon key) - for frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface User {
  id: string;
  wallet_address: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  creator_id?: string;
  creator_wallet: string;
  title: string;
  description?: string;
  asset_type: "image" | "video" | "audio" | "document";
  preview_cid: string;
  full_cid: string;
  metadata_cid?: string;
  file_size?: number;
  mime_type?: string;
  original_filename?: string;
  token_id?: number;
  price: string; // stored as string to handle big numbers
  royalty_percentage: number;
  status: "draft" | "pending" | "minted" | "archived";
  created_at: string;
  updated_at: string;
}

export interface NFT {
  id: string;
  asset_id: string;
  token_id: number;
  owner_wallet: string;
  owner_id?: string;
  mint_transaction_hash: string;
  mint_block_number?: number;
  chain_id: number;
  amount: number;
  minted_at: string;
}

export interface Transaction {
  id: string;
  asset_id: string;
  token_id: number;
  transaction_type: "mint" | "purchase" | "transfer";
  transaction_hash: string;
  block_number?: number;
  chain_id: number;
  from_wallet?: string;
  to_wallet: string;
  amount: number;
  price_wei?: string;
  platform_fee_wei?: string;
  creator_payment_wei?: string;
  created_at: string;
}

export interface Royalty {
  id: string;
  asset_id: string;
  creator_wallet: string;
  transaction_id: string;
  amount_wei: string;
  percentage: number;
  status: "pending" | "paid" | "failed";
  payout_transaction_hash?: string;
  created_at: string;
  paid_at?: string;
}

export interface Voucher {
  id: string;
  asset_id: string;
  token_id: number;
  signature: string;
  nonce: number;
  is_redeemed: boolean;
  creator_wallet: string;
  uri: string;
  price_wei: string;
  royalty_bps: number;
  created_at: string;
  redeemed_at?: string;
}

// Database table names
export const TABLES = {
  USERS: "users",
  ASSETS: "assets",
  NFTS: "nfts",
  TRANSACTIONS: "transactions",
  ROYALTIES: "royalties",
  VOUCHERS: "vouchers",
} as const;
