import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { requireAdmin } from "@/lib/auth";
import { ApplicationError } from "@/lib/error";
import {
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteFromCloudinary,
  listCloudinaryMedia,
  getImageExtensionFromMagicBytes,
  getMediaStorageInfo,
} from "@/lib/media-storage";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

function ensureUploadsDir(): boolean {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    return true;
  } catch (err) {
    console.warn("Uploads directory is not writable (e.g. read-only serverless environment):", err);
    return false;
  }
}

export async function GET() {
  try {
    await requireAdmin();

    const mediaList = [];

    // 1. Fetch images from Cloudinary if configured
    if (isCloudinaryConfigured()) {
      try {
        const cloudMedia = await listCloudinaryMedia(50);
        mediaList.push(...cloudMedia);
      } catch (err) {
        console.warn("[Media API] Cloudinary list failed, falling back to local files:", err);
      }
    }

    // 2. Scan real uploaded files from local storage
    try {
      if (fs.existsSync(UPLOADS_DIR)) {
        const uploadFiles = fs.readdirSync(UPLOADS_DIR);
        for (const file of uploadFiles) {
          const ext = path.extname(file).toLowerCase();
          if ([".jpg", ".jpeg", ".png", ".webp", ".svg"].includes(ext)) {
            const fullPath = path.join(UPLOADS_DIR, file);
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
      }
    } catch {
      // Continue if uploads dir cannot be read in some serverless environments
    }

    // 3. Scan official products catalogue HD images
    const productsDir = path.join(process.cwd(), "public", "images", "products");
    try {
      if (fs.existsSync(productsDir)) {
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
      }
    } catch {
      // Continue if productsDir is inaccessible
    }

    return NextResponse.json({
      ok: true,
      media: mediaList,
      storageInfo: getMediaStorageInfo(),
    });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "صورة عطر فاخر";

    if (!file) {
      return NextResponse.json({ ok: false, message: "يرجى اختيار ملف صورة صالح" }, { status: 400 });
    }

    // MIME type validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { ok: false, message: "نوع الملف غير مدعوم. الأنواع المسموحة: JPG, PNG, WEBP" },
        { status: 400 }
      );
    }

    // Size limit (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, message: "حجم الصورة يتجاوز الحد الأقصى المسموح (5 ميجابايت)" },
        { status: 400 }
      );
    }

    // Inspect file content buffer & binary magic bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeExt = getImageExtensionFromMagicBytes(buffer);
    if (!safeExt) {
      return NextResponse.json(
        { ok: false, message: "محتوى الملف غير صالح أو لا يطابق ترويسة صور JPG أو PNG أو WEBP الحقيقية." },
        { status: 400 }
      );
    }

    // Primary Cloud Storage Strategy: Cloudinary (Free Tier)
    if (isCloudinaryConfigured()) {
      try {
        const cloudMedia = await uploadToCloudinary(buffer, {
          filename: file.name,
          altText,
        });

        return NextResponse.json(
          {
            ok: true,
            media: cloudMedia,
            provider: "cloudinary",
            message: "تم رفع الصورة بنجاح إلى التخزين السحابي Cloudinary",
          },
          { status: 201 }
        );
      } catch (cloudErr) {
        console.warn("[Media API] Cloudinary upload failed, attempting local fallback:", cloudErr);
        // Fall through to local storage if Cloudinary fails
      }
    }

    // Fallback: Local Storage
    if (!ensureUploadsDir()) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "بيئة الاستضافة الحالية تعمل بنظام ملفات للقراءة فقط (Read-only Serverless). يرجى ربط خدمة تخزين سحابية مجانية (مثل Cloudinary عبر CLOUDINARY_URL) لحفظ الصور المرفوعة.",
        },
        { status: 500 }
      );
    }

    // Derive destination file extension STRICTLY from validated magic bytes, never client filename
    const clientExt = path.extname(file.name);
    const rawBaseName = path.basename(file.name, clientExt);
    const safeBaseName = rawBaseName.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 50) || "upload";
    const uniqueName = `${Date.now()}-${safeBaseName}${safeExt}`;
    const destinationPath = path.join(UPLOADS_DIR, uniqueName);

    try {
      fs.writeFileSync(destinationPath, buffer);
    } catch (writeErr: unknown) {
      const code = (writeErr as { code?: string })?.code;
      if (code === "EROFS" || code === "EACCES") {
        return NextResponse.json(
          {
            ok: false,
            message:
              "تعذر حفظ الصورة: مسار الملفات في هذه الاستضافة مخصص للقراءة فقط (Serverless Read-Only). يرجى استخدام خدمة Cloudinary للتخزين السحابي.",
          },
          { status: 500 }
        );
      }
      throw writeErr;
    }

    const mediaItem = {
      id: `upload-${uniqueName}`,
      name: uniqueName,
      url: `/uploads/${uniqueName}`,
      alt: altText,
      size: `${Math.round(file.size / 1024)} KB`,
      date: new Date().toISOString().split("T")[0],
      isCustomUpload: true,
      provider: "local",
    };

    return NextResponse.json(
      {
        ok: true,
        media: mediaItem,
        provider: "local",
        message: "تم حفظ الصورة بنجاح في مجلد التخزين المحلي",
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    if (err instanceof ApplicationError && (err.status === 401 || err.status === 403)) {
      return NextResponse.json({ ok: false, message: err.message || "غير مصرح" }, { status: 403 });
    }
    const errMsg = err instanceof Error ? err.message : "";
    if (errMsg.includes("صلاحية") || errMsg.includes("تسجيل الدخول") || errMsg.includes("مصرح")) {
      return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
    }
    console.error("Media upload error:", err);
    return NextResponse.json({ ok: false, message: "تعذر رفع وحفظ الصورة على الخادم" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("name");
    const publicId = searchParams.get("publicId");

    if (!fileName && !publicId) {
      return NextResponse.json({ ok: false, message: "اسم الملف أو معرف الوسائط مطلوب للحذف" }, { status: 400 });
    }

    // 1. Cloudinary asset deletion
    const targetPublicId = publicId || (fileName && fileName.startsWith("ameer-store/") ? fileName.replace(/\.[^/.]+$/, "") : null);
    if (targetPublicId && isCloudinaryConfigured()) {
      const deleted = await deleteFromCloudinary(targetPublicId);
      if (deleted) {
        return NextResponse.json({ ok: true, message: "تم حذف الصورة نهائياً من التخزين السحابي Cloudinary" });
      }
      return NextResponse.json({ ok: false, message: "تعذر حذف الصورة من التخزين السحابي Cloudinary" }, { status: 500 });
    }

    // 2. Local asset deletion
    if (fileName) {
      const safeBaseName = path.basename(fileName);
      const targetPath = path.join(UPLOADS_DIR, safeBaseName);

      if (fs.existsSync(targetPath)) {
        try {
          fs.unlinkSync(targetPath);
          return NextResponse.json({ ok: true, message: "تم حذف الصورة نهائياً من السيرفر" });
        } catch (unlinkErr: unknown) {
          const code = (unlinkErr as { code?: string })?.code;
          if (code === "EROFS" || code === "EACCES") {
            return NextResponse.json(
              { ok: false, message: "تعذر حذف الملف: نظام الملفات للقراءة فقط." },
              { status: 500 }
            );
          }
          throw unlinkErr;
        }
      }
    }

    return NextResponse.json({ ok: false, message: "الملف غير موجود في مجلد الرفع أو السحابة" }, { status: 404 });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح أو تعذر حذف الملف" }, { status: 403 });
  }
}
