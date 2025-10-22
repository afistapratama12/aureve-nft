# Contract Integration Guide - Aureve Frontend

Panduan integrasi smart contract ke frontend Aureve.

## 📋 Prerequisites

1. Smart contract sudah di-deploy di `aureve-contract` project
2. Contract address sudah tersedia
3. Contract ABI sudah di-generate (ada di `aureve-contract/artifacts/`)

## 🔗 Setup Contract Connection

### 1. Environment Variables

Edit `.env.local` dengan contract addresses:

```env
# Contract addresses per network
VITE_NFT_CONTRACT_ADDRESS_ARBITRUM=0x... # dari deployment Arbitrum Sepolia
VITE_NFT_CONTRACT_ADDRESS_ETHEREUM=0x... # dari deployment Ethereum Sepolia (optional)
VITE_NFT_CONTRACT_ADDRESS_MONAD=0x...    # dari deployment Monad (optional)

# Platform wallet (receives 1% fee)
VITE_PLATFORM_WALLET_ADDRESS=0x...

# Signer private key (untuk create voucher di backend)
SIGNER_PRIVATE_KEY=0x...
```

### 2. Contract ABI

Contract ABI sudah ada di `src/services/blockchain/walletService.ts` dengan fungsi-fungsi utama:

```typescript
const NFT_CONTRACT_ABI = [
  "function redeemVoucher((uint256 tokenId, string uri, uint256 price, address creator, uint96 royaltyBps, uint256 nonce, bytes signature) voucher, uint256 amount) payable",
  "function purchaseToken(uint256 tokenId, uint256 amount) payable",
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function uri(uint256 tokenId) view returns (string)",
  "function getCreator(uint256 tokenId) view returns (address)",
  "function getPrice(uint256 tokenId) view returns (uint256)",
  "function totalSupply(uint256 tokenId) view returns (uint256)",
  "function royaltyInfo(uint256 tokenId, uint256 salePrice) view returns (address, uint256)"
];
```

## 🎯 Key Integration Points

### 1. Wallet Connection (`src/hooks/useWallet.ts`)

```typescript
// Connect wallet
const { mutate: connect } = useConnectWallet();

// Switch network
const { mutate: switchNetwork } = useSwitchNetwork();

// Disconnect
const { mutate: disconnect } = useDisconnectWallet();
```

### 2. Lazy Minting Flow

**Step 1: Upload asset to IPFS (Frontend)**
```typescript
// src/routes/api/upload.ts
const { metadata, previewUrl } = await processAndUploadAsset(formData);
```

**Step 2: Create voucher signature (Backend)**
```typescript
// src/routes/api/nft.ts
const voucher = await createLazyMintVoucher({
  tokenId,
  uri: metadataUri,
  price: ethers.parseEther(priceInEth),
  creator: walletAddress,
  royaltyBps: 1000, // 10%
  nonce: Date.now()
});
```

**Step 3: User redeems voucher (Frontend)**
```typescript
// src/hooks/useNFT.ts
const { mutate: redeemVoucher } = useRedeemVoucher();

redeemVoucher({
  voucher,
  amount: 1,
  value: voucher.price
});
```

### 3. Purchase Additional Copies

```typescript
// src/hooks/useNFT.ts
const { mutate: purchaseNFT } = usePurchaseNFT();

purchaseNFT({
  tokenId: 1,
  amount: 5,
  value: price * 5n
});
```

### 4. Check Ownership (Gated Content)

```typescript
// src/hooks/useNFT.ts
const { data: hasAccess } = useCheckOwnership({
  tokenId: 1,
  userAddress: '0x...'
});

if (hasAccess) {
  // Show full asset
} else {
  // Show preview only
}
```

## 🔄 Data Flow

### Asset Creation & Minting

```
User Upload Asset
    ↓
Frontend: processAndUploadAsset()
    ↓
Sharp/FFmpeg: Generate preview
    ↓
Pinata: Upload full asset + preview + metadata
    ↓
Backend: createLazyMintVoucher()
    ↓
ethers.js: Sign voucher with SIGNER_PRIVATE_KEY
    ↓
Return voucher to frontend
    ↓
User calls: contract.redeemVoucher()
    ↓
Smart Contract: Mint NFT + Distribute payment
    ↓
Update Supabase: Record transaction
```

### Purchase Flow

```
User clicks "Buy"
    ↓
Frontend: usePurchaseNFT()
    ↓
walletService: contract.purchaseToken()
    ↓
Smart Contract: Mint + Pay (creator + royalty + platform fee)
    ↓
Backend: recordTransaction()
    ↓
Update Supabase: transactions table
```

## 📁 Important Files

### Contract Integration
- `src/services/blockchain/walletService.ts` - Core contract interaction
- `src/lib/networkConfig.ts` - Network configurations
- `src/hooks/useWallet.ts` - Wallet connection hooks
- `src/hooks/useNFT.ts` - NFT operation hooks

### Asset Processing
- `src/services/assetProcessing/imageProcessor.ts` - Image optimization
- `src/services/assetProcessing/videoProcessor.ts` - Video compression
- `src/services/assetProcessing/audioProcessor.ts` - Audio processing
- `src/services/storage/pinataService.ts` - IPFS uploads

### API Routes (TanStack Start Server Functions)
- `src/routes/api/upload.ts` - Asset upload & processing
- `src/routes/api/nft.ts` - Voucher creation & verification

## 🧪 Testing Integration

### 1. Test Wallet Connection
```typescript
// Should connect to MetaMask
const address = await connectWallet();
console.log('Connected:', address);
```

### 2. Test Network Switching
```typescript
// Should switch to Arbitrum Sepolia (421614)
await switchNetwork(421614);
```

### 3. Test Asset Upload
```typescript
// Should upload to Pinata and return metadata
const result = await processAndUploadAsset(formData);
console.log('IPFS URI:', result.metadata.image);
```

### 4. Test Lazy Minting
```typescript
// Should create valid signature
const voucher = await createLazyMintVoucher({ ... });
console.log('Voucher:', voucher);

// Should mint NFT
await contract.redeemVoucher(voucher, 1, { value: price });
```

### 5. Test Purchase
```typescript
// Should purchase additional copies
await contract.purchaseToken(tokenId, amount, { value: totalPrice });
```

## ⚠️ Common Issues

### Issue: "Network mismatch"
**Solution:** Ensure user is on correct network before transactions
```typescript
if (chainId !== ARBITRUM_SEPOLIA_CHAIN_ID) {
  await switchNetwork(ARBITRUM_SEPOLIA_CHAIN_ID);
}
```

### Issue: "Invalid signature"
**Solution:** Check SIGNER_PRIVATE_KEY matches voucherSigner in contract
```typescript
const contractVoucherSigner = await contract.voucherSigner();
console.log('Contract signer:', contractVoucherSigner);
```

### Issue: "Insufficient funds"
**Solution:** Ensure user has enough ETH for (price * amount) + gas
```typescript
const balance = await provider.getBalance(address);
if (balance < totalCost) {
  throw new Error('Insufficient balance');
}
```

### Issue: "Transaction reverted"
**Solution:** Check contract error messages in console
```typescript
try {
  await tx.wait();
} catch (error) {
  console.error('Contract error:', error.reason);
}
```

## 🔍 Debugging

### Enable Verbose Logging

```typescript
// In walletService.ts
const contract = new ethers.Contract(address, abi, signer);
contract.on('*', (event) => {
  console.log('Contract event:', event);
});
```

### Check Transaction Status

```typescript
const tx = await contract.purchaseToken(...);
console.log('TX Hash:', tx.hash);

const receipt = await tx.wait();
console.log('Status:', receipt.status); // 1 = success, 0 = failed
console.log('Gas used:', receipt.gasUsed.toString());
```

### Verify Contract State

```typescript
const tokenPrice = await contract.getPrice(tokenId);
const tokenSupply = await contract.totalSupply(tokenId);
const creator = await contract.getCreator(tokenId);

console.log({ tokenPrice, tokenSupply, creator });
```

## 📚 Additional Resources

- **Ethers.js Docs**: https://docs.ethers.org/v6/
- **ERC-1155 Standard**: https://eips.ethereum.org/EIPS/eip-1155
- **ERC-2981 Royalty**: https://eips.ethereum.org/EIPS/eip-2981
- **TanStack Start**: https://tanstack.com/start/latest
- **Zustand**: https://zustand-demo.pmnd.rs/

## ✅ Integration Checklist

- [ ] Smart contract deployed (from `aureve-contract`)
- [ ] Contract address added to `.env.local`
- [ ] SIGNER_PRIVATE_KEY configured
- [ ] PLATFORM_WALLET_ADDRESS configured
- [ ] Supabase tables created (migrations applied)
- [ ] Pinata API keys configured
- [ ] FFmpeg installed (for video/audio processing)
- [ ] Test wallet connection
- [ ] Test network switching
- [ ] Test asset upload
- [ ] Test lazy minting (voucher creation)
- [ ] Test NFT purchase
- [ ] Test gated content access
- [ ] Test royalty distribution

## 🎉 Ready to Test!

Setelah semua checklist di atas selesai, jalankan:

```bash
bun run dev
```

Dan test flow:
1. Connect wallet → Switch to Arbitrum Sepolia
2. Upload asset → Generate preview
3. Create NFT listing → Sign voucher
4. Purchase NFT → Verify ownership
5. Access gated content → Download full asset
