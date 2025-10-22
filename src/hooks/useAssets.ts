import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, Asset, TABLES } from "@/lib/supabaseClient";

/**
 * Hook to get all assets (marketplace)
 */
export function useGetAssets(filters?: {
  assetType?: string;
  creator?: string;
  status?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["assets", filters],
    queryFn: async () => {
      let query = supabase
        .from(TABLES.ASSETS)
        .select("*")
        .eq("status", "minted")
        .order("created_at", { ascending: false });

      if (filters?.assetType && filters.assetType !== "all") {
        query = query.eq("asset_type", filters.assetType);
      }

      if (filters?.creator) {
        query = query.eq("creator_wallet", filters.creator);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Asset[];
    },
  });
}

/**
 * Hook to get single asset by ID
 */
export function useGetAsset(assetId: string) {
  return useQuery({
    queryKey: ["asset", assetId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLES.ASSETS)
        .select("*")
        .eq("id", assetId)
        .single();

      if (error) throw error;
      return data as Asset;
    },
    enabled: !!assetId,
  });
}

/**
 * Hook to get assets by creator
 */
export function useGetCreatorAssets(creatorWallet: string) {
  return useQuery({
    queryKey: ["creator-assets", creatorWallet],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLES.ASSETS)
        .select("*")
        .eq("creator_wallet", creatorWallet)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Asset[];
    },
    enabled: !!creatorWallet,
  });
}

/**
 * Hook to create/upload asset
 */
export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assetData: Partial<Asset>) => {
      const { data, error } = await supabase
        .from(TABLES.ASSETS)
        .insert(assetData)
        .select()
        .single();

      if (error) throw error;
      return data as Asset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

/**
 * Hook to update asset
 */
export function useUpdateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Asset> }) => {
      const { data, error } = await supabase
        .from(TABLES.ASSETS)
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Asset;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["asset", data.id] });
    },
  });
}
