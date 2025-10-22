import { createFileRoute, Link } from '@tanstack/react-router'
import { useWallet } from '@/hooks/useWallet'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NFTCard } from '@/components/ui/nft-card'
import { Copy, ExternalLink, Wallet as WalletIcon, TrendingUp, Image, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

// Mock data for owned NFTs - replace with actual blockchain data
const ownedNFTs = [
  {
    id: '1',
    title: 'Digital Sunset #42',
    description: 'Beautiful sunset captured in 8K resolution',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    price: '0.5 ETH',
    creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    owned: true,
  },
  {
    id: '2',
    title: 'Abstract Motion',
    description: '3D animated loop - 60fps',
    imageUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800',
    price: '1.2 ETH',
    creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    owned: true,
  },
  {
    id: '3',
    title: 'Neon City',
    description: 'Cyberpunk cityscape photograph',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
    price: '0.8 ETH',
    creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    owned: true,
  },
]

function ProfilePage() {
  const { address, isConnected, balance, chainName, openModal } = useWallet()

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      // You can add toast notification here
    }
  }

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getEtherscanUrl = (addr: string) => {
    // Adjust based on chain
    if (chainName?.includes('Sepolia')) {
      return `https://sepolia.etherscan.io/address/${addr}`
    }
    return `https://etherscan.io/address/${addr}`
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
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

        <Card className="w-full max-w-md mx-4 bg-white/[0.03] border-white/[0.08]">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <WalletIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Connect Your Wallet</CardTitle>
            <CardDescription className="text-gray-400">
              Please connect your wallet to view your profile and NFT collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => openModal()}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25"
            >
              <WalletIcon className="w-5 h-5 mr-2" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = [
    {
      label: 'NFTs Owned',
      value: ownedNFTs.length,
      icon: Image,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Total Value',
      value: '2.5 ETH',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Collections',
      value: '3',
      icon: Award,
      color: 'from-orange-500 to-red-500',
    },
  ]

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

      <div className="container mx-auto px-4 py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-3xl text-white font-bold">
                  {address ? address[2].toUpperCase() : 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-lg">
                    {address && shortenAddress(address)}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-white"
                    onClick={copyAddress}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <a
                    href={address ? getEtherscanUrl(address) : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-gray-400">Balance</div>
              <div className="text-2xl font-bold text-white">{balance}</div>
              <div className="text-xs text-gray-500">{chainName}</div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05] transition-colors group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center",
                      stat.color
                    )}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* NFT Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">My Collection</h2>
            <Link to="/marketplace">
              <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white">
                Browse Marketplace
              </Button>
            </Link>
          </div>

          {ownedNFTs.length === 0 ? (
            <Card className="bg-white/[0.03] border-white/[0.08]">
              <CardContent className="py-12 text-center">
                <Image className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-white mb-2">No NFTs Yet</h3>
                <p className="text-gray-400 mb-6">
                  Start building your collection by purchasing NFTs from the marketplace
                </p>
                <Link to="/marketplace">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25">
                    Explore Marketplace
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ownedNFTs.map((nft, index) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NFTCard
                    id={nft.id}
                    title={nft.title}
                    description={nft.description}
                    image={nft.imageUrl}
                    price={nft.price}
                    creator={shortenAddress(nft.creator)}
                    onPurchase={() => {
                      // Navigate to asset detail page
                      window.location.href = `/assets/${nft.id}`
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
