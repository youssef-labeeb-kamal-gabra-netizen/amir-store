import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  isMaliciousUserAgent,
  isMaliciousPath,
} from "@/lib/rate-limiter";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const userAgent = request.headers.get("user-agent");

  // 1. Immediately drop malicious scanners and automated attack tools
  if (isMaliciousUserAgent(userAgent)) {
    return new NextResponse(
      JSON.stringify({
        ok: false,
        error: "Forbidden",
        message: "تم حظر هذا الطلب لأسباب أمنية (Malicious scanner detected).",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );
  }

  // 1.5 Drop path traversal and exploit scanning attempts
  if (isMaliciousPath(pathname, search)) {
    return new NextResponse(
      JSON.stringify({
        ok: false,
        error: "Forbidden",
        message: "محاولة وصول غير مصرح بها ومشبوهة أمنياً.",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );
  }

  // 2. Skip rate-limiting for static build assets and public images
  if (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images/")
  ) {
    return NextResponse.next();
  }

  // 3. Extract IP and evaluate sliding-window Rate Limit (> 1000 requests guard)
  const ip = getClientIp(request.headers);
  const rateLimitResult = checkRateLimit(ip, pathname);

  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfterSeconds || 60;
    return new NextResponse(
      JSON.stringify({
        ok: false,
        error: "Too Many Requests",
        message:
          "تم تجاوز الحد الأقصى المسموح به للطلبات (أكثر من 1000 طلب لحماية الموقع من الهجمات). يرجى الانتظار والمحاولة لاحقاً.",
        retryAfterSeconds: retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": rateLimitResult.reset.toString(),
        },
      }
    );
  }

  // 4. Continue with strict Security Headers
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("X-RateLimit-Limit", rateLimitResult.limit.toString());
  response.headers.set(
    "X-RateLimit-Remaining",
    rateLimitResult.remaining.toString()
  );
  response.headers.set("X-RateLimit-Reset", rateLimitResult.reset.toString());

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
