import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/lib/env";
import { OAUTH_STATE_COOKIE, OAUTH_PKCE_COOKIE } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!env.auth.googleClientId || env.auth.googleClientId.trim() === "") {
    return NextResponse.redirect(new URL("/login?error=not_configured", request.url));
  }

  // 1. Generate cryptographically random CSRF state (Phase 1, Item 2)
  const state = crypto.randomBytes(32).toString("hex");

  // 2. Generate PKCE code_verifier and code_challenge (RFC 7636 - Phase 1, Item 2)
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest("base64url");

  // Dynamically detect the actual live host (Vercel domain or custom domain)
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || (request.url.startsWith("https") ? "https" : "http");
  const rawBaseUrl = host ? `${proto}://${host}` : (env.appUrl || new URL(request.url).origin);
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");

  const redirectUri = `${baseUrl}/api/auth/callback/google`;
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    redirect_uri: redirectUri,
    client_id: env.auth.googleClientId,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options).toString();
  const response = NextResponse.redirect(`${rootUrl}?${qs}`);

  // Store CSRF state in a strict, HTTP-only cookie valid for 10 minutes
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });

  // Store PKCE code_verifier in an HTTP-only cookie valid for 10 minutes
  response.cookies.set(OAUTH_PKCE_COOKIE, codeVerifier, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });

  return response;
}
