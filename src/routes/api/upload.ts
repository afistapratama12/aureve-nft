import { createServerFn } from "@tanstack/react-start";
import { supabase, TABLES } from "@/lib/supabaseClient";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";

/**
 * Server function to process and upload asset
 */
export const processAndUploadAsset = createServerFn({ method: "POST"}).inputValidator((data: {
  // file: File;
  title: string;
  description: string;
  assetType: "image" | "video" | "audio" | "document";
  price: string;
  royaltyPercentage: number;
  creatorWallet: string;
  watermarkText?: string;
}) => data).handler(async ({data}) => {
  const params = data;
  try {
    // Read file buffer
    const arrayBuffer = await params.file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to temp file
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(
      tempDir,
      `upload-${Date.now()}-${params.file.name}`
    );
    await fs.writeFile(tempFilePath, buffer);

    let previewBuffer: Buffer;
    let fullBuffer: Buffer = buffer;

    // Process based on asset type
    switch (params.assetType) {
      case "image": {
        const { createImagePreview } = await import(
          "@/services/assetProcessing/imageProcessor"
        );
        previewBuffer = await createImagePreview(buffer, params.watermarkText);
        break;
      }

      case "video": {
        const { createVideoPreview } = await import(
          "@/services/assetProcessing/videoProcessor"
        );
        previewBuffer = await createVideoPreview(tempFilePath, params.watermarkText);
        break;
      }

      case "audio": {
        const { createAudioPreview } = await import(
          "@/services/assetProcessing/audioProcessor"
        );
        previewBuffer = await createAudioPreview(tempFilePath);
        break;
      }

      case "document": {
        const { createDocumentPreview } = await import(
          "@/services/assetProcessing/documentProcessor"
        );
        previewBuffer = await createDocumentPreview(buffer, params.file.type);
        break;
      }

      default:
        throw new Error("Unsupported asset type");
    }

    // Upload to IPFS via Pinata (server-side)
    const { uploadToIPFS } = await import("@/services/storage/pinataService");
    
    const [previewUpload, fullUpload] = await Promise.all([
      uploadToIPFS(previewBuffer, `preview-${params.file.name}`, {
        assetType: params.assetType,
        title: params.title,
      }),
      uploadToIPFS(fullBuffer, params.file.name, {
        assetType: params.assetType,
        title: params.title,
      }),
    ]);

    // Create metadata JSON
    const { createNFTMetadata, uploadMetadataToIPFS } = await import(
      "@/services/storage/pinataService"
    );

    const metadata = createNFTMetadata({
      name: params.title,
      description: params.description,
      previewCid: previewUpload.cid,
      fullCid: fullUpload.cid,
      assetType: params.assetType,
      creator: params.creatorWallet,
    });

    const metadataUpload = await uploadMetadataToIPFS(metadata);

    // Save to database
    const { data: asset, error } = await supabase
      .from(TABLES.ASSETS)
      .insert({
        creator_wallet: params.creatorWallet,
        title: params.title,
        description: params.description,
        asset_type: params.assetType,
        preview_cid: previewUpload.cid,
        full_cid: fullUpload.cid,
        metadata_cid: metadataUpload.cid,
        file_size: buffer.length,
        mime_type: params.file.type,
        original_filename: params.file.name,
        price: params.price,
        royalty_percentage: params.royaltyPercentage,
        status: "draft",
      })
      .select()
      .single();

    if (error) throw error;

    // Cleanup temp file
    await fs.unlink(tempFilePath).catch(() => {});

    return {
      asset,
      previewUrl: previewUpload.url,
      fullUrl: fullUpload.url,
      metadataUrl: metadataUpload.url,
    };
  } catch (error) {
    console.error("Error processing and uploading asset:", error);
    throw error;
  }
});

/**
 * Server function to get next available token ID
 */
export const getNextTokenId = createServerFn({ method: "GET"}).handler(async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.ASSETS)
      .select("token_id")
      .order("token_id", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      throw error;
    }

    const nextId = data?.token_id ? data.token_id + 1 : 1;
    return nextId;
  } catch (error) {
    console.error("Error getting next token ID:", error);
    return 1;
  }
});
