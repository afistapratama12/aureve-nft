/**
 * Server functions API
 * All server-side functions for backend operations
 */

// NFT related server functions
export {
  createLazyMintVoucher,
  verifyNFTOwnership,
  getAssetAccessUrl,
  recordTransaction,
} from './nftServerFunctions';

// Upload related server functions
export {
  getNextTokenId,
  verifyNFTOwnershipFromDB,
} from './uploadServerFunctions';
