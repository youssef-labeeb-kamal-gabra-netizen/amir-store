import React from "react";
import fs from "fs";
import path from "path";
import { MediaManager, MediaItem } from "@/components/admin/media-manager";
import { constructMetadata } from "@/lib/seo";
import { isCloudinaryConfigured, listCloudinaryMedia } from "@/lib/media-storage";

export const metadata = constructMetadata({
  title: "مكتبة الوسائط وصور المنتجات | أمير ستور",
  noIndex: true,
});

export default async function AdminMediaPage() {
  const mediaList: MediaItem[] = [];

  // 1. Cloudinary media (if configured)
  if (isCloudinaryConfigured()) {
    try {
      const cloudMedia = await listCloudinaryMedia(50);
      mediaList.push(...cloudMedia);
    } catch (e) {
      console.warn("Failed to list Cloudinary media:", e);
    }
  }

  // 2. Scan real custom uploaded files from public/uploads
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (fs.existsSync(uploadsDir)) {
    try {
      const uploadFiles = fs.readdirSync(uploadsDir);
      for (const file of uploadFiles) {
        const ext = path.extname(file).toLowerCase();
        if ([".jpg", ".jpeg", ".png", ".webp", ".svg"].includes(ext)) {
          const fullPath = path.join(uploadsDir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isFile()) {
            mediaList.push({
              id: `upload-${file}`,
              name: file,
              url: `/uploads/${file}`,
              alt: file.replace(/[-_]/g, " ").replace(/\.[^/.]+$/, ""),
              size: `${Math.round(stat.size / 1024)} KB`,
              date: stat.mtime.toISOString().split("T")[0],
              isCustomUpload: true,
              provider: "local",
            });
          }
        }
      }
    } catch {
      // Ignore if uploads directory is missing or unreadable
    }
  }

  // 3. Scan official products catalogue HD images
  const productsDir = path.join(process.cwd(), "public", "images", "products");
  if (fs.existsSync(productsDir)) {
    try {
      const productFiles = fs.readdirSync(productsDir);
      for (const file of productFiles) {
        if (file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".webp") || file.endsWith(".svg")) {
          const fullPath = path.join(productsDir, file);
          const stat = fs.statSync(fullPath);
          mediaList.push({
            id: `prod-img-${file}`,
            name: file,
            url: `/images/products/${file}`,
            alt: file.replace(/[-_]/g, " ").replace(/\.[^/.]+$/, ""),
            size: `${Math.round(stat.size / 1024)} KB`,
            date: stat.mtime.toISOString().split("T")[0],
            isCustomUpload: false,
            provider: "local",
          });
        }
      }
    } catch {
      // Ignore if products directory is missing
    }
  }

  return <MediaManager initialMedia={mediaList} />;
}
