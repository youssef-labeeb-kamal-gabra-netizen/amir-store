import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getReviewsStore,
  moderateReview,
  deleteReview,
  ReviewStatus,
} from "@/lib/reviews-store";

export async function GET() {
  try {
    await requireAdmin();
    const reviews = getReviewsStore();
    return NextResponse.json({ ok: true, reviews });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ ok: false, message: "بيانات غير مكتملة" }, { status: 400 });
    }

    const validStatuses: ReviewStatus[] = ["PENDING", "APPROVED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ ok: false, message: "حالة التقييم غير صالحة" }, { status: 400 });
    }

    const updated = moderateReview(id, status);
    if (!updated) {
      return NextResponse.json({ ok: false, message: "التقييم غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, review: updated });
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
      return NextResponse.json({ ok: false, message: "معرّف التقييم مفقود" }, { status: 400 });
    }

    const deleted = deleteReview(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, message: "التقييم غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "تم حذف التقييم بنجاح" });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}
