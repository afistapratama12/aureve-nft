/**
 * Network configuration for supported blockchains
 * Supports: Arbitrum Sepolia (default), Ethereum Sepolia, Monad Testnet
 */

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  contractAddress?: string;
}

// Arbitrum Sepolia (Default Network)
export const ARBITRUM_SEPOLIA: NetworkConfig = {
  chainId: 421614,
  name: "Arbitrum Sepolia",
  rpcUrl: import.meta.env.VITE_ARBITRUM_SEPOLIA_RPC || "https://sepolia-rollup.arbitrum.io/rpc",
  blockExplorer: "https://sepolia.arbiscan.io",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  contractAddress: import.meta.env.VITE_NFT_CONTRACT_ADDRESS_ARBITRUM,
};

// Ethereum Sepolia
export const ETHEREUM_SEPOLIA: NetworkConfig = {
  chainId: 11155111,
  name: "Ethereum Sepolia",
  rpcUrl: import.meta.env.VITE_ETHEREUM_SEPOLIA_RPC || "https://rpc.ankr.com/eth_sepolia",
  blockExplorer: "https://sepolia.etherscan.io",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  contractAddress: import.meta.env.VITE_NFT_CONTRACT_ADDRESS_ETHEREUM,
};

// Monad Testnet
export const MONAD_TESTNET: NetworkConfig = {
  chainId: 10143,
  name: "Monad Testnet",
  rpcUrl: import.meta.env.VITE_MONAD_TESTNET_RPC || "https://testnet-rpc.monad.xyz",
  blockExplorer: "https://explorer.testnet.monad.xyz",
  nativeCurrency: {
    name: "Monad",
    symbol: "MONAD",
    decimals: 18,
  },
  contractAddress: import.meta.env.VITE_NFT_CONTRACT_ADDRESS_MONAD,
};

// All supported networks
export const SUPPORTED_NETWORKS: NetworkConfig[] = [
  ARBITRUM_SEPOLIA,
  ETHEREUM_SEPOLIA,
  MONAD_TESTNET,
];

// Default network
export const DEFAULT_NETWORK = ARBITRUM_SEPOLIA;

// Platform fee configuration
export const PLATFORM_FEE_PERCENTAGE = Number(import.meta.env.VITE_PLATFORM_FEE_PERCENTAGE) || 1;
export const PLATFORM_WALLET_ADDRESS = import.meta.env.VITE_PLATFORM_WALLET_ADDRESS;

/**
 * Get network config by chain ID
 */
export function getNetworkByChainId(chainId: number): NetworkConfig | undefined {
  return SUPPORTED_NETWORKS.find((network) => network.chainId === chainId);
}

/**
 * Get contract address for current chain ID
 */
export function getContractAddress(chainId: number): string | undefined {
  const network = getNetworkByChainId(chainId);
  return network?.contractAddress;
}

/**
 * Check if chain ID is supported
 */
export function isSupportedChain(chainId: number): boolean {
  return SUPPORTED_NETWORKS.some((network) => network.chainId === chainId);
}

/**
 * Format chain ID for display
 */
export function formatChainName(chainId: number): string {
  const network = getNetworkByChainId(chainId);
  return network?.name || `Chain ${chainId}`;
}
