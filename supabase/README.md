# Supabase Database Setup Guide

## Overview
This directory contains SQL migration files for the Aureve NFT platform database schema.

## Database Structure

### Tables:
1. **users** - Wallet-based user profiles
2. **assets** - Uploaded digital assets (photos, videos, music, documents)
3. **nfts** - Minted NFT instances on blockchain
4. **transactions** - Purchase and transfer history
5. **royalties** - Royalty tracking and payouts
6. **vouchers** - Lazy minting vouchers

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project: https://luntbqcrvpdgztefttdm.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query
4. Copy and paste the contents of `001_initial_schema.sql`
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI
```bash
# Install Supabase CLI
bun add -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref luntbqcrvpdgztefttdm

# Run migrations
supabase db push
```

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:
- **Public Read**: All data is readable by anyone (for marketplace transparency)
- **Authenticated Write**: Only authorized users can create/update their own records
- **System Operations**: Backend with service_role key can perform all operations

## Indexes

Indexes are created for:
- Creator wallet lookups
- Token ID searches
- Owner wallet queries
- Transaction history
- Asset type filtering
- Status filtering

These ensure fast queries for marketplace, dashboard, and search features.

## Testing the Schema

After running the migration, test with these queries:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check indexes
SELECT indexname, tablename FROM pg_indexes 
WHERE schemaname = 'public';

-- Test insert (replace with your wallet)
INSERT INTO users (wallet_address, username) 
VALUES ('0x1234...', 'testuser');

-- Verify insert
SELECT * FROM users;
```

## Notes
- All wallet addresses stored as TEXT (lowercase for consistency)
- Prices stored as NUMERIC(78, 0) to handle wei amounts
- Timestamps use TIMESTAMP WITH TIME ZONE for accuracy
- Foreign keys cascade appropriately to maintain data integrity
