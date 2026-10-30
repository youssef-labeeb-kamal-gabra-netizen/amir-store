# Handoff Report: Security & API Architecture Audit

**Agent:** Explorer 1 (Security & API Explorer)  
**Working Directory:** `E:\ameer-store\.agents\teamwork\explorer_survey_1`  
**Target Project:** Ameer Store (`E:\ameer-store`)  
**Parent Orchestrator:** `dbe60015-7af9-4298-a52b-536f980ce583`  
**Handoff Type:** Hard (Audit Complete)  

---

## 1. Observation

Direct observations and evidence collected during the audit:

1. **Unvalidated Client-Side Pricing in Order Endpoint:**
   - File: `E:\ameer-store\src\app\api\orders\route.ts`, lines 8, 39, 46-55:
     ```typescript
     const { customerName, phone, governorate, address, notes, items, paymentMethod } = body;
     ...
     const order = createOrder({
       customerName, phone, governorate, address, notes, items,
       paymentMethod: paymentMethod || "COD",
     });
     ```
   - File: `E:\ameer-store\src\lib\orders-store.ts`, line 33:
     ```typescript
     const subtotal = input.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
     const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
     const total = subtotal + shippingCost;
     ```
   - The server accepts `item.price` as submitted by the client without looking up or verifying `item.id` against `getProductsStore()`.

2. **Hardcoded Fallback Auth Secret in Production:**
   - File: `E:\ameer-store\src\lib\env.ts`, lines 9-16:
     ```typescript
     const FALLBACK_PRODUCTION_SECRET = "lkl-store-sha256-auth-secret-production-persistent-key-9823419082341";
     function getRuntimeAuthSecret(): string {
       if (process.env.AUTH_SECRET && process.env.AUTH_SECRET.trim().length >= 32) {
         return process.env.AUTH_SECRET.trim();
       }
       return FALLBACK_PRODUCTION_SECRET;
     }
     ```
   - Search across `E:\ameer-store\src` for `validateProductionSecurity` returned exactly 1 match (definition in `env.ts`). It is never invoked.

3. **Logic Flaw in Sliding-Window API Rate Limiting:**
   - File: `E:\ameer-store\src\lib\rate-limiter.ts`, lines 173-186:
     ```typescript
     if (isApiRoute && record.count > SECURITY_CONFIG.API_MAX_REQUESTS && (record.resetTime - now) > (SECURITY_CONFIG.GLOBAL_WINDOW_MS - SECURITY_CONFIG.API_WINDOW_MS)) {
       if (record.count > SECURITY_CONFIG.API_MAX_REQUESTS * 3) {
         ...
       }
     }
     ```
   - `GLOBAL_WINDOW_MS - API_WINDOW_MS = 15m - 1m = 14m`. The condition is only true when `record.resetTime - now > 14 minutes`, which occurs solely during the first 60 seconds of a 15-minute global cycle.

4. **Rate Limit Bypass via `X-Forwarded-For` Spoofing:**
   - File: `E:\ameer-store\src\lib\rate-limiter.ts`, lines 74-79:
     ```typescript
     export function getClientIp(headers: Headers): string {
       const forwarded = headers.get("x-forwarded-for");
       if (forwarded) {
         const first = forwarded.split(",")[0].trim();
         if (first) return first;
       }
     ```
   - Any client sending `x-forwarded-for: <random_ip>` receives an isolated rate-limiting record.

5. **Arbitrary File Extension in Media Upload:**
   - File: `E:\ameer-store\src\app\api\admin\media\route.ts`, lines 158-164:
     ```typescript
     const ext = path.extname(file.name).toLowerCase() || ".jpg";
     const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
     const uniqueName = `${Date.now()}-${baseName}${ext}`;
     const destinationPath = path.join(UPLOADS_DIR, uniqueName);
     fs.writeFileSync(destinationPath, buffer);
     ```
   - File extension is taken from `file.name` without restriction, allowing `.html` or `.svg` to be written to `public/uploads/`.

6. **Race Conditions in Storage Stores:**
   - Store modules (`orders-store.ts`, `products-store.ts`, etc.) execute:
     `const data = readStorageFile(); ...; writeStorageFile(FILE, data);`
     without a mutual exclusion lock or queue.

7. **Automated Verification Status:**
   - Command `cd E:\ameer-store; npm.cmd run typecheck` returned exit code 0 (`tsc --noEmit` passed).
   - Command `cd E:\ameer-store; npm.cmd run lint` returned exit code 0 (zero ESLint errors).
   - Command `cd E:\ameer-store; npm.cmd run build` returned exit code 0 (`Compiled successfully`, 41/41 static pages generated).
   - Command `cd E:\ameer-store; node scripts/run-tests.js` returned exit code 1 with 3 failures due to obsolete agricultural LKL assertions.

---

## 2. Logic Chain

1. **Order Creation & Financial Integrity:**
   - Observation 1 demonstrates that `POST /api/orders` blindly accepts `price` from `request.json()` and calls `createOrder`.
   - `createOrder` multiplies the user-supplied `item.price` by `item.quantity` to calculate `subtotal` and `total`.
   - Because the server never reads the price from `src/data/catalog.ts` or `src/lib/products-store.ts`, any client with basic HTTP tooling (or manipulated cart state) can place confirmed luxury perfume orders at 0 or 1 EGP.
   - **Conclusion:** Server-side price resolution is missing, posing a critical vulnerability to store finances.

2. **Authentication Security & Secret Management:**
   - Observation 2 demonstrates that `getRuntimeAuthSecret()` falls back to a known hardcoded string `FALLBACK_PRODUCTION_SECRET` if `process.env.AUTH_SECRET` is unset.
   - Because `validateProductionSecurity()` is not invoked during application boot, a production server running without `AUTH_SECRET` will use the hardcoded secret.
   - Because session tokens are signed using HMAC-SHA256 with this secret, any external party possessing the source code can craft valid session cookies with `role: "ADMIN"`.
   - **Conclusion:** Production enforcement must be mandatory and fail-fast at boot time.

3. **Rate Limiting & Traffic Protection:**
   - Observation 3 shows the time calculation error in `checkRateLimit`, restricting API rate limiting to minute 1 of 15.
   - Observation 4 shows `getClientIp` trust of raw client headers.
   - Combining these two observations reveals that API endpoints (and contact forms) have effectively zero reliable rate-limiting protection against automated bots.
   - **Conclusion:** Rate limiting must be redesigned with dedicated sliding windows and trusted proxy header resolution.

4. **File Upload Security:**
   - Observation 5 shows that while file binary content is checked for image magic bytes, the file extension is taken from `file.name`.
   - A valid PNG file can carry an `.html` extension. Once stored in `public/uploads/` and served statically by Next.js, opening that URL in a browser renders the HTML/JavaScript under the store's domain.
   - **Conclusion:** File extensions must be derived solely from validated magic byte MIME types.

---

## 3. Caveats

1. **Database Mode vs. Local Storage:**
   - The application supports both atomic JSON file storage (`data/storage/*.json`) and PostgreSQL (`@neondatabase/serverless`).
   - The current audit specifically inspected the active default file storage engine. If a live PostgreSQL database is connected via `POSTGRES_URL`, race conditions in `storage.ts` are mitigated for tables using SQL transactions, but `orders` and `products` are currently only persisted to JSON file stores (only `contact_requests` has DDL in `db.ts`).
2. **Third-Party Infrastructure Assumptions:**
   - Google OAuth credentials (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) require external configuration in Google Cloud Console with exact redirect URI matching.
3. **Alternative Interpretations:**
   - Hardcoded admin email `"yousseflabeeb256@gmail.com"` was likely placed during prototyping for developer convenience; however, security best practices require moving it entirely to environment variables.

---

## 4. Conclusion & Recommended Fix Strategy

Ameer Store has a strong foundation (Next.js App Router, strict TypeScript, HMAC-SHA256 signed sessions, clean component hierarchy, zero build errors), but requires hardening before release.

### Recommended Fix Priorities for Implementation Agents:

1. **Phase 1: Critical Server-Side Business Logic & Secrets (Immediate)**
   - Update `POST /api/orders` to fetch products from `getProductsStore()`, validate existence and published state, enforce server prices, and reject price discrepancies.
   - Call `validateProductionSecurity()` in `src/lib/env.ts` during initialization; throw an error if `AUTH_SECRET` is missing in production.
   - Add schema validation for items in `POST /api/orders` (valid positive integer quantity 1-50, valid product IDs).

2. **Phase 2: Rate Limiting & Upload Security (High)**
   - Fix sliding-window calculation in `src/lib/rate-limiter.ts` to maintain an independent `apiCount` and `apiResetTime`.
   - Secure `getClientIp` against untrusted `X-Forwarded-For` spoofing.
   - In `POST /api/admin/media`, derive file extensions strictly from validated magic byte MIME types (`.jpg`, `.png`, `.webp`) and ignore client-supplied extensions.
   - Add endpoint rate limiting to `POST /api/orders` and `POST /api/reviews`.

3. **Phase 3: Storage Concurrency & Sanitization (Medium)**
   - Add an asynchronous mutex or sequential write queue in `src/lib/storage.ts` to serialize disk writes per storage file.
   - Add a Content-Security-Policy (CSP) header in `src/middleware.ts`.
   - Sanitize and whitelist payload keys in `PUT /api/admin/content` and `PUT /api/admin/settings`.

4. **Phase 4: Cleanup & Test Suite Modernization (Low)**
   - Update `scripts/run-tests.js` and `scripts/verify-all.js` to assert Ameer Store perfume catalog structure, prices, and phone numbers.
   - Replace residual LKL copy in `src/lib/content-store.ts`, `src/lib/settings-store.ts`, and page titles with Ameer Store luxury perfume text.

---

## 5. Verification Method

To independently verify the audit findings:

1. **Verify Price Tampering Vulnerability:**
   - Inspect `E:\ameer-store\src\app\api\orders\route.ts` lines 8-55.
   - Observe that `createOrder` receives `items` directly from `request.json()` with zero price cross-referencing.

2. **Verify Hardcoded Secret Vulnerability:**
   - Inspect `E:\ameer-store\src\lib\env.ts` lines 9-16.
   - Run grep search for `validateProductionSecurity` to confirm it is not invoked.

3. **Verify Rate Limiter Logic Error:**
   - Inspect `E:\ameer-store\src\lib\rate-limiter.ts` line 173.
   - Calculate `SECURITY_CONFIG.GLOBAL_WINDOW_MS - SECURITY_CONFIG.API_WINDOW_MS = 14 minutes`.
   - Confirm that any request arriving when `resetTime - now <= 14 minutes` skips the check.

4. **Verify Legacy Test Suite Status:**
   - Run command: `cd E:\ameer-store; node scripts/run-tests.js`
   - Observe 3 failures relating to missing prices, wrong category names, and old phone numbers.

5. **Verify TypeScript & Production Build:**
   - Run command: `cd E:\ameer-store; npm.cmd run typecheck` (Expected: 0 errors).
   - Run command: `cd E:\ameer-store; npm.cmd run build` (Expected: Successful build, 41/41 pages).
