import { sepolia, arbitrumSepolia } from "wagmi/chains";
import { monadTestnet } from "@/config/web3";
import { Network } from "@/types/network";

// Complete list of LayerZero V2 supported networks
export const allNetworks: Network[] = [
  // ===== MAINNETS =====
  // Ethereum
  {
    id: 1,
    name: "Ethereum",
    logo: "⟠",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    color: "from-blue-500 to-indigo-500",
    layerZeroId: 30101,
    isSupported: false,
  },
  // BNB Chain
  {
    id: 56,
    name: "BNB Chain",
    logo: "◆",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    color: "from-yellow-500 to-orange-500",
    layerZeroId: 30102,
    isSupported: false,
  },
  // Avalanche
  {
    id: 43114,
    name: "Avalanche",
    logo: "▲",
    nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
    color: "from-red-500 to-pink-500",
    layerZeroId: 30106,
    isSupported: false,
  },
  // Polygon
  {
    id: 137,
    name: "Polygon",
    logo: "⬡",
    nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
    color: "from-purple-500 to-violet-500",
    layerZeroId: 30109,
    isSupported: false,
  },
  // Arbitrum
  {
    id: 42161,
    name: "Arbitrum",
    logo: "◆",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    color: "from-blue-400 to-cyan-500",
    layerZeroId: 30110,
    isSupported: false,
  },
  // Optimism
  {
    id: 10,
    name: "Optimism",
    logo: "◉",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    color: "from-red-400 to-pink-500",
    layerZeroId: 30111,
    isSupported: false,
  },
  // Fantom
  {
    id: 250,
    name: "Fantom",
    logo: "◈",
    nativeCurrency: { name: "Fantom", symbol: "FTM", decimals: 18 },
    color: "from-blue-600 to-indigo-600",
    layerZeroId: 30112,
    isSupported: false,
  },
  // Base
  {
    id: 8453,
    name: "Base",
    logo: "🔵",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    color: "from-blue-500 to-cyan-400",
    layerZeroId: 30184,
    isSupported: false,
  },
  // Linea
  {
    id: 59144,
    name: "Linea",
    logo: "⚡",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    color: "from-gray-700 to-gray-900",
    layerZeroId: 30183,
    isSupported: false,
  },
  // Mantle
  {
    id: 5000,
    name: "Mantle",
    logo: "◎",
    nativeCurrency: { name: "Mantle", symbol: "MNT", decimals: 18 },
    color: "from-emerald-500 to-teal-500",
    layerZeroId: 30181,
    isSupported: false,
  },
  // Scroll
  {
    id: 534352,
    name: "Scroll",
    logo: "📜",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    color: "from-orange-400 to-yellow-500",
    layerZeroId: 30214,
    isSupported: false,
  },
  // zkSync Era
  {
    id: 324,
    name: "zkSync Era",
    logo: "⚡",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    color: "from-blue-600 to-purple-600",
    layerZeroId: 30165,
    isSupported: false,
  },
  // Metis
  {
    id: 1088,
    name: "Metis",
    logo: "◆",
    nativeCurrency: { name: "Metis", symbol: "METIS", decimals: 18 },
    color: "from-cyan-500 to-blue-600",
    layerZeroId: 30151,
    isSupported: false,
  },
  // Gnosis
  {
    id: 100,
    name: "Gnosis",
    logo: "◎",
    nativeCurrency: { name: "xDAI", symbol: "XDAI", decimals: 18 },
    color: "from-teal-500 to-emerald-500",
    layerZeroId: 30145,
    isSupported: false,
  },
  // Celo
  {
    id: 42220,
    name: "Celo",
    logo: "●",
    nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
    color: "from-green-400 to-emerald-500",
    layerZeroId: 30125,
    isSupported: false,
  },
  // Moonbeam
  {
    id: 1284,
    name: "Moonbeam",
    logo: "🌙",
    nativeCurrency: { name: "Glimmer", symbol: "GLMR", decimals: 18 },
    color: "from-teal-400 to-cyan-500",
    layerZeroId: 30126,
    isSupported: false,
  },
  // Moonriver
  {
    id: 1285,
    name: "Moonriver",
    logo: "🌙",
    nativeCurrency: { name: "Moonriver", symbol: "MOVR", decimals: 18 },
    color: "from-purple-400 to-pink-500",
    layerZeroId: 30167,
    isSupported: false,
  },
  // Kava
  {
    id: 2222,
    name: "Kava",
    logo: "◆",
    nativeCurrency: { name: "Kava", symbol: "KAVA", decimals: 18 },
    color: "from-red-500 to-orange-500",
    layerZeroId: 30177,
    isSupported: false,
  },
  // Blast
  {
    id: 81457,
    name: "Blast",
    logo: "💥",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    color: "from-yellow-400 to-orange-500",
    layerZeroId: 30243,
    isSupported: false,
  },
  // Kroma
  {
    id: 255,
    name: "Kroma",
    logo: "◎",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    color: "from-green-500 to-teal-500",
    layerZeroId: 30255,
    isSupported: false,
  },
  // Taiko
  {
    id: 167000,
    name: "Taiko",
    logo: "◈",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    color: "from-pink-500 to-rose-500",
    layerZeroId: 30290,
    isSupported: false,
  },
  // Mode
  {
    id: 34443,
    name: "Mode",
    logo: "●",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    color: "from-lime-500 to-green-500",
    layerZeroId: 30260,
    isSupported: false,
  },
  
  // ===== TESTNETS (SUPPORTED) =====
  {
    id: sepolia.id,
    name: "Ethereum Sepolia",
    logo: "⟠",
    nativeCurrency: sepolia.nativeCurrency,
    color: "from-blue-500 to-indigo-500",
    layerZeroId: 40161,
    isSupported: true, // ✅ Currently supported
  },
  {
    id: arbitrumSepolia.id,
    name: "Arbitrum Sepolia",
    logo: "◆",
    nativeCurrency: arbitrumSepolia.nativeCurrency,
    color: "from-cyan-500 to-blue-500",
    layerZeroId: 40231,
    isSupported: true, // ✅ Currently supported
  },
  {
    id: monadTestnet.id,
    name: "Monad Testnet",
    logo: "◎",
    nativeCurrency: monadTestnet.nativeCurrency,
    color: "from-purple-500 to-pink-500",
    layerZeroId: 40277, // Placeholder - update when official
    isSupported: true, // ✅ Currently supported
  },
  
  // ===== OTHER TESTNETS (NOT YET SUPPORTED) =====
  {
    id: 84532,
    name: "Base Sepolia",
    logo: "🔵",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    color: "from-blue-500 to-cyan-400",
    layerZeroId: 40245,
    isSupported: false,
  },
  {
    id: 11155420,
    name: "Optimism Sepolia",
    logo: "◉",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    color: "from-red-400 to-pink-500",
    layerZeroId: 40232,
    isSupported: false,
  },
  {
    id: 59141,
    name: "Linea Sepolia",
    logo: "⚡",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    color: "from-gray-700 to-gray-900",
    layerZeroId: 40287,
    isSupported: false,
  },
  {
    id: 534351,
    name: "Scroll Sepolia",
    logo: "📜",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    color: "from-orange-400 to-yellow-500",
    layerZeroId: 40170,
    isSupported: false,
  },
];
