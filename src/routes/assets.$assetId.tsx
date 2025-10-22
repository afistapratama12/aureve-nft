import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Download, ExternalLink, User, Calendar, Hash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { Asset } from "@/lib/supabaseClient";

export const Route = createFileRoute("/assets/$assetId")({
  component: AssetDetailPage,
});

function AssetDetailPage() {
  const navigate = useNavigate();
  const { assetId } = Route.useParams();
  const { isConnected } = useWallet();
  
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // TODO: Replace with actual data fetching
  const mockAsset: Asset & { editions?: number; owned?: boolean } = {
    id: assetId,
    creator_wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    title: "Cosmic Dreams #001",
    description:
      "A stunning digital artwork exploring the vastness of space and the beauty of cosmic phenomena. This piece combines abstract expressionism with digital painting techniques to create a mesmerizing visual experience.",
    asset_type: "image",
    preview_cid: "QmExample123456",
    full_cid: "QmFullExample789",
    metadata_cid: "QmMetadataExample",
    price: "0.25",
    royalty_percentage: 10,
    status: "minted",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    token_id: 1,
    editions: 100,
    owned: false,
  };

  const previewUrl = mockAsset.preview_cid
    ? `https://${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${mockAsset.preview_cid}`
    : "/placeholder.png";

  const fullAssetUrl = mockAsset.full_cid
    ? `https://${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${mockAsset.full_cid}`
    : null;

  const handlePurchase = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    setIsPurchasing(true);
    try {
      // TODO: Implement actual purchase logic
      // 1. Call redeemVoucher or purchaseToken
      // 2. Wait for transaction confirmation
      // 3. Update asset ownership status
      console.log("Purchasing asset:", assetId);
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      alert("Purchase successful! NFT minted to your wallet.");
      // Refresh asset data
    } catch (error) {
      console.error("Purchase error:", error);
      alert("Purchase failed. Please try again.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleDownload = async () => {
    if (!fullAssetUrl) {
      alert("Full asset not available");
      return;
    }

    setIsDownloading(true);
    try {
      // Open in new tab for download
      window.open(fullAssetUrl, "_blank");
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-[#09090b] py-12">
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

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 text-gray-400 hover:text-white hover:bg-white/5"
          onClick={() => navigate({ to: "/marketplace" })}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Asset Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="overflow-hidden bg-white/[0.03] border-white/[0.08]">
              <CardContent className="p-0">
                {mockAsset.asset_type === "image" ? (
                  <div className="relative aspect-square bg-black/50">`
                    <img
                      src={previewUrl}
                      alt={mockAsset.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />
                    {!mockAsset.owned && (
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end justify-center p-6">
                        <p className="text-sm text-muted-foreground">
                          🔒 Purchase to access full resolution
                        </p>
                      </div>
                    )}
                  </div>
                ) : mockAsset.asset_type === "video" ? (
                  <video
                    src={previewUrl}
                    controls={mockAsset.owned}
                    className="w-full aspect-video"
                  />
                ) : mockAsset.asset_type === "audio" ? (
                  <div className="p-8 flex flex-col items-center justify-center aspect-square bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                    <div className="text-6xl mb-4">🎵</div>
                    <audio
                      src={previewUrl}
                      controls={mockAsset.owned}
                      className="w-full"
                    />
                  </div>
                ) : (
                  <div className="p-8 flex flex-col items-center justify-center aspect-square bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="text-muted-foreground">Document Asset</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Download Button (if owned) */}
            {mockAsset.owned && fullAssetUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download Full Asset
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Asset Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Title & Description */}
            <div>
              <h1 className="text-4xl font-bold mb-2">{mockAsset.title}</h1>
              {mockAsset.owned && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-sm font-medium mb-4">
                  ✓ You own this NFT
                </div>
              )}
              <p className="text-muted-foreground leading-relaxed">
                {mockAsset.description}
              </p>
            </div>

            {/* Creator Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {shortenAddress(mockAsset.creator_wallet)}
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={() =>
                        window.open(
                          `https://etherscan.io/address/${mockAsset.creator_wallet}`,
                          "_blank"
                        )
                      }
                    >
                      View on Etherscan
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asset Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Hash className="w-4 h-4" />
                    <span className="text-sm">Token ID</span>
                  </div>
                  <span className="font-medium">#{mockAsset.token_id}</span>
                </div>
                
                {mockAsset.editions && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Hash className="w-4 h-4" />
                      <span className="text-sm">Editions</span>
                    </div>
                    <span className="font-medium">{mockAsset.editions}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Created</span>
                  </div>
                  <span className="font-medium">
                    {formatDate(mockAsset.created_at)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-sm">💰</span>
                    <span className="text-sm">Royalty</span>
                  </div>
                  <span className="font-medium">
                    {mockAsset.royalty_percentage}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-sm">🎨</span>
                    <span className="text-sm">Type</span>
                  </div>
                  <span className="font-medium capitalize">
                    {mockAsset.asset_type}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Price & Purchase */}
            {!mockAsset.owned && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Price</CardTitle>
                  <CardDescription>Current listing price</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-3xl font-bold">
                        {mockAsset.price} ETH
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ≈ ${(parseFloat(mockAsset.price) * 2000).toFixed(2)} USD
                      </p>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handlePurchase}
                    disabled={isPurchasing || !isConnected}
                  >
                    {isPurchasing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : !isConnected ? (
                      "Connect Wallet to Purchase"
                    ) : (
                      "Buy Now"
                    )}
                  </Button>

                  {!isConnected && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Connect your wallet to purchase this NFT
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
