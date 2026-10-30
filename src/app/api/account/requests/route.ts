import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getUserContactRequests,
  addContactRequest,
  deleteUserContactRequest,
} from "@/lib/contact-requests";

const EGYPTIAN_PHONE_REGEX = /^(?:(?:\+?200?|0)?(?:1[0125]\d{8}|[2-9]\d{7,8}))$/;
const INTL_PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

/**
 * Strict Server-Side Authorization for Customer Private Data
 * 
 * Rules:
 * 1. Must have a cryptographically verified HMAC-SHA256 session.
 * 2. Can ONLY access records where user_email === session.email or user_id === session.id.
 * 3. Never trusts query parameters for user identity.
 */

export async function GET() {
  const session = await getSession();

  if (!session || !session.email) {
    return NextResponse.json(
      { ok: false, message: "غير مصرح. يرجى تسجيل الدخول أولاً." },
      { status: 401 }
    );
  }

  const requests = getUserContactRequests(session.email, session.id);
  return NextResponse.json({
    ok: true,
    data: requests,
  });
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session || !session.email) {
    return NextResponse.json(
      { ok: false, message: "غير مصرح. يرجى تسجيل الدخول أولاً." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { phone, product, message } = body;

    // Validate phone
    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { ok: false, message: "يرجى إدخال رقم الهاتف للتواصل ومتابعة طلبك." },
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

    // Validate message
    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { ok: false, message: "يرجى كتابة تفاصيل استفسارك بوضوح (5 أحرف على الأقل)." },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedPhone = cleanPhone.slice(0, 30);
    const sanitizedProduct = product ? String(product).replace(/<[^>]*>?/gm, "").trim().slice(0, 100) : undefined;
    const sanitizedMessage = message.replace(/<[^>]*>?/gm, "").trim().slice(0, 1000);

    const newRequest = addContactRequest({
      userId: session.id,
      userEmail: session.email,
      name: session.name,
      phone: sanitizedPhone,
      email: session.email,
      product: sanitizedProduct,
      message: sanitizedMessage,
    });

    return NextResponse.json(
      {
        ok: true,
        message: "تم تسجيل استفسارك بنجاح في حسابك الخاص.",
        data: newRequest,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[AccountAPI] Error creating request:", err);
    return NextResponse.json(
      { ok: false, message: "تعذر تسجيل الطلب حالياً. يرجى المحاولة لاحقاً." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();

  if (!session || !session.email) {
    return NextResponse.json(
      { ok: false, message: "غير مصرح. يرجى تسجيل الدخول أولاً." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { ok: false, message: "معرف الطلب غير محدد." },
        { status: 400 }
      );
    }

    // Strict row-level ownership check enforced inside deleteUserContactRequest
    const deleted = deleteUserContactRequest(id, session.email, session.id);

    if (!deleted) {
      return NextResponse.json(
        { ok: false, message: "الطلب غير موجود أو ليس لديك صلاحية لحذفه." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "تم حذف الاستفسار من حسابك بنجاح.",
    });
  } catch (err) {
    console.error("[AccountAPI] Error deleting request:", err);
    return NextResponse.json(
      { ok: false, message: "تعذر حذف الاستفسار حالياً." },
      { status: 500 }
    );
  }
}
