// Network icons as SVG components
export const NetworkIcons = {
  ethereum: (
    <svg width="20" height="20" viewBox="0 0 256 417" fill="currentColor">
      <path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" fill="#8A92B2"/>
      <path d="M127.962 0L0 212.32l127.962 75.639V0z" fill="#62688F"/>
      <path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" fill="#62688F"/>
      <path d="M127.962 416.905v-104.72L0 236.585z" fill="#454A75"/>
      <path d="M127.961 287.958l127.96-75.637-127.96-58.162z" fill="#8A92B2"/>
      <path d="M0 212.32l127.96 75.638v-133.8z" fill="#62688F"/>
    </svg>
  ),
  arbitrum: (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#28A0F0"/>
      <path d="M16 4L7 20H11L16 11L21 20H25L16 4Z" fill="white"/>
      <path d="M14 20H18L16 24L14 20Z" fill="white"/>
    </svg>
  ),
  monad: (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#7C3AED"/>
      <path d="M16 8L10 16L16 20L22 16L16 8Z" fill="white"/>
      <path d="M10 18L16 24L22 18L16 22L10 18Z" fill="white" opacity="0.7"/>
    </svg>
  ),
}

export function getNetworkIcon(chainId: number | undefined) {
  switch (chainId) {
    case 11155111: // Ethereum Sepolia
      return NetworkIcons.ethereum
    case 421614: // Arbitrum Sepolia
      return NetworkIcons.arbitrum
    case 10143: // Monad Testnet
      return NetworkIcons.monad
    default:
      return NetworkIcons.ethereum
  }
}
