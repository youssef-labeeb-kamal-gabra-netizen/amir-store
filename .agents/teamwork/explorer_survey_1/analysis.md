# Comprehensive Security & API Route Audit Report: Ameer Store (أمير ستور)

**Auditor:** Explorer 1 (Security & API Explorer)  
**Date:** 2026-10-30  
**Scope:** `E:\ameer-store` (API routes in `src/app/api/`, authentication/authorization in `src/lib/auth.ts`, data storage in `src/lib/storage.ts` & `data/storage/`, middleware & rate limiting in `src/middleware.ts` & `src/lib/rate-limiter.ts`)  
**Status:** Audit Completed  

---

## Executive Summary

A comprehensive security audit of Ameer Store was conducted across 15 API routes, authentication mechanisms, session management, data storage engines, rate limiting, and HTTP security headers. 

While the project demonstrates solid security engineering in several areas (such as HMAC-SHA256 cryptographically signed sessions with constant-time verification, session revocation registries, Google OAuth PKCE and CSRF state validation, and atomic temporary-file-and-rename disk persistence), **critical security vulnerabilities and business logic flaws were identified that require immediate remediation before production deployment.**

The most critical vulnerability is **Client-Side Price Tampering (SEC-01)** in `POST /api/orders`, where the server accepts customer-submitted prices without validation against the product catalog, allowing arbitrary prices (e.g. 1 EGP or negative prices) on luxury perfumes worth thousands of EGP. Additionally, **SEC-02** allows hardcoded authentication secret fallback in production because the production validator is never invoked.

---

## Vulnerability Summary Matrix

| ID | Title | Component / Endpoint | Severity | Impact |
|---|---|---|---|---|
| **SEC-01** | Client-Side Price Tampering in Order Submission | `POST /api/orders` | **CRITICAL** | Financial loss, arbitrary price manipulation |
| **SEC-02** | Hardcoded Auth Secret Fallback & Uninvoked Production Guard | `src/lib/env.ts`, `src/lib/auth.ts` | **CRITICAL** | Session forgery, unauthorized admin takeover |
| **SEC-03** | Sliding-Window Rate Limiter Logic Bypass for API Routes | `src/lib/rate-limiter.ts` | **HIGH** | API rate-limiting completely disabled after min 1 |
| **SEC-04** | Rate Limit & Security Bypass via Untrusted `X-Forwarded-For` | `src/lib/rate-limiter.ts`, `/api/contact` | **HIGH** | Complete circumvention of rate limiting & IP bans |
| **SEC-05** | Unrestricted File Extension & Stored XSS in Media Upload | `POST /api/admin/media` | **HIGH** | Stored XSS / arbitrary static file execution |
| **SEC-06** | Concurrency Race Conditions & Lost Updates in JSON Storage | `src/lib/storage.ts`, all store modules | **HIGH** | Lost orders, reviews, or product data during spikes |
| **SEC-07** | Missing Schema & Field Validation on Order Items | `POST /api/orders` | **HIGH** | Server errors, database corruption, invalid quantities |
| **SEC-08** | Lack of Content-Security-Policy (CSP) Header | `src/middleware.ts` | **MEDIUM** | Inability to restrict malicious script execution |
| **SEC-09** | In-Memory Cache Desynchronization in Multi-Instance / Lambdas | `src/lib/storage.ts` | **MEDIUM** | Stale data served across serverless instances |
| **SEC-10** | Host Header Injection / Open Redirect in OAuth Callbacks | `/api/auth/google`, `/api/auth/callback` | **MEDIUM** | Credential/session redirection to attacker host |
| **SEC-11** | Unvalidated Partial Updates in Admin Content & Settings | `/api/admin/content`, `/api/admin/settings` | **MEDIUM** | Unsanitized data injection into persistent stores |
| **SEC-12** | Missing Endpoint Rate Limiting on Orders and Reviews | `/api/orders`, `/api/reviews` | **MEDIUM** | Spam order creation, disk exhaustion |
| **SEC-13** | Hardcoded Administrator Email in Source Code | `src/lib/env.ts`, `src/lib/users-store.ts` | **LOW** | Inflexible & insecure privilege assignment |
| **SEC-14** | Misleading 403 Status for Syntax & Internal Errors | Admin API routes (`categories`, `products`) | **LOW** | Masked bad requests and internal server failures |
| **SEC-15** | Obsolete LKL Test Suite Causing QA Verification Failures | `scripts/run-tests.js`, `verify-all.js` | **LOW** | False negatives in CI/CD automated test runs |
| **SEC-16** | Residual LKL Agricultural Fallbacks in Copy & Metadata | `content-store.ts`, `settings-store.ts` | **LOW** | Brand identity corruption if storage is wiped |

---

## Detailed Vulnerability Analysis

### CRITICAL SEVERITY

#### SEC-01: Client-Side Price Tampering in Order Submission
- **File:** `src/app/api/orders/route.ts` (lines 8, 39-55) & `src/lib/orders-store.ts` (lines 26-61)
- **Description:**
  When a customer submits an order via `POST /api/orders`, the request body contains:
  ```json
  {
    "customerName": "...",
    "phone": "...",
    "governorate": "...",
    "address": "...",
    "items": [
      { "id": "prod-1", "name": "دهن عود كمبودي", "price": 1, "quantity": 10 }
    ]
  }
  ```
  The server performs only shallow validation: `!items || !Array.isArray(items) || items.length === 0`.
  In `createOrder` (`src/lib/orders-store.ts` line 33):
  ```typescript
  const subtotal = input.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const total = subtotal + shippingCost;
  ```
  The server **never validates `item.price` against the authoritative catalog (`getProductsStore()`)**!
- **Impact:**
  An attacker can purchase luxury perfumes valued at 3,850 EGP for 1 EGP or even negative amounts, resulting in direct financial fraud and corrupt accounting.
- **Concrete Remediation:**
  1. For every item in `items`, lookup the authoritative product from `getProductsStore().find(p => p.id === item.id)`.
  2. Verify that the product exists and `product.published === true`.
  3. Override the item price with `product.price` (or throw an error if client-submitted price differs).
  4. Recalculate `subtotal`, `shippingCost`, and `total` strictly from server-resolved prices.

---

#### SEC-02: Hardcoded Auth Secret Fallback & Uninvoked Production Security Guard
- **File:** `src/lib/env.ts` (lines 9-35) & `src/lib/auth.ts` (lines 112-115)
- **Description:**
  In `src/lib/env.ts`:
  ```typescript
  const FALLBACK_PRODUCTION_SECRET = "lkl-store-sha256-auth-secret-production-persistent-key-9823419082341";

  function getRuntimeAuthSecret(): string {
    if (process.env.AUTH_SECRET && process.env.AUTH_SECRET.trim().length >= 32) {
      return process.env.AUTH_SECRET.trim();
    }
    return FALLBACK_PRODUCTION_SECRET;
  }
  ```
  While `validateProductionSecurity()` exists in `src/lib/env.ts`, **it is never called anywhere in the codebase.**
- **Impact:**
  If a production deployment omits `AUTH_SECRET`, the application silently defaults to the public hardcoded secret `FALLBACK_PRODUCTION_SECRET`. Anyone who inspects the git repository can craft an HMAC-SHA256 signature for `{ "user": { "role": "ADMIN", ... } }` and achieve immediate unauthorized administrative takeover.
- **Concrete Remediation:**
  1. In production (`isProduction === true`), throw an immediate exception if `process.env.AUTH_SECRET` is missing or shorter than 32 characters.
  2. Remove `FALLBACK_PRODUCTION_SECRET` for production contexts.
  3. Ensure `validateProductionSecurity()` executes at server startup.

---

### HIGH SEVERITY

#### SEC-03: Sliding-Window Rate Limiter Logic Bypass for API Routes
- **File:** `src/lib/rate-limiter.ts` (lines 172-186)
- **Description:**
  The API rate limiting logic in `checkRateLimit` is written as follows:
  ```typescript
  if (isApiRoute && record.count > SECURITY_CONFIG.API_MAX_REQUESTS && (record.resetTime - now) > (SECURITY_CONFIG.GLOBAL_WINDOW_MS - SECURITY_CONFIG.API_WINDOW_MS)) {
    if (record.count > SECURITY_CONFIG.API_MAX_REQUESTS * 3) {
      record.blockedUntil = now + 120 * 1000;
      return { success: false, ... };
    }
  }
  ```
  `SECURITY_CONFIG.GLOBAL_WINDOW_MS - SECURITY_CONFIG.API_WINDOW_MS = 15m - 1m = 14m`.
  `record.resetTime - now` is only greater than 14 minutes during the **first 60 seconds** of each 15-minute global window. After the first 60 seconds have elapsed, this condition is **permanently false** until the 15-minute window expires!
  Additionally, it tests `record.count` (which aggregates all static and page requests) rather than maintaining an independent API counter.
- **Impact:**
  API rate limiting is completely bypassed for 14 out of every 15 minutes, allowing brute-force, scraping, and endpoint denial of service.
- **Concrete Remediation:**
  Add a dedicated `apiCount` and `apiResetTime` to `RateLimitRecord`. Check `record.apiCount > SECURITY_CONFIG.API_MAX_REQUESTS` within its own 1-minute sliding window independently of the global window.

---

#### SEC-04: Rate Limiting & Security Check Bypass via Untrusted `X-Forwarded-For`
- **File:** `src/lib/rate-limiter.ts` (lines 74-86) & `src/app/api/contact/route.ts` (lines 16-24)
- **Description:**
  The `getClientIp` function extracts the client IP:
  ```typescript
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  ```
  The first entry in `X-Forwarded-For` is client-controlled unless stripped by an edge proxy.
- **Impact:**
  An attacker can spoof `X-Forwarded-For: 198.51.100.1` and rotate it on every request, easily bypassing all rate limiting, IP blocking, and malicious probe detection.
- **Concrete Remediation:**
  On cloud hosting (e.g., Vercel, Cloudflare), inspect authenticated headers such as `x-real-ip` or `cf-connecting-ip` first, or take the leftmost IP only after verifying the connection originated from a trusted reverse proxy.

---

#### SEC-05: Unrestricted File Extension & Stored XSS in Media Upload
- **File:** `src/app/api/admin/media/route.ts` (lines 118-164)
- **Description:**
  While the endpoint validates binary magic bytes for JPG/PNG/WebP, it extracts the file extension directly from the user-controlled filename:
  ```typescript
  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const uniqueName = `${Date.now()}-${baseName}${ext}`;
  const destinationPath = path.join(UPLOADS_DIR, uniqueName);
  ```
  If an attacker sends a PNG file with filename `xss.html` or `vector.svg`, `ext` becomes `.html` or `.svg`. The file is saved directly into `public/uploads/` and served as a static asset.
- **Impact:**
  When a victim or administrator opens the uploaded file URL (`/uploads/<timestamp>-xss.html`), the browser executes HTML/JavaScript within the store's origin, resulting in Stored Cross-Site Scripting (XSS).
- **Concrete Remediation:**
  Map the extension strictly from the validated MIME/magic byte type (e.g. `image/jpeg` -> `.jpg`, `image/png` -> `.png`, `image/webp` -> `.webp`). Disregard `file.name`'s extension completely.

---

#### SEC-06: Concurrency Race Conditions & Lost Updates in JSON Storage
- **File:** `src/lib/storage.ts` (lines 64-138) and all store modules (`orders-store.ts`, `products-store.ts`, etc.)
- **Description:**
  Data mutation across all stores follows an unsynchronized Read-Modify-Write pattern:
  ```typescript
  const orders = getOrders();
  const updatedOrders = [newOrder, ...orders];
  writeStorageFile(STORAGE_FILE, updatedOrders);
  ```
  `writeStorageFile` uses an atomic file rename, which prevents file corruption during unexpected crashes. However, it does not lock the read-modify-write cycle. If two orders arrive simultaneously, thread/task B reads before task A writes, causing task A's order to be permanently erased upon task B's write.
- **Impact:**
  Customer orders and inquiries will be silently lost during high traffic periods or concurrent checkouts.
- **Concrete Remediation:**
  Implement an in-memory sequential promise-chain / write-queue per storage file to serialize write operations, or append new records rather than rewriting the entire JSON array.

---

#### SEC-07: Missing Schema & Field Validation on Order Items
- **File:** `src/app/api/orders/route.ts` (lines 39-45)
- **Description:**
  The order endpoint does not validate individual item properties within the `items` array. Items can have negative quantities, fractional quantities, missing IDs, or missing names.
- **Impact:**
  Passing `{ quantity: -10 }` or `{ quantity: 0 }` can disrupt total calculations or corrupt order records in `orders.json`.
- **Concrete Remediation:**
  Validate each item in the array:
  - `id`: Non-empty string matching an active product in `getProductsStore()`.
  - `quantity`: Positive integer between 1 and 50 (`Number.isInteger(q) && q >= 1 && q <= 50`).
  - Cap `items.length` to at most 20 items per order to prevent payload flooding.

---

### MEDIUM SEVERITY

#### SEC-08: Lack of Content-Security-Policy (CSP) Header
- **File:** `src/middleware.ts` (lines 81-100)
- **Description:**
  `middleware.ts` sets `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, and `Strict-Transport-Security`, but omits `Content-Security-Policy`.
- **Impact:**
  No defense-in-depth barrier exists against cross-site scripting or untrusted third-party script injection.
- **Remediation:**
  Define a robust CSP header in `middleware.ts` restricting script execution to `'self'`, inline scripts with nonces/hashes, and trusted Google domains.

---

#### SEC-09: In-Memory Cache Desynchronization in Serverless / Multi-Instance Deployments
- **File:** `src/lib/storage.ts` (lines 14-23, 65-68, 132)
- **Description:**
  `readStorageFile` uses a process-local `global.__lkl_storage_cache = new Map()`. In serverless hosting (e.g. Vercel) or multi-container clusters, different instances have disjoint memories. An order created on Instance A is cached in Instance A, but Instance B's cache remains stale until that instance terminates.
- **Impact:**
  Admin dashboard or inventory views may display inconsistent or outdated order counts depending on which serverless instance handles the request.
- **Remediation:**
  Verify file modification timestamp (`fs.statSync(filePath).mtimeMs`) before serving from cache, or bypass the in-memory cache for mutation-heavy stores (`orders.json`).

---

#### SEC-10: Host Header Injection / Open Redirect in OAuth Callbacks
- **File:** `src/app/api/auth/google/route.ts` (lines 18-24) & `src/app/api/auth/callback/google/route.ts` (lines 13-17, 97-98)
- **Description:**
  The OAuth routes derive `baseUrl` from incoming `x-forwarded-host` or `host` headers.
- **Impact:**
  If a malicious host header is accepted by an edge proxy, post-authentication redirects could send the user to an external phishing URL while attaching the application session cookie.
- **Remediation:**
  Validate `host` against a whitelist of expected hostnames or default strictly to `env.appUrl`.

---

#### SEC-11: Unvalidated Partial Updates in Admin Content & Settings
- **File:** `src/app/api/admin/content/route.ts` (lines 18-19) & `src/app/api/admin/settings/route.ts` (lines 18-19)
- **Description:**
  The `PUT` handlers accept arbitrary request JSON and merge it directly into the storage files without filtering unauthorized keys or validating data types.
- **Impact:**
  An administrative session or CSRF vulnerability could inject corrupted data, prototype pollution payloads, or unexpected properties into configuration files.
- **Remediation:**
  Filter incoming payload keys against an explicit whitelist of allowed fields with length and type checks.

---

#### SEC-12: Missing Endpoint Rate Limiting on Orders and Reviews
- **File:** `src/app/api/orders/route.ts` & `src/app/api/reviews/route.ts`
- **Description:**
  Unlike `/api/contact`, which enforces a 5-request-per-10-minute rate limit, `/api/orders` and `/api/reviews` have no dedicated rate limiting.
- **Impact:**
  Automated bots can spam fake COD orders or flood the reviews moderation queue.
- **Remediation:**
  Add sliding-window rate limiting to `/api/orders` (e.g., max 5 orders per 10 minutes per IP) and `/api/reviews` (e.g., max 3 reviews per 10 minutes per IP).

---

### LOW SEVERITY

#### SEC-13: Hardcoded Administrator Email in Source Code
- **File:** `src/lib/env.ts` (line 65) & `src/lib/users-store.ts` (line 18)
- **Description:** `"yousseflabeeb256@gmail.com"` is hardcoded as an immutable administrator.
- **Remediation:** Derive admin emails strictly from the `ADMIN_EMAILS` environment variable.

#### SEC-14: Misleading 403 Status for Syntax & Internal Errors
- **File:** `src/app/api/admin/categories/route.ts`, `src/app/api/admin/products/route.ts`, `src/app/api/admin/reviews/route.ts`
- **Description:** All exceptions are caught in a single `catch` block that returns `{ status: 403 }`, masking 400 Bad Request and 500 Internal Error.
- **Remediation:** Separate authentication errors from payload parsing and filesystem errors.

#### SEC-15: Obsolete LKL Test Suite Causing QA Verification Failures
- **File:** `scripts/run-tests.js` & `scripts/verify-all.js`
- **Description:** Tests assert that the catalog must NOT contain prices and must contain agricultural categories. Running `npm test` fails with 3 errors.
- **Remediation:** Update test assertions to match Ameer Store perfume catalog and business data.

#### SEC-16: Residual LKL Agricultural Fallbacks in Copy & Metadata
- **File:** `src/lib/content-store.ts`, `src/lib/settings-store.ts`, `src/app/admin/layout.tsx`, `src/app/account/page.tsx`
- **Description:** Fallback strings reference agricultural machinery, old phone numbers, and outdated page titles.
- **Remediation:** Update fallback constants to Ameer Store luxury perfume branding.

---

## Endpoint-by-Endpoint Security Audit Breakdown

| Endpoint | Method | Auth Guard | Input Validation | Rate Limited | Status & Notes |
|---|---|---|---|---|---|
| `/api/orders` | POST | Public | **Inadequate** (no price/item check) | **No** | **CRITICAL**: Price tampering vulnerability (SEC-01) |
| `/api/orders` | GET | `requireAdmin()` | N/A | Global MW | Secure |
| `/api/orders` | PATCH | `requireAdmin()` | Partial (no status enum check) | Global MW | Medium: Needs status enum check |
| `/api/reviews` | GET | Public | N/A | Global MW | Secure: Returns approved reviews only |
| `/api/reviews` | POST | Public | Basic (regex tag strip) | **No** | Needs rate limit & sanitization |
| `/api/contact` | POST | Public | Regex phone & email | **Yes** (5/10m) | Fix `X-Forwarded-For` spoofing (SEC-04) |
| `/api/account/requests` | GET | `getSession()` | N/A | Global MW | Secure: Row-level customer isolation |
| `/api/account/requests` | POST | `getSession()` | Phone & message regex | Global MW | Secure |
| `/api/account/requests` | DELETE | `getSession()` | ID check | Global MW | Secure: Enforces customer ownership |
| `/api/admin/categories` | GET/POST/PUT/DELETE | `requireAdmin()` | Basic | Global MW | Secure: Admin restricted |
| `/api/admin/contact-requests` | GET/PATCH/DELETE | `requireAdmin()` | Status enum validated | Global MW | Secure: Admin restricted |
| `/api/admin/content` | GET/PUT | `requireAdmin()` | **Missing** on PUT | Global MW | Medium: Whitelist allowed keys |
| `/api/admin/media` | GET/POST/DELETE | `requireAdmin()` | Magic bytes checked | Global MW | **HIGH**: Extension spoofing / XSS (SEC-05) |
| `/api/admin/products` | GET/POST/PUT/DELETE/PATCH | `requireAdmin()` | Missing perfume fields | Global MW | Incomplete schema in POST/PUT |
| `/api/admin/reviews` | GET/PATCH/DELETE | `requireAdmin()` | Status enum validated | Global MW | Secure: Admin restricted |
| `/api/admin/settings` | GET/PUT | `requireAdmin()` | **Missing** on PUT | Global MW | Medium: Whitelist allowed keys |
| `/api/admin/users` | GET/PATCH | `requireAdmin()` | Role validated | Global MW | Secure: Prevents self-demotion |
| `/api/auth/google` | GET | Public | Validates client ID | Global MW | Uses PKCE + CSRF state cookie |
| `/api/auth/callback/google` | GET | Public | CSRF state + PKCE | Global MW | Verifies `email_verified` from Google |
| `/api/auth/logout` | POST | Authenticated | N/A | Global MW | Rejects GET; destroys session & revokes JTI |
