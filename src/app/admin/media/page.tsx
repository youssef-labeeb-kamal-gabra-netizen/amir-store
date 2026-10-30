import React from "react";
import fs from "fs";
import path from "path";
import { MediaManager, MediaItem } from "@/components/admin/media-manager";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "مكتبة وسائط وصور المعدات | شركة لبيب كمال",
  noIndex: true,
});

export default function AdminMediaPage() {
  const mediaList: MediaItem[] = [];

  // 1. Scan real custom uploaded files from public/uploads
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (fs.existsSync(uploadsDir)) {
    const uploadFiles = fs.readdirSync(uploadsDir);
    for (const file of uploadFiles) {
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
        });
      }
    }
  }

  // 2. Scan official products catalogue HD images
  const productsDir = path.join(process.cwd(), "public", "images", "products");
  if (fs.existsSync(productsDir)) {
    const productFiles = fs.readdirSync(productsDir);
    for (const file of productFiles) {
      if (file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".webp")) {
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
        });
      }
    }
  }

  return <MediaManager initialMedia={mediaList} />;
}
