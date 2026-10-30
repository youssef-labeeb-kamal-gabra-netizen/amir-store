import { cookies } from "next/headers";
import crypto from "crypto";
import { env } from "@/lib/env";
import { ApplicationError } from "@/lib/error";
import { getUsersStore, upsertUser } from "@/lib/users-store";
import { readStorageFile, writeStorageFile } from "@/lib/storage";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "USER" | "ADMIN";
}

export interface SessionResult extends SessionUser {
  token: string;
}

interface StoredSessionPayload {
  user: SessionUser;
  iat: number;
  exp: number;
  jti: string; // Unique Session ID for revocation (Phase 1, Item 4)
}

export const SESSION_COOKIE_NAME = "lkl_session";
export const OAUTH_STATE_COOKIE = "lkl_oauth_state";
export const OAUTH_PKCE_COOKIE = "lkl_oauth_pkce";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

interface RevocationsStore {
  revokedJtis: string[];
  revokedEmails: Record<string, number>;
}

const REVOCATIONS_FILE = "revocations.json";

function getRevocationsStore(): RevocationsStore {
  return readStorageFile<RevocationsStore>(REVOCATIONS_FILE, {
    revokedJtis: [],
    revokedEmails: {},
  });
}

export function revokeSession(jti: string): void {
  if (!jti) return;
  const store = getRevocationsStore();
  if (!store.revokedJtis.includes(jti)) {
    store.revokedJtis.push(jti);
    // Keep max 5000 recent revoked jtis to prevent unbounded storage file growth
    if (store.revokedJtis.length > 5000) {
      store.revokedJtis = store.revokedJtis.slice(-5000);
    }
    writeStorageFile(REVOCATIONS_FILE, store);
  }
}

export function revokeAllSessionsForUser(email: string): void {
  if (!email) return;
  const store = getRevocationsStore();
  store.revokedEmails[email.trim().toLowerCase()] = Date.now();
  writeStorageFile(REVOCATIONS_FILE, store);
}

export function isSessionRevoked(payload: StoredSessionPayload): boolean {
  try {
    const store = getRevocationsStore();
    if (payload.jti && store.revokedJtis.includes(payload.jti)) {
      return true;
    }
    if (payload.user?.email) {
      const revokedAt = store.revokedEmails[payload.user.email.trim().toLowerCase()];
      if (revokedAt && payload.iat < revokedAt) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Resolves whether an email belongs to an administrator
 * Unified authoritative check (Phase 1, Item 3)
 */
export function resolveUserRole(email: string): "USER" | "ADMIN" {
  const normalizedEmail = email.trim().toLowerCase();
  
  // 1. Immutable primary admin check from environment
  if (env.auth.adminEmails.includes(normalizedEmail)) {
    return "ADMIN";
  }

  // 2. Dynamic check from registered store
  try {
    const user = getUsersStore().find((u) => u.email.trim().toLowerCase() === normalizedEmail);
    if (user && user.role === "ADMIN") {
      return "ADMIN";
    }
  } catch {
    // Fallback if users store is uninitialized
  }

  return "USER";
}

/**
 * Generates an HMAC-SHA256 signature for a payload string using AUTH_SECRET
 */
function signPayload(payloadStr: string): string {
  const secret = env.auth.secret || "fallback-secret-for-development-mode-only";
  return crypto.createHmac("sha256", secret).update(payloadStr).digest("base64url");
}

/**
 * Verifies that a given signature matches the payload using constant-time comparison
 */
function verifySignature(payloadStr: string, signature: string): boolean {
  try {
    const expectedSig = signPayload(payloadStr);
    const expectedBuffer = Buffer.from(expectedSig);
    const actualBuffer = Buffer.from(signature);
    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch {
    return false;
  }
}

/**
 * Encodes and cryptographically signs a session payload into an HTTP-only cookie.
 */
export async function createSession(user: Omit<SessionUser, "role">): Promise<SessionResult> {
  const role = resolveUserRole(user.email);
  const sessionUser: SessionUser = {
    ...user,
    role,
  };

  const now = Date.now();
  const jti = crypto.randomUUID();
  const payload: StoredSessionPayload = {
    user: sessionUser,
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS * 1000,
    jti,
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(payloadStr);
  const token = `${payloadStr}.${signature}`;

  try {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
  } catch {
    // Non-fatal if setting cookies() fails in some contexts
  }

  try {
    upsertUser({
      email: sessionUser.email,
      name: sessionUser.name,
      role: sessionUser.role,
    });
  } catch {
    // Non-fatal if storage fails during edge session creation
  }

  return {
    ...sessionUser,
    token,
  };
}

/**
 * Retrieves and cryptographically validates the current authenticated user session from HTTP-only cookie.
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) return null;

    const parts = sessionCookie.value.split(".");
    if (parts.length !== 2) {
      // Unsigned or malformed legacy/forged cookie: reject immediately
      return null;
    }

    const [payloadStr, signature] = parts;
    if (!verifySignature(payloadStr, signature)) {
      // Signature mismatch (tampering detected): reject immediately
      return null;
    }

    const jsonStr = Buffer.from(payloadStr, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonStr) as StoredSessionPayload;

    // Check expiration
    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }

    // Check session revocation (Phase 1, Item 4)
    if (isSessionRevoked(payload)) {
      return null;
    }

    if (!payload.user || !payload.user.email) {
      return null;
    }

    // Always re-verify role server-side against authoritative source of truth
    const freshRole = resolveUserRole(payload.user.email);
    payload.user.role = freshRole;

    return payload.user;
  } catch {
    return null;
  }
}

/**
 * Destroys and revokes current session cookie (Logout)
 */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (sessionCookie && sessionCookie.value) {
      const parts = sessionCookie.value.split(".");
      if (parts.length === 2 && verifySignature(parts[0], parts[1])) {
        const jsonStr = Buffer.from(parts[0], "base64url").toString("utf-8");
        const payload = JSON.parse(jsonStr) as StoredSessionPayload;
        if (payload.jti) {
          revokeSession(payload.jti);
        }
      }
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  }
}

/**
 * Server-side guard: Requires an authenticated user session
 */
export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw ApplicationError.unauthorized();
  }
  return session;
}

/**
 * Server-side guard: Requires ADMIN role verified on the server
 */
export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireAuth();
  if (session.role !== "ADMIN") {
    throw ApplicationError.forbidden("هذه الصفحة مخصصة لمدير النظام فقط.");
  }
  return session;
}
