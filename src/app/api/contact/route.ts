import { NextResponse } from "next/server";
import { addContactRequest } from "@/lib/contact-requests";
import { getSession } from "@/lib/auth";

// Egyptian phone: Mobile (010, 011, 012, 015 - 11 digits) or Landline (e.g. 055, 02 - 9-10 digits), with or without +20
const EGYPTIAN_PHONE_REGEX = /^(?:(?:\+?200?|0)?(?:1[0125]\d{8}|[2-9]\d{7,8}))$/;
// International phone: E.164 standard (+ followed by 8 to 15 digits)
const INTL_PHONE_REGEX = /^\+[1-9]\d{7,14}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

// In-memory rate limiting map: ip -> timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (checkRateLimit(ip)) {
      return NextResponse.json(
        {
          ok: false,
          message: "تم إرسال عدد كبير من الطلبات مؤخراً. يرجى الانتظار بضع دقائق قبل المحاولة مجدداً أو الاتصال بنا مباشرة.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, phone, email, product, message } = body;

    // 1. Name validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { ok: false, message: "يرجى كتابة الاسم بشكل صحيح (حرفين على الأقل)." },
        { status: 400 }
      );
    }

    // 2. Phone validation (Egyptian mobile or valid international)
    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { ok: false, message: "يرجى إدخال رقم الهاتف للتواصل." },
        { status: 400 }
      );
    }
    const cleanPhone = phone.replace(/[\s\-()]/g, "");
    if (!EGYPTIAN_PHONE_REGEX.test(cleanPhone) && !INTL_PHONE_REGEX.test(cleanPhone)) {
      return NextResponse.json(
        {
          ok: false,
          message: "يرجى إدخال رقم هاتف صحيح (مثال: 010xxxxxxxx أو 012xxxxxxxx أو رقم دولي مع كود الدولة).",
        },
        { status: 400 }
      );
    }

    // 3. Email validation (if provided)
    if (email && typeof email === "string" && email.trim() !== "") {
      const cleanEmail = email.trim();
      if (!EMAIL_REGEX.test(cleanEmail)) {
        return NextResponse.json(
          { ok: false, message: "البريد الإلكتروني المدخل غير صالح، يرجى كتابته بالشكل الصحيح أو تركه فارغاً." },
          { status: 400 }
        );
      }
    }

    // 4. Message details validation
    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { ok: false, message: "يرجى كتابة تفاصيل استفساركم بوضوح (5 أحرف على الأقل)." },
        { status: 400 }
      );
    }

    // Sanitize basic tags to prevent XSS
    const sanitizedName = name.replace(/<[^>]*>?/gm, "").trim().slice(0, 100);
    const sanitizedPhone = cleanPhone.slice(0, 30);
    const sanitizedEmail = email ? String(email).replace(/<[^>]*>?/gm, "").trim().slice(0, 100) : undefined;
    const sanitizedProduct = product ? String(product).replace(/<[^>]*>?/gm, "").trim().slice(0, 100) : undefined;
    const sanitizedMessage = message.replace(/<[^>]*>?/gm, "").trim().slice(0, 1000);

    // Authenticated customer context (Customer Data Isolation)
    const session = await getSession();

    // Persist request to storage
    const saved = addContactRequest({
      userId: session?.id,
      userEmail: session?.email,
      name: sanitizedName,
      phone: sanitizedPhone,
      email: sanitizedEmail || session?.email,
      product: sanitizedProduct,
      message: sanitizedMessage,
    });

    return NextResponse.json(
      {
        ok: true,
        message: "تم استلام استفساركم وتسجيله بنجاح.",
        requestId: saved.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error processing contact request:", err);
    return NextResponse.json(
      {
        ok: false,
        message: "تعذر حفظ الاستفسار حالياً بسبب خطأ في الخادم. يرجى التواصل معنا مباشرة عبر الهاتف أو واتساب.",
      },
      { status: 500 }
    );
  }
}
