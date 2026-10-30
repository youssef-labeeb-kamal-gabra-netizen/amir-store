import { NextResponse } from "next/server";
import { getOrders, createOrder, updateOrderStatus } from "@/lib/orders-store";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, governorate, address, notes, items, paymentMethod } = body;

    // Strict validation
    if (!customerName || typeof customerName !== "string" || customerName.trim().length < 2) {
      return NextResponse.json(
        { ok: false, message: "يرجى كتابة الاسم بالكامل بشكل صحيح." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || phone.trim().length < 8) {
      return NextResponse.json(
        { ok: false, message: "يرجى كتابة رقم هاتف صالح للتواصل والتسليم." },
        { status: 400 }
      );
    }

    if (!governorate || typeof governorate !== "string") {
      return NextResponse.json(
        { ok: false, message: "يرجى اختيار المحافظة." },
        { status: 400 }
      );
    }

    if (!address || typeof address !== "string" || address.trim().length < 5) {
      return NextResponse.json(
        { ok: false, message: "يرجى إدخال العنوان بالتفصيل لضمان سرعة التوصيل." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { ok: false, message: "سلة المشتريات فارغة! يرجى إضافة عطور للسلة أولاً." },
        { status: 400 }
      );
    }

    const order = createOrder({
      customerName,
      phone,
      governorate,
      address,
      notes,
      items,
      paymentMethod: paymentMethod || "COD",
    });

    return NextResponse.json({
      ok: true,
      message: "تم تسجيل طلبك بنجاح في متجر أمير ستور",
      order,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { ok: false, message: "حدث خطأ أثناء تسجيل الطلب. يرجى المحاولة لاحقاً." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await requireAdmin();
    const orders = getOrders();
    return NextResponse.json({ ok: true, orders });
  } catch {
    return NextResponse.json(
      { ok: false, message: "غير مصرح لك بالوصول" },
      { status: 403 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { ok: false, message: "معرف الطلب والحالة مطلوبان." },
        { status: 400 }
      );
    }

    const updated = updateOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { ok: false, message: "الطلب غير موجود." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, order: updated });
  } catch {
    return NextResponse.json(
      { ok: false, message: "غير مصرح لك بتعديل الطلبات" },
      { status: 403 }
    );
  }
}
