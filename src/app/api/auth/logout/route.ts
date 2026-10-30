import { NextRequest, NextResponse } from "next/server";
import { destroySession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { env } from "@/lib/env";

function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || (request.url.startsWith("https") ? "https" : "http");
  return host ? `${proto}://${host}` : (env.appUrl || new URL(request.url).origin);
}

export async function POST(request: NextRequest) {
  await destroySession();
  const baseUrl = getBaseUrl(request);
  const response = NextResponse.redirect(`${baseUrl}/login?logged_out=1`, { status: 303 });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}

/**
 * Rejects GET requests to prevent logout CSRF via prefetching or embedded image tags (Phase 1, Item 4)
 */
export async function GET() {
  return new NextResponse(
    JSON.stringify({
      ok: false,
      error: "Method Not Allowed",
      message: "تسجيل الخروج يتطلب طلب POST حصراً لحماية الأمان ومنع هجمات Logout CSRF.",
    }),
    {
      status: 405,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Allow: "POST",
      },
    }
  );
}
