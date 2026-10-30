# Ameer Store (أمير ستور) — Comprehensive Code Review & Quality Audit Report
**Reviewer**: Explorer 3 (Code Quality & UI Explorer)  
**Date**: October 30, 2026  
**Scope**: `E:\ameer-store`  
**Review Standards**: CodeRabbit-style professional code review, Next.js 15 / React 19 Best Practices, TypeScript Strictness, OWASP Client-Server Invariants, WAI-ARIA Accessibility, RTL Arabic Typography & Brand Constitution.

---

## 1. Executive Summary & Diagnostic Findings

### Automated Diagnostics Overview
| Diagnostic Tool | Command | Status | Output / Notes |
| :--- | :--- | :--- | :--- |
| **TypeScript Strict Check** | `tsc --noEmit` | **PASS (Code 0)** | Zero compilation errors under `"strict": true`. |
| **ESLint Check** | `next lint` | **PASS (Code 0) w/ Warning** | Zero ESLint errors or warnings. Notice: `next lint` is deprecated in Next.js 15/16; recommendation to migrate to native ESLint CLI flat config. |
| **Next.js Production Build** | `next build` | **PASS (Code 0)** | Compiled in 4.4s. 41 static/dynamic routes generated cleanly. |
| **Unit & Integration Suite** | `node scripts/run-tests.js` | **FAIL (Code 1)** | 16 Passed, **3 FAILED**. Test suite still asserts LKL agricultural rules (e.g. asserts that prices must NOT exist and categories must be `spray-motors`). |
| **Full Site Verification** | `node scripts/verify-all.js` | **FAIL (Code 1)** | Asserts LKL agricultural machinery, non-existent routes, and old phone numbers. |

### Summary of Systemic Issues
1. **Critical Price Tampering & Catalog Disconnect**: The cart checkout directly passes client prices to `/api/orders` without server-side verification against the database/catalog. Anyone can purchase high-end oud for 1 EGP. Furthermore, the Admin Products Manager completely lacks price input fields.
2. **Extensive Brand & Constitution Violation (LKL Agricultural Machinery Inversion)**: Multiple pages, components, reviews, specifications, and fallback numbers display agricultural machinery data (tractors, spray motors, diesel engines, Abu Hammad map, "01220792948"), violating Rule 1 (Strict Isolation) and Rule 2 (Zero Fabrication) of `AGENTS.md`.
3. **Hydration & State Synchronization Risks**: `cart-context.tsx` does not expose `isHydrated`, causing badge flickers; `ProductCatalogView` binds category filters to initial props in `useState` without re-synchronizing when URL query parameters change.
4. **Accessibility & Error Resilience Gaps**: Missing `app/global-error.tsx`, missing segment-level error boundaries, browser native `alert()`/`confirm()` usage, absence of ARIA error attributes on form inputs, and missing focus trap in modals.
5. **RTL Centering Bug**: GSAP hero glow uses `start-1/2 -translate-x-1/2` which translates 100% off-center horizontally in RTL layout.
6. **Color Token Deviation**: `brand.gold` in `tailwind.config.ts` is configured with bright cyan hex codes (`#56CFE1`) instead of metallic gold.

---

## 2. Issues Breakdown by Severity

---

### 🚨 Critical Severity (P0 / Critical)

#### 1. Server-Side Price Trust & Vulnerability in COD Order Creation
- **File**: `E:\ameer-store\src\lib\orders-store.ts` (Lines 26–36) & `src/app/api/orders/route.ts` (Lines 46–54)
- **Description**:
  When creating an order via `POST /api/orders`, the client sends `items: OrderItem[]` with `price` set on the client. In `createOrder()`, the subtotal is calculated as:
  ```ts
  const subtotal = input.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  ```
  The server does NOT verify the product IDs or calculate prices from the official product store (`INITIAL_PRODUCTS` or database). Any client or script can submit an order with `price: 1` for a luxury perfume priced at 3,850 EGP.
- **Impact**: Severe commercial vulnerability; fraudulent orders with manipulated totals will be written to disk/database and sent to fulfillment.
- **Refactoring Solution**:
  In `createOrder` (or inside `/api/orders/route.ts`), look up each item's actual price from `getProductsStore()` by its `id`. If an item does not exist or is not published, reject the order.
  ```ts
  // Secure server-side recalculation
  const officialProducts = getProductsStore();
  const verifiedItems: OrderItem[] = [];
  let calculatedSubtotal = 0;

  for (const clientItem of input.items) {
    const product = officialProducts.find((p) => p.id === clientItem.id && p.published);
    if (!product) {
      throw new Error(`المنتج "${clientItem.name}" غير متوفر حالياً.`);
    }
    const realPrice = product.price || 1200;
    const qty = Math.max(1, Math.floor(clientItem.quantity || 1));
    verifiedItems.push({
      id: product.id,
      name: product.name,
      model: product.model,
      price: realPrice,
      quantity: qty,
      image: product.images?.[0] || "/images/logo.png",
    });
    calculatedSubtotal += realPrice * qty;
  }
  const shippingCost = calculatedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const total = calculatedSubtotal + shippingCost;
  ```

#### 2. Products Manager Lacks Price Input Fields & Drops Pricing
- **File**: `E:\ameer-store\src\components\admin\products-manager.tsx` (Lines 38–49, 125–137, 168–179) & `src/app/api/admin/products/route.ts` (Lines 26–52)
- **Description**:
  The Admin Products Manager (`products-manager.tsx`) form does not contain any state, inputs, or payload properties for `price` or `compareAtPrice`. Furthermore, `POST /api/admin/products` explicitly omits `price` from the extracted fields:
  ```ts
  const { name, categoryId, categoryName, model, brand, shortDescription, description, specifications, featured } = body;
  ```
- **Impact**: Any product added or edited via the admin dashboard loses its pricing or is saved without a price, falling back to the hardcoded `1200 EGP` fallback in the shopping cart.
- **Refactoring Solution**:
  1. Add `formPrice` and `formCompareAtPrice` states to `ProductsManager`.
  2. Include numeric inputs for price and comparison price in the Add/Edit modals.
  3. Include `price: Number(formPrice)` and `compareAtPrice: formCompareAtPrice ? Number(formCompareAtPrice) : undefined` in the API requests and in `POST /api/admin/products`.

#### 3. Agricultural Equipment Specs Displayed on Perfume Product Pages
- **File**: `E:\ameer-store\src\components\products\product-specifications.tsx` (Lines 17–18, 53–56)
- **Description**:
  In `ProductSpecifications`, every perfume details page displays:
  - Header: `"البيانات والملامح الفنية للمعدة"` (Technical characteristics of the equipment).
  - Transparency Guarantee note:
    ```tsx
    <h4 className="font-extrabold">أمانة فنية وتوصية للمزارع</h4>
    <p className="text-emerald-800 leading-relaxed">
      التزاماً بمبدأ الأمانة وعدم ترويج أرقام نظرية غير دقيقة، نؤكد أن كفاءة السحب وتصريف المياه وضغط الرش تختلف ميدانياً بحسب عمق البئر، أقطار المواسير، ومسافة الأرض عن مصدر الري. فريقنا الفني بالزقازيق جاهز لحساب متطلبات أرضك وتحديد الموديل المناسب بالضبط قبل الشراء.
    </p>
    ```
- **Impact**: Extreme brand identity corruption; customers viewing high-end oud fragrances read agricultural water pump well-depth advisories.
- **Refactoring Solution**:
  Update `ProductSpecifications` to present perfume specifications (volume, concentration, olfactive pyramid, longevity, notes, and bottle material) with an authentic Haute Parfumerie guarantee note.

#### 4. Agricultural Equipment Fallback Graphic in Product Gallery
- **File**: `E:\ameer-store\src\components\products\product-gallery.tsx` (Lines 5, 30–35)
- **Description**:
  When a product image is loading or unavailable, `ProductGallery` imports and renders a large tractor icon (`Tractor` from `lucide-react`) with text:
  ```tsx
  <Tractor className="h-24 w-24 text-brand-green-700/40 mb-3" />
  <span className="text-sm font-bold text-brand-neutral-600">{productName}</span>
  <span className="text-xs text-brand-neutral-400 mt-1">صورة توضيحية للمعدّة</span>
  ```
- **Impact**: Visual and brand corruption on perfume product detail pages.
- **Refactoring Solution**:
  Replace `Tractor` with `Sparkles` or `Package` and change text to `"صورة توضيحية لزجاجة العطر"`.

#### 5. Agricultural Customer Reviews on Homepage & Review Modal
- **File**: `E:\ameer-store\src\data\reviews.ts` (Lines 16–96) & `src/components/common/reviews-section.tsx` (Lines 209–212, 271–282)
- **Description**:
  1. `INITIAL_REVIEWS` in `src/data/reviews.ts` contains 6 reviews exclusively about agricultural machinery ("موتور رش 450", "عزاقة زراعية 7 حصان", "طلمبة مياه 3 بوصة", "فلاتر قرصية لـ 15 فدان").
  2. When visitors click "شاركنا رأيك" on `ReviewsSection`, the modal displays:
     - `"شاركنا رأيك وتجربتك مع شركة لبيب كمال"`
     - `"رأيك يساعد إخوانك من المزارعين في اختيار المعدة المناسبة ويسهم في تطوير خدماتنا."`
     - Input field: `"المعدة التي اشتريتها أو قمت بصيانتها (اختياري) ... مثال: موتور رش 450، طلمبة مياه 3 بوصة، موتور ديزل"`.
- **Impact**: Direct violation of AGENTS.md Rule 1 (Strict Isolation) and Rule 2 (Zero Fabrication) on the home page.
- **Refactoring Solution**:
  1. Replace `INITIAL_REVIEWS` with verified customer testimonials regarding Ameer Store perfumes (longevity, authentic oud scent, gift packaging, prompt delivery across Egyptian governorates).
  2. In `reviews-section.tsx`, replace agricultural prompts with perfume fields (e.g., `"العطر أو دهن العود الذي جربته"`).

#### 6. Contact Page Embeds Agricultural Machinery Map & Phone Numbers
- **File**: `E:\ameer-store\src\components\common\store-location-map.tsx` (Lines 18–25, 86, 112, 124)
- **Description**:
  `StoreLocationMap` (rendered on `src/app/contact/page.tsx`) explicitly hardcodes:
  - `placeName = "شركة لبيب كمال للآلات الزراعية"`
  - `addressArabic = "طريق بنها - الزقازيق (طريق مصر الزراعي)، قرية الجديدة، مركز منيا القمح، محافظة الشرقية"`
  - `title="موقع شركة لبيب كمال لبيب على خرائط جوجل"`
  - `أرقام التواصل: 01220792948 / 01114587917`
  - Plus Code: `G9MM+VMW`
- **Impact**: Any customer visiting `/contact` of Ameer Store sees an agricultural equipment center in Minya al-Qamh, Sharqia, and calls non-Ameer store numbers.
- **Refactoring Solution**:
  Make `StoreLocationMap` configurable via `settings-store` and `env`, presenting Ameer Store's nationwide delivery coverage across all 27 governorates with preview-on-delivery guarantee instead of hardcoded agricultural workshop coordinates.

---

### ⚠️ High Severity (P1 / High)

#### 7. Missing Next.js Configuration File (`next.config.*`)
- **File**: `E:\ameer-store\` (Root directory)
- **Description**:
  There is no `next.config.js`, `next.config.mjs`, or `next.config.ts`. Next.js runs with defaults.
- **Impact**:
  - No Content Security Policy (CSP) headers configured at build time.
  - Image remote patterns cannot be added if remote CDNs are utilized.
  - `reactStrictMode` is not explicitly enforced.
  - Turbopack / webpack optimization flags cannot be fine-tuned.
- **Refactoring Solution**:
  Create `next.config.mjs`:
  ```js
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    images: {
      formats: ['image/avif', 'image/webp'],
    },
  };
  export default nextConfig;
  ```

#### 8. Category Filter Synchronization Bug in Product Catalog
- **File**: `E:\ameer-store\src\components\products\product-catalog-view.tsx` (Lines 26–36) & `src/app/products/page.tsx` (Lines 20–34)
- **Description**:
  `ProductCatalogView` initializes `selectedCategory` with `useState(initialCategorySlug)`. In React, when `initialCategorySlug` changes (e.g. user clicks from `/products?category=pure-oud-oils` to `/products?category=french-perfumes`), `useState` does not re-initialize. There is no `useEffect` or state synchronization to update `selectedCategory`.
- **Impact**: Navigating between categories via header/footer navigation while already on `/products` fails to update the filtered catalog.
- **Refactoring Solution**:
  Add prop synchronization:
  ```tsx
  useEffect(() => {
    setSelectedCategory(initialCategorySlug || "");
  }, [initialCategorySlug]);
  ```

#### 9. Missing Root Layout Error Boundary (`app/global-error.tsx`) & Sub-route Fallbacks
- **File**: `E:\ameer-store\src\app\error.tsx`
- **Description**:
  Next.js App Router specifies that `app/error.tsx` only catches errors in nested components, NOT inside `app/layout.tsx`. To catch errors thrown in root layout, `app/global-error.tsx` with `<html>` and `<body>` tags is mandatory.
  Furthermore, neither `/admin` nor `/products/[slug]` have localized `error.tsx` boundaries.
- **Impact**: Any runtime error in root layout (e.g. failure in `getSession()` or `getCustomSettings()`) results in an unhandled Next.js white-screen crash.
- **Refactoring Solution**:
  Create `src/app/global-error.tsx`:
  ```tsx
  "use client";
  export default function GlobalError({
    error,
    reset,
  }: {
    error: Error & { digest?: string };
    reset: () => void;
  }) {
    return (
      <html lang="ar" dir="rtl">
        <body className="flex min-h-screen items-center justify-center p-4 bg-[#EEEBE7] text-[#2E3A24]">
          <div className="max-w-md text-center space-y-4">
            <h2 className="text-xl font-bold">عذراً، حدث خطأ غير متوقع في النظام</h2>
            <p className="text-xs text-neutral-600">نواجه مشكلة فنية مؤقتة. يرجى إعادة المحاولة.</p>
            <button
              onClick={() => reset()}
              className="px-5 py-2.5 rounded-full bg-[#2E3A24] text-white text-xs font-bold"
            >
              إعادة المحاولة
            </button>
          </div>
        </body>
      </html>
    );
  }
  ```

#### 10. `useSearchParams()` Without `<Suspense>` in Login Page
- **File**: `E:\ameer-store\src\app\login\page.tsx` (Lines 11–15)
- **Description**:
  `LoginPage` calls `const searchParams = useSearchParams();` directly in the page component root without wrapping in a `<Suspense>` boundary.
- **Impact**:
  In Next.js App Router, using `useSearchParams()` without a `<Suspense>` boundary opts the entire page out of static optimization and can cause hydration bailouts in production.
- **Refactoring Solution**:
  Extract the form into a child component `LoginFormContent` and wrap it in `<Suspense fallback={<Skeleton ... />}>` inside `LoginPage`.

#### 11. Broken Open Graph Image (404) in SEO Metadata
- **File**: `E:\ameer-store\src\lib\seo.ts` (Line 7)
- **Description**:
  The default Open Graph image is configured as:
  ```ts
  image = "/images/og-lkl.png"
  ```
  However, `public/images/og-lkl.png` does not exist in `public/images/`. The actual logo available is `public/images/logo.png`.
- **Impact**: Sharing any link to Ameer Store on WhatsApp, Facebook, Twitter, or LinkedIn renders a broken/missing image preview.
- **Refactoring Solution**:
  Update default in `seo.ts` to `image = "/images/logo.png"`.

#### 12. Automated Test Suite Divergence & `npm test` Failure
- **File**: `E:\ameer-store\scripts\run-tests.js` (Lines 27–46, 207–212) & `scripts\verify-all.js`
- **Description**:
  `scripts/run-tests.js` and `scripts/verify-all.js` were directly copied from LKL and test against agricultural constraints. Specifically:
  - Test 1 asserts: `!catalogContent.includes('price:')` -> FAILS because Ameer Store has prices.
  - Test 2 asserts: `catalogContent.includes('spray-motors')` -> FAILS because categories are perfume categories.
  - Test 9 asserts: `envContent.includes('01220792948')` -> FAILS because Ameer Store uses 01220086002.
- **Impact**: Running `npm test` or automated CI/CD pipelines always fails with code 1.
- **Refactoring Solution**:
  Update test suites to assert Ameer Store's real perfume entities, 01220086002 phone number, perfume categories, and COD order creation logic.

---

### ⚡ Medium Severity (P2 / Medium)

#### 13. GSAP Hero Aura RTL Centering Transformation Bug
- **File**: `E:\ameer-store\src\components\motion\gsap-hero-showcase.tsx` (Line 70)
- **Description**:
  Line 70 sets:
  ```tsx
  className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full ..."
  ```
  In an RTL container (`dir="rtl"`), Tailwind compiles `start-1/2` to `inset-inline-start: 50%` (i.e. `right: 50%`). But CSS `transform: -translate-x-1/2` is `translateX(-50%)`, which translates towards the left (away from right: 50%). Consequently, the aura is shifted 100% off-center horizontally to the left side of the logo emblem.
- **Impact**: Visual flaw; the golden aura glow is displaced instead of centered directly behind the perfume emblem.
- **Refactoring Solution**:
  Use `left-1/2 -translate-x-1/2 -translate-y-1/2` (absolute physical coordinate) or `start-1/2 rtl:translate-x-1/2 -translate-y-1/2`.
  ```tsx
  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full ..."
  ```

#### 14. `brand.gold` Palette Configured with Cyan Hex Codes
- **File**: `E:\ameer-store\tailwind.config.ts` (Lines 56–68)
- **Description**:
  In `tailwind.config.ts`, the color scale `brand.gold` is defined as:
  ```ts
  gold: {
    ...
    400: "#56CFE1", // Bright Cyan
    500: "#2abed5",
    600: "#1c99b0",
    ...
  }
  ```
  This defines `brand-gold` as Cyan instead of Gold (`#D4AF37` / `#C5A059`), directly contradicting AGENTS.md ("Cashmere Surface, Royal Forest Olive, Burnished Gold, Midnight Charcoal").
- **Impact**: Buttons, icons, and badges meant to be Burnished Gold render as bright cyan.
- **Refactoring Solution**:
  Replace `brand.gold` with true luxury metallic gold palette:
  ```ts
  gold: {
    50: "#FAF7EE",
    100: "#F5EFD7",
    200: "#EBDDB0",
    300: "#DFC582",
    400: "#D4AF37", // Burnished Gold Primary
    500: "#C5A059",
    600: "#A8833B",
    700: "#876629",
    800: "#694E21",
    900: "#4D381A",
    950: "#2B1E0C",
  }
  ```

#### 15. Unused Dead Code Files with Foreign Branding
- **Files**:
  - `E:\ameer-store\src\components\common\interactive-equipment-advisor.tsx` (494 lines)
  - `E:\ameer-store\src\components\common\floating-whatsapp.tsx` (55 lines)
- **Description**:
  1. `interactive-equipment-advisor.tsx` is completely unreferenced across the codebase, contains agricultural matching rules (tractors, sprayers, diesel engines), and hardcodes `01220792948`.
  2. `floating-whatsapp.tsx` is unreferenced (the active component in `layout.tsx` is `whatsapp-button.tsx`), and contains LKL references and `01220792948`.
- **Impact**: Code bloat, confusion, and maintenance hazard.
- **Refactoring Solution**:
  Safely delete these two dead files from `src/components/common/`.

#### 16. Fallback Phone Numbers & Identity Remnants Across Pages
- **Files**:
  - `src/lib/settings-store.ts` (Lines 11–18)
  - `src/app/about/page.tsx` (Lines 16–17)
  - `src/app/contact/page.tsx` (Lines 28–30)
  - `src/components/common/faq-section.tsx` (Lines 43–44)
  - `src/components/common/contact-cta.tsx` (Line 7)
  - `src/components/admin/settings-manager.tsx` (Lines 54, 71, 78)
  - `src/app/account/page.tsx` (Lines 23, 183–197)
  - `src/components/account/customer-inquiries-client.tsx` (Line 157)
  - `src/components/admin/contact-requests-manager.tsx` (Line 156)
- **Description**:
  In each of the above files, fallback phone numbers default to `01220792948`, `01114587917`, or `201006540307`, or text references "شركة لبيب كمال", violating AGENTS.md Rule 2:
  `أرقام التواصل الرسمية المعتمدة فقط: الهاتف والواتساب +20 12 20086002 (01220086002).`
- **Impact**: High probability of customers reaching wrong phone numbers or seeing incorrect company branding.
- **Refactoring Solution**:
  Standardize all fallbacks in `settings-store.ts`, `env.ts`, and components to `"01220086002"` and remove all agricultural naming.

#### 17. User Account Page Omits Customer Orders
- **File**: `E:\ameer-store\src\app\account\page.tsx`
- **Description**:
  The customer account page displays customer inquiries (`CustomerInquiriesClient`), but does NOT display any customer orders placed through COD/checkout.
- **Impact**: A logged-in customer who orders perfumes cannot track their order status, delivery, or items in `/account`.
- **Refactoring Solution**:
  Query `getOrders()` matching the user's phone or email and display an "أحدث طلباتي" (My Orders) section with real-time status (`NEW`, `PROCESSING`, `SHIPPED`, `DELIVERED`).

#### 18. Native Browser `alert()` and `confirm()` Used in Production UI
- **Files**:
  - `src/components/cart/checkout-modal.tsx` (Lines 80, 130)
  - `src/components/admin/orders-manager.tsx` (Line 106)
  - `src/components/admin/media-manager.tsx` (Line 60)
  - `src/components/admin/reviews-manager.tsx` (Line 57)
  - `src/components/admin/contact-requests-manager.tsx` (Line 44)
- **Description**:
  Native browser `alert(...)` and `confirm(...)` dialogs are used for notifications and delete confirmations.
- **Impact**:
  - Blocks the single JavaScript thread.
  - Can be permanently disabled by users in modern browsers ("Prevent this page from creating additional dialogs").
  - Inconsistent with the bespoke luxury design system.
  - Inaccessible to screen readers and mobile webviews.
- **Refactoring Solution**:
  Use `Toast` or the existing `Modal` component for inline confirmations and error messages.

---

### ℹ️ Low Severity & Hygiene (P3 / Low)

#### 19. ESLint Deprecation Warning (`next lint`)
- **File**: `package.json` (Line 10) & `.eslintrc.json`
- **Description**:
  Running `npm run lint` displays:
  ```
  `next lint` is deprecated and will be removed in Next.js 16.
  For existing projects, migrate to the ESLint CLI:
  npx @next/codemod@canary next-lint-to-eslint-cli .
  ```
- **Impact**: Deprecation warning; will break upon upgrading to Next.js 16.
- **Refactoring Solution**:
  Migrate to flat config (`eslint.config.mjs`) or update script to run `eslint .`.

#### 20. Missing Focus Trap in Dialog Modals & Drawers
- **Files**: `src/components/ui/modal.tsx`, `src/components/cart/cart-drawer.tsx`, `src/components/layout/side-nav-drawer.tsx`
- **Description**:
  When modals or drawers are open, pressing the `Tab` key allows keyboard focus to escape the modal and navigate behind the backdrop.
- **Impact**: Minor accessibility violation for keyboard-only navigation.
- **Refactoring Solution**:
  Implement a focus-trap hook or trap focus between the first and last focusable elements inside the modal.

#### 21. Non-Unique or Special Character IDs in `Input` Component
- **File**: `src/components/ui/input.tsx` (Line 12)
- **Description**:
  ```ts
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  ```
  When labels contain Arabic characters or punctuation (e.g. `رقم الهاتف (للتواصل)`), slugifying by whitespace leaves parentheses in the HTML ID. If multiple inputs share a label, IDs collide.
- **Refactoring Solution**:
  Use React 19's native `React.useId()`:
  ```tsx
  const reactId = React.useId();
  const inputId = id || (label ? `${label.replace(/[^a-zA-Z0-9\u0621-\u064A]/g, "-")}-${reactId}` : reactId);
  ```

#### 22. Duplicate Links in `ProductCard`
- **File**: `src/components/products/product-card.tsx` (Lines 38, 84)
- **Description**:
  Both the image container and the product title are wrapped in separate `<Link href={...}>` elements pointing to the same slug without distinguishing `aria-label`s.
- **Impact**: Screen readers announce the same link twice sequentially.
- **Refactoring Solution**:
  Add `aria-hidden="true"` and `tabIndex={-1}` to the image link, or unify into a single accessible parent link.

---

## 3. Component Performance & Lifecycle Review

1. **Re-render Optimization**:
   - `ProductCatalogView`: Uses `useMemo` for filtering and sorting products cleanly, avoiding re-calculation on unrelated renders.
   - `CartDrawer` & `Header`: Re-render appropriately when `items` in `useCart` change.
   - `GsapHeroShowcase`: GSAP animations run inside `useGSAP` with `{ scope: containerRef }` and clean up their timelines on unmount, preventing memory leaks.
2. **Body Scroll Lock Cleanup**:
   - `SideNavDrawer` and `Modal` cleanly revert `document.body.style.overflow = "unset"` in their effect cleanup callbacks.

---

## 4. Accessibility (a11y) & Semantic HTML Compliance Matrix

| Criterion | Evaluation | Recommendation |
| :--- | :--- | :--- |
| **Semantic HTML** | **Good** | Standard elements used (`<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`, `<dl>`, `<dt>`, `<dd>`). |
| **RTL Direction** | **Good** | `dir="rtl"` and `lang="ar"` defined on `<html>`. |
| **Focus Visibility** | **Good** | Dedicated `:focus-visible` ring (`outline: 2px solid`) set in `globals.css` and `button.tsx`. |
| **Image Alt Tags** | **Needs Improvement** | Several fallback images default to "صورة معدة زراعية" or empty strings. |
| **ARIA Role & Modals** | **Needs Improvement** | Modals have `role="dialog"` but lack `aria-labelledby` binding and focus trap. |
| **Form Error States** | **Needs Improvement** | Inputs do not link errors to `aria-invalid` or `aria-describedby`. |
| **Color Contrast** | **Needs Verification** | Metallic gold text over light surface requires high-contrast fallbacks (`#A8833B`). |

---

## 5. Prioritized Remediation Roadmap

1. **Phase 1: Security & Commercial Integrity**
   - Implement server-side price calculation and product validation in `/api/orders`.
   - Add price and compareAtPrice fields to `ProductsManager` and `/api/admin/products`.
2. **Phase 2: Brand Identity & Constitution Alignment**
   - Cleanse all agricultural remnants from `ProductSpecifications`, `ProductGallery`, `ReviewsSection`, `StoreLocationMap`, `AboutPage`, `ContactPage`, `AccountPage`, and admin managers.
   - Standardize all fallback contact numbers to `01220086002`.
   - Delete dead files `interactive-equipment-advisor.tsx` and `floating-whatsapp.tsx`.
3. **Phase 3: Next.js & Build System Normalization**
   - Add `next.config.mjs` with production headers.
   - Add `src/app/global-error.tsx` and sub-route error fallbacks.
   - Wrap `LoginPage` searchParams in `<Suspense>`.
   - Update `brand.gold` palette in `tailwind.config.ts`.
   - Fix GSAP aura RTL horizontal translation.
   - Update `scripts/run-tests.js` to test Ameer Store perfume catalog and order flow.
