import sharp from "sharp";

/**
 * Image processing service
 * Handles resizing, compression, and optional watermarking
 */

export interface ImageProcessOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  watermark?: {
    text: string;
    position?: "center" | "bottom-right" | "bottom-left";
  };
}

/**
 * Process image: resize and compress
 * Default: max 800px width, 80% quality
 */
export async function processImage(
  input: Buffer | string,
  options: ImageProcessOptions = {}
): Promise<Buffer> {
  try {
    const {
      maxWidth = 800,
      maxHeight = 800,
      quality = 80,
      watermark,
    } = options;

    let pipeline = sharp(input);

    // Get metadata
    const metadata = await pipeline.metadata();

    // Resize if needed
    if (metadata.width && metadata.width > maxWidth) {
      pipeline = pipeline.resize(maxWidth, maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Add watermark if requested
    if (watermark) {
      // Create SVG watermark
      const svgWatermark = createSVGWatermark(watermark.text);
      pipeline = pipeline.composite([
        {
          input: Buffer.from(svgWatermark),
          gravity: watermark.position === "center" ? "center" : "southeast",
        },
      ]);
    }

    // Apply compression based on format
    if (metadata.format === "jpeg" || metadata.format === "jpg") {
      pipeline = pipeline.jpeg({ quality });
    } else if (metadata.format === "png") {
      pipeline = pipeline.png({ quality });
    } else if (metadata.format === "webp") {
      pipeline = pipeline.webp({ quality });
    } else {
      // Convert to JPEG for other formats
      pipeline = pipeline.jpeg({ quality });
    }

    return await pipeline.toBuffer();
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Failed to process image");
  }
}

/**
 * Create low-res preview of image
 */
export async function createImagePreview(
  input: Buffer | string,
  watermarkText?: string
): Promise<Buffer> {
  return processImage(input, {
    maxWidth: 800,
    maxHeight: 800,
    quality: 70,
    watermark: watermarkText
      ? { text: watermarkText, position: "center" }
      : undefined,
  });
}

/**
 * Get image metadata
 */
export async function getImageMetadata(input: Buffer | string) {
  try {
    const metadata = await sharp(input).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
      hasAlpha: metadata.hasAlpha,
    };
  } catch (error) {
    console.error("Error getting image metadata:", error);
    return null;
  }
}

/**
 * Create SVG watermark text
 */
function createSVGWatermark(text: string): string {
  return `
    <svg width="600" height="100">
      <style>
        .watermark {
          fill: rgba(255, 255, 255, 0.5);
          font-size: 48px;
          font-weight: bold;
          font-family: Arial, sans-serif;
        }
      </style>
      <text x="50%" y="50%" text-anchor="middle" class="watermark">${text}</text>
    </svg>
  `;
}

/**
 * Validate image file
 */
export function validateImage(buffer: Buffer): boolean {
  try {
    const formats = ["jpeg", "jpg", "png", "webp", "gif", "svg"];
    // Check if sharp can process it
    sharp(buffer).metadata().then((meta) => {
      return meta.format && formats.includes(meta.format);
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Convert image to specific format
 */
export async function convertImageFormat(
  input: Buffer,
  format: "jpeg" | "png" | "webp",
  quality: number = 90
): Promise<Buffer> {
  try {
    let pipeline = sharp(input);

    switch (format) {
      case "jpeg":
        pipeline = pipeline.jpeg({ quality });
        break;
      case "png":
        pipeline = pipeline.png({ quality });
        break;
      case "webp":
        pipeline = pipeline.webp({ quality });
        break;
    }

    return await pipeline.toBuffer();
  } catch (error) {
    console.error("Error converting image format:", error);
    throw new Error("Failed to convert image format");
  }
}
