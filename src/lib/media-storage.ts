import path from "path";
import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary Media Storage Helper & Fallback Engine
 * Amir Store - Luxury Fragrance Platform
 *
 * Free Tier Specs:
 * - 25 GB monthly storage & bandwidth
 * - Automatic image optimization & webp conversion
 * - Fast global CDN delivery
 */

export interface ParsedCloudinaryCredentials {
  apiKey: string;
  apiSecret: string;
  cloudName: string;
}

/**
 * Parses a Cloudinary connection URL (cloudinary://API_KEY:API_SECRET@CLOUD_NAME)
 * into its discrete authentication credentials.
 */
export function parseCloudinaryUrl(rawUrl: string): ParsedCloudinaryCredentials | null {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const trimmed = rawUrl.trim();
  const match = trimmed.match(/^cloudinary:\/\/([^:]+):([^@]+)@([^/?#]+)/);
  if (!match) return null;
  return {
    apiKey: match[1],
    apiSecret: match[2],
    cloudName: match[3],
  };
}

export function isCloudinaryConfigured(): boolean {
  const url = process.env.CLOUDINARY_URL?.trim();
  if (url && url.length > 0) {
    return Boolean(parseCloudinaryUrl(url));
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  return Boolean(cloudName && apiKey && apiSecret);
}

export function resetCloudinaryCache(): void {
  // Maintained for backward compatibility with existing tests
}

export function configureCloudinary(): void {
  const url = process.env.CLOUDINARY_URL?.trim();
  if (url && url.length > 0) {
    const parsed = parseCloudinaryUrl(url);
    if (parsed) {
      cloudinary.config({
        cloud_name: parsed.cloudName,
        api_key: parsed.apiKey,
        api_secret: parsed.apiSecret,
        secure: true,
      });
      return;
    }
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }
}

export function getMediaStorageInfo() {
  const isCloud = isCloudinaryConfigured();
  return {
    provider: isCloud ? "Cloudinary Cloud Media (Free Tier - 25GB)" : "Local Storage (public/uploads)",
    isConfigured: isCloud,
    mode: isCloud ? "Global Cloud CDN" : "Server Disk Storage",
    freeTierQuota: "25 GB Free Monthly Storage & Transformations",
  };
}

/**
 * Validates real binary magic bytes for JPEG, PNG, and WebP,
 * and derives the authoritative file extension directly from byte inspection.
 */
export function getImageExtensionFromMagicBytes(buffer: Buffer): ".jpg" | ".png" | ".webp" | null {
  if (!buffer || buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return ".jpg";
  }

  // PNG: 89 50 4E 47 (0x89 'P' 'N' 'G')
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return ".png";
  }

  // WebP: 'RIFF' .... 'WEBP'
  const riff = buffer.toString("ascii", 0, 4);
  const webp = buffer.toString("ascii", 8, 12);
  if (riff === "RIFF" && webp === "WEBP") {
    return ".webp";
  }

  return null;
}

export interface CloudinaryMediaItem {
  id: string;
  name: string;
  url: string;
  alt: string;
  size: string;
  date: string;
  isCustomUpload: boolean;
  publicId: string;
  provider: "cloudinary";
}

/**
 * Uploads an image buffer directly to Cloudinary with automatic
 * optimization, high-quality compression, and responsive dimensions.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    filename?: string;
    folder?: string;
    altText?: string;
  } = {}
): Promise<CloudinaryMediaItem> {
  if (!isCloudinaryConfigured()) {
    throw new Error("خدمة Cloudinary غير مهيأة في متغيرات البيئة.");
  }

  configureCloudinary();

  return new Promise((resolve, reject) => {
    const folder = options.folder || "ameer-store/products";
    const rawBase = options.filename
      ? path.basename(options.filename, path.extname(options.filename))
      : "";
    const cleanBase = rawBase.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/^_+|_+$/g, "").slice(0, 50);
    const cleanBaseName = cleanBase.length > 0 ? cleanBase : "perfume";
    const publicId = `${Date.now()}-${cleanBaseName}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
        overwrite: false,
        transformation: [
          { quality: "auto:best", fetch_format: "auto" }
        ],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("فشل رفع الصورة إلى خدمة Cloudinary"));
        }

        resolve({
          id: `cld-${result.public_id}`,
          name: options.filename || `${path.basename(result.public_id)}.${result.format || "jpg"}`,
          url: result.secure_url,
          alt: options.altText || "صورة عطر فاخر",
          size: `${Math.round((result.bytes || 0) / 1024)} KB`,
          date: new Date().toISOString().split("T")[0],
          isCustomUpload: true,
          publicId: result.public_id,
          provider: "cloudinary",
        });
      }
    );

    stream.end(buffer);
  });
}

/**
 * Permanently deletes an asset from Cloudinary by its publicId and invalidates CDN cache.
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured()) return false;
  configureCloudinary();

  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });
    return res.result === "ok" || res.result === "not found";
  } catch (err) {
    console.error("[Media Storage] Cloudinary deletion error:", err);
    return false;
  }
}

/**
 * Lists recently uploaded images from Cloudinary under the store folder.
 */
export async function listCloudinaryMedia(maxResults = 50): Promise<CloudinaryMediaItem[]> {
  if (!isCloudinaryConfigured()) return [];
  configureCloudinary();

  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "ameer-store/",
      max_results: maxResults,
    });

    if (!result.resources || !Array.isArray(result.resources)) return [];

    return result.resources.map(
      (res: { public_id: string; secure_url: string; bytes: number; created_at: string; format: string }) => ({
        id: `cld-${res.public_id}`,
        name: `${path.basename(res.public_id)}.${res.format || "jpg"}`,
        url: res.secure_url,
        alt: path.basename(res.public_id).replace(/[-_]/g, " "),
        size: `${Math.round((res.bytes || 0) / 1024)} KB`,
        date: (res.created_at || "").split("T")[0] || new Date().toISOString().split("T")[0],
        isCustomUpload: true,
        publicId: res.public_id,
        provider: "cloudinary" as const,
      })
    );
  } catch (err) {
    console.warn("[Media Storage] Warning: Could not list Cloudinary media:", err);
    return [];
  }
}
