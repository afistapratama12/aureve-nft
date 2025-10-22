import { createFileRoute } from "@tanstack/react-router";
import { useMarketplaceNFTs } from "@/hooks/useAureveNFTs";
import { useMarketplaceStore } from "@/stores";
import { NFTCard } from "@/components/ui/nft-card";
import { Search, Filter, Grid3x3, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";

/**
 * Marketplace page - Browse and search for NFTs
 */
export const Route = createFileRoute("/marketplace")({
  component: MarketplacePage,
});

function MarketplacePage() {
  const { assetTypeFilter, searchQuery, setAssetTypeFilter, setSearchQuery } =
    useMarketplaceStore();
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');

  const { data: allNFTs = [], isLoading } = useMarketplaceNFTs();

  // Filter NFTs based on search and asset type
  const assets = useMemo(() => {
    let filtered = allNFTs;

    // Filter by asset type
    if (assetTypeFilter && assetTypeFilter !== 'all') {
      filtered = filtered.filter((nft) => nft.assetType === assetTypeFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (nft) =>
          nft.title.toLowerCase().includes(query) ||
          nft.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allNFTs, assetTypeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </div>

      {/* Hero Section */}
      <div className="border-b border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Discover Digital Assets
            </h1>
            <p className="text-xl text-gray-300">
              Explore, collect, and trade unique NFTs from creators worldwide
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 flex-wrap items-center">
            {/* Search */}
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, creator, or collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-white/[0.08] rounded-xl bg-white/[0.03] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              />
            </div>

            {/* Asset Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={assetTypeFilter}
                onChange={(e) => setAssetTypeFilter(e.target.value as any)}
                className="px-4 py-3 border border-white/[0.08] rounded-xl bg-white/[0.03] text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              >
                <option value="all">All Types</option>
                <option value="image">🖼️ Images</option>
                <option value="video">🎬 Videos</option>
                <option value="audio">🎵 Audio</option>
                <option value="document">📄 Documents</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-1 border rounded-xl p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'large' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('large')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Assets Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto" />
              <p className="text-gray-400">Loading amazing assets...</p>
            </div>
          </div>
        ) : assets && assets.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {assets.map((asset) => (
              <NFTCard
                key={asset.id}
                id={asset.id}
                title={asset.title || 'Untitled'}
                description={asset.description}
                price={`${asset.price} ETH`}
                image={asset.imageUrl || ''}
                creator={asset.creatorAddress.slice(0, 6) + '...' + asset.creatorAddress.slice(-4)}
                editions={asset.tokenId}
                onPurchase={() => {
                  // TODO: Navigate to asset detail page
                  console.log('Purchase', asset.id);
                }}
                onFavorite={() => {
                  // TODO: Add to favorites
                  console.log('Favorite', asset.id);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">No assets found</h3>
                <p className="text-gray-400">`
                  Try adjusting your search or filters
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
