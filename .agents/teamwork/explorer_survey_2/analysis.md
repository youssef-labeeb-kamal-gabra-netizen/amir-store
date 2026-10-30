# Ameer Store — Business Logic, Cart Architecture & Checkout Security Analysis

**Auditor:** Explorer 2 (State & Flow Explorer)  
**Date:** 2026-10-30  
**Target:** `E:\ameer-store`  
**Classification:** Confidential Security & Code Review Report  

---

## 1. Executive Summary

A comprehensive investigation was conducted into the business logic, state management, cart architecture, and checkout flows (Cash on Delivery / COD and WhatsApp direct ordering) of Ameer Store (متجر أمير ستور للعطور والعود الفاخر).

The examination revealed several **critical security vulnerabilities and architectural design flaws**, most notably:
1. **Client-Side Price Tampering (Critical)**: The server (`/api/orders` and `orders-store.ts`) calculates totals directly from client-supplied item prices without validating against the authoritative product catalog.
2. **Arbitrary / Negative Item Injection (Critical)**: The server accepts non-existent product IDs, draft/unpublished products, and arbitrary quantities (including negative quantities, zero, float, or NaN), allowing malicious customers to set arbitrary subtotal and total values.
3. **Desynchronized Dual Checkout Flow (Critical)**: Placing an order via WhatsApp from the cart drawer does not persist an order to the database, generates no order ID, does not clear the cart, and provides no audit trail for the store owner.
4. **Hydration Crash Vulnerability (High)**: Corrupted or tampered `localStorage` cart data causes unhandled client-side runtime crashes (`TypeError: items.reduce is not a function`).
5. **Deceptive Shipping Fee Calculation (High)**: Checkout UI displays subtotal as total, only adding the 50 EGP standard shipping fee after order submission, creating price discrepancy and customer friction.
6. **No Rate Limiting & Weak Input Validation (High)**: Anyone can spam `/api/orders` without phone regex validation, HTML tag stripping, or rate limits.

---

## 2. Findings by Severity

### Critical Severity

#### [SEC-01] [CRITICAL] Client-Side Price Tampering in Order Submission Flow
- **Affected Files:**
  - `src/app/api/orders/route.ts` (lines 46–55)
  - `src/lib/orders-store.ts` (lines 33–36, 46)
  - `src/components/cart/checkout-modal.tsx` (lines 96–104)
- **Description:**
  When a customer submits a COD order via `CheckoutModal`, the client maps cart items and explicitly passes their `price` in the JSON request payload:
  ```typescript
  // checkout-modal.tsx:96-103
  items: items.map((i) => ({
    id: i.id,
    name: i.name,
    model: i.model,
    price: i.price,
    quantity: i.quantity,
    image: i.image,
  }))
  ```
  In `src/app/api/orders/route.ts`:
  ```typescript
  // route.ts:46-54
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
  In `src/lib/orders-store.ts`:
  ```typescript
  // orders-store.ts:33-35
  const subtotal = input.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const total = subtotal + shippingCost;
  ```
  The server **never** looks up the product in `products-store.ts` or `catalog.ts`. It takes `item.price` straight from the client payload.
- **Exploitation Impact:**
  An attacker can intercept the request or execute `fetch('/api/orders', { method: 'POST', body: JSON.stringify({ ... items: [{ id: 'prod-1', name: 'دهن عود كمبودي ملكي', price: 1, quantity: 10 }] }) })`.
  The authentic price of `prod-1` is 3,850 EGP. The server records the subtotal as `10 EGP` + 50 EGP shipping = `60 EGP` total for 10 bottles of royal oud! In the admin dashboard, the merchant sees a valid order requesting 60 EGP upon delivery instead of 38,500 EGP.
- **Recommended Remediation:**
  The server must **never** trust client-provided `price`. It should only receive `{ id: string, quantity: number }` from the client, look up each product from `getPublishedProducts()`, fetch the authoritative catalog price, compute subtotal and shipping cost authoritatively on the server, and populate the stored item name, image, and price from catalog data.

---

#### [SEC-02] [CRITICAL] Negative Quantities, Float Rounding, Non-Existent Products & Arbitrary Items
- **Affected Files:**
  - `src/app/api/orders/route.ts` (lines 39–44)
  - `src/lib/orders-store.ts` (lines 33, 46)
- **Description:**
  `/api/orders` checks only that `items` is an array and not empty:
  ```typescript
  if (!items || !Array.isArray(items) || items.length === 0) { ... }
  ```
  It does **not** validate the items within the array:
  1. `item.quantity` can be negative (e.g. `-5`). When multiplied by `item.price`, it subtracts from `subtotal`, allowing a customer to offset real items and purchase products for negative or zero amounts.
  2. `item.quantity` can be `0`, `0.5`, `NaN`, or `Infinity`. `NaN` propagates into `subtotal` and `total`, serializing into `null` in JSON.
  3. `item.id` is never verified against the product catalog. Fake or arbitrary product IDs are stored in the database.
  4. Unpublished or disabled products (`published === false`) can still be ordered if the user sends their ID.
- **Exploitation Impact:**
  Financial theft, order database corruption, negative revenue calculations, and inventory tracking failure.
- **Recommended Remediation:**
  Add strict schema validation for every item:
  - Verify `typeof item.id === "string"`.
  - Lookup product in catalog: ensure product exists and `product.published === true`.
  - Enforce `Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 50`.
  - Reject unknown or negative fields.

---

#### [SEC-03] [CRITICAL] Desynchronized WhatsApp Order Placement (Untracked Orders & Lost Business Data)
- **Affected Files:**
  - `src/components/cart/cart-drawer.tsx` (lines 44–61, 280–289)
  - `src/types/order.ts` (line 28)
- **Description:**
  Ameer Store features a dual checkout model: Cash on Delivery (COD) and WhatsApp direct ordering.
  However, in `CartDrawer`:
  ```tsx
  {/* cart-drawer.tsx:280-288 */}
  <a
    href={generateWhatsAppOrderUrl()}
    target="_blank"
    rel="noopener noreferrer"
    className="..."
  >
    <MessageCircle className="h-4 w-4" />
    <span>طلب فوري عبر محادثة واتساب</span>
  </a>
  ```
  Clicking this button merely opens a formatted `wa.me` URL in a new tab:
  - **No order is recorded in `/api/orders` or `orders.json`**.
  - **No unique Order ID (`AMR-XXXXXX`) is generated**.
  - **The cart is not cleared**, leading to duplicate ordering or confusion.
  - The admin dashboard has zero visibility into customer intent or lost WhatsApp conversions.
  - In `types/order.ts:28`, `paymentMethod` is typed as `"COD" | "WHATSAPP"`, but `"WHATSAPP"` is never saved from the cart drawer!
- **Recommended Remediation:**
  When clicking WhatsApp order in `CartDrawer` or `CheckoutModal`:
  1. Either require customer contact info or create a pending order with `paymentMethod: "WHATSAPP"` and status `"NEW"` via `/api/orders`.
  2. Generate the authoritative `AMR-XXXXXX` Order ID.
  3. Include the Order ID in the WhatsApp message text (`كود الطلب: AMR-XXXXXX`).
  4. Clear the cart upon order registration.

---

### High Severity

#### [BZ-01] [HIGH] Unvalidated `localStorage` Hydration Causing Client App Crash
- **Affected Files:**
  - `src/lib/cart-context.tsx` (lines 38–49, 110–112)
- **Description:**
  In `CartProvider`:
  ```typescript
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Fallback
    }
    setIsHydrated(true);
  }, []);
  ```
  `JSON.parse(stored)` is assigned directly to `items` without validating that it is an array.
  If a user has invalid JSON or an object/string in `localStorage` (e.g. from script error, manual edit, or conflicting version):
  ```typescript
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  ```
  Calling `items.reduce` throws `TypeError: items.reduce is not a function`, which unmounts the React component tree and crashes the entire website for that user.
- **Recommended Remediation:**
  Validate the parsed object with `Array.isArray(parsed)` and validate that every element has valid properties (`id`, `name`, `price > 0`, `quantity > 0`). If invalid, clear `localStorage` and reset to `[]`.

---

#### [BZ-02] [HIGH] Deceptive / Inconsistent Shipping Fee Between Checkout Modal and Server
- **Affected Files:**
  - `src/components/cart/cart-drawer.tsx` (lines 253–265)
  - `src/components/cart/checkout-modal.tsx` (lines 235–240)
  - `src/lib/orders-store.ts` (lines 5–6, 33–36)
- **Description:**
  In `cart-drawer.tsx`:
  - Free shipping threshold is `1000 EGP`.
  - Under 1000 EGP, shipping says "يحسب عند التسليم" (calculated upon delivery), and "الإجمالي التقريبي" only shows `subtotal`.
  In `checkout-modal.tsx`:
  - Mini summary displays: `الإجمالي: {subtotal.toLocaleString("ar-EG")} ج.م`.
  - It **does not display the 50 EGP shipping cost**!
  In `orders-store.ts`:
  - When submitted, the server calculates:
    `const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;` (50 EGP)
    `const total = subtotal + shippingCost;`
  In `checkout-modal.tsx` (post-submission success screen):
  - Suddenly displays `المبلغ المطلوب عند الاستلام: {orderSuccess.total}` (which includes +50 EGP).
- **User Impact:**
  A customer whose cart is 850 EGP sees "الإجمالي: 850 ج.م" right above the submit button. Once they click submit, the confirmation announces they must pay 900 EGP! This violates transparent pricing principles and causes customer disputes with delivery couriers.
- **Recommended Remediation:**
  Display explicit shipping fee (+50 EGP if `< 1000 EGP`, or مجاني if `>= 1000 EGP`) directly in the `CheckoutModal` summary before the user clicks "تأكيد الطلب", so the pre-submission total exactly matches the post-submission total.

---

#### [BZ-03] [HIGH] Missing Input Sanitization & Unconstrained Customer Details in `/api/orders`
- **Affected Files:**
  - `src/app/api/orders/route.ts` (lines 10–38)
  - `src/lib/orders-store.ts` (lines 41–45)
- **Description:**
  Validation in `/api/orders` is superficial:
  1. `phone`: only checks `typeof phone === "string" && phone.trim().length >= 8`. Any string (e.g. `"abcdefgh"`, `"--------"`) is accepted.
  2. `governorate`: only checks `typeof governorate === "string"`. It does not validate against the 27 official Egyptian governorates.
  3. `customerName`, `address`, `notes`: No maximum string length check (e.g. 100KB payload allowed) and no HTML tag stripping.
  4. Stored directly in `orders.json` and rendered in admin panels and WhatsApp links.
- **Recommended Remediation:**
  Adopt the rigorous validation pattern already established in `src/app/api/contact/route.ts`:
  - Test phone against Egyptian mobile/landline regex (`/^(?:(?:\+?200?|0)?(?:1[0125]\d{8}|[2-9]\d{7,8}))$/`).
  - Validate governorate against `EGYPT_GOVERNORATES` whitelist.
  - Strip HTML tags (`replace(/<[^>]*>?/gm, "").trim()`) and enforce sensible max lengths (e.g. name <= 100, address <= 300, notes <= 500).

---

#### [BZ-04] [HIGH] Missing Order Status Enum Validation on `PATCH /api/orders`
- **Affected Files:**
  - `src/app/api/orders/route.ts` (lines 83–105)
  - `src/lib/orders-store.ts` (lines 66–81)
- **Description:**
  `PATCH /api/orders` receives `{ id, status }`.
  It only checks `if (!id || !status)`.
  It does **not** check whether `status` is a member of `OrderStatus` (`"NEW" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"`).
  An arbitrary string (e.g. `status: "FOOBAR"` or `<script>...`) will be written to `orders.json`.
- **Recommended Remediation:**
  Add whitelist check:
  ```typescript
  const VALID_STATUSES: OrderStatus[] = ["NEW", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ ok: false, message: "حالة الطلب غير صالحة." }, { status: 400 });
  }
  ```

---

#### [SEC-04] [HIGH] Lack of Rate Limiting on Order Placement Endpoint
- **Affected Files:**
  - `src/app/api/orders/route.ts` (line 5)
- **Description:**
  Unlike `src/app/api/contact/route.ts` which implements IP-based rate limiting (max 5 requests per 10 minutes), `/api/orders` has **no rate limit**. A malicious user or bot can send thousands of `POST /api/orders` requests per minute, creating enormous files in `data/storage/orders.json`, spamming the merchant, and exhausting disk/memory resources.
- **Recommended Remediation:**
  Apply the IP rate-limiting utility to `/api/orders` (e.g. max 5 orders per 10 minutes per IP).

---

### Medium Severity

#### [BZ-05] [MEDIUM] Hardcoded Arbitrary Fallback Price (1200 EGP) Across Components
- **Affected Files:**
  - `src/lib/cart-context.tsx` (lines 65, 77)
  - `src/components/products/product-purchase-actions.tsx` (line 17)
  - `src/components/products/product-card.tsx` (line 19)
- **Description:**
  In multiple places, the code uses:
  `const price = product.price || 1200;`
  `types/product.ts` declares `price?: number` as optional, leading components to invent a fallback of 1,200 EGP.
  If a product is added without a price, it defaults to 1,200 EGP. If a product's price is 0, it also becomes 1,200 EGP.
- **Recommended Remediation:**
  Ensure `price` is mandatory on `Product` in `types/product.ts`, or throw an error if a product lacks a valid price rather than silently substituting 1200 EGP.

---

#### [BZ-06] [MEDIUM] Potential Order ID Collisions from Weak Random Generation
- **Affected Files:**
  - `src/lib/orders-store.ts` (lines 30–31)
- **Description:**
  `orderNumber` is generated as:
  `const orderNumber = Math.floor(100000 + Math.random() * 900000);`
  `const id = "AMR-" + orderNumber;`
  There are only 900,000 potential values. Due to the Birthday Paradox, collisions begin occurring after a few thousand orders. Furthermore, there is no check `orders.some(o => o.id === id)` before assigning the ID.
- **Recommended Remediation:**
  Loop to ensure the generated ID does not exist in `orders`, or use a timestamp + random suffix e.g. `AMR-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`.

---

#### [BZ-07] [MEDIUM] Fragmented and Inconsistent WhatsApp Number Resolution Across 8+ Files
- **Affected Files:**
  - `src/components/cart/cart-drawer.tsx` (lines 40–42)
  - `src/components/cart/checkout-modal.tsx` (lines 73–75)
  - `src/components/products/product-purchase-actions.tsx` (lines 24–26)
  - `src/components/products/product-card.tsx` (lines 26–28)
  - `src/components/layout/header.tsx` (lines 50–52)
  - `src/components/layout/mobile-action-bar.tsx` (lines 16–18)
  - `src/components/admin/orders-manager.tsx` (lines 113–114)
  - `src/lib/settings-store.ts` (lines 11–15)
- **Description:**
  The phone cleaning logic `cleanWhatsApp.replace(/[^0-9]/g, "")` and conditional country code prefix `cleanWhatsApp.startsWith("0") ? "2" + cleanWhatsApp : cleanWhatsApp` is duplicated verbatim in at least 8 distinct files.
  Worse, `cart-drawer.tsx` and `checkout-modal.tsx` ignore dynamic settings from `settings-store.ts` and only look at `env.business.whatsapp`.
  If an admin updates the store WhatsApp number in `admin/settings`, the header updates, but the cart drawer and checkout modal still point to the old number!
- **Recommended Remediation:**
  Extract a single shared utility in `src/lib/phone.ts` or `src/lib/whatsapp.ts`:
  `export function formatWhatsAppUrl(phoneNumber: string, messageText: string): string`
  And ensure all components use the unified business settings.

---

#### [BZ-08] [MEDIUM] Stale Cart Prices Not Re-synchronized With Updated Catalog
- **Affected Files:**
  - `src/lib/cart-context.tsx` (lines 38–60)
- **Description:**
  Cart items in `localStorage` store a snapshot of the price at the moment of `addItem()`. If an admin changes a perfume price from 1,650 to 1,900 EGP, returning customers will keep the 1,650 EGP price in their cart forever. Because the server does not re-validate prices (Finding SEC-01), the old price is honoured.
- **Recommended Remediation:**
  When the cart is hydrated, or when checkout is initiated, query an endpoint or re-verify against latest catalog prices.

---

#### [BZ-09] [MEDIUM] Absence of Customer Order History in Account View
- **Affected Files:**
  - `src/app/account/page.tsx` (lines 36, 172)
  - `src/components/account/customer-inquiries-client.tsx`
- **Description:**
  Logged-in customers who place orders have no place in `/account` to see their past orders, shipping status, or tracking numbers. The account page only displays `contact-requests` (inquiries).
- **Recommended Remediation:**
  Add an "Orders" tab or section to `/account` so customers can view orders associated with their verified email or phone number.

---

### Low Severity

#### [BZ-10] [LOW] Dead Code `getOrderById` in `orders-store.ts`
- **Affected Files:**
  - `src/lib/orders-store.ts` (lines 18–21)
- **Description:**
  `getOrderById(id: string): Order | null` is declared and exported, but never invoked anywhere in the codebase.
- **Recommended Remediation:**
  Expose it via a public or authenticated tracking route (`/api/orders/[id]` or `/orders/track`) so customers can look up order status by order ID.

---

#### [BZ-11] [LOW] Remnants of Old LKL Project Copy and Settings in Account Page and Store Defaults
- **Affected Files:**
  - `src/app/account/page.tsx` (lines 23, 183–197)
  - `src/lib/settings-store.ts` (lines 11–18)
  - `src/app/admin/layout.tsx` (line 8)
- **Description:**
  - `src/app/account/page.tsx` title is `"حسابي الخاص | شركة لبيب كمال للأدوات والآلات الزراعية"` and contains copy asking if the user needs consultations about "الآلات وقطع الغيار" with a hardcoded WhatsApp link `https://wa.me/201006540307`.
  - `src/lib/settings-store.ts` defaults contain `lkl.machinery`, Benha/Zagazig agricultural roads, and old phone numbers.
  - `src/app/admin/layout.tsx` title is `"لوحة تحكم الإدارة | شركة لبيب كمال"`.
- **Recommended Remediation:**
  Replace all residual agricultural machinery strings, titles, and WhatsApp numbers with Ameer Store perfume brand copy and official contact details.

---

#### [BZ-12] [LOW] Lack of Purge/Delete Mechanism for Spam Orders in Admin Panel
- **Affected Files:**
  - `src/app/api/orders/route.ts` (lines 83–111)
  - `src/components/admin/orders-manager.tsx` (lines 91–110)
- **Description:**
  The admin panel only permits updating status to `"CANCELLED"`. There is no `DELETE` method to prune spam, test, or fraudulent orders.
- **Recommended Remediation:**
  Add a secure `DELETE /api/orders` route guarded by `requireAdmin()`.

---

## 3. Comprehensive Summary Table

| ID | Title | Severity | Impacted Files | Remediation Summary |
|---|---|---|---|---|
| **SEC-01** | Client-Side Price Tampering in Order Submission | **CRITICAL** | `orders/route.ts`, `orders-store.ts`, `checkout-modal.tsx` | Re-verify and compute all prices and totals strictly on the server against catalog. |
| **SEC-02** | Negative Quantities, Float Rounding & Fake Product IDs | **CRITICAL** | `orders/route.ts`, `orders-store.ts` | Enforce positive integer quantities (1–50) and catalog existence checks. |
| **SEC-03** | WhatsApp Order Placement Desynchronized & Untracked | **CRITICAL** | `cart-drawer.tsx`, `checkout-modal.tsx`, `types/order.ts` | Register WhatsApp orders with Order ID in `/api/orders` and clear cart. |
| **BZ-01** | Unvalidated `localStorage` Hydration Causing Client App Crash | **HIGH** | `cart-context.tsx` | Validate `Array.isArray` and item schema on hydration. |
| **BZ-02** | Deceptive Shipping Fee Display Between Modal & Server | **HIGH** | `checkout-modal.tsx`, `cart-drawer.tsx`, `orders-store.ts` | Display +50 EGP shipping transparently in modal before submit. |
| **BZ-03** | Missing Input Sanitization & Unconstrained Customer Details | **HIGH** | `orders/route.ts`, `orders-store.ts` | Regex phone check, governorate whitelist, tag stripping, length bounds. |
| **BZ-04** | Missing Status Enum Validation on `PATCH /api/orders` | **HIGH** | `orders/route.ts` | Whitelist valid `OrderStatus` enum values. |
| **SEC-04** | Lack of Rate Limiting on Order Creation Endpoint | **HIGH** | `orders/route.ts` | Add IP-based rate limiting (5 req / 10 min). |
| **BZ-05** | Hardcoded Arbitrary Fallback Price (1200 EGP) | **MEDIUM** | `cart-context.tsx`, `product-purchase-actions.tsx`, `product-card.tsx` | Enforce mandatory product prices; eliminate arbitrary fallback. |
| **BZ-06** | Potential Order ID Collisions from Weak Random Generation | **MEDIUM** | `orders-store.ts` | Add collision checking or timestamp entropy to order ID generation. |
| **BZ-07** | Fragmented WhatsApp Number & URL Formatting Across 8+ Files | **MEDIUM** | `cart-drawer.tsx`, `checkout-modal.tsx`, `header.tsx`, etc. | Unify into single `formatWhatsAppUrl` utility with dynamic settings. |
| **BZ-08** | Stale Cart Prices in Local Storage | **MEDIUM** | `cart-context.tsx` | Re-synchronize cart prices against catalog upon load/checkout. |
| **BZ-09** | Absence of Customer Order History in Account View | **MEDIUM** | `app/account/page.tsx` | Expose customer orders in account area. |
| **BZ-10** | Dead Code `getOrderById` | **LOW** | `orders-store.ts` | Connect to order tracking route or clean up. |
| **BZ-11** | Remnants of Old LKL Project Copy and Defaults | **LOW** | `account/page.tsx`, `settings-store.ts`, `admin/layout.tsx` | Update all strings to Ameer Store luxury perfume brand. |
| **BZ-12** | Lack of Purge/Delete Mechanism for Spam Orders | **LOW** | `orders/route.ts`, `orders-manager.tsx` | Add admin-only `DELETE /api/orders` endpoint. |

---

## 4. Proposed Fix Architecture & Code Snippets

### A. Authoritative Server Calculation in `createOrder` (`src/lib/orders-store.ts`)
```typescript
import { getProductsStore } from "@/lib/products-store";
import { ApplicationError } from "@/lib/error";

export function createOrder(input: CreateOrderInput): Order {
  const catalog = getProductsStore();
  const catalogMap = new Map(catalog.map((p) => [p.id, p]));

  // Re-verify every item against authoritative catalog
  const verifiedItems = input.items.map((item) => {
    const product = catalogMap.get(item.id);
    if (!product || !product.published) {
      throw new Error(`المنتج المطلوب (${item.name || item.id}) غير متوفر حالياً.`);
    }
    const authoritativePrice = product.price;
    if (typeof authoritativePrice !== "number" || authoritativePrice <= 0) {
      throw new Error(`سعر المنتج (${product.name}) غير محدد بدقة.`);
    }
    const qty = Math.floor(item.quantity);
    if (!Number.isInteger(qty) || qty <= 0 || qty > 50) {
      throw new Error("الكمية المطلوبة لكل منتج يجب أن تكون بين 1 و 50 قطعة.");
    }
    return {
      id: product.id,
      name: product.name,
      model: product.model || item.model || "الحجم القياسي",
      price: authoritativePrice,
      quantity: qty,
      image: product.images?.[0] || item.image || "/images/logo.png",
    };
  });

  const subtotal = verifiedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const total = subtotal + shippingCost;
  ...
```

### B. Safe Hydration in `src/lib/cart-context.tsx`
```typescript
useEffect(() => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const sanitized = parsed.filter(
          (item) =>
            item &&
            typeof item.id === "string" &&
            typeof item.name === "string" &&
            typeof item.price === "number" &&
            item.price > 0 &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        );
        setItems(sanitized);
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY);
  }
  setIsHydrated(true);
}, []);
```
