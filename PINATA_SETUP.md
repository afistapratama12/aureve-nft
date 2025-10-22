# Pinata IPFS Setup Guide

Aureve uses Pinata for decentralized file storage via IPFS. Follow these steps to set up Pinata for your development environment.

## 1. Create Pinata Account

1. Go to [https://app.pinata.cloud](https://app.pinata.cloud)
2. Sign up for a free account
3. Verify your email address

## 2. Get API Key

1. Once logged in, click on **"API Keys"** in the sidebar
2. Click **"New Key"** button
3. Configure the key:
   - **Key Name**: `Aureve Development` (or any name you prefer)
   - **Permissions**: 
     - ✅ `pinFileToIPFS` (required for file uploads)
     - ✅ `pinJSONToIPFS` (required for metadata uploads)
     - ✅ Optional: `unpinFromIPFS`, `pinList` (for management)
4. Click **"Generate Key"**
5. **IMPORTANT**: Copy the API key immediately - it won't be shown again!

## 3. Get Gateway Domain

1. Go to **"Gateways"** in the sidebar
2. You'll see your default gateway domain (e.g., `gateway.pinata.cloud`)
3. Optional: Create a dedicated gateway for better performance
4. Copy your gateway domain

## 4. Configure Environment Variables

Add to your `.env` file:

```bash
# Pinata Configuration
VITE_PINATA_API_KEY=your_actual_api_key_here
VITE_PINATA_GATEWAY_DOMAIN=gateway.pinata.cloud
```

### Example:
```bash
VITE_PINATA_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_PINATA_GATEWAY_DOMAIN=gateway.pinata.cloud
```

## 5. Test Your Setup

1. Restart your dev server after adding environment variables:
   ```bash
   bun dev
   ```

2. Try uploading an NFT through the `/upload` page
3. Check browser console for detailed logs:
   - ✅ "Uploading to Pinata..."
   - ✅ "Upload successful: QmXxx..."
   - ❌ If you see "Pinata API key is missing" - check your .env file

## 6. Verify Uploads

After successful upload:
1. Go to [https://app.pinata.cloud/pinmanager](https://app.pinata.cloud/pinmanager)
2. You should see your uploaded files
3. Click on any file to view/test the IPFS URL

## Free Tier Limits

Pinata's free tier includes:
- **1 GB** storage
- **100 GB** bandwidth/month
- Unlimited pins
- Dedicated gateway

This is more than enough for development and testing!

## Troubleshooting

### Error: "Pinata API key not configured"
- Make sure your `.env` file has `VITE_PINATA_API_KEY` (with `VITE_` prefix!)
- Restart your dev server after adding/changing .env variables

### Error: "401 Unauthorized"
- Your API key might be invalid or expired
- Generate a new API key from Pinata dashboard
- Make sure you copied the entire key (they're quite long!)

### Error: "Failed to upload to Pinata: 403"
- Check that your API key has the correct permissions
- Required: `pinFileToIPFS` and `pinJSONToIPFS`

### Files not appearing in Pin Manager
- Wait a few seconds - uploads can take time
- Check the browser console for the IPFS hash
- Try accessing directly: `https://gateway.pinata.cloud/ipfs/YOUR_HASH`

## Production Considerations

For production deployment:
1. Use a **dedicated gateway** for better performance
2. Consider upgrading to paid plan for:
   - More storage
   - Higher bandwidth
   - Better reliability
   - Custom domains
3. Implement rate limiting on your app
4. Monitor your usage in Pinata dashboard

## Resources

- [Pinata Documentation](https://docs.pinata.cloud)
- [Pinata API Reference](https://docs.pinata.cloud/api-reference)
- [IPFS Documentation](https://docs.ipfs.tech)
