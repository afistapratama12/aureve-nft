# 🚀 Quick Reference - Common Commands

## 📦 Installation
```bash
bun install
```

## 🏃 Development
```bash
# Start dev server (http://localhost:3000)
bun run dev

# Build for production
bun run build

# Preview production build
bun run serve
```

## 🔗 Smart Contracts
```bash
# Compile contracts
bun run compile

# Run tests
bun run test:contracts

# Deploy to Arbitrum Sepolia (default)
bun run deploy:arbitrum

# Deploy to Ethereum Sepolia
bun run deploy:ethereum

# Deploy to Monad Testnet
bun run deploy:monad

# Deploy to local Hardhat network
bun run deploy:local
```

## 🗄️ Database
```bash
# Run migration in Supabase SQL Editor
# Copy content from: supabase/migrations/001_initial_schema.sql
# Paste in Supabase Dashboard → SQL Editor → Run
```

## 🔧 Environment Setup
```bash
# 1. Copy example env
cp .env.example .env.local

# 2. Fill in your credentials:
# - Supabase URL & keys (already provided)
# - Pinata API key (already provided)
# - Your wallet address for VITE_PLATFORM_WALLET_ADDRESS
# - Your private key for SIGNER_PRIVATE_KEY

# 3. After contract deployment, add:
# - VITE_NFT_CONTRACT_ADDRESS_ARBITRUM=0x...
# - VITE_NFT_CONTRACT_ADDRESS_ETHEREUM=0x...
# - VITE_NFT_CONTRACT_ADDRESS_MONAD=0x...
```

## 📝 Checklist Before First Run

- [ ] `bun install` completed
- [ ] `.env.local` created and filled
- [ ] Supabase migration executed
- [ ] Smart contract deployed to Arbitrum Sepolia
- [ ] Contract address added to `.env.local`
- [ ] MetaMask installed in browser
- [ ] Testnet ETH in your wallet

## 🎯 First Time Setup Flow

```bash
# 1. Install
bun install

# 2. Configure env
cp .env.example .env.local
# Edit .env.local with your keys

# 3. Setup database
# Go to https://luntbqcrvpdgztefttdm.supabase.co
# Run supabase/migrations/001_initial_schema.sql

# 4. Get testnet ETH
# Visit: https://faucet.quicknode.com/arbitrum/sepolia

# 5. Deploy contract
bun run deploy:arbitrum
# Copy the contract address from output

# 6. Update .env.local with contract address
# VITE_NFT_CONTRACT_ADDRESS_ARBITRUM=0xYourAddress

# 7. Start dev server
bun run dev

# 8. Open browser
# Visit: http://localhost:3000
# Click "Connect Wallet"
# You're ready to go! 🎉
```

## 🐛 Quick Troubleshooting

### Can't connect wallet?
```bash
# Check MetaMask is installed
# Check you're on a supported network
```

### Wrong network?
```bash
# Click network switcher in app
# Select Arbitrum Sepolia
```

### Contract not found?
```bash
# Verify contract address in .env.local
# Check you deployed to the right network
```

### Upload fails?
```bash
# Check PINATA_API_KEY in .env.local
# Verify Pinata account is active
```

### FFmpeg errors?
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg
```

## 📚 Documentation

- **Full Setup**: `SETUP.md`
- **Project Overview**: `PROJECT_SUMMARY.md`
- **Database Schema**: `supabase/README.md`

## 🆘 Need Help?

1. Check `SETUP.md` → Common Issues section
2. Review code comments in source files
3. Use AI prompts in `SETUP.md` for feature requests

## 🎉 Ready to Launch!

Once everything is set up:
```bash
bun run dev
```

Open http://localhost:3000 and start minting NFTs! 🚀
