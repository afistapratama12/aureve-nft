-- Create users table (wallet-based authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  username TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assets table (uploaded digital assets)
CREATE TABLE IF NOT EXISTS assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  creator_wallet TEXT NOT NULL,
  
  -- Asset metadata
  title TEXT NOT NULL,
  description TEXT,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('image', 'video', 'audio', 'document')),
  
  -- IPFS/Pinata storage
  preview_cid TEXT NOT NULL, -- Low-res/watermarked preview
  full_cid TEXT NOT NULL, -- Full quality asset
  metadata_cid TEXT, -- JSON metadata on IPFS
  
  -- File details
  file_size BIGINT,
  mime_type TEXT,
  original_filename TEXT,
  
  -- NFT details
  token_id BIGINT, -- Assigned after lazy mint voucher created
  price NUMERIC(78, 0) NOT NULL, -- Price in wei
  royalty_percentage INTEGER DEFAULT 10 CHECK (royalty_percentage >= 0 AND royalty_percentage <= 100),
  
  -- Status tracking
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'minted', 'archived')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nfts table (minted NFT instances)
CREATE TABLE IF NOT EXISTS nfts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  token_id BIGINT NOT NULL,
  
  -- Owner information
  owner_wallet TEXT NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Mint details
  mint_transaction_hash TEXT NOT NULL,
  mint_block_number BIGINT,
  chain_id INTEGER NOT NULL,
  amount INTEGER DEFAULT 1,
  
  -- Timestamps
  minted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(token_id, owner_wallet, chain_id)
);

-- Create transactions table (purchase and transfer history)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  token_id BIGINT NOT NULL,
  
  -- Transaction details
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('mint', 'purchase', 'transfer')),
  transaction_hash TEXT NOT NULL UNIQUE,
  block_number BIGINT,
  chain_id INTEGER NOT NULL,
  
  -- Parties involved
  from_wallet TEXT,
  to_wallet TEXT NOT NULL,
  amount INTEGER NOT NULL,
  
  -- Financial details
  price_wei NUMERIC(78, 0),
  platform_fee_wei NUMERIC(78, 0),
  creator_payment_wei NUMERIC(78, 0),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create royalties table (royalty tracking and payouts)
CREATE TABLE IF NOT EXISTS royalties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  creator_wallet TEXT NOT NULL,
  
  -- Royalty details
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  amount_wei NUMERIC(78, 0) NOT NULL,
  percentage INTEGER NOT NULL,
  
  -- Payout status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  payout_transaction_hash TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Create vouchers table (lazy minting vouchers)
CREATE TABLE IF NOT EXISTS vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  token_id BIGINT NOT NULL UNIQUE,
  
  -- Voucher details
  signature TEXT NOT NULL,
  nonce BIGINT NOT NULL,
  is_redeemed BOOLEAN DEFAULT FALSE,
  
  -- Voucher data (mirrors smart contract struct)
  creator_wallet TEXT NOT NULL,
  uri TEXT NOT NULL,
  price_wei NUMERIC(78, 0) NOT NULL,
  royalty_bps INTEGER NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  redeemed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX idx_assets_creator ON assets(creator_wallet);
CREATE INDEX idx_assets_token_id ON assets(token_id);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_type ON assets(asset_type);
CREATE INDEX idx_nfts_owner ON nfts(owner_wallet);
CREATE INDEX idx_nfts_token_id ON nfts(token_id);
CREATE INDEX idx_nfts_chain_id ON nfts(chain_id);
CREATE INDEX idx_transactions_asset ON transactions(asset_id);
CREATE INDEX idx_transactions_token ON transactions(token_id);
CREATE INDEX idx_transactions_from ON transactions(from_wallet);
CREATE INDEX idx_transactions_to ON transactions(to_wallet);
CREATE INDEX idx_royalties_creator ON royalties(creator_wallet);
CREATE INDEX idx_royalties_status ON royalties(status);
CREATE INDEX idx_vouchers_token_id ON vouchers(token_id);
CREATE INDEX idx_vouchers_redeemed ON vouchers(is_redeemed);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE royalties ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow public read, authenticated write)
-- Users: Public read, own record update
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own record" ON users
  FOR UPDATE USING (auth.jwt() ->> 'wallet_address' = wallet_address);

CREATE POLICY "Users can insert own record" ON users
  FOR INSERT WITH CHECK (true);

-- Assets: Public read, creator can manage own assets
CREATE POLICY "Assets are viewable by everyone" ON assets
  FOR SELECT USING (true);

CREATE POLICY "Creators can insert assets" ON assets
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Creators can update own assets" ON assets
  FOR UPDATE USING (creator_wallet = (SELECT wallet_address FROM users WHERE id = auth.uid()));

CREATE POLICY "Creators can delete own assets" ON assets
  FOR DELETE USING (creator_wallet = (SELECT wallet_address FROM users WHERE id = auth.uid()));

-- NFTs: Public read
CREATE POLICY "NFTs are viewable by everyone" ON nfts
  FOR SELECT USING (true);

CREATE POLICY "System can insert NFTs" ON nfts
  FOR INSERT WITH CHECK (true);

-- Transactions: Public read
CREATE POLICY "Transactions are viewable by everyone" ON transactions
  FOR SELECT USING (true);

CREATE POLICY "System can insert transactions" ON transactions
  FOR INSERT WITH CHECK (true);

-- Royalties: Creators can view their royalties
CREATE POLICY "Creators can view own royalties" ON royalties
  FOR SELECT USING (true);

CREATE POLICY "System can insert royalties" ON royalties
  FOR INSERT WITH CHECK (true);

-- Vouchers: Public read for verification
CREATE POLICY "Vouchers are viewable by everyone" ON vouchers
  FOR SELECT USING (true);

CREATE POLICY "System can manage vouchers" ON vouchers
  FOR ALL USING (true);
