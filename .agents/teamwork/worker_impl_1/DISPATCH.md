## 2026-10-30T13:40:43Z
[Message] timestamp=2026-10-30T13:40:43Z sender=dbe60015-7af9-4298-a52b-536f980ce583 priority=MESSAGE_PRIORITY_HIGH content=You are Worker 1 (Security & Order Integrity Worker).
Your Working Directory: E:\ameer-store\.agents\teamwork\worker_impl_1\
Your Parent Orchestrator ID: dbe60015-7af9-4298-a52b-536f980ce583

MANDATORY FIRST STEP:
Read E:\ameer-store\.agents\teamwork\ORIGINAL_REQUEST.md and E:\ameer-store\.agents\teamwork\orchestrator\PROJECT.md before doing any work. Also review explorer findings at:
- `E:\ameer-store\.agents\teamwork\explorer_survey_1\analysis.md`
- `E:\ameer-store\.agents\teamwork\explorer_survey_2\analysis.md`

STRICT PROJECT BOUNDARY:
Operate strictly within E:\ameer-store. DO NOT touch, inspect, or modify anything in E:\WEB or any external directory.

WRITE OWNERSHIP:
You exclusively own and may edit:
- `src/lib/env.ts`
- `src/lib/rate-limiter.ts`
- `src/app/api/admin/media/route.ts`
- `src/lib/storage.ts`
- `next.config.mjs`
- `src/app/api/orders/route.ts`
- `src/lib/orders-store.ts`
- `src/components/cart/checkout-modal.tsx`
- `src/lib/cart-context.tsx`
- `src/components/cart/cart-drawer.tsx`
Do NOT edit any files in `scripts/` (owned by Test Writer).

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

OBJECTIVE:
Implement Milestone 1 (Security Architecture, Secrets & Rate Limiting) and Milestone 2 (Order Integrity, Server-Side Authoritative Pricing & Dual Checkout Flow) in Ameer Store.

TASKS TO IMPLEMENT:
1. `src/lib/env.ts`:
   - Enforce `validateProductionSecurity()` on boot. If in production (`NODE_ENV === "production"`), throw a clear fatal error if `AUTH_SECRET` is unset or insecure. Remove insecure fallback string in production.
2. `src/lib/rate-limiter.ts`:
   - Fix sliding-window calculation logic for API routes so rate limiting works reliably throughout the entire window (maintain independent API window/counter).
   - Sanitize `getClientIp`: do not blindly trust raw `X-Forwarded-For`.
3. `src/app/api/admin/media/route.ts`:
   - Derive destination file extension strictly from validated magic byte MIME types (`.jpg`, `.png`, `.webp`), never from user-supplied `file.name`.
4. `src/lib/storage.ts`:
   - Add serialized async write queue / mutex lock per file path to prevent concurrent lost updates during high traffic.
5. `next.config.mjs`:
   - Create Next.js configuration with comprehensive HTTP security headers (CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy).
6. `src/app/api/orders/route.ts` & `src/lib/orders-store.ts`:
   - Authoritative Server Pricing: Look up products in `getProductsStore()`. Compute subtotal = sum(product.price * quantity) and shipping cost (subtotal >= 1000 ? 0 : 50). Do NOT trust client `price`.
   - Item Validation: Validate that items array is non-empty, every item has an existing, published product ID, and quantity is a positive integer between 1 and 50.
   - Customer Validation: Validate customerName (3-100 chars), Egyptian phone regex (`/^(010|011|012|015)[0-9]{8}$/`), governorate is one of the 27 Egyptian governorates, address (5-250 chars). Sanitize text against HTML/XSS.
   - Rate limit order creation by IP.
   - Whitelist status strings in `PATCH /api/orders` (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`).
7. `src/components/cart/cart-drawer.tsx`:
   - Synchronize WhatsApp Checkout: When user clicks "طلب فوري عبر واتساب", call `POST /api/orders` with `paymentMethod: "WHATSAPP"` to create an authoritative order record in the database, obtain the Order ID, clear the cart, and open WhatsApp with the formatted order message containing the official Order ID.
8. `src/components/cart/checkout-modal.tsx`:
   - Transparent Pricing: Display the shipping cost (50 EGP or Free) and the final grand total in the summary pre-submission, so it matches the server's authoritative calculation exactly.
9. `src/lib/cart-context.tsx`:
   - Safe LocalStorage Hydration: Check `Array.isArray(parsed)` and validate item schema before `setItems`. Handle corrupt localStorage gracefully without crashing.

VERIFICATION REQUIREMENTS:
Run:
- `npm run typecheck` (`tsc --noEmit`) -> Must exit 0 with 0 errors.
- `npm run lint` -> Must exit 0 with 0 errors.
- `npm run build` -> Must exit 0 and compile all pages successfully.

OUTPUT REQUIREMENTS:
- Update `progress.md` in your directory.
- Write `handoff.md` with Observation, Logic Chain, Caveats, Conclusion, and Verification results.
- Send completion message to parent orchestrator via `send_message`.
