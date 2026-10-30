import { NextResponse } from "next/server";
import { getOrders, createOrder, updateOrderStatus, isValidOrderStatus } from "@/lib/orders-store";
import { requireAdmin } from "@/lib/auth";
import { getClientIp, checkEndpointRateLimit } from "@/lib/rate-limiter";

const EGYPT_GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "الشرقية",
  "القليوبية",
  "البحيرة",
  "الغربية",
  "المنوفية",
  "دمياط",
  "كفر الشيخ",
  "بورسعيد",
  "الإسماعيلية",
  "السويس",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "البحر الأحمر",
  "مطروح",
  "الوادي الجديد",
  "شمال سيناء",
  "جنوب سيناء",
] as const;

const EGYPTIAN_PHONE_REGEX = /^(010|011|012|015)[0-9]{8}$/;

function sanitizeText(str: unknown): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>?/gm, "")
    .trim();
}

function normalizeEgyptianPhone(raw: string): string {
  let clean = raw.replace(/[\s\-()]/g, "").trim();
  if (clean.startsWith("+20")) {
    clean = clean.slice(3);
  } else if (clean.startsWith("0020")) {
    clean = clean.slice(4);
  } else if (clean.startsWith("20") && clean.length === 12) {
    clean = clean.slice(2);
  }
  if (/^(10|11|12|15)[0-9]{8}$/.test(clean)) {
    clean = "0" + clean;
  }
  return clean;
}

export async function POST(request: Request) {
  try {
    // 1. Sliding-window IP Rate Limiting (max 5 orders per 10 minutes)
    const clientIp = getClientIp(request.headers);
    if (checkEndpointRateLimit(`order-${clientIp}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        {
          ok: false,
          message: "تم إرسال عدد كبير من الطلبات من هذا العنوان مؤخراً. يرجى الانتظار 10 دقائق قبل المحاولة مجدداً.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { items } = body;
    let { customerName, phone, governorate, address, notes, paymentMethod } = body;

    // Sanitize text inputs
    customerName = sanitizeText(customerName);
    phone = typeof phone === "string" ? normalizeEgyptianPhone(phone) : "";
    governorate = sanitizeText(governorate);
    address = sanitizeText(address);
    notes = sanitizeText(notes);
    paymentMethod = paymentMethod === "WHATSAPP" ? "WHATSAPP" : "COD";

    // Defaults for instant WhatsApp flow if empty
    if (paymentMethod === "WHATSAPP") {
      if (!customerName || customerName.length < 3) customerName = "عميل واتساب";
      if (!phone || !EGYPTIAN_PHONE_REGEX.test(phone)) phone = "01000000000";
      if (!governorate || !EGYPT_GOVERNORATES.includes(governorate as (typeof EGYPT_GOVERNORATES)[number])) {
        governorate = "القاهرة";
      }
      if (!address || address.length < 5) address = "طلب مباشر عبر محادثة واتساب";
    }

    // 2. Customer Name Validation (3 - 100 characters)
    if (!customerName || customerName.length < 3 || customerName.length > 100) {
      return NextResponse.json(
        { ok: false, message: "يرجى كتابة الاسم بالكامل بشكل صحيح (بين 3 و 100 حرف)." },
        { status: 400 }
      );
    }

    // 3. Egyptian Phone Regex Validation (/^(010|011|012|015)[0-9]{8}$/)
    if (!phone || !EGYPTIAN_PHONE_REGEX.test(phone)) {
      return NextResponse.json(
        {
          ok: false,
          message: "يرجى كتابة رقم هاتف مصري صالح (11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015).",
        },
        { status: 400 }
      );
    }

    // 4. Governorate Validation (must be one of 27 Egyptian governorates)
    if (!governorate || !EGYPT_GOVERNORATES.includes(governorate as (typeof EGYPT_GOVERNORATES)[number])) {
      return NextResponse.json(
        { ok: false, message: "يرجى اختيار محافظة صحيحة من قائمة محافظات مصر." },
        { status: 400 }
      );
    }

    // 5. Address Validation (5 - 250 characters)
    if (!address || address.length < 5 || address.length > 250) {
      return NextResponse.json(
        { ok: false, message: "يرجى إدخال العنوان بالتفصيل لضمان سرعة التوصيل (بين 5 و 250 حرف)." },
        { status: 400 }
      );
    }

    // 6. Notes length validation (max 500 characters)
    if (notes && notes.length > 500) {
      notes = notes.slice(0, 500);
    }

    // 7. Items Array Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { ok: false, message: "سلة المشتريات فارغة! يرجى إضافة عطور للسلة أولاً." },
        { status: 400 }
      );
    }

    if (items.length > 20) {
      return NextResponse.json(
        { ok: false, message: "لا يمكن إضافة أكثر من 20 منتج في الطلب الواحد." },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (!item || typeof item.id !== "string" || !item.id.trim()) {
        return NextResponse.json(
          { ok: false, message: "معرف المنتج غير صالح أو مفقود." },
          { status: 400 }
        );
      }
      if (typeof item.quantity !== "number" || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 50) {
        return NextResponse.json(
          { ok: false, message: "الكمية المطلوبة للمنتج يجب أن تكون عدداً صحيحاً بين 1 و 50 قطعة." },
          { status: 400 }
        );
      }
    }

    // 8. Authoritative Creation (Calculates prices and shipping strictly on the server)
    const order = await createOrder({
      customerName,
      phone,
      governorate,
      address,
      notes,
      items,
      paymentMethod,
    });

    return NextResponse.json({
      ok: true,
      message: "تم تسجيل طلبك بنجاح في متجر أمير ستور",
      order,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    const message = error instanceof Error ? error.message : "حدث خطأ أثناء تسجيل الطلب. يرجى المحاولة لاحقاً.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
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

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { ok: false, message: "معرف الطلب مطلوب." },
        { status: 400 }
      );
    }

    if (!status || typeof status !== "string" || !isValidOrderStatus(status)) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "حالة الطلب غير صالحة. الحالات المسموحة: NEW, PROCESSING, SHIPPED, DELIVERED, CANCELLED أو pending, confirmed, shipped, delivered, cancelled.",
        },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { ok: false, message: "الطلب غير موجود." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, order: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "غير مصرح لك بتعديل الطلبات";
    return NextResponse.json({ ok: false, message }, { status: 403 });
  }
}
