import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getCustomSettings, updateCustomSettings } from "@/lib/settings-store";

export async function GET() {
  try {
    await requireAdmin();
    const settings = getCustomSettings();
    return NextResponse.json({ ok: true, settings });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const updated = updateCustomSettings(body);
    return NextResponse.json({ ok: true, settings: updated });
  } catch {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }
}
