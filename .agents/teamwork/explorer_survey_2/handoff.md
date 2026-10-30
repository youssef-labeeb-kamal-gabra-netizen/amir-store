# Handoff Report — Explorer 2 (State & Flow Explorer)

**Target:** `E:\ameer-store`  
**Working Directory:** `E:\ameer-store\.agents\teamwork\explorer_survey_2\`  
**Date:** 2026-10-30  
**Recipient:** Orchestrator (`dbe60015-7af9-4298-a52b-536f980ce583`)  
**Status:** Hard Handoff (Investigation Complete)  

---

## 1. Observation

Direct code observations from files examined in `E:\ameer-store`:

### Obs 1: Client Provides Price & Server Trusts It Blindly
- **File:** `src/components/cart/checkout-modal.tsx` (lines 96–103)
  ```typescript
  items: items.map((i) => ({
    id: i.id,
    name: i.name,
    model: i.model,
    price: i.price,
    quantity: i.quantity,
    image: i.image,
  }))
  ```
- **File:** `src/app/api/orders/route.ts` (lines 46–54)
  ```typescript
  const order = createOrder({
    customerName,
    phone,
    governorate,
    address,
    notes,
    items,
    paymentMethod: paymentMethod || "COD",
  });
  ```
- **File:** `src/lib/orders-store.ts` (lines 33–36, 46)
  ```typescript
  const subtotal = input.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const total = subtotal + shippingCost;
  ...
  items: input.items,
  ```
  Neither `/api/orders` nor `orders-store.ts` queries `products-store.ts` or `catalog.ts`.

### Obs 2: Unvalidated Items Array, Quantities, and Non-Existent Products
- **File:** `src/app/api/orders/route.ts` (lines 39–44)
  ```typescript
  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { ok: false, message: "سلة المشتريات فارغة! يرجى إضافة عطور للسلة أولاً." },
      { status: 400 }
    );
  }
  ```
  There is zero iteration, type checking, or numerical range validation over individual elements of `items`. Negative integers (e.g. `-5`), fractions, `NaN`, or strings pass through without rejection.

### Obs 3: WhatsApp Cart Order Does Not Persist in Database
- **File:** `src/components/cart/cart-drawer.tsx` (lines 280–288)
  ```tsx
  <a
    href={generateWhatsAppOrderUrl()}
    target="_blank"
    rel="noopener noreferrer"
    className="w-full py-3 px-4 rounded-full bg-[#25D366]..."
  >
    <MessageCircle className="h-4 w-4" />
    <span>طلب فوري عبر محادثة واتساب</span>
  </a>
  ```
  `generateWhatsAppOrderUrl()` (lines 44–61) constructs a `wa.me` URL. No `fetch` call is made to `/api/orders`, no Order ID is created, no entry is written to `orders.json`, and `clearCart()` is not invoked.

### Obs 4: Unvalidated LocalStorage Hydration Leading to Application Crash
- **File:** `src/lib/cart-context.tsx` (lines 41–44, 110)
  ```typescript
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  if (stored) {
    setItems(JSON.parse(stored));
  }
  ...
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  ```
  If `localStorage.getItem("amir_store_cart_v1")` returns an object or primitive (not an array), `JSON.parse` returns a non-array, and `items.reduce` throws an uncaught `TypeError: items.reduce is not a function`, crashing the React runtime.

### Obs 5: Shipping Fee Pre-Submission Omission (Deceptive Pricing)
- **File:** `src/components/cart/checkout-modal.tsx` (lines 235–240)
  ```tsx
  <div className="p-3.5 rounded-2xl bg-brand-green-50/70 ...">
    <span>عدد المنتجات ({items.reduce((s, i) => s + i.quantity, 0)})</span>
    <span className="text-sm text-brand-green-950">
      الإجمالي: {subtotal.toLocaleString("ar-EG")} ج.م
    </span>
  </div>
  ```
  The pre-submission form shows `subtotal` as "الإجمالي".
  Then in `orders-store.ts:34`, if `subtotal < 1000`, `STANDARD_SHIPPING_COST = 50` is added.
  In `checkout-modal.tsx:207`, post-submission displays:
  `المبلغ المطلوب عند الاستلام: {orderSuccess.total}` (`subtotal + 50`), creating a 50 EGP price discrepancy.

### Obs 6: Superficial Customer Validation & Missing Rate Limiting
- **File:** `src/app/api/orders/route.ts` (lines 18–23, 25–30)
  ```typescript
  if (!phone || typeof phone !== "string" || phone.trim().length < 8) { ... }
  if (!governorate || typeof governorate !== "string") { ... }
  ```
  Phone check only requires length >= 8 (e.g. `"abcdefgh"` passes).
  Governorate is not checked against the 27 Egyptian governorates.
  There is no IP-based rate limiting on `POST /api/orders` (unlike `contact/route.ts` which has `checkRateLimit(ip)`).

### Obs 7: Missing Status Whitelist in Order Status Updates
- **File:** `src/app/api/orders/route.ts` (lines 89–94)
  ```typescript
  const { id, status } = body;
  if (!id || !status) { ... }
  const updated = updateOrderStatus(id, status);
  ```
  Any arbitrary string for `status` is accepted and permanently saved in storage.

---

## 2. Logic Chain

1. **Premise 1 (from Obs 1):** The client transmits `{ id, name, model, price, quantity, image }`, and `orders-store.ts` computes `subtotal` via `sum + (item.price * item.quantity)` without catalog consultation.
   - *Inference:* Any user can forge HTTP requests with `price: 1` or `price: 0.01` to order high-value perfumes (e.g. 3,850 EGP) for negligible sums. This is a high-impact financial vulnerability (SEC-01).

2. **Premise 2 (from Obs 2):** `/api/orders` does not check item quantity bounds or existence.
   - *Inference:* Negative quantities (e.g. `-5`) can be supplied to reduce subtotal, and zero, fractional, or NaN quantities corrupt data integrity and financial metrics (SEC-02).

3. **Premise 3 (from Obs 3):** Clicking WhatsApp order in the cart drawer bypasses the server API entirely.
   - *Inference:* The store management has no record or analytics of WhatsApp conversions, orders cannot be tracked, and the cart remains full, undermining the COD/WhatsApp dual flow (SEC-03).

4. **Premise 4 (from Obs 4):** `localStorage` content is passed straight to `setItems` without `Array.isArray` verification.
   - *Inference:* Any corrupt or unexpected `localStorage` state causes an unhandled exception at `items.reduce`, resulting in a white screen / crash for the user (BZ-01).

5. **Premise 5 (from Obs 5):** `CheckoutModal` displays subtotal as total, but the server adds 50 EGP shipping cost if under 1000 EGP.
   - *Inference:* The final amount shown to the customer jumps by 50 EGP after submission, violating transparent checkout standards and causing courier delivery disputes (BZ-02).

6. **Premise 6 (from Obs 6 & 7):** Phone numbers, governorates, and order statuses are not validated against strict formats or enum whitelists, and no rate limiting protects `/api/orders`.
   - *Inference:* The system is vulnerable to automated order flooding (DoS) and data pollution in the admin dashboard (BZ-03, BZ-04, SEC-04).

---

## 3. Caveats

- **Catalog Storage Model:** Products are currently stored in `data/storage/products.json` with fallback to `src/data/catalog.ts`. The server-side pricing fix must query `getProductsStore()` (or `getPublishedProducts()`) so both custom admin products and initial catalog products are supported.
- **Inventory & Stock:** The current `Product` schema in `types/product.ts` does not contain an `inventoryCount` or `inStock` field (only `published: boolean`). Therefore, out-of-stock validation is bounded by `product.published === true`.
- **Payment Gateways:** Ameer Store currently operates exclusively on Cash on Delivery (COD) and WhatsApp direct messaging. No external card/credit payment gateways (such as Paymob, Stripe, or Fawry) are integrated.

---

## 4. Conclusion

The Ameer Store checkout and cart architecture contains **3 Critical, 5 High, 5 Medium, and 3 Low** security vulnerabilities and business logic defects. 
The most urgent fixes required for production readiness are:
1. **Enforcing Server-Side Authoritative Pricing:** Make the server look up products in `getProductsStore()`, take only `{ id, quantity }` from the client, compute prices/totals server-side, and reject non-existent or unpublished products.
2. **Strict Item and Input Validation:** Enforce positive integer quantities (`1 <= quantity <= 50`), Egyptian phone regex check, governorate whitelist, tag sanitization, and `OrderStatus` enum check.
3. **Synchronizing WhatsApp Flow:** Persist WhatsApp orders in `/api/orders` with `paymentMethod: "WHATSAPP"`, generate an authoritative Order ID, and clear the cart.
4. **Defensive Cart Hydration:** Validate `Array.isArray` and item schema on `localStorage` mount.
5. **Transparent Shipping Display:** Show the +50 EGP shipping cost in the checkout modal summary prior to order placement.

---

## 5. Verification Method

To independently verify these findings:

1. **Verify Client-Side Price Tampering (SEC-01):**
   Execute a simulated POST request against `/api/orders`:
   ```bash
   curl -X POST http://localhost:3000/api/orders \
     -H "Content-Type: application/json" \
     -d "{\"customerName\":\"Tester\",\"phone\":\"01012345678\",\"governorate\":\"القاهرة\",\"address\":\"شارع التحرير\",\"items\":[{\"id\":\"prod-1\",\"name\":\"دهن عود كمبودي\",\"price\":1,\"quantity\":1}]}"
   ```
   **Expected finding:** Returns HTTP 200 with `order.total: 51`, proving the server uses the submitted `1 EGP` price rather than catalog price `3850 EGP`.

2. **Verify Negative Quantity Vulnerability (SEC-02):**
   ```bash
   curl -X POST http://localhost:3000/api/orders \
     -H "Content-Type: application/json" \
     -d "{\"customerName\":\"Tester\",\"phone\":\"01012345678\",\"governorate\":\"القاهرة\",\"address\":\"شارع التحرير\",\"items\":[{\"id\":\"fake\",\"name\":\"Test\",\"price\":1000,\"quantity\":-5}]}"
   ```
   **Expected finding:** Returns HTTP 200 with `subtotal: -5000` and `total: -4950`.

3. **Verify LocalStorage Hydration Crash (BZ-01):**
   Open the browser console on `http://localhost:3000`:
   ```javascript
   localStorage.setItem("amir_store_cart_v1", "{\"bad\":\"data\"}");
   location.reload();
   ```
   **Expected finding:** Uncaught `TypeError: items.reduce is not a function` in `src/lib/cart-context.tsx:110`.

4. **Verify Build & Lint Baseline:**
   ```powershell
   npm run build
   npx tsc --noEmit
   ```
