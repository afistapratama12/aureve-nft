import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Upload, ShoppingBag, Zap, Shield, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Showcase NFTs for carousel
  const showcaseNFTs = [
    {
      id: 1,
      title: "Cosmic Dreams #001",
      creator: "ArtistDAO",
      price: "0.5 ETH",
      image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=400&fit=crop",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 2,
      title: "Digital Sunset",
      creator: "CryptoCanvas",
      price: "0.3 ETH",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: 3,
      title: "Abstract Mind",
      creator: "NFTCreator",
      price: "0.8 ETH",
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=400&fit=crop",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      id: 4,
      title: "Neon City",
      creator: "MetaArtist",
      price: "0.6 ETH",
      image: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=400&h=400&fit=crop",
      gradient: "from-green-500 to-teal-500",
    },
    {
      id: 5,
      title: "Future Vision",
      creator: "Web3Creator",
      price: "0.4 ETH",
      image: "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=400&h=400&fit=crop",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      id: 6,
      title: "Digital Wave",
      creator: "BlockchainArt",
      price: "0.7 ETH",
      image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400&h=400&fit=crop",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Upload & Mint",
      description:
        "Transform your digital creations into NFTs with just a few clicks. Support for images, videos, audio, and documents.",
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Buy & Sell",
      description:
        "Discover unique digital assets in our marketplace. Secure transactions on multiple blockchain networks.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lazy Minting",
      description:
        "Create NFTs without upfront gas fees. Minting happens only when someone purchases your asset.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Verified",
      description:
        "Built on battle-tested smart contracts with ERC-1155 standard. Your assets are safe and verifiable.",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Royalty System",
      description:
        "Earn royalties on secondary sales. Set your own percentage and get paid automatically.",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Multi-Chain Support",
      description:
        "Deploy on Arbitrum, Ethereum, and Monad networks. Choose the blockchain that fits your needs.",
    },
  ];

  const stats = [
    { label: "Total NFTs", value: "10,234" },
    { label: "Artists", value: "2,456" },
    { label: "Total Sales", value: "$2.5M" },
    { label: "Active Listings", value: "5,678" },
  ];

  return (
    <div className="bg-[#09090b] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Dot Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        ></div>
        
        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section - Similar to shadcnblocks hero231 */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-purple-500/50 bg-purple-500/10 text-purple-300 text-sm">
                <Sparkles className="w-3 h-3 mr-2" />
                Powered by Lazy Minting Technology
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="block text-white">Create, Trade &</span>
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent py-2">
                  Own Digital Assets
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                The next-generation NFT marketplace where creators mint for free and buyers pay only when they purchase. Zero upfront costs, maximum creativity.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
            >
              <Button 
                size="lg" 
                className="h-14 px-8 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
                asChild
              >
                <Link to="/marketplace">
                  Explore Marketplace
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 text-base border-white/10 text-primary"
                asChild
              >
                <Link to="/upload">
                  Start Creating
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full max-w-4xl"
            >
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* NFT Carousel - Animated Card Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="pt-16 w-full"
            >
              <div className="relative">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none"></div>
                
                {/* Scrolling container */}
                <div className="overflow-hidden">
                  <motion.div
                    className="flex gap-6"
                    animate={{
                      x: [0, -1920], // Move left by total width
                    }}
                    transition={{
                      x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 30,
                        ease: "linear",
                      },
                    }}
                  >
                    {/* Render cards twice for seamless loop */}
                    {[...showcaseNFTs, ...showcaseNFTs].map((nft, index) => (
                      <Card
                        key={`${nft.id}-${index}`}
                        className="flex-shrink-0 w-[320px] bg-white/[0.03] border-white/[0.08] hover:border-white/20 transition-all duration-300 overflow-hidden group cursor-pointer"
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-br ${nft.gradient} opacity-20`}></div>
                          <img
                            src={nft.image}
                            alt={nft.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Button
                              size="sm"
                              className="bg-white text-black hover:bg-gray-200"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold text-white mb-1 truncate">
                            {nft.title}
                          </h3>
                          <p className="text-sm text-gray-400 mb-3">
                            by {nft.creator}
                          </p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-500">Price</p>
                              <p className="text-sm font-semibold text-purple-400">
                                {nft.price}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                            >
                              <ShoppingBag className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Why Choose Aureve?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Built for creators, collectors, and innovators. Experience the
              future of digital ownership.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <Card className="bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-purple-500/30 transition-all duration-300 h-full group">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
