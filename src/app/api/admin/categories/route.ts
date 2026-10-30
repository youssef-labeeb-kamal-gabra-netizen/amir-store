import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getCategoriesStore,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categories-store";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    await requireAdmin();
    const categories = getCategoriesStore();
    return NextResponse.json({ ok: true, categories });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ ok: false, message: "اسم القسم مطلوب" }, { status: 400 });
    }

    const slug = slugify(name) + "-" + Date.now().toString().slice(-4);
    const category = addCategory({
      name: name.trim(),
      slug,
      description: description ? String(description).trim() : "",
      iconName: "Layers",
    });

    return NextResponse.json({ ok: true, category }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, name, description } = body;

    if (!id || !name) {
      return NextResponse.json({ ok: false, message: "بيانات غير مكتملة" }, { status: 400 });
    }

    const updated = updateCategory(id, {
      name: name.trim(),
      description: description ? String(description).trim() : "",
    });

    if (!updated) {
      return NextResponse.json({ ok: false, message: "القسم غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, category: updated });
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
      return NextResponse.json({ ok: false, message: "معرف القسم مطلوب" }, { status: 400 });
    }

    const success = deleteCategory(id);
    if (!success) {
      return NextResponse.json({ ok: false, message: "تعذر الحذف" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "تم حذف القسم بنجاح" });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}
