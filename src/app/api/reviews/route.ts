import { NextResponse } from "next/server";
import { getApprovedReviews, addReview } from "@/lib/reviews-store";

export async function GET() {
  // Public endpoint strictly returns APPROVED reviews only (Phase 4, Item 1)
  const reviews = getApprovedReviews();
  return NextResponse.json({ ok: true, reviews });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { author, location, role, rating, comment, equipmentUsed } = body;

    if (!author || typeof author !== "string" || author.trim().length < 2) {
      return NextResponse.json(
        { ok: false, message: "يرجى كتابة الاسم الكريم (حرفين على الأقل)" },
        { status: 400 }
      );
    }

    if (!comment || typeof comment !== "string" || comment.trim().length < 5) {
      return NextResponse.json(
        { ok: false, message: "يرجى كتابة تفاصيل رأيك وتجربتك (5 أحرف على الأقل)" },
        { status: 400 }
      );
    }

    const numericRating = Number(rating);
    // Reject invalid ratings instead of defaulting to 5 stars (Phase 6, Item 2)
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { ok: false, message: "يرجى تحديد تقييم صالح بين 1 إلى 5 نجوم" },
        { status: 400 }
      );
    }

    // Sanitize basic tags to prevent XSS
    const cleanAuthor = author.replace(/<[^>]*>?/gm, "").trim().slice(0, 80);
    const cleanLocation = (location || "محافظة الشرقية").replace(/<[^>]*>?/gm, "").trim().slice(0, 80);
    const cleanRole = (role || "مزارع / عميل كريم").replace(/<[^>]*>?/gm, "").trim().slice(0, 80);
    const cleanComment = comment.replace(/<[^>]*>?/gm, "").trim().slice(0, 800);
    const cleanEquipment = equipmentUsed ? equipmentUsed.replace(/<[^>]*>?/gm, "").trim().slice(0, 100) : undefined;

    const review = addReview({
      author: cleanAuthor,
      location: cleanLocation,
      role: cleanRole,
      rating: numericRating,
      comment: cleanComment,
      equipmentUsed: cleanEquipment,
    });

    return NextResponse.json({
      ok: true,
      review,
      message: "شكراً لتقييمكم! تم إرسال مراجعتكم بنجاح وهي قيد المراجعة والاعتماد من إدارة المحل قبل النشر.",
    });
  } catch {
    return NextResponse.json({ ok: false, message: "حدث خطأ أثناء حفظ التقييم" }, { status: 500 });
  }
}
