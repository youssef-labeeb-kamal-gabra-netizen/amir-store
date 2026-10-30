import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { requireAdmin } from "@/lib/auth";

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

/**
 * Validates real binary magic bytes for JPEG, PNG, and WebP
 */
function validateImageMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // PNG: 89 50 4E 47 (0x89 'P' 'N' 'G')
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return true;
  }

  // WebP: 'RIFF' .... 'WEBP'
  const riff = buffer.toString("ascii", 0, 4);
  const webp = buffer.toString("ascii", 8, 12);
  if (riff === "RIFF" && webp === "WEBP") {
    return true;
  }

  return false;
}

export async function GET() {
  try {
    await requireAdmin();

    const mediaList = [];

    // 1. Scan real uploaded files
    try {
      if (fs.existsSync(UPLOADS_DIR)) {
        const uploadFiles = fs.readdirSync(UPLOADS_DIR);
        for (const file of uploadFiles) {
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
            });
          }
        }
      }
    } catch {
      // Continue if uploads dir cannot be read in some serverless environments
    }

    // 2. Scan official products catalogue HD images
    const productsDir = path.join(process.cwd(), "public", "images", "products");
    try {
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
    } catch {
      // Continue if productsDir is inaccessible
    }

    return NextResponse.json({ ok: true, media: mediaList });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "صورة معدة زراعية";

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

    if (!validateImageMagicBytes(buffer)) {
      return NextResponse.json(
        { ok: false, message: "محتوى الملف غير صالح أو لا يطابق ترويسة صور JPG أو PNG أو WEBP الحقيقية." },
        { status: 400 }
      );
    }

    if (!ensureUploadsDir()) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "بيئة الاستضافة الحالية تعمل بنظام ملفات للقراءة فقط (Read-only Serverless). يرجى ربط خدمة تخزين سحابية خارجية (مثل S3 أو Cloudflare R2) لحفظ الصور المرفوعة.",
        },
        { status: 500 }
      );
    }

    // Sanitize and generate unique safe filename
    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueName = `${Date.now()}-${baseName}${ext}`;
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
              "تعذر حفظ الصورة: مسار الملفات في هذه الاستضافة مخصص للقراءة فقط (Serverless Read-Only). يرجى استخدام خدمة تخزين سحابية خارجية للصور الجديدة.",
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
    };

    return NextResponse.json({ ok: true, media: mediaItem }, { status: 201 });
  } catch (err) {
    console.error("Media upload error:", err);
    return NextResponse.json({ ok: false, message: "تعذر رفع وحفظ الصورة على الخادم" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("name");

    if (!fileName) {
      return NextResponse.json({ ok: false, message: "اسم الملف مطلوب للحذف" }, { status: 400 });
    }

    // Security check: prevent path traversal attacks
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

    return NextResponse.json({ ok: false, message: "الملف غير موجود في مجلد الرفع" }, { status: 404 });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح أو تعذر حذف الملف" }, { status: 403 });
  }
}
