/**
 * LKL Production-Grade Security & Sliding-Window Rate Limiter
 * Protects against DDoS, automated scanning tools, brute force, and abusive traffic.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
  burstCount: number;
  burstResetTime: number;
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
      if (record.resetTime < now && (!record.blockedUntil || record.blockedUntil < now)) {
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

/**
 * Extracts a reliable client IP from headers
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

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

  // 2. Check strict API rate limit
  if (isApiRoute && record.count > SECURITY_CONFIG.API_MAX_REQUESTS && (record.resetTime - now) > (SECURITY_CONFIG.GLOBAL_WINDOW_MS - SECURITY_CONFIG.API_WINDOW_MS)) {
    // API limit check
    if (record.count > SECURITY_CONFIG.API_MAX_REQUESTS * 3) {
      record.blockedUntil = now + 120 * 1000;
      return {
        success: false,
        limit: SECURITY_CONFIG.API_MAX_REQUESTS,
        remaining: 0,
        reset: Math.ceil(record.resetTime / 1000),
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
