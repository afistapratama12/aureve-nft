import ffmpeg from "fluent-ffmpeg";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

/**
 * Audio processing service using FFmpeg
 * Handles compression and low-quality preview generation
 */

export interface AudioProcessOptions {
  bitrate?: string;
  sampleRate?: number;
  channels?: number;
}

/**
 * Process audio: compress to lower bitrate
 */
export async function processAudio(
  inputPath: string,
  options: AudioProcessOptions = {}
): Promise<Buffer> {
  const { bitrate = "128k", sampleRate = 44100, channels = 2 } = options;

  const tempDir = os.tmpdir();
  const outputPath = path.join(tempDir, `processed-audio-${Date.now()}.mp3`);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec("libmp3lame")
      .audioBitrate(bitrate)
      .audioChannels(channels)
      .audioFrequency(sampleRate)
      .format("mp3")
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
        reject(new Error(`FFmpeg audio error: ${error.message}`));
      })
      .save(outputPath);
  });
}

/**
 * Create low-quality audio preview (64kbps)
 */
export async function createAudioPreview(inputPath: string): Promise<Buffer> {
  return processAudio(inputPath, {
    bitrate: "64k",
    sampleRate: 22050,
    channels: 1,
  });
}

/**
 * Get audio metadata
 */
export async function getAudioMetadata(inputPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (error, metadata) => {
      if (error) {
        reject(error);
        return;
      }

      const audioStream = metadata.streams.find((s) => s.codec_type === "audio");

      resolve({
        duration: metadata.format.duration,
        size: metadata.format.size,
        bitrate: metadata.format.bit_rate,
        codec: audioStream?.codec_name,
        sampleRate: audioStream?.sample_rate,
        channels: audioStream?.channels,
      });
    });
  });
}

export { saveBufferToTempFile, cleanupTempFile } from "./videoProcessor";
