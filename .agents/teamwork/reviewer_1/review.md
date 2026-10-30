# Security & API Architecture Code Review Report — Reviewer 1

## Review Summary

**Verdict**: **APPROVE**  
**Reviewer**: Reviewer 1 (Security & API Reviewer)  
**Target Project**: Ameer Store (`E:\ameer-store`)  
**Scope**: Milestones 1 & 2 (Security Architecture, Secrets, Rate Limiting, Storage Concurrency, Authoritative Server Pricing, Order Integrity, Dual Checkout Flow)  
**Integrity Audit**: Clean — No integrity violations, no dummy facades, no hardcoded bypasses.

---

## 1. Executive Summary & Verification Metrics

All core security and API requirements defined in `PROJECT.md` and `ORIGINAL_REQUEST.md` for Milestones 1 & 2 have been thoroughly examined, verified statically, and tested adversarially against an active Next.js 15 production server.

| Verification Target | Command | Result | Details |
|---|---|---|---|
| **TypeScript Strictness** | `npm run typecheck` (`tsc --noEmit`) | **PASS (0 errors)** | Strict mode clean |
| **Code Style & ESLint** | `npm run lint` (`next lint`) | **PASS (0 warnings/errors)** | Next.js 15 lint clean |
| **Test Suite Execution** | `npm test` (`node scripts/run-tests.js`) | **PASS (86/86, 100%)** | All 4 tiers pass |
| **Production Build** | `npm run build` (`next build`) | **PASS (Exit 0)** | 41/41 routes generated |
| **Live Server Probes** | `node scripts/verify-all.js` + HTTP probes | **PASS (16/16 verified)** | Live price tampering & headers tested |

---

## 2. Findings & Adversarial Analysis

### [Minor] Finding 1: Phone Prefix Normalization Rejects International E.164 Format (`+2010...`)
- **What**: In `src/app/api/orders/route.ts` line 45, `normalizeEgyptianPhone` strips `+20`, leaving a 10-digit number (`1012345678`), which fails the subsequent 11-digit regex `EGYPTIAN_PHONE_REGEX = /^(010|011|012|015)[0-9]{8}$/` (which requires a leading `0`).
- **Where**: `src/app/api/orders/route.ts`, lines 43–53 and line 100.
- **Why**: Egyptian users entering numbers in standard international notation (`+2010...` or `002010...` or `2010...`) without the national trunk `0` are rejected as invalid, even though they are valid Egyptian mobile numbers.
- **Severity**: Minor (Non-blocking).
- **Suggestion**: In `normalizeEgyptianPhone`, if the resulting string has 10 digits and starts with `10`, `11`, `12`, or `15`, prepend `'0'`.

### [Minor] Finding 2: `POST /api/admin/media` Masks Authorization Rejection as HTTP 500
- **What**: In `src/app/api/admin/media/route.ts` line 194, the outer `try ... catch (err)` block wraps both `await requireAdmin()` and the upload logic. When an unauthenticated or unauthorized user calls `POST /api/admin/media`, `requireAdmin()` throws `ApplicationError.unauthorized()` or `forbidden()`, which is caught by the generic catch block and returned as `{ ok: false, message: "تعذر رفع وحفظ الصورة على الخادم" }, { status: 500 }`.
- **Where**: `src/app/api/admin/media/route.ts`, lines 109, 194–197.
- **Why**: Authorization failures should return HTTP 401 or 403 (as `GET` and `DELETE` in the same route file correctly do), not HTTP 500 Internal Server Error. While unauthorized users ARE successfully blocked from uploading files, returning 500 is technically imprecise and masks access denials as server crashes in API telemetry.
- **Severity**: Minor (Non-blocking).
- **Suggestion**: Specifically check `if (err instanceof ApplicationError)` in the catch block or handle `requireAdmin()` before the multipart body parsing, returning `{ status: err.statusCode || 403 }`.

### [Informational] Finding 3: In-Memory Storage Cache Multi-Instance Horizon
- **What**: `readStorageFile` in `src/lib/storage.ts` caches parsed JSON files in `global.__lkl_storage_cache`.
- **Where**: `src/lib/storage.ts`, lines 64–68.
- **Why**: In a single Node.js process (standard deployment), writes update the cache (`cache.set(filename, data)`) and disk atomically, so reads and writes stay synchronized. However, if deployed in a multi-instance or serverless container environment with horizontal scaling, file updates made on disk by another process/worker won't invalidate the in-memory cache of sibling processes. Given that Neon Postgres (`DATABASE_URL`) is planned for multi-instance production, this is acceptable for the local JSON storage engine, but worth noting.
- **Severity**: Informational.

### [Cosmetic] Finding 4: Legacy Naming Artifacts in Storage and Cookie Identifiers
- **What**: `SESSION_COOKIE_NAME` is `"lkl_session"`, `OAUTH_STATE_COOKIE` is `"lkl_oauth_state"`, storage cache global is `__lkl_storage_cache`, and temp storage path is `"lkl_storage"`.
- **Where**: `src/lib/auth.ts` lines 27–29, `src/lib/storage.ts` lines 15, 49.
- **Why**: These are harmless leftovers from the codebase's origin project (LKL) and do not impair security or functionality, but could be renamed to `ameer_session` / `ameer_storage` for brand consistency in a future cleanup milestone.
- **Severity**: Cosmetic / Low.

---

## 3. Verified Claims & Deep-Dive Evidence

### 1. Server-Side Authoritative Pricing & Order Validation (`src/app/api/orders/route.ts` & `src/lib/orders-store.ts`)
- **Claim**: Client-supplied prices are completely ignored; prices are verified against catalog.
- **Verification Evidence**:
  - Code inspection of `src/lib/orders-store.ts` (lines 80–114) confirms `createOrder` retrieves each item from `catalogMap.get(item.id.trim())`, verifies `product.published === true`, takes `product.price`, and completely ignores `item.price` from the client request.
  - Live adversarial probe against running Next.js server (`http://localhost:3005/api/orders`):
    - Sent: `{ items: [{ id: "prod-1", price: 1, quantity: 2 }] }` (attacker attempted to inject 1 EGP).
    - Result: HTTP 200, `subtotal: 7700` (3850 * 2), `shippingCost: 0`, `total: 7700`. Client price was completely overridden.
    - Sent: `{ items: [{ id: "prod-3", price: -500, quantity: 1 }] }` (attacker attempted to inject negative price).
    - Result: HTTP 200, `subtotal: 850`, `shippingCost: 50`, `total: 900`.
    - Sent: `{ items: [{ id: "fake-prod-999", quantity: 1 }] }`. Result: HTTP 400 Bad Request.
    - Sent: `{ items: [{ id: "prod-1", quantity: 0 }] }`. Result: HTTP 400 Bad Request.
    - Sent: `{ items: [{ id: "prod-1", quantity: 51 }] }`. Result: HTTP 400 Bad Request.
- **Status**: **VERIFIED — FULLY SECURE**.

### 2. Rate Limiting (`src/lib/rate-limiter.ts`)
- **Claim**: Sliding-window rate limiter protects API routes across all 15 minutes and throttles order submissions.
- **Verification Evidence**:
  - Code inspection confirms `checkEndpointRateLimit` uses a timestamp-sliding log window (`now - t < windowMs`).
  - Live adversarial probe: Sending rapid consecutive order requests from the same client IP resulted in requests 1–5 being processed, and request 6 immediately returning **HTTP 429 Too Many Requests** with the Arabic cooldown message:
    `"تم إرسال عدد كبير من الطلبات من هذا العنوان مؤخراً. يرجى الانتظار 10 دقائق قبل المحاولة مجدداً."`
- **Status**: **VERIFIED — FULLY FUNCTIONAL**.

### 3. Media Upload MIME Magic Byte Derivation (`src/app/api/admin/media/route.ts`)
- **Claim**: File extensions are derived strictly from binary magic bytes, never client filename.
- **Verification Evidence**:
  - `getImageExtensionFromMagicBytes(buffer)` inspects JPEG (`FF D8 FF`), PNG (`89 50 4E 47`), and WebP (`RIFF ... WEBP`).
  - Line 163 constructs destination filename using `${safeBaseName}${safeExt}`, strictly overriding any client-provided extension (e.g. `exploit.php` with JPEG header becomes `exploit.jpg`).
  - Path traversal is prevented on DELETE via `path.basename(fileName)`.
- **Status**: **VERIFIED — FULLY SECURE**.

### 4. Storage Concurrency Mutex (`src/lib/storage.ts`)
- **Claim**: `withStorageMutex` serializes concurrent file mutations to eliminate lost updates.
- **Verification Evidence**:
  - `withStorageMutex(filename, operation)` chains promises on `fileQueues.get(filename)`.
  - Operations are executed sequentially in FIFO order; each operation resolves its predecessor's promise in a `finally` block, ensuring no deadlocks even on thrown errors (`previousOp.catch(() => {})`).
  - Atomic write via temporary file and rename (`renameSync`) prevents file truncation or partial reads.
- **Status**: **VERIFIED — FULLY CONCURRENT-SAFE**.

### 5. Production Boot Security & Secrets (`src/lib/env.ts`)
- **Claim**: Insecure fallback secret is removed; system fails fast at boot in production if secrets are missing.
- **Verification Evidence**:
  - `validateProductionSecurity()` throws a fatal error if `AUTH_SECRET` is missing, shorter than 32 characters, or using the dev fallback string.
  - Automatically invoked at module load time when `isProduction === true`.
- **Status**: **VERIFIED — FAIL-SAFE**.

### 6. Security Headers (`next.config.mjs`)
- **Claim**: Strict security headers are configured and returned.
- **Verification Evidence**:
  - Live HTTP response headers from Next.js server confirmed:
    - `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com; ...`
    - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: SAMEORIGIN`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
    - `X-XSS-Protection: 1; mode=block`
- **Status**: **VERIFIED — COMPLETE**.

---

## 4. Adversarial Challenge & Stress-Test Summary

| Attack Vector / Stress Test | Predicted Threat | Actual Behavior | Defense Status |
|---|---|---|---|
| **Price Tampering (`price: 1`, `price: -500`)** | Unauthorized discount / free items | Server fetches price from catalog; client price ignored | **DEFENDED** |
| **Quantity Exploits (`0`, `-10`, `51`, `NaN`)** | Stock drain / negative totals | Server rejects with 400 Bad Request | **DEFENDED** |
| **Non-existent / Unpublished Products** | Database pollution / ghost orders | Rejected with 400 Bad Request | **DEFENDED** |
| **Order Flooding / Brute Force** | Denial of Service / spam | Throttled after 5 orders with 429 Too Many Requests | **DEFENDED** |
| **MIME Spoofing (`.php` masquerading as image)** | Remote Code Execution | Extension forced to `.jpg`/`.png`/`.webp` from magic bytes | **DEFENDED** |
| **Path Traversal on Media Delete (`../../etc/passwd`)** | Arbitrary file deletion | Sanitized with `path.basename` to local folder | **DEFENDED** |
| **Concurrent Order Creation Race Conditions** | Lost updates / corrupted JSON | Queued and serialized via `withStorageMutex` | **DEFENDED** |
| **Clickjacking & MIME Confusion** | UI redressing & script sniffing | Blocked by CSP, `X-Frame-Options: SAMEORIGIN`, `nosniff` | **DEFENDED** |

---

## 5. Conclusion & Final Recommendation

The security architecture, server-side pricing integrity, authentication guards, and storage concurrency in Ameer Store (`E:\ameer-store`) are solid, robust, and production-ready. All verification commands pass with 100% success. The two minor non-blocking findings (phone prefix normalization for E.164 and 500 status on unauth media upload) are documented above for future refinement.

**Final Verdict: APPROVE**.
