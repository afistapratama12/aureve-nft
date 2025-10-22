import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { arbitrumSepolia, sepolia } from 'wagmi/chains'
import { http } from 'viem'

// Define custom chains if needed
export const monadTestnet = {
  id: 10_143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_MONAD_TESTNET_RPC || 'https://testnet-rpc.monad.xyz'],
    },
    public: {
      http: [import.meta.env.VITE_MONAD_TESTNET_RPC || 'https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://explorer.testnet.monad.xyz' },
  },
  testnet: true,
} as const

// Get projectId from https://cloud.walletconnect.com
export const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'a71a3229192415ea069dff3ddc7fe658'

if (!projectId) {
  console.warn('You need to provide a VITE_WALLETCONNECT_PROJECT_ID env variable')
}

// Create wagmiConfig
const metadata = {
  name: 'Aureve',
  description: 'Decentralized NFT Marketplace for Digital Assets',
  url: 'https://aureve.app', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Define chains to support
const chains = [sepolia, arbitrumSepolia, monadTestnet] as const

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  auth: {
    email: false, // optional - true by default
  },
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_ETHEREUM_SEPOLIA_RPC),
    [arbitrumSepolia.id]: http(import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC),
    [monadTestnet.id]: http(import.meta.env.VITE_MONAD_TESTNET_RPC),
  },
})

export { chains }
