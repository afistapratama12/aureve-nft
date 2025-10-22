import { BrowserProvider, JsonRpcSigner, Contract, formatEther, parseEther } from "ethers";
import { getContractAddress, isSupportedChain, DEFAULT_NETWORK } from "@/lib/networkConfig";

/**
 * Blockchain service for wallet connection and contract interaction
 * Handles MetaMask connection, network switching, and NFT contract calls
 */

// NFT Contract ABI (subset of key functions)
export const NFT_CONTRACT_ABI = [
  // Read functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function uri(uint256 tokenId) view returns (string)",
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function totalSupply(uint256 tokenId) view returns (uint256)",
  "function getCreator(uint256 tokenId) view returns (address)",
  "function getPrice(uint256 tokenId) view returns (uint256)",
  "function royaltyInfo(uint256 tokenId, uint256 salePrice) view returns (address receiver, uint256 royaltyAmount)",
  
  // Write functions
  "function redeemVoucher((uint256 tokenId, string uri, uint256 price, address creator, uint96 royaltyBps, uint256 nonce, bytes signature) voucher, uint256 amount) payable returns (uint256)",
  "function purchaseToken(uint256 tokenId, uint256 amount) payable",
  
  // Events
  "event TokenMinted(uint256 indexed tokenId, address indexed minter, address indexed creator, uint256 amount, uint256 price)",
  "event TokenPurchased(uint256 indexed tokenId, address indexed buyer, address indexed creator, uint256 amount, uint256 totalPrice)",
];

/**
 * Get Ethereum provider (MetaMask)
 */
export async function getProvider(): Promise<BrowserProvider | null> {
  if (typeof window === "undefined" || !window.ethereum) {
    return null;
  }
  return new BrowserProvider(window.ethereum);
}

/**
 * Check if MetaMask is installed
 */
export function isMetaMaskInstalled(): boolean {
  return typeof window !== "undefined" && Boolean(window.ethereum?.isMetaMask);
}

/**
 * Connect wallet and request account access
 */
export async function connectWallet(): Promise<{
  address: string;
  chainId: number;
} | null> {
  try {
    const provider = await getProvider();
    if (!provider) {
      throw new Error("No Ethereum provider found. Please install MetaMask.");
    }

    // Request account access
    const accounts = await provider.send("eth_requestAccounts", []);
    const address = accounts[0];

    // Get current chain ID
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);

    return { address, chainId };
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return null;
  }
}

/**
 * Get current connected account
 */
export async function getCurrentAccount(): Promise<string | null> {
  try {
    const provider = await getProvider();
    if (!provider) return null;

    const accounts = await provider.send("eth_accounts", []);
    return accounts[0] || null;
  } catch (error) {
    console.error("Error getting current account:", error);
    return null;
  }
}

/**
 * Get current chain ID
 */
export async function getCurrentChainId(): Promise<number | null> {
  try {
    const provider = await getProvider();
    if (!provider) return null;

    const network = await provider.getNetwork();
    return Number(network.chainId);
  } catch (error) {
    console.error("Error getting chain ID:", error);
    return null;
  }
}

/**
 * Switch to a specific network
 */
export async function switchNetwork(chainId: number): Promise<boolean> {
  try {
    const provider = await getProvider();
    if (!provider) {
      throw new Error("No provider found");
    }

    // Try to switch to the network
    try {
      await provider.send("wallet_switchEthereumChain", [
        { chainId: `0x${chainId.toString(16)}` },
      ]);
      return true;
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        // Network needs to be added
        const networkConfig = isSupportedChain(chainId) 
          ? await addNetwork(chainId) 
          : false;
        return networkConfig;
      }
      throw switchError;
    }
  } catch (error) {
    console.error("Error switching network:", error);
    return false;
  }
}

/**
 * Add network to MetaMask
 */
async function addNetwork(chainId: number): Promise<boolean> {
  try {
    const provider = await getProvider();
    if (!provider) return false;

    const { getNetworkByChainId } = await import("@/lib/networkConfig");
    const network = getNetworkByChainId(chainId);
    if (!network) return false;

    await provider.send("wallet_addEthereumChain", [
      {
        chainId: `0x${chainId.toString(16)}`,
        chainName: network.name,
        nativeCurrency: network.nativeCurrency,
        rpcUrls: [network.rpcUrl],
        blockExplorerUrls: [network.blockExplorer],
      },
    ]);

    return true;
  } catch (error) {
    console.error("Error adding network:", error);
    return false;
  }
}

/**
 * Ensure user is on the correct network (default: Arbitrum Sepolia)
 */
export async function ensureCorrectNetwork(): Promise<boolean> {
  const currentChainId = await getCurrentChainId();
  
  if (!currentChainId) return false;
  if (currentChainId === DEFAULT_NETWORK.chainId) return true;

  // Ask user to switch
  return await switchNetwork(DEFAULT_NETWORK.chainId);
}

/**
 * Get signer for transactions
 */
export async function getSigner(): Promise<JsonRpcSigner | null> {
  try {
    const provider = await getProvider();
    if (!provider) return null;

    return await provider.getSigner();
  } catch (error) {
    console.error("Error getting signer:", error);
    return null;
  }
}

/**
 * Get NFT contract instance
 */
export async function getNFTContract(chainId?: number): Promise<Contract | null> {
  try {
    const provider = await getProvider();
    if (!provider) return null;

    const currentChainId = chainId || (await getCurrentChainId());
    if (!currentChainId) return null;

    const contractAddress = getContractAddress(currentChainId);
    if (!contractAddress) {
      throw new Error(`No contract address for chain ${currentChainId}`);
    }

    const signer = await getSigner();
    if (!signer) return null;

    return new Contract(contractAddress, NFT_CONTRACT_ABI, signer);
  } catch (error) {
    console.error("Error getting NFT contract:", error);
    return null;
  }
}

/**
 * Get account balance in ETH
 */
export async function getBalance(address: string): Promise<string | null> {
  try {
    const provider = await getProvider();
    if (!provider) return null;

    const balance = await provider.getBalance(address);
    return formatEther(balance);
  } catch (error) {
    console.error("Error getting balance:", error);
    return null;
  }
}

/**
 * Format wei to ETH string
 */
export function formatWeiToEth(wei: string | bigint): string {
  try {
    return formatEther(wei);
  } catch (error) {
    return "0";
  }
}

/**
 * Parse ETH string to wei
 */
export function parseEthToWei(eth: string): bigint {
  try {
    return parseEther(eth);
  } catch (error) {
    return BigInt(0);
  }
}

/**
 * Check if user owns an NFT
 */
export async function checkNFTOwnership(
  tokenId: number,
  userAddress: string
): Promise<boolean> {
  try {
    const contract = await getNFTContract();
    if (!contract) return false;

    const balance = await contract.balanceOf(userAddress, tokenId);
    return balance > 0;
  } catch (error) {
    console.error("Error checking NFT ownership:", error);
    return false;
  }
}

/**
 * Get NFT balance for a user
 */
export async function getNFTBalance(
  tokenId: number,
  userAddress: string
): Promise<number> {
  try {
    const contract = await getNFTContract();
    if (!contract) return 0;

    const balance = await contract.balanceOf(userAddress, tokenId);
    return Number(balance);
  } catch (error) {
    console.error("Error getting NFT balance:", error);
    return 0;
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
