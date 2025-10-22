import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Upload, ShoppingBag, Zap, Shield, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-[#09090b] relative overflow-hidden">
      {/* UI-Layouts Style Background */}
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
        
        {/* Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            {/* Logo & Title */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50">
                <span className="text-white text-4xl font-bold">A</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Aureve
                </span>
              </h1>
            </div>

            {/* Tagline */}
            <p className="text-2xl md:text-3xl text-gray-300 font-light max-w-3xl mx-auto">
              Create, Discover, and Trade{" "}
              <span className="font-semibold text-white">
                Unique Digital Assets
              </span>{" "}
              on the Blockchain
            </p>

            {/* Description */}
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              The next-generation NFT marketplace powered by lazy minting
              technology. Zero upfront costs, maximum creativity.
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button size="lg" className="gap-2 text-lg px-8 py-6" asChild>
                <Link to="/marketplace">
                  <ShoppingBag className="w-5 h-5" />
                  Explore Marketplace
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-lg px-8 py-6"
                asChild
              >
                <Link to="/upload">
                  <Upload className="w-5 h-5" />
                  Create NFT
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className="bg-white/[0.03] backdrop-blur-2xl border-white/[0.08] hover:bg-white/[0.06] hover:border-purple-400/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 group">
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:via-pink-200 group-hover:to-blue-200 transition-all duration-500">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-400 mt-2 group-hover:text-gray-300 transition-colors">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
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
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
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
                <Card className="h-full bg-white/[0.03] backdrop-blur-2xl border-white/[0.08] hover:bg-white/[0.06] hover:border-purple-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 group">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 text-purple-300 group-hover:from-purple-500/30 group-hover:to-pink-500/30 group-hover:scale-110 transition-all duration-500">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-100 transition-colors">
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

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={mounted ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 backdrop-blur-2xl border-white/10 hover:border-purple-400/40 transition-all duration-500 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/30 group">
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardContent className="relative p-12 text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                  Ready to Get Started?
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Join thousands of creators and collectors building the future
                  of digital art. Start minting your NFTs today.
                </p>
                <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/50" asChild>
                  <Link to="/upload">
                    Create Your First NFT
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
