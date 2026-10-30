import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { createSession, SESSION_COOKIE_NAME, OAUTH_STATE_COOKIE, OAUTH_PKCE_COOKIE } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDesc = searchParams.get("error_description");

  // Dynamically resolve base URL from incoming request
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || (request.url.startsWith("https") ? "https" : "http");
  const rawBaseUrl = host ? `${proto}://${host}` : (env.appUrl || new URL(request.url).origin);
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");

  // Helper to ensure transient security cookies are wiped on ALL error paths (Phase 1, Item 2)
  const redirectWithError = (reason: string) => {
    const res = NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(reason)}`);
    res.cookies.delete(OAUTH_STATE_COOKIE);
    res.cookies.delete(OAUTH_PKCE_COOKIE);
    return res;
  };

  // 0. CSRF State Verification (Phase 1, Item 2)
  const storedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
  if (!state || !storedState || state !== storedState) {
    console.error("OAuth CSRF protection triggered: state mismatch or missing");
    return redirectWithError("invalid_csrf_state");
  }

  if (error || !code) {
    const errorMsg = errorDesc || error || "oauth_failed";
    return redirectWithError(errorMsg);
  }

  try {
    const redirectUri = `${baseUrl}/api/auth/callback/google`;
    const codeVerifier = request.cookies.get(OAUTH_PKCE_COOKIE)?.value;

    // 1. Exchange authorization code and PKCE code_verifier for access token (RFC 7636)
    const tokenRequestBody: Record<string, string> = {
      code,
      client_id: env.auth.googleClientId,
      client_secret: env.auth.googleClientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    };

    if (codeVerifier) {
      tokenRequestBody.code_verifier = codeVerifier;
    }

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(tokenRequestBody),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      const errDetail = tokenData.error_description || tokenData.error || "token_exchange_failed";
      console.error("Token exchange failed:", tokenData);
      return redirectWithError(errDetail);
    }

    // 2. Fetch user profile from Google UserInfo endpoint
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userRes.json();
    if (!userRes.ok || !googleUser.email) {
      const errUser = googleUser.error_description || googleUser.error?.message || "user_info_failed";
      return redirectWithError(errUser);
    }

    // 3. Mandatory Google Email Verification Check (Phase 1, Item 2)
    // Never issue a session or admin role if the Google account has unverified email
    const isEmailVerified = Boolean(googleUser.email_verified || googleUser.verified_email);
    if (!isEmailVerified) {
      console.error("Google OAuth login rejected: unverified email", googleUser.email);
      return redirectWithError("unverified_email");
    }

    // 4. Create cryptographically signed application session
    const normalizedEmail = googleUser.email.trim().toLowerCase();
    const session = await createSession({
      id: googleUser.id,
      name: googleUser.name || "مستخدم LKL",
      email: normalizedEmail,
      image: googleUser.picture,
    });

    // 5. Redirect based on role and wipe transient OAuth cookies
    const targetUrl = session.role === "ADMIN" ? `${baseUrl}/admin` : `${baseUrl}/account`;
    const response = NextResponse.redirect(targetUrl);

    // CRITICAL: Explicitly set the session cookie on the redirect response itself
    response.cookies.set(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.delete(OAUTH_STATE_COOKIE);
    response.cookies.delete(OAUTH_PKCE_COOKIE);
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "oauth_exception";
    return redirectWithError(message);
  }
}
