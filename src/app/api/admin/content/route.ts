import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getContentStore, updateContentStore } from "@/lib/content-store";

export async function GET() {
  try {
    await requireAdmin();
    const content = getContentStore();
    return NextResponse.json({ ok: true, content });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const updated = updateContentStore(body);
    return NextResponse.json({ ok: true, content: updated });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}
