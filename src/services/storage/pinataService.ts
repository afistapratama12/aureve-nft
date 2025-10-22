/**
 * Pinata IPFS service for uploading and pinning files
 * Handles both preview and full-quality asset uploads
 */

export interface PinataUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export interface PinataMetadata {
  name?: string;
  keyvalues?: Record<string, string>;
}

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY_DOMAIN;

/**
 * Upload file to IPFS via Pinata (client-side)
 */
export async function uploadToPinata(
  file: File | Blob,
  metadata?: PinataMetadata
): Promise<string> {
  if (!PINATA_API_KEY) {
    console.error("Pinata API key is missing. Please set VITE_PINATA_API_KEY in your .env file");
    throw new Error("Pinata API key not configured. Please check your .env file.");
  }
  
  try {
    console.log("Uploading to Pinata...", { 
      fileName: file instanceof File ? file.name : 'blob',
      fileSize: file.size,
      fileType: file.type 
    });
    
    const formData = new FormData();
    formData.append("file", file);
  
    if (metadata) {
      formData.append("pinataMetadata", JSON.stringify(metadata));
    }
  
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PINATA_API_KEY}`,
      },
      body: formData,
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pinata API error:", { status: response.status, error: errorText });
      throw new Error(`Pinata upload failed: ${response.status} - ${errorText}`);
    }
  
    const data = await response.json();
    console.log("Upload successful:", data.IpfsHash);
    return data.IpfsHash;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to upload to IPFS");
  }
}

/**
 * Upload JSON metadata to IPFS
 */
export async function uploadJSONToPinata(
  jsonData: any,
  filename: string
): Promise<string> {
  if (!PINATA_API_KEY) {
    console.error("Pinata API key is missing. Please set VITE_PINATA_API_KEY in your .env file");
    throw new Error("Pinata API key not configured. Please check your .env file.");
  }

  try {
    console.log("Uploading JSON to Pinata...", { filename });
    
    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PINATA_API_KEY}`,
      },
      body: JSON.stringify({
        pinataContent: jsonData,
        pinataMetadata: {
          name: filename,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pinata JSON upload error:", { status: response.status, error: errorText });
      throw new Error(`Pinata JSON upload failed: ${response.status} - ${errorText}`);
    }

    const data: PinataUploadResponse = await response.json();
    console.log("JSON upload successful:", data.IpfsHash);
    return data.IpfsHash;
  } catch (error) {
    console.error("Error uploading JSON to Pinata:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to upload metadata to IPFS");
  }
}

/**
 * Get IPFS gateway URL
 */
export function getIPFSUrl(cid: string): string {
  if (!cid) return "";
  
  // Use custom gateway if configured, otherwise use default
  if (PINATA_GATEWAY) {
    return `https://${PINATA_GATEWAY}/ipfs/${cid}`;
  }
  
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}

/**
 * Fetch file from IPFS
 */
export async function fetchFromIPFS(cid: string): Promise<Blob> {
  try {
    const url = getIPFSUrl(cid);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("Error fetching from IPFS:", error);
    throw error;
  }
}

/**
 * Fetch JSON metadata from IPFS
 */
export async function fetchJSONFromIPFS(cid: string): Promise<any> {
  try {
    const url = getIPFSUrl(cid);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch JSON from IPFS: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching JSON from IPFS:", error);
    throw error;
  }
}

/**
 * Unpin file from Pinata (cleanup)
 */
export async function unpinFromPinata(cid: string): Promise<boolean> {
  if (!PINATA_API_KEY) {
    throw new Error("Pinata API key not configured");
  }

  try {
    const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${PINATA_API_KEY}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Error unpinning from Pinata:", error);
    return false;
  }
}

/**
 * Get pinned file info
 */
export async function getPinataFileInfo(cid: string): Promise<any> {
  if (!PINATA_API_KEY) {
    throw new Error("Pinata API key not configured");
  }

  try {
    const response = await fetch(
      `https://api.pinata.cloud/data/pinList?hashContains=${cid}`,
      {
        headers: {
          Authorization: `Bearer ${PINATA_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get pin info");
    }

    const data = await response.json();
    return data.rows[0] || null;
  } catch (error) {
    console.error("Error getting pin info:", error);
    return null;
  }
}

/**
 * Create NFT metadata JSON
 */
export interface NFTMetadata {
  name: string;
  description: string;
  image: string; // IPFS CID of preview
  animation_url?: string; // For video/audio
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    assetType: "image" | "video" | "audio" | "document";
    fullAssetCID: string; // CID of full quality asset
    creator: string;
    license?: string;
  };
}

export async function createNFTMetadata(params: {
  title: string;
  description: string;
  assetType: "image" | "video" | "audio" | "document";
  previewCID: string;
  fullCID: string;
  creator: string;
  price: string;
  royalty: number;
}): Promise<string> {
  const metadata: NFTMetadata = {
    name: params.title,
    description: params.description,
    image: getIPFSUrl(params.previewCID),
    external_url: `https://yourapp.com/asset/${params.fullCID}`, // Update with your domain
    attributes: [
      {
        trait_type: "Asset Type",
        value: params.assetType,
      },
      {
        trait_type: "Creator",
        value: params.creator,
      },
      {
        trait_type: "Price (ETH)",
        value: params.price,
      },
      {
        trait_type: "Royalty",
        value: `${params.royalty}%`,
      },
    ],
    properties: {
      assetType: params.assetType,
      fullAssetCID: params.fullCID,
      creator: params.creator,
      license: "All rights reserved",
    },
  };

  // Add animation_url for video/audio
  if (params.assetType === "video" || params.assetType === "audio") {
    metadata.animation_url = getIPFSUrl(params.previewCID);
  }

  // Upload metadata JSON to IPFS
  const metadataCID = await uploadJSONToPinata(
    metadata,
    `${params.title.replace(/\s+/g, "-")}-metadata.json`
  );

  return metadataCID;
}
