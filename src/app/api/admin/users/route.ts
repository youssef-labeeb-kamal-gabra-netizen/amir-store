import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getUsersStore, updateUserRole } from "@/lib/users-store";

export async function GET() {
  try {
    await requireAdmin();
    const users = getUsersStore();
    return NextResponse.json({ ok: true, users });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const { id, role } = body;

    if (!id || (role !== "USER" && role !== "ADMIN")) {
      return NextResponse.json({ ok: false, message: "بيانات غير صالحة" }, { status: 400 });
    }

    // Protect primary admin from self-demotion
    if (admin.id === id && role !== "ADMIN") {
      return NextResponse.json({ ok: false, message: "لا يمكن إلغاء صلاحية المدير لنفسك" }, { status: 400 });
    }

    const updated = updateUserRole(id, role);
    if (!updated) {
      return NextResponse.json({ ok: false, message: "المستخدم غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, user: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "غير مصرح أو حدث خطأ";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
