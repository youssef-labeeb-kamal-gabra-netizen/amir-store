import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getProductsStore,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleProductPublished,
} from "@/lib/products-store";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    await requireAdmin();
    const products = await getProductsStore();
    return NextResponse.json({ ok: true, products });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح لك بالوصول" }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { name, categoryId, categoryName, model, brand, price, compareAtPrice, shortDescription, description, specifications, featured } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ ok: false, message: "اسم المنتج مطلوب (حرفين على الأقل)" }, { status: 400 });
    }

    if (!categoryId || !categoryName) {
      return NextResponse.json({ ok: false, message: "يرجى تحديد القسم التابع له" }, { status: 400 });
    }

    const numPrice = Number(price);
    if (price === undefined || price === null || price === "" || isNaN(numPrice) || numPrice < 0) {
      return NextResponse.json({ ok: false, message: "سعر المنتج مطلوب ويجب أن يكون رقماً صحيحاً أو موجباً" }, { status: 400 });
    }

    const numCompareAtPrice =
      compareAtPrice !== undefined && compareAtPrice !== null && compareAtPrice !== ""
        ? Number(compareAtPrice)
        : undefined;

    if (numCompareAtPrice !== undefined && (isNaN(numCompareAtPrice) || numCompareAtPrice < 0)) {
      return NextResponse.json({ ok: false, message: "السعر قبل الخصم غير صالح" }, { status: 400 });
    }

    const slug = slugify(name) + "-" + Date.now().toString().slice(-4);

    const product = await addProduct({
      name: name.trim(),
      slug,
      categoryId,
      categoryName,
      price: numPrice,
      compareAtPrice: numCompareAtPrice,
      model: model ? String(model).trim() : undefined,
      brand: brand ? String(brand).trim() : "Amir Store",
      shortDescription: shortDescription ? String(shortDescription).trim() : name.trim(),
      description: description ? String(description).trim() : name.trim(),
      images: ["/images/products/ameer-oud-parfum.svg"],
      specifications: Array.isArray(specifications) ? specifications : [],
      featured: Boolean(featured),
      published: true,
    });

    return NextResponse.json({ ok: true, product }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح أو بيانات غير صالحة" }, { status: 403 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, price, compareAtPrice, ...updates } = body;

    if (!id) {
      return NextResponse.json({ ok: false, message: "معرف المنتج مطلوب للتحديث" }, { status: 400 });
    }

    const payloadUpdates: Record<string, unknown> = { ...updates };

    if (price !== undefined && price !== null && price !== "") {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice < 0) {
        return NextResponse.json({ ok: false, message: "سعر المنتج غير صالح" }, { status: 400 });
      }
      payloadUpdates.price = numPrice;
    }

    if (compareAtPrice !== undefined) {
      if (compareAtPrice === null || compareAtPrice === "") {
        payloadUpdates.compareAtPrice = undefined;
      } else {
        const numCompare = Number(compareAtPrice);
        if (isNaN(numCompare) || numCompare < 0) {
          return NextResponse.json({ ok: false, message: "السعر قبل الخصم غير صالح" }, { status: 400 });
        }
        payloadUpdates.compareAtPrice = numCompare;
      }
    }

    const updated = await updateProduct(id, payloadUpdates);
    if (!updated) {
      return NextResponse.json({ ok: false, message: "المنتج غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, product: updated });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, message: "معرف المنتج مطلوب للحذف" }, { status: 400 });
    }

    const success = await deleteProduct(id);
    if (!success) {
      return NextResponse.json({ ok: false, message: "المنتج غير موجود أو تم حذفه مسبقاً" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "تم حذف المنتج بنجاح" });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ ok: false, message: "معرف المنتج مطلوب" }, { status: 400 });
    }

    const updated = await toggleProductPublished(id);
    if (!updated) {
      return NextResponse.json({ ok: false, message: "المنتج غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, product: updated });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}
