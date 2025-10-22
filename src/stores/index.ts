import { create } from "zustand";
import { Asset } from "@/lib/supabaseClient";

// Export wallet store
export { useWalletStore, type WalletState } from "./walletStore";

/**
 * Asset store for managing uploaded assets
 */

export interface AssetState {
  // Upload state
  isUploading: boolean;
  uploadProgress: number;
  currentAsset: Asset | null;

  // Actions
  setIsUploading: (isUploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setCurrentAsset: (asset: Asset | null) => void;
  resetUpload: () => void;
}

export const useAssetStore = create<AssetState>((set) => ({
  // Initial state
  isUploading: false,
  uploadProgress: 0,
  currentAsset: null,

  // Actions
  setIsUploading: (isUploading) => set({ isUploading }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
  setCurrentAsset: (currentAsset) => set({ currentAsset }),
  
  resetUpload: () =>
    set({
      isUploading: false,
      uploadProgress: 0,
      currentAsset: null,
    }),
}));

/**
 * NFT store for managing minted NFTs
 */

export interface NFTState {
  // Current viewing NFT
  selectedTokenId: number | null;
  
  // Actions
  setSelectedTokenId: (tokenId: number | null) => void;
}

export const useNFTStore = create<NFTState>((set) => ({
  // Initial state
  selectedTokenId: null,

  // Actions
  setSelectedTokenId: (selectedTokenId) => set({ selectedTokenId }),
}));

/**
 * Marketplace store for filters and search
 */

export interface MarketplaceState {
  // Filters
  assetTypeFilter: "all" | "image" | "video" | "audio" | "document";
  searchQuery: string;
  sortBy: "newest" | "oldest" | "price-low" | "price-high" | "popular";
  priceRange: [number, number];

  // Actions
  setAssetTypeFilter: (filter: "all" | "image" | "video" | "audio" | "document") => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: "newest" | "oldest" | "price-low" | "price-high" | "popular") => void;
  setPriceRange: (range: [number, number]) => void;
  resetFilters: () => void;
}

export const useMarketplaceStore = create<MarketplaceState>((set) => ({
  // Initial state
  assetTypeFilter: "all",
  searchQuery: "",
  sortBy: "newest",
  priceRange: [0, 10], // in ETH

  // Actions
  setAssetTypeFilter: (assetTypeFilter) => set({ assetTypeFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortBy: (sortBy) => set({ sortBy }),
  setPriceRange: (priceRange) => set({ priceRange }),
  
  resetFilters: () =>
    set({
      assetTypeFilter: "all",
      searchQuery: "",
      sortBy: "newest",
      priceRange: [0, 10],
    }),
}));
