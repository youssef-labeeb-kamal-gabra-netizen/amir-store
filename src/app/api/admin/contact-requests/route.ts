import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getContactRequests,
  updateContactRequestStatus,
  deleteContactRequest,
  ContactRequestStatus,
} from "@/lib/contact-requests";

export async function GET() {
  try {
    await requireAdmin();
    const requests = getContactRequests();
    return NextResponse.json({ ok: true, requests });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ ok: false, message: "بيانات غير مكتملة" }, { status: 400 });
    }

    const validStatuses: ContactRequestStatus[] = ["NEW", "CONTACTED", "IN_PROGRESS", "RESOLVED", "ARCHIVED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ ok: false, message: "حالة الطلب غير صالحة" }, { status: 400 });
    }

    const updated = updateContactRequestStatus(id, status, notes);
    if (!updated) {
      return NextResponse.json({ ok: false, message: "طلب الاستفسار غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, request: updated });
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
      return NextResponse.json({ ok: false, message: "معرف الطلب مطلوب" }, { status: 400 });
    }

    const deleted = deleteContactRequest(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, message: "الطلب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "تم حذف الطلب بنجاح" });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}
