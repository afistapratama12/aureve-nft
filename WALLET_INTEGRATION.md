# Wallet Connect Integration Guide

## Overview

Aureve menggunakan **Web3Modal v5** (powered by WalletConnect) untuk koneksi wallet. Ini memberikan support untuk berbagai wallet providers seperti MetaMask, WalletConnect, Coinbase Wallet, dan lainnya.

## Setup

### 1. Dapatkan WalletConnect Project ID

1. Kunjungi [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Sign up / Login dengan GitHub
3. Buat project baru
4. Copy **Project ID** yang diberikan

### 2. Setup Environment Variables

Buat file `.env.local` di root project dan tambahkan:

```bash
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Atau copy dari `.env.example`:

```bash
cp .env.example .env.local
```

### 3. Configuration

Web3Modal sudah dikonfigurasi di `/src/config/web3.ts` dengan:

- **Supported Networks:**
  - Ethereum Sepolia (Testnet)
  - Arbitrum Sepolia (Testnet)
  - Monad Testnet

- **Supported Wallets:**
  - MetaMask
  - WalletConnect
  - Coinbase Wallet
  - Trust Wallet
  - Rainbow
  - Dan wallet lainnya yang support WalletConnect v2

### 4. Provider Setup

Web3Provider sudah di-wrap di root layout (`/src/routes/__root.tsx`), sehingga wallet state tersedia di seluruh aplikasi.

## Usage

### Connect Wallet

```tsx
import { useWallet } from '@/hooks/useWallet'

function MyComponent() {
  const { address, isConnected, openModal } = useWallet()

  return (
    <button onClick={() => openModal()}>
      {isConnected ? address : 'Connect Wallet'}
    </button>
  )
}
```

### Get Wallet Info

```tsx
import { useWallet } from '@/hooks/useWallet'

function WalletInfo() {
  const { address, balance, chainName, chainId } = useWallet()

  return (
    <div>
      <p>Address: {address}</p>
      <p>Balance: {balance}</p>
      <p>Network: {chainName} (ID: {chainId})</p>
    </div>
  )
}
```

### Disconnect Wallet

```tsx
import { useWallet } from '@/hooks/useWallet'

function DisconnectButton() {
  const { disconnect, isConnected } = useWallet()

  if (!isConnected) return null

  return (
    <button onClick={() => disconnect()}>
      Disconnect
    </button>
  )
}
```

### Switch Network

```tsx
import { useSwitchNetwork } from '@/hooks/useWallet'
import { sepolia, arbitrumSepolia } from 'wagmi/chains'

function NetworkSwitcher() {
  const { switchNetwork } = useSwitchNetwork()

  return (
    <div>
      <button onClick={() => switchNetwork(sepolia.id)}>
        Switch to Ethereum Sepolia
      </button>
      <button onClick={() => switchNetwork(arbitrumSepolia.id)}>
        Switch to Arbitrum Sepolia
      </button>
    </div>
  )
}
```

## Profile Page

Halaman profile (`/profile`) menampilkan:

- **Wallet Information:**
  - Address dengan copy & Etherscan link
  - Balance dan network name
  - Avatar placeholder

- **Statistics:**
  - Total NFTs owned
  - Total value of collection
  - Number of collections

- **NFT Collection:**
  - Grid display of owned NFTs
  - Empty state dengan link ke marketplace
  - Card animations dengan Framer Motion

### Access Control

Profile page memerlukan wallet connection. Jika user belum connect wallet, akan muncul:
- Centered card dengan "Connect Your Wallet" message
- Button untuk open wallet modal
- Background dengan dot pattern (ui-layouts.com style)

## Hooks API

### `useWallet()`

Main hook untuk wallet interaction.

**Returns:**
```typescript
{
  address: string | undefined           // User's wallet address
  isConnected: boolean                  // Connection status
  chainId: number | undefined           // Current chain ID
  chainName: string | undefined         // Current chain name
  balance: string                       // Formatted balance with symbol
  openModal: () => void                 // Open Web3Modal
  disconnect: () => void                // Disconnect wallet
}
```

### `useWalletInfo()`

Get detailed wallet information.

**Returns:**
```typescript
{
  address: string | undefined
  chainId: number | undefined
  balance: string                       // Raw balance in ETH
  isConnected: boolean
}
```

### `useSwitchNetwork()`

Switch between supported networks.

**Returns:**
```typescript
{
  switchNetwork: (chainId: number) => void
}
```

## Customization

### Theme

Web3Modal theme dapat dikustomisasi di `/src/providers/Web3Provider.tsx`:

```tsx
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'dark',                    // 'dark' | 'light'
  themeVariables: {
    '--w3m-accent': '#a855f7',          // Purple-500
    '--w3m-border-radius-master': '8px',
  }
})
```

### Add More Networks

Edit `/src/config/web3.ts`:

```typescript
import { mainnet, polygon } from 'wagmi/chains'

const chains = [
  sepolia, 
  arbitrumSepolia, 
  monadTestnet,
  mainnet,      // Add Ethereum Mainnet
  polygon,      // Add Polygon
] as const
```

### Configure RPC Endpoints

Update transports di `/src/config/web3.ts`:

```typescript
export const config = defaultWagmiConfig({
  // ... other config
  transports: {
    [sepolia.id]: http('YOUR_CUSTOM_RPC_URL'),
    [arbitrumSepolia.id]: http('YOUR_CUSTOM_RPC_URL'),
    // ... more networks
  },
})
```

## Troubleshooting

### Modal tidak muncul

Pastikan:
1. ✅ `VITE_WALLETCONNECT_PROJECT_ID` sudah di set di `.env.local`
2. ✅ Web3Provider sudah di-wrap di root layout
3. ✅ Browser tidak block popups

### Network tidak tersedia

Pastikan:
1. ✅ Chain sudah di-define di `config/web3.ts`
2. ✅ RPC URL benar dan accessible
3. ✅ Chain ditambahkan di `chains` array

### Balance tidak muncul

- Wagmi's `useBalance` hook memerlukan wallet address
- Jika tidak connect, balance akan return '0.0000 ETH'
- Pastikan wallet ada balance untuk testing

## Resources

- [Web3Modal Documentation](https://docs.walletconnect.com/appkit/overview)
- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)
- [WalletConnect Cloud](https://cloud.walletconnect.com)

## Next Steps

1. ✅ Setup WalletConnect Project ID
2. ✅ Test wallet connection di different browsers
3. ⏳ Integrate dengan smart contract untuk:
   - Purchase NFTs
   - Lazy mint vouchers
   - Transfer tokens
   - Check ownership
4. ⏳ Add transaction notifications/toasts
5. ⏳ Implement proper error handling
