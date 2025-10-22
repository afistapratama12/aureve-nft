# 🎨 Aureve - NFT Digital Asset Platform

## 📊 Project Summary

**Aureve** is a full-stack decentralized NFT marketplace for tokenizing and trading digital assets (images, videos, audio, documents) with:

- ✅ **ERC-1155** unlimited edition NFTs
- ✅ **ERC-2981** automatic royalty enforcement  
- ✅ **Lazy minting** with signed vouchers (no upfront gas)
- ✅ **Multi-chain support**: Arbitrum Sepolia (default), Ethereum Sepolia, Monad Testnet
- ✅ **IPFS/Pinata** decentralized storage
- ✅ **Supabase** PostgreSQL database
- ✅ **Auto-processing**: Images, videos, audio, documents with preview generation
- ✅ **1% platform fee**, rest to creator + royalties
- ✅ **Wallet-only authentication** (fully decentralized)

---

## 🏗️ Architecture

### **Frontend**
- **Framework**: @tanstack/start (React-based, TypeScript)
- **Styling**: Tailwind CSS
- **State**: Zustand (global state management)
- **Data Fetching**: React Query (TanStack Query)
- **Wallet**: ethers.js v6 + MetaMask

### **Backend**
- **API**: TanStack Start server functions
- **Database**: Supabase (PostgreSQL)
- **Storage**: Pinata (IPFS gateway)
- **Processing**: Sharp (images), FFmpeg (video/audio)

### **Blockchain**
- **Development**: Hardhat
- **Contracts**: Solidity 0.8.28
- **Standards**: ERC-1155, ERC-2981
- **Networks**: Arbitrum Sepolia (default), Ethereum Sepolia, Monad Testnet

---

## 📁 Key Files Created

### **Smart Contracts** (`/contracts`)
- `DigitalAssetNFT.sol` - Main ERC-1155 + ERC-2981 contract with lazy minting

### **Blockchain Services** (`/src/services/blockchain`)
- `walletService.ts` - Wallet connection, network switching, contract interaction

### **Storage Services** (`/src/services/storage`)
- `pinataService.ts` - IPFS upload via Pinata API

### **Asset Processing** (`/src/services/assetProcessing`)
- `imageProcessor.ts` - Resize, compress, optional watermark
- `videoProcessor.ts` - FFmpeg compression, preview generation
- `audioProcessor.ts` - Audio compression, low-quality preview
- `documentProcessor.ts` - Document handling

### **State Management** (`/src/stores`)
- `walletStore.ts` - Wallet connection state
- `index.ts` - Asset, NFT, and marketplace stores

### **React Hooks** (`/src/hooks`)
- `useWallet.ts` - Connect, disconnect, switch network
- `useAssets.ts` - CRUD operations for assets
- `useNFT.ts` - Mint, purchase, ownership verification

### **API Routes** (`/src/routes/api`)
- `nft.ts` - Lazy mint voucher creation, ownership verification, access control
- `upload.ts` - Asset processing and IPFS upload

### **Components** (`/src/components`)
- `WalletConnect.tsx` - Wallet connection button
- `NetworkSwitcher.tsx` - Multi-chain network selector
- `AssetCard.tsx` - Asset display card for marketplace

### **Pages** (`/src/routes`)
- `marketplace.tsx` - Browse, search, filter NFTs

### **Database** (`/supabase/migrations`)
- `001_initial_schema.sql` - Complete database schema with RLS policies

### **Configuration**
- `hardhat.config.ts` - Hardhat networks and TypeChain
- `.env.example` - Environment variable template
- `package.json` - Updated with deployment scripts

### **Documentation**
- `SETUP.md` - Comprehensive setup and deployment guide
- `supabase/README.md` - Database setup instructions

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Configure environment (see SETUP.md)
cp .env.example .env.local
# Fill in your credentials

# 3. Setup database
# Run supabase/migrations/001_initial_schema.sql in Supabase

# 4. Deploy smart contract
bun run deploy:arbitrum

# 5. Start development server
bun run dev
```

**Open**: http://localhost:3000

---

## 🎯 Core Features

### ✅ **Upload & Process Assets**
- Drag & drop upload
- Auto-generate low-res preview
- Optional watermarking
- IPFS pinning (Pinata)

### ✅ **Lazy Minting**
- Creator creates signed voucher (no gas)
- First buyer redeems and mints
- Subsequent buyers purchase from supply

### ✅ **Unlimited Editions**
- ERC-1155 allows infinite minting
- Each NFT is fungible within its ID
- Lower costs, higher accessibility

### ✅ **Royalty Enforcement**
- ERC-2981 standard
- Automatic royalty calculation
- Creator earns on all sales (after 1% platform fee)

### ✅ **NFT-Gated Access**
- Preview always public (low-res)
- Full asset requires NFT ownership
- On-chain verification

### ✅ **Multi-Chain Support**
- Arbitrum Sepolia (default, cheaper gas)
- Ethereum Sepolia
- Monad Testnet
- Easy network switching

### ✅ **Marketplace**
- Browse all assets
- Filter by type (image, video, audio, document)
- Search by title/description
- Creator profiles

---

## 🧪 Testing

```bash
# Compile smart contracts
bun run compile

# Run contract tests
bun run test:contracts

# Local deployment
bun run deploy:local
```

---

## 📦 Deployment

### **Smart Contracts**
```bash
# Deploy to Arbitrum Sepolia
bun run deploy:arbitrum

# Deploy to Ethereum Sepolia
bun run deploy:ethereum

# Deploy to Monad Testnet
bun run deploy:monad
```

### **Frontend**
```bash
# Build for production
bun run build

# Deploy to Vercel
vercel --prod

# Or Netlify
netlify deploy --prod
```

---

## 🔐 Security Considerations

### ✅ **Implemented**
- Row Level Security (RLS) on Supabase
- Private key stored in environment variable
- Signature verification for lazy minting
- Ownership verification for asset access
- HTTPS for all API calls

### ⚠️ **Production Recommendations**
- Use AWS KMS or HashiCorp Vault for private key management
- Implement rate limiting on API endpoints
- Add CAPTCHA for upload forms
- Set up monitoring and alerting
- Regular smart contract audits

---

## 📊 Database Schema

### **Tables**
1. **users** - Wallet-based user profiles
2. **assets** - Uploaded digital assets
3. **nfts** - Minted NFT instances
4. **transactions** - Purchase/transfer history
5. **royalties** - Royalty tracking
6. **vouchers** - Lazy mint vouchers

All tables have indexes, foreign keys, and RLS policies.

---

## 🎨 Asset Processing Pipeline

1. **Upload** → User selects file
2. **Validate** → Check file type and size
3. **Process** → Generate preview based on type:
   - **Image**: Resize to 800px, 70% quality
   - **Video**: Compress to 480p, 500kbps
   - **Audio**: 64kbps, mono
   - **Document**: Keep as-is (could extract pages)
4. **Watermark** (optional) → Add text overlay
5. **Upload to IPFS** → Pin preview + full asset
6. **Create metadata** → JSON with IPFS CIDs
7. **Save to database** → Asset record created

---

## 💰 Payment Flow

1. **Buyer** clicks "Purchase"
2. **Frontend** gets voucher from backend (if first mint)
3. **Transaction** sent to smart contract
4. **Contract** verifies signature and payment
5. **Mints** NFT to buyer
6. **Distributes**:
   - 1% to platform wallet
   - 99% to creator
7. **Backend** records transaction in database
8. **Buyer** can now access full asset

---

## 🔮 Future Enhancements (Prompts for AI)

### **Phase 2**
- "Add bidding and auction functionality for NFTs"
- "Create creator analytics dashboard with revenue charts"
- "Implement batch minting for collections"
- "Add NFT bundling and series management"

### **Phase 3**
- "Implement gasless transactions with meta-transactions"
- "Add ERC-20 token payment support (USDC, DAI)"
- "Create mobile app with React Native"
- "Add 3D model support with Three.js viewer"

---

## 📞 Support

**Issues?** Check `SETUP.md` for troubleshooting.

**Questions?** Review inline code comments - every service and component is documented.

**Need help?** Use the AI prompts in `SETUP.md` for extending features.

---

## 📄 License
MIT License

---

**Built with:**
- TanStack Start
- Hardhat
- Supabase
- Pinata
- ethers.js
- Zustand
- React Query
- Tailwind CSS

**Deployed on:** Arbitrum Sepolia, Ethereum Sepolia, Monad Testnet

---

🎉 **You're all set!** Follow SETUP.md to deploy and launch your NFT platform.
