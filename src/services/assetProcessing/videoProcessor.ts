import ffmpeg from "fluent-ffmpeg";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

/**
 * Video processing service using FFmpeg
 * Handles compression, resizing, and preview generation
 */

export interface VideoProcessOptions {
  maxWidth?: number;
  maxHeight?: number;
  bitrate?: string;
  fps?: number;
  duration?: number; // Max duration in seconds
}

/**
 * Process video: compress and resize
 * Default: 720p, 1mbps bitrate
 */
export async function processVideo(
  inputPath: string,
  options: VideoProcessOptions = {}
): Promise<Buffer> {
  const {
    maxWidth = 1280,
    maxHeight = 720,
    bitrate = "1000k",
    fps = 30,
  } = options;

  const tempDir = os.tmpdir();
  const outputPath = path.join(tempDir, `processed-${Date.now()}.mp4`);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .size(`${maxWidth}x${maxHeight}`)
      .videoBitrate(bitrate)
      .fps(fps)
      .videoCodec("libx264")
      .audioCodec("aac")
      .audioBitrate("128k")
      .format("mp4")
      .on("end", async () => {
        try {
          const buffer = await fs.readFile(outputPath);
          await fs.unlink(outputPath).catch(() => {}); // Cleanup
          resolve(buffer);
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (error) => {
        reject(new Error(`FFmpeg error: ${error.message}`));
      })
      .save(outputPath);
  });
}

/**
 * Create low-res preview of video
 */
export async function createVideoPreview(
  inputPath: string,
  watermarkText?: string
): Promise<Buffer> {
  const tempDir = os.tmpdir();
  const outputPath = path.join(tempDir, `preview-${Date.now()}.mp4`);

  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath)
      .size("854x480") // 480p
      .videoBitrate("500k")
      .fps(24)
      .videoCodec("libx264")
      .audioCodec("aac")
      .audioBitrate("64k")
      .format("mp4");

    // Add watermark if provided
    if (watermarkText) {
      command = command.videoFilters([
        {
          filter: "drawtext",
          options: {
            text: watermarkText,
            fontsize: 24,
            fontcolor: "white@0.5",
            x: "(w-text_w)/2",
            y: "(h-text_h)/2",
          },
        },
      ]);
    }

    command
      .on("end", async () => {
        try {
          const buffer = await fs.readFile(outputPath);
          await fs.unlink(outputPath).catch(() => {});
          resolve(buffer);
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (error) => {
        reject(new Error(`FFmpeg preview error: ${error.message}`));
      })
      .save(outputPath);
  });
}

/**
 * Get video metadata
 */
export async function getVideoMetadata(inputPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (error, metadata) => {
      if (error) {
        reject(error);
        return;
      }

      const videoStream = metadata.streams.find((s) => s.codec_type === "video");
      const audioStream = metadata.streams.find((s) => s.codec_type === "audio");

      resolve({
        duration: metadata.format.duration,
        size: metadata.format.size,
        bitrate: metadata.format.bit_rate,
        video: videoStream
          ? {
              width: videoStream.width,
              height: videoStream.height,
              codec: videoStream.codec_name,
              fps: eval(videoStream.r_frame_rate || "0"), // e.g., "30/1"
            }
          : null,
        audio: audioStream
          ? {
              codec: audioStream.codec_name,
              bitrate: audioStream.bit_rate,
              sampleRate: audioStream.sample_rate,
            }
          : null,
      });
    });
  });
}

/**
 * Generate video thumbnail
 */
export async function generateVideoThumbnail(
  inputPath: string,
  timestampSeconds: number = 1
): Promise<Buffer> {
  const tempDir = os.tmpdir();
  const outputPath = path.join(tempDir, `thumb-${Date.now()}.jpg`);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .screenshots({
        timestamps: [timestampSeconds],
        filename: path.basename(outputPath),
        folder: tempDir,
        size: "1280x720",
      })
      .on("end", async () => {
        try {
          const buffer = await fs.readFile(outputPath);
          await fs.unlink(outputPath).catch(() => {});
          resolve(buffer);
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (error) => {
        reject(new Error(`Thumbnail generation error: ${error.message}`));
      });
  });
}

/**
 * Validate video file
 */
export async function validateVideo(inputPath: string): Promise<boolean> {
  try {
    await getVideoMetadata(inputPath);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Save buffer to temporary file
 */
export async function saveBufferToTempFile(
  buffer: Buffer,
  extension: string
): Promise<string> {
  const tempDir = os.tmpdir();
  const tempPath = path.join(tempDir, `upload-${Date.now()}.${extension}`);
  await fs.writeFile(tempPath, buffer);
  return tempPath;
}

/**
 * Clean up temporary file
 */
export async function cleanupTempFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Error cleaning up temp file:", error);
  }
}
