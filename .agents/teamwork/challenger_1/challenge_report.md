# Adversarial Security & Pricing Challenge Report (`challenge_report.md`)
**Challenger**: Challenger 1 (Adversarial Security & Pricing Challenger)  
**Target**: Ameer Store (`E:\ameer-store`)  
**Date**: 2026-10-30  
**Verdict**: **REQUEST_CHANGES** ⚠️

---

## Challenge Summary

**Overall risk assessment**: **HIGH**

While Ameer Store demonstrates excellent, highly robust defenses in **authoritative server-side pricing**, **sliding-window rate limiting**, and **storage mutex concurrency**, empirical adversarial stress-testing identified **three notable bugs and edge cases** in input validation, type coercion, and phone normalization that bypass intended constraints or block legitimate customer checkouts.

1. **Fractional & Coerced Quantities Accepted (HIGH)**: Sending fractional quantities (e.g. `quantity: 1.5`), booleans (`quantity: true`), or arrays (`quantity: [1]`) is not rejected with HTTP 400. Instead, `Math.floor(Number(item.quantity))` silently floored/coerced the input into an integer and generated a genuine order with HTTP 200.
2. **International Egyptian Phone Number Rejection (HIGH)**: Phone numbers entered in international notation (`+2010...`, `002010...`, or `2010...`) are stripped of their country prefix to 10 digits (`10...`), which fails the subsequent 11-digit regex requiring a leading `0`. Legitimate customers using autofill are erroneously blocked with HTTP 400. (Previously identified as an escalation item in `TEST_READY.md`, but left unpatched in `src/app/api/orders/route.ts`).
3. **Incomplete XSS Tag Sanitization (MEDIUM)**: The sanitization regex `replace(/<[^>]*>?/gm, "")` only strips HTML markup delimiters (`<...>` and `</...>`), but preserves the inner executable JavaScript body. Submitting `<script>alert("XSS")</script>محمد أحمد` persists `alert("XSS")محمد أحمد`. Crucially, submitting `<script>alert(1)</script>` alone strips the tags to produce `alert(1)` (8 characters), which passes the 3-100 character name length check and persists an order with customer name `"alert(1)"`.

---

## Confirmed Vulnerabilities & Failure Modes

### 1. [High] Quantity Type Coercion & Silent Floored Purchases

- **Assumption Challenged**: All non-integer, fractional, or non-numeric quantities are rejected with HTTP 400.
- **Empirical Attack**:
  - Sent `POST /api/orders` with `items: [{ id: "prod-1", quantity: 1.5 }]`.
  - Sent `POST /api/orders` with `items: [{ id: "prod-1", quantity: true }]`.
  - Sent `POST /api/orders` with `items: [{ id: "prod-1", quantity: [1] }]`.
- **Actual Behavior**: The server responded with **HTTP 200 OK** and created orders with `quantity: 1` and `total: 3850`!
- **Root Cause**: In `src/lib/orders-store.ts` line 95:
  ```typescript
  const qty = Math.floor(Number(item.quantity));
  if (!Number.isInteger(qty) || qty < 1 || qty > 50) {
    throw new Error(`الكمية المطلوبة للمنتج (${product.name}) يجب أن تكون عدداً صحيحاً بين 1 و 50 قطعة.`);
  }
  ```
  `Math.floor` guarantees `qty` is an integer before `Number.isInteger(qty)` is evaluated, concealing the fractional nature of the input.
- **Blast Radius**: Clients can submit fractional or coerced quantities, causing discrepancies between client UI intentions and server-created orders.
- **Mitigation**:
  Validate that `item.quantity` is strictly a number and an integer *before* any transformation:
  ```typescript
  if (typeof item.quantity !== "number" || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 50) {
    throw new Error(`الكمية المطلوبة للمنتج (${product.name}) يجب أن تكون عدداً صحيحاً بين 1 و 50 قطعة.`);
  }
  const qty = item.quantity;
  ```

---

### 2. [High] International Egyptian Phone Number Rejection

- **Assumption Challenged**: All valid Egyptian phone number formats, including standard international notation, are normalized and accepted.
- **Empirical Attack**:
  - Sent `POST /api/orders` with `phone: "+201012345678"`.
  - Sent `POST /api/orders` with `phone: "00201012345678"`.
- **Actual Behavior**: The server rejected the requests with **HTTP 400 Bad Request**: `"يرجى كتابة رقم هاتف مصري صالح (11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015)."`.
- **Root Cause**: In `src/app/api/orders/route.ts` lines 43-53:
  ```typescript
  function normalizeEgyptianPhone(raw: string): string {
    let clean = raw.replace(/[\s\-()]/g, "").trim();
    if (clean.startsWith("+20")) {
      clean = clean.slice(3);
    } else if (clean.startsWith("0020")) {
      clean = clean.slice(4);
    } else if (clean.startsWith("20") && clean.length === 12) {
      clean = clean.slice(2);
    }
    return clean;
  }
  ```
  Stripping `+20` produces `1012345678` (10 digits). The regex `EGYPTIAN_PHONE_REGEX` (`/^(010|011|012|015)[0-9]{8}$/`) requires 11 digits starting with `0`. The missing `0` causes rejection.
- **Blast Radius**: High customer checkout drop-off for mobile users using browser autofill or WhatsApp contact cards formatted with international dialing codes.
- **Mitigation**:
  Prepend `'0'` when clean phone is 10 digits starting with `10`, `11`, `12`, or `15`:
  ```typescript
  function normalizeEgyptianPhone(raw: string): string {
    let clean = raw.replace(/[\s\-()]/g, "").trim();
    if (clean.startsWith("+20")) {
      clean = clean.slice(3);
    } else if (clean.startsWith("0020")) {
      clean = clean.slice(4);
    } else if (clean.startsWith("20") && clean.length === 12) {
      clean = clean.slice(2);
    }
    if (/^(10|11|12|15)[0-9]{8}$/.test(clean)) {
      clean = "0" + clean;
    }
    return clean;
  }
  ```

---

### 3. [Medium] Naive HTML Tag Stripping Preserves Script Body

- **Assumption Challenged**: Input sanitization neutralizes script payloads and strips malicious executable tags.
- **Empirical Attack**:
  - Sent `customerName: '<script>alert("XSS")</script>محمد أحمد'`.
  - Sent `customerName: '<script>alert(1)</script>'`.
- **Actual Behavior**:
  - The first payload was stored as `alert("XSS")محمد أحمد`.
  - The second payload had its tags stripped to `alert(1)`, which met the minimum 3-character threshold and was stored as valid name `alert(1)`.
- **Root Cause**: In `src/app/api/orders/route.ts` lines 38-41:
  ```typescript
  function sanitizeText(str: unknown): string {
    if (typeof str !== "string") return "";
    return str.replace(/<[^>]*>?/gm, "").trim();
  }
  ```
  `replace(/<[^>]*>?/gm, "")` removes `<script>` and `</script>` tags, leaving the script body intact.
- **Blast Radius**: Storing script bodies in the database leads to corrupt customer records, and creates secondary injection risks if exported to CSV or displayed in non-escaped contexts.
- **Mitigation**:
  Remove `<script>...</script>` blocks entirely, or reject strings containing `<script`:
  ```typescript
  function sanitizeText(str: unknown): string {
    if (typeof str !== "string") return "";
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<[^>]*>?/gm, "")
      .trim();
  }
  ```

---

## Stress Test Results

| # | Attack Scenario | Expected Behavior | Actual Behavior | Result |
|---|---|---|---|---|
| 1 | Client sends `price: 0` for `prod-1` (3850 EGP) | Ignored; price resolved from catalog (3850 EGP) | Price resolved to 3850 EGP, total 3850 EGP | **PASS** |
| 2 | Client sends `price: 1` for `prod-1` | Ignored; price resolved from catalog (3850 EGP) | Price resolved to 3850 EGP, total 3850 EGP | **PASS** |
| 3 | Client sends `price: -1000` for `prod-1` | Ignored; subtotal 3850 EGP | Price resolved to 3850 EGP, total 3850 EGP | **PASS** |
| 4 | Client sends `price: 0.001` for `prod-1` | Ignored; subtotal 3850 EGP | Price resolved to 3850 EGP, total 3850 EGP | **PASS** |
| 5 | Client sends `price: "free"` for `prod-1` | Ignored; subtotal 3850 EGP | Price resolved to 3850 EGP, total 3850 EGP | **PASS** |
| 6 | Client omits `price` field in payload | Resolved from catalog (3850 EGP) | Resolved to 3850 EGP, subtotal 7700 EGP (qty 2) | **PASS** |
| 7 | Client sends negative quantity (`quantity: -5`) | Rejected with HTTP 400 | HTTP 400 (validation error) | **PASS** |
| 8 | Client sends fractional quantity (`quantity: 1.5`) | Rejected with HTTP 400 | HTTP 200 (silently floored to 1) | ❌ **FAIL** |
| 9 | Client sends fractional quantity (`quantity: 0.5`) | Rejected with HTTP 400 | HTTP 400 (floored to 0 < 1) | **PASS** |
| 10 | Client sends zero quantity (`quantity: 0`) | Rejected with HTTP 400 | HTTP 400 (validation error) | **PASS** |
| 11 | Client sends huge quantity (`quantity: 999999`) | Rejected with HTTP 400 | HTTP 400 (exceeds limit 50) | **PASS** |
| 12 | Client sends string quantity (`quantity: "not-a-number"`) | Rejected with HTTP 400 | HTTP 400 (NaN validation error) | **PASS** |
| 13 | Client sends `quantity: null` | Rejected with HTTP 400 | HTTP 400 (null coerced to 0 < 1) | **PASS** |
| 14 | Client sends `quantity: true` (boolean) | Rejected with HTTP 400 | HTTP 200 (coerced to 1, order created) | ❌ **FAIL** |
| 15 | Client sends `quantity: [1]` (array) | Rejected with HTTP 400 | HTTP 200 (coerced to 1, order created) | ❌ **FAIL** |
| 16 | Client sends non-existent product ID (`prod-fake-999`) | Rejected with HTTP 400 | HTTP 400 (product not found) | **PASS** |
| 17 | Client sends >20 distinct items in single order | Rejected with HTTP 400 | HTTP 400 (limit exceeded) | **PASS** |
| 18 | Client sends `<script>alert("XSS")</script>محمد أحمد` | Script tags and content sanitized | Script body preserved (`alert("XSS")محمد أحمد`) | ❌ **FAIL** |
| 19 | Client sends `<script>alert(1)</script>` as name | Rejected with HTTP 400 (empty stripped) | HTTP 200 (persisted as name `alert(1)`) | ❌ **FAIL** |
| 20 | Client sends `<img src=x onerror=alert(1)>` in address | Image tag stripped cleanly | Stripped cleanly to valid address | **PASS** |
| 21 | Client sends `customerName` >100 characters | Rejected with HTTP 400 | HTTP 400 (length error) | **PASS** |
| 22 | Client sends `address` >250 characters | Rejected with HTTP 400 | HTTP 400 (length error) | **PASS** |
| 23 | Client sends `notes` >500 characters | Truncated safely to 500 characters | Truncated to 500 characters | **PASS** |
| 24 | Client sends phone with invalid prefix (`01312345678`) | Rejected with HTTP 400 | HTTP 400 (regex failure) | **PASS** |
| 25 | Client sends phone with letters (`0101234567a`) | Rejected with HTTP 400 | HTTP 400 (regex failure) | **PASS** |
| 26 | Client sends international phone (`+201012345678`) | Normalized to `01012345678` and accepted | HTTP 400 (missing leading `0`) | ❌ **FAIL** |
| 27 | Client sends fake governorate (`Paris`, `Tokyo`, `<script>`) | Rejected with HTTP 400 | HTTP 400 (whitelist rejection) | **PASS** |
| 28 | Rapid burst requests from single IP (>5 requests) | Throttled with HTTP 429 | Throttled on 6th and 7th requests (429) | **PASS** |
| 29 | 20 simultaneous concurrent order creations via `Promise.all` | All 20 succeed atomically without corruption | 20/20 succeeded, JSON valid, zero duplicate IDs | **PASS** |
| 30 | Anonymous request to `GET /api/orders` | Rejected with HTTP 403 | HTTP 403 Forbidden | **PASS** |
| 31 | Forged session token to `GET /api/orders` | Rejected with HTTP 403 | HTTP 403 Forbidden | **PASS** |
| 32 | Unauthorized status update `PATCH /api/orders` | Rejected with HTTP 403 | HTTP 403 Forbidden | **PASS** |
| 33 | Unauthorized product creation `POST /api/admin/products` | Rejected with HTTP 403 | HTTP 403 Forbidden | **PASS** |

---

## Unchallenged Areas

- **OAuth 2.0 Token Exchange with Google Live Servers**: Requires active external Google Client Secrets and interactive browser redirect flow; verified offline HMAC-SHA256 session token mechanics and admin role assignment.
- **Neon Postgres Remote Fallback**: Remote cloud connection was not reachable offline; local atomic storage engine verified with full concurrency stress test.
