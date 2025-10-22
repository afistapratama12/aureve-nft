import { Asset } from "@/lib/supabaseClient";
import { formatWeiToEth } from "@/services/blockchain/walletService";
import { Link } from "@tanstack/react-router";

/**
 * AssetCard component
 * Displays asset preview in marketplace/dashboard
 */
interface AssetCardProps {
  asset: Asset;
  showCreator?: boolean;
}

export function AssetCard({ asset, showCreator = true }: AssetCardProps) {
  const previewUrl = `https://${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${asset.preview_cid}`;
  const priceInEth = formatWeiToEth(asset.price);

  return (
    <Link
      to="/assets/$assetId"
      params={{ assetId: asset.id }}
      className="block group"
    >
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        {/* Preview Image/Video */}
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {asset.asset_type === "image" ? (
            <img
              src={previewUrl}
              alt={asset.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : asset.asset_type === "video" ? (
            <video
              src={previewUrl}
              className="w-full h-full object-cover"
              muted
              loop
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
          ) : asset.asset_type === "audio" ? (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-400 to-pink-400">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-400 to-cyan-400">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          )}

          {/* Asset Type Badge */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
            {asset.asset_type}
          </div>
        </div>

        {/* Asset Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg truncate">{asset.title}</h3>
          {asset.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {asset.description}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Price</p>
              <p className="font-bold text-lg">{priceInEth} ETH</p>
            </div>

            {asset.token_id && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Token ID</p>
                <p className="font-mono text-sm">#{asset.token_id}</p>
              </div>
            )}
          </div>

          {showCreator && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-gray-500">Creator</p>
              <p className="font-mono text-sm truncate">
                {asset.creator_wallet}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
