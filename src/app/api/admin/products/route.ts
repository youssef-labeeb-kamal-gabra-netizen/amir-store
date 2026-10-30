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
    const products = getProductsStore();
    return NextResponse.json({ ok: true, products });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح لك بالوصول" }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { name, categoryId, categoryName, model, brand, shortDescription, description, specifications, featured } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ ok: false, message: "اسم المعدة مطلوب (حرفين على الأقل)" }, { status: 400 });
    }

    if (!categoryId || !categoryName) {
      return NextResponse.json({ ok: false, message: "يرجى تحديد القسم الزراعي التابع له" }, { status: 400 });
    }

    const slug = slugify(name) + "-" + Date.now().toString().slice(-4);

    const product = addProduct({
      name: name.trim(),
      slug,
      categoryId,
      categoryName,
      model: model ? String(model).trim() : undefined,
      brand: brand ? String(brand).trim() : "LKL Equipment",
      shortDescription: shortDescription ? String(shortDescription).trim() : name.trim(),
      description: description ? String(description).trim() : name.trim(),
      images: ["/images/products/spray-motor-1.jpg"],
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
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ ok: false, message: "معرف المنتج مطلوب للتحديث" }, { status: 400 });
    }

    const updated = updateProduct(id, updates);
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

    const success = deleteProduct(id);
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

    const updated = toggleProductPublished(id);
    if (!updated) {
      return NextResponse.json({ ok: false, message: "المنتج غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, product: updated });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}
