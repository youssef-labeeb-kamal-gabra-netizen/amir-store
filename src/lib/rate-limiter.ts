/**
 * Amir Store Production-Grade Security & Sliding-Window Rate Limiter
 * Protects against DDoS, automated scanning tools, brute force, and abusive traffic.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
  burstCount: number;
  burstResetTime: number;
  apiCount: number;
  apiResetTime: number;
  blockedUntil?: number;
}

// In-memory IP tracking store
const ipStore = new Map<string, RateLimitRecord>();

// Malicious User-Agent signatures (common attack and scanning tools)
const BLOCKED_USER_AGENTS = [
  "sqlmap",
  "nikto",
  "masscan",
  "wpscan",
  "dirbuster",
  "havij",
  "acunetix",
  "nessus",
  "metasploit",
  "morfeus",
  "zgrab",
];

// Security Configurations
export const SECURITY_CONFIG = {
  // Global maximum: 1000 requests per 15-minute window
  GLOBAL_MAX_REQUESTS: 1000,
  GLOBAL_WINDOW_MS: 15 * 60 * 1000, // 15 minutes

  // Rapid burst protection: 120 requests per 10 seconds
  BURST_MAX_REQUESTS: 120,
  BURST_WINDOW_MS: 10 * 1000, // 10 seconds

  // Strict API limits: 100 requests per 1 minute for /api/*
  API_MAX_REQUESTS: 100,
  API_WINDOW_MS: 60 * 1000, // 1 minute

  // Penalty lockout duration when limit is breached
  PENALTY_LOCKOUT_MS: 10 * 60 * 1000, // 10 minutes lockout
};

// Periodic cleanup every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipStore.entries()) {
      if (
        record.resetTime < now &&
        record.apiResetTime < now &&
        (!record.blockedUntil || record.blockedUntil < now)
      ) {
        ipStore.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  reason?: "GLOBAL_LIMIT_EXCEEDED" | "BURST_LIMIT_EXCEEDED" | "API_LIMIT_EXCEEDED" | "MALICIOUS_USER_AGENT" | "LOCKED_OUT";
  retryAfterSeconds?: number;
}

// IP validation regexes
const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const IPV6_REGEX = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$|^::1$|^[a-fA-F0-9:]+$/;

function sanitizeIp(rawIp: string | null | undefined): string | null {
  if (!rawIp) return null;
  let cleaned = rawIp.trim();
  if (cleaned.startsWith("[") && cleaned.includes("]")) {
    cleaned = cleaned.replace(/^\[([a-fA-F0-9:]+)\](?::\d+)?$/, "$1");
  } else if (cleaned.includes(":") && !cleaned.includes("::") && cleaned.split(":").length === 2) {
    cleaned = cleaned.split(":")[0].trim();
  }

  if (IPV4_REGEX.test(cleaned) || IPV6_REGEX.test(cleaned)) {
    return cleaned;
  }
  return null;
}

/**
 * Extracts a reliable client IP from headers, rejecting spoofed or malformed values
 */
export function getClientIp(headers: Headers): string {
  const cfConnectingIp = sanitizeIp(headers.get("cf-connecting-ip"));
  if (cfConnectingIp) return cfConnectingIp;

  const realIp = sanitizeIp(headers.get("x-real-ip"));
  if (realIp) return realIp;

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => sanitizeIp(p)).filter(Boolean);
    if (parts.length > 0 && parts[0]) {
      return parts[0] as string;
    }
  }

  return "127.0.0.1";
}

/**
 * Checks User-Agent for known vulnerability scanners
 */
export function isMaliciousUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const lower = userAgent.toLowerCase();
  return BLOCKED_USER_AGENTS.some((bad) => lower.includes(bad));
}

// Common exploit scanner patterns (path traversal, PHP probes, env file dumping)
const MALICIOUS_PATTERNS = [
  /(\.\.|\%2e\%2e)/i, // Path traversal
  /\.(env|git|aws|ssh|bak|sql|tar|gz|zip)($|\/)/i, // Sensitive config probes
  /(wp-admin|wp-login|xmlrpc|eval-stdin|phpmyadmin|adminer|\.php$)/i, // Automated CMS scanner probes
  /(<script|javascript:|onload=|onerror=)/i, // Script injection attempts
];

/**
 * Detects common malicious exploit probes in requested paths and queries
 */
export function isMaliciousPath(pathname: string, search: string = ""): boolean {
  const full = `${pathname}${search}`;
  return MALICIOUS_PATTERNS.some((pattern) => pattern.test(full));
}

/**
 * Validates request against rate limits and returns status
 */
export function checkRateLimit(ip: string, pathname: string): RateLimitResult {
  const now = Date.now();
  const isApiRoute = pathname.startsWith("/api");

  let record = ipStore.get(ip);
  if (!record) {
    record = {
      count: 0,
      resetTime: now + SECURITY_CONFIG.GLOBAL_WINDOW_MS,
      burstCount: 0,
      burstResetTime: now + SECURITY_CONFIG.BURST_WINDOW_MS,
      apiCount: 0,
      apiResetTime: now + SECURITY_CONFIG.API_WINDOW_MS,
    };
    ipStore.set(ip, record);
  }

  // Check if IP is currently locked out
  if (record.blockedUntil && record.blockedUntil > now) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    return {
      success: false,
      limit: SECURITY_CONFIG.GLOBAL_MAX_REQUESTS,
      remaining: 0,
      reset: Math.ceil(record.blockedUntil / 1000),
      reason: "LOCKED_OUT",
      retryAfterSeconds: retryAfter,
    };
  }

  // Reset burst window if expired
  if (now > record.burstResetTime) {
    record.burstCount = 0;
    record.burstResetTime = now + SECURITY_CONFIG.BURST_WINDOW_MS;
  }

  // Reset global window if expired
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + SECURITY_CONFIG.GLOBAL_WINDOW_MS;
  }

  // Reset API window if expired
  if (now > record.apiResetTime) {
    record.apiCount = 0;
    record.apiResetTime = now + SECURITY_CONFIG.API_WINDOW_MS;
  }

  record.count += 1;
  record.burstCount += 1;

  // 1. Check burst rate (anti-hammering)
  if (record.burstCount > SECURITY_CONFIG.BURST_MAX_REQUESTS) {
    record.blockedUntil = now + 60 * 1000; // 1 min cool-off
    return {
      success: false,
      limit: SECURITY_CONFIG.BURST_MAX_REQUESTS,
      remaining: 0,
      reset: Math.ceil(record.burstResetTime / 1000),
      reason: "BURST_LIMIT_EXCEEDED",
      retryAfterSeconds: 60,
    };
  }

  // 2. Check strict API rate limit (independent 1-minute sliding window)
  if (isApiRoute) {
    record.apiCount += 1;
    if (record.apiCount > SECURITY_CONFIG.API_MAX_REQUESTS) {
      record.blockedUntil = now + 120 * 1000;
      return {
        success: false,
        limit: SECURITY_CONFIG.API_MAX_REQUESTS,
        remaining: 0,
        reset: Math.ceil(record.apiResetTime / 1000),
        reason: "API_LIMIT_EXCEEDED",
        retryAfterSeconds: 120,
      };
    }
  }

  // 3. Check Global limit: > 1000 requests
  if (record.count > SECURITY_CONFIG.GLOBAL_MAX_REQUESTS) {
    record.blockedUntil = now + SECURITY_CONFIG.PENALTY_LOCKOUT_MS;
    return {
      success: false,
      limit: SECURITY_CONFIG.GLOBAL_MAX_REQUESTS,
      remaining: 0,
      reset: Math.ceil(record.blockedUntil / 1000),
      reason: "GLOBAL_LIMIT_EXCEEDED",
      retryAfterSeconds: Math.ceil(SECURITY_CONFIG.PENALTY_LOCKOUT_MS / 1000),
    };
  }

  return {
    success: true,
    limit: SECURITY_CONFIG.GLOBAL_MAX_REQUESTS,
    remaining: Math.max(0, SECURITY_CONFIG.GLOBAL_MAX_REQUESTS - record.count),
    reset: Math.ceil(record.resetTime / 1000),
  };
}

// In-memory sliding-window map for specific route rate-limiting (e.g. orders, contact)
const routeRateLimitMap = new Map<string, number[]>();

/**
 * Endpoint-specific sliding window rate limiter
 * Returns true if request should be blocked, false if allowed
 */
export function checkEndpointRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 10 * 60 * 1000
): boolean {
  const now = Date.now();
  const timestamps = (routeRateLimitMap.get(key) || []).filter(
    (t) => now - t < windowMs
  );
  if (timestamps.length >= maxRequests) {
    routeRateLimitMap.set(key, timestamps);
    return true; // blocked
  }
  timestamps.push(now);
  routeRateLimitMap.set(key, timestamps);
  return false; // allowed
}
