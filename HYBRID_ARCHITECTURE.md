# Hybrid Architecture: Database + Blockchain

## Overview

Aureve menggunakan **hybrid architecture** yang menggabungkan database (Supabase) dengan blockchain (smart contract) untuk mendapatkan yang terbaik dari kedua dunia:

- **Database (Supabase)**: Untuk query cepat, search, filtering, dan metadata
- **Blockchain (Smart Contract)**: Untuk ownership verification, transactions, dan decentralization

## Why Hybrid?

### ❌ Pure Database (Centralized)
**Pros:**
- Fast queries
- Easy search & filter
- Low cost

**Cons:**
- ❌ **Not decentralized** - data can be manipulated
- ❌ No true ownership
- ❌ No blockchain benefits
- ❌ Requires trust in platform

### ❌ Pure Blockchain (Fully Decentralized)
**Pros:**
- Fully decentralized
- True ownership
- Immutable

**Cons:**
- ❌ Slow queries
- ❌ Expensive storage
- ❌ Difficult to search/filter
- ❌ Poor UX (slow loading)

### ✅ Hybrid (Best of Both)
**Pros:**
- ✅ Fast queries from database
- ✅ **True ownership on blockchain**
- ✅ **Transaction verification on-chain**
- ✅ Good UX
- ✅ Lower costs

**Trade-offs:**
- Database can go down (use IPFS URLs as fallback)
- Need to sync database with blockchain events

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND                          │
│  (React + TanStack Query)                           │
└──────────┬─────────────────────────┬────────────────┘
           │                         │
           ├─────────────┐           ├─────────────┐
           │             │           │             │
           ▼             ▼           ▼             ▼
    ┌──────────┐  ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ Database │  │   IPFS   │ │ Contract │ │ Wagmi    │
    │(Supabase)│  │(Pinata)  │ │ (Viem)   │ │ Hooks    │
    └──────────┘  └──────────┘ └──────────┘ └──────────┘
         │             │             │
         │             │             │
    ┌────┴─────────────┴─────────────┴────┐
    │     SOURCE OF TRUTH HIERARCHY       │
    ├─────────────────────────────────────┤
    │ 1. Blockchain (Ownership)           │
    │ 2. IPFS (Metadata)                  │
    │ 3. Database (Cache/Search)          │
    └─────────────────────────────────────┘
```

## Data Flow

### 1. **Upload & Create NFT** (Off-chain)

```
User uploads file
    ↓
Upload to IPFS (Pinata) → Get file hash
    ↓
Create metadata JSON
    ↓
Upload metadata to IPFS → Get metadata hash
    ↓
Create lazy mint voucher (off-chain signature)
    ↓
Save to Database (Supabase)
    - token_id
    - metadata_url (ipfs://...)
    - price
    - creator_address
    - voucher_signature
    - is_minted: FALSE ← Not on blockchain yet
```

**Result**: NFT listed in marketplace, but not minted on-chain yet (no gas cost)

### 2. **Purchase NFT** (On-chain)

```
Buyer clicks "Purchase"
    ↓
Fetch voucher from Database
    ↓
Call Smart Contract: redeemVoucher(voucher)
    ↓
Contract verifies signature
    ↓
Contract mints NFT to buyer
    ↓
Contract pays creator & platform
    ↓
Transaction confirmed ✅
    ↓
Update Database:
    - is_minted: TRUE
    - owner_address: buyer
    - transaction_hash
    - minted_at
```

**Result**: NFT now exists on blockchain, buyer owns it

### 3. **View Owned NFTs** (Hybrid)

```
User visits profile
    ↓
Query 1: Fetch from Database (fast)
    - Filter: creator_address = user OR owner_address = user
    - Get metadata, images, etc.
    ↓
Query 2: Verify on Blockchain (optional, for critical operations)
    - Call contract.balanceOf(user, tokenId)
    - Confirm actual ownership
```

**Result**: Fast loading + optional on-chain verification

## Source of Truth

### Database (Supabase)
**Used for:**
- Fast search & filtering
- Display metadata (title, description, image)
- List available NFTs
- Show creator info
- Cache IPFS data for performance

**NOT used for:**
- ❌ Ownership verification (blockchain is source of truth)
- ❌ Price at purchase time (read from contract)
- ❌ Transfer history (use blockchain events)

### Blockchain (Smart Contract)
**Used for:**
- ✅ **Ownership verification** (who owns what)
- ✅ **Minting** (create NFT on-chain)
- ✅ **Transfers** (buy, sell, transfer)
- ✅ **Payments** (ETH transactions)
- ✅ **Royalties** (automatic payment)

### IPFS (Pinata)
**Used for:**
- ✅ **Immutable storage** (files & metadata)
- ✅ **Decentralized storage** (no single point of failure)
- ✅ **Permanent URLs** (ipfs://...)

## Implementation

### Files Created

#### 1. **Contract Service** (`/src/services/blockchain/contractService.ts`)
```typescript
- NFT_CONTRACT_ADDRESSES: Contract addresses per network
- NFT_CONTRACT_ABI: Contract interface
- useNFTContract(): Get contract instance
- redeemVoucher(): Purchase NFT via lazy mint
- getTokenBalance(): Check ownership
- getTokenURI(): Get metadata URL
- getTokenPrice(): Get current price
```

#### 2. **Purchase Hook** (`/src/hooks/usePurchaseNFT.ts`)
```typescript
- usePurchaseNFT(): Main purchase function
  - Creates voucher from DB data
  - Calls contract.redeemVoucher()
  - Updates database after mint
  - Invalidates cache

- useCheckNFTOwnership(): Verify on-chain ownership
- useNFTMetadata(): Get on-chain metadata
```

#### 3. **Database Schema** (Supabase `nfts` table)
```sql
CREATE TABLE nfts (
  id UUID PRIMARY KEY,
  token_id BIGINT UNIQUE,
  creator_address TEXT NOT NULL,
  owner_address TEXT, -- Updated after purchase
  title TEXT,
  description TEXT,
  price TEXT, -- in ETH
  royalty_percentage NUMERIC,
  asset_type TEXT,
  file_url TEXT, -- ipfs://...
  metadata_url TEXT, -- ipfs://...
  chain_id INTEGER,
  voucher_signature TEXT,
  is_minted BOOLEAN DEFAULT FALSE, -- ← Key field!
  transaction_hash TEXT,
  minted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

```bash
# Smart Contract Addresses (fill after deployment)
VITE_NFT_CONTRACT_ADDRESS_ETHEREUM_SEPOLIA=0x...
VITE_NFT_CONTRACT_ADDRESS_ARBITRUM_SEPOLIA=0x...
VITE_NFT_CONTRACT_ADDRESS_MONAD_TESTNET=0x...
```

## Usage Example

### Purchase Flow

```typescript
import { usePurchaseNFT } from '@/hooks/usePurchaseNFT'

function PurchaseButton({ nft }) {
  const { mutate: purchase, isPending } = usePurchaseNFT()

  const handlePurchase = () => {
    purchase({
      tokenId: nft.tokenId,
      price: nft.price,
      metadataUrl: nft.metadataUrl,
      creatorAddress: nft.creatorAddress,
      royaltyPercentage: nft.royaltyPercentage,
      voucherSignature: nft.voucherSignature,
    })
  }

  return (
    <Button onClick={handlePurchase} disabled={isPending}>
      {isPending ? 'Processing...' : `Buy for ${nft.price} ETH`}
    </Button>
  )
}
```

## Benefits of This Approach

1. **Gas Efficiency**
   - Creator pays $0 to list NFT
   - Buyer pays gas only when purchasing
   - Single transaction for mint + purchase

2. **Great UX**
   - Fast marketplace browsing (database)
   - Instant search & filter
   - Image loading from IPFS gateway

3. **True Decentralization**
   - Ownership verified on-chain
   - Can trade on OpenSea, Blur, etc.
   - Even if Aureve database goes down:
     - NFTs still exist on blockchain
     - Metadata on IPFS still accessible
     - Users still own their NFTs

4. **Scalability**
   - Database can handle millions of NFTs
   - Blockchain only stores ownership
   - IPFS handles large files

## Security Considerations

1. **Database can be compromised**
   - ✅ Always verify ownership on-chain for critical operations
   - ✅ Use blockchain as final authority
   - ✅ IPFS URLs are in metadata (immutable)

2. **Voucher signature verification**
   - ✅ Smart contract must verify EIP-712 signature
   - ✅ Backend API must generate signatures securely
   - ✅ Never expose private key in frontend

3. **Price manipulation**
   - ✅ Price in voucher is enforced by contract
   - ✅ Database price is for display only
   - ✅ Contract checks minimum price before minting

## Next Steps

1. ✅ **Done**: Contract service & purchase hook
2. 🔄 **TODO**: Backend API for signature generation
3. 🔄 **TODO**: Deploy smart contracts to testnets
4. 🔄 **TODO**: Update .env with contract addresses
5. 🔄 **TODO**: Integrate purchase button in UI
6. 🔄 **TODO**: Add transaction status tracking
7. 🔄 **TODO**: Sync blockchain events to database

## Monitoring & Sync

**Future Enhancement**: Listen to blockchain events and sync to database

```typescript
// Listen to TokenMinted events
contract.on('TokenMinted', (tokenId, minter, creator, amount) => {
  // Update database
  supabase.from('nfts').update({
    is_minted: true,
    owner_address: minter,
    minted_at: new Date()
  }).eq('token_id', tokenId)
})
```

This ensures database stays in sync with blockchain state.

## Conclusion

Hybrid architecture gives us:
- 🚀 Performance of Web2
- 🔒 Security of Web3
- 💰 Cost efficiency
- 🎯 Great user experience
- ✅ True decentralization where it matters (ownership)

**Database is for UX, Blockchain is for truth!**
