# 🚀 Aureve NFT Platform - Setup & Deployment Guide

## 📋 Overview
Aureve is a decentralized NFT platform for tokenizing digital assets (images, videos, audio, documents) with:
- **ERC-1155** for unlimited edition NFTs
- **ERC-2981** for automatic royalties
- **Lazy minting** with signed vouchers
- **IPFS/Pinata** for decentralized storage
- **Supabase** for database
- **Multi-chain support**: Arbitrum Sepolia (default), Ethereum Sepolia, Monad Testnet

---

## 🛠️ Prerequisites

- **Node.js**: v18+ or **Bun** runtime
- **MetaMask**: Browser wallet extension
- **Supabase account**: For database
- **Pinata account**: For IPFS storage
- **Testnet ETH**: From faucets for gas fees

---

## 📦 Installation

### 1. Install Dependencies
```bash
cd /Users/afistapratama/coding/MYPROJECT/project/aureve
bun install
```

### 2. Configure Environment Variables

Create `.env.local` in the root directory:

```env
# Supabase
VITE_SUPABASE_URL=https://luntbqcrvpdgztefttdm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1bnRicWNydnBkZ3p0ZWZ0dGRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDA1OTMsImV4cCI6MjA3NjYxNjU5M30.0Ok6JlOU8ojhQDsLmS-O4iVR72NO3MHmYgWa0xaEZGs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1bnRicWNydnBkZ3p0ZWZ0dGRtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTA0MDU5MywiZXhwIjoyMDc2NjE2NTkzfQ.9s9PMmkwr9vIyE29CMpkbZX3rdO_XY-YrggqXy1Ln-I

# Pinata
PINATA_API_KEY=42d0d06dd7943f6ded43
PINATA_GATEWAY_DOMAIN=peach-selective-orca-105.mypinata.cloud

# Blockchain Networks
VITE_DEFAULT_CHAIN_ID=421614
VITE_ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
VITE_ETHEREUM_SEPOLIA_RPC=https://rpc.ankr.com/eth_sepolia
VITE_MONAD_TESTNET_RPC=https://testnet-rpc.monad.xyz

# Smart Contract Addresses (fill after deployment)
VITE_NFT_CONTRACT_ADDRESS_ARBITRUM=
VITE_NFT_CONTRACT_ADDRESS_ETHEREUM=
VITE_NFT_CONTRACT_ADDRESS_MONAD=

# Platform Configuration
VITE_PLATFORM_FEE_PERCENTAGE=1
VITE_PLATFORM_WALLET_ADDRESS=YOUR_WALLET_ADDRESS_HERE

# Signer for Lazy Minting (IMPORTANT: Keep this secret!)
SIGNER_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
```

**⚠️ IMPORTANT:** Never commit `.env.local` to git!

---

## 🗄️ Database Setup

### 1. Setup Supabase Database

Go to your Supabase project SQL Editor and run the migration:

```bash
# Navigate to supabase/migrations/001_initial_schema.sql
# Copy the entire SQL content
# Paste and execute in Supabase SQL Editor
```

Or use Supabase CLI:
```bash
bun add -g supabase
supabase login
supabase link --project-ref luntbqcrvpdgztefttdm
supabase db push
```

### 2. Verify Tables
Check that these tables exist:
- `users`
- `assets`
- `nfts`
- `transactions`
- `royalties`
- `vouchers`

---

## 🔗 Smart Contract Deployment

### 1. Setup Hardhat
Your `hardhat.config.ts` is already configured.

### 2. Add Private Key
In `.env.local`, set:
```env
SIGNER_PRIVATE_KEY=your_private_key_without_0x_prefix
```

**Get testnet ETH:**
- **Arbitrum Sepolia**: https://faucet.quicknode.com/arbitrum/sepolia
- **Ethereum Sepolia**: https://sepoliafaucet.com/
- **Monad Testnet**: Check Monad Discord

### 3. Deploy to Arbitrum Sepolia (Default)

```bash
bun hardhat run scripts/deploy.ts --network arbitrumSepolia
```

Output will show:
```
✅ Deployment successful on arbitrum-sepolia!
Contract Address: 0x...
```

### 4. Update Environment Variables

Copy the contract address and update `.env.local`:
```env
VITE_NFT_CONTRACT_ADDRESS_ARBITRUM=0xYourContractAddress
```

### 5. Deploy to Other Networks (Optional)

**Ethereum Sepolia:**
```bash
bun hardhat run scripts/deploy.ts --network ethereumSepolia
```

**Monad Testnet:**
```bash
bun hardhat run scripts/deploy.ts --network monadTestnet
```

### 6. Verify Contract (Optional)

```bash
bun hardhat verify --network arbitrumSepolia CONTRACT_ADDRESS PLATFORM_WALLET VOUCHER_SIGNER
```

---

## 🧪 Testing Smart Contracts

```bash
# Compile contracts
bun hardhat compile

# Run tests
bun hardhat test

# Run with gas report
REPORT_GAS=true bun hardhat test
```

---

## 🏃 Running Locally

### 1. Start Development Server

```bash
bun run dev
```

App will run on **http://localhost:3000**

### 2. Connect Wallet

- Click "Connect Wallet" button
- Approve MetaMask connection
- Switch to Arbitrum Sepolia if prompted

### 3. Test Features

**Upload Asset:**
1. Go to Upload page
2. Select file (image, video, audio, or document)
3. Fill title, description, price
4. Click Upload → Asset processes automatically
5. Creates preview and uploads to IPFS

**Mint NFT (Lazy Mint):**
1. After upload, click "Create NFT"
2. Sign voucher (no gas yet)
3. Share link with buyers

**Purchase NFT:**
1. Browse marketplace
2. Click asset card
3. Click "Purchase" button
4. Approve transaction in MetaMask
5. NFT minted and transferred

**Access Full Asset:**
1. Own the NFT
2. Click "Download Full Asset"
3. Full-quality file accessible

---

## 🚀 Production Deployment

### 1. Build for Production

```bash
bun run build
```

### 2. Deploy Frontend

**Option A: Vercel**
```bash
bun add -g vercel
vercel --prod
```

**Option B: Netlify**
```bash
bun add -g netlify-cli
netlify deploy --prod
```

### 3. Environment Variables
Add all `.env.local` variables to your hosting platform.

### 4. Update Contract Addresses
Make sure deployed contract addresses are in production env vars.

---

## 📚 Project Structure

```
aureve/
├── contracts/                  # Smart contracts
│   └── DigitalAssetNFT.sol    # ERC-1155 + ERC-2981
├── scripts/
│   └── deploy.ts              # Deployment script
├── test/
│   └── DigitalAssetNFT.test.ts # Contract tests
├── src/
│   ├── components/            # UI components
│   │   ├── AssetCard.tsx
│   │   ├── WalletConnect.tsx
│   │   └── NetworkSwitcher.tsx
│   ├── hooks/                 # React Query hooks
│   │   ├── useWallet.ts
│   │   ├── useAssets.ts
│   │   └── useNFT.ts
│   ├── services/              # Business logic
│   │   ├── blockchain/
│   │   ├── storage/
│   │   └── assetProcessing/
│   ├── stores/                # Zustand stores
│   │   ├── walletStore.ts
│   │   └── index.ts
│   ├── routes/                # Pages & API
│   │   ├── api/
│   │   ├── index.tsx
│   │   └── marketplace.tsx
│   └── lib/                   # Utils & config
│       ├── networkConfig.ts
│       └── supabaseClient.ts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── hardhat.config.ts
├── package.json
└── .env.local
```

---

## 🔧 Common Issues & Solutions

### Issue: "Contract not found"
**Solution:** Make sure you deployed the contract and updated `VITE_NFT_CONTRACT_ADDRESS_ARBITRUM` in `.env.local`

### Issue: "Wrong network"
**Solution:** Click network switcher and select Arbitrum Sepolia

### Issue: "Failed to upload to IPFS"
**Solution:** Check `PINATA_API_KEY` is correct in `.env.local`

### Issue: "Transaction failed"
**Solution:** 
- Check you have enough testnet ETH
- Gas limit might be low - increase in MetaMask

### Issue: "FFmpeg not found" (video/audio processing)
**Solution:** 
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg
```

---

## 🎯 Next Steps / Future Enhancements

### Phase 2 Features:
- Secondary marketplace with bidding
- Batch minting
- Collections/series support
- Creator dashboard with analytics
- Royalty payout automation

### Phase 3 Features:
- Gasless transactions (meta-transactions)
- Multiple currency support (USDC, DAI)
- Mobile app
- AR/VR asset previews

---

## 📞 Support & Prompts for AI Assistance

### Prompt: Add Secondary Marketplace
"Add a secondary marketplace feature where users can list their owned NFTs for resale, with bidding functionality and automatic royalty enforcement."

### Prompt: Add Analytics Dashboard
"Create a creator analytics dashboard showing: total sales, royalty earnings, NFT holders, trending assets, and revenue charts."

### Prompt: Add New Asset Type
"Add support for 3D models (GLB/GLTF files) with Three.js preview in the marketplace."

### Prompt: Implement Batch Minting
"Implement batch minting feature allowing creators to mint multiple NFTs from a single transaction."

---

## 📄 License
MIT License

---

**Built with ❤️ using TanStack Start, Hardhat, Supabase, and Pinata**
