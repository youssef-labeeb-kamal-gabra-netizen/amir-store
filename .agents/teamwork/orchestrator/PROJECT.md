# Project: Ameer Store Hardening & Security Audit

## Architecture
- **Framework**: Next.js 15 (App Router) with TypeScript Strict Mode, Tailwind CSS, and Lucide React.
- **Backend**: Next.js Server Route Handlers (`src/app/api/`) with JSON file-based persistence (`data/storage/*.json`) and optional Neon Postgres (`src/lib/db.ts`).
- **Authentication**: HMAC-SHA256 signed session cookies (`src/lib/auth.ts`) with Google OAuth 2.0 flow and server-side role authorization (`ADMIN`).
- **Store Front**: Arabic-first luxury perfume e-commerce interface with RTL support, dual checkout flow (Cash on Delivery + WhatsApp Instant Ordering), and Admin Dashboard.

## Feature Inventory
| # | Feature / Issue | Description | Milestone | Source |
|---|-----------------|-------------|-----------|--------|
| 1 | Server-Side Authoritative Pricing | Lookup items in `getProductsStore()`, ignore client price, compute subtotal & shipping server-side | M2 | Survey (All 3) |
| 2 | Order Item & Quantity Validation | Enforce positive integer quantities (1-50), reject non-existent / unpublished product IDs | M2 | Survey (Explorers 1 & 2) |
| 3 | WhatsApp Checkout Synchronization | Persist WhatsApp orders in `/api/orders` with `paymentMethod: "WHATSAPP"`, generate Order ID, clear cart | M2 | Survey (Explorer 2) |
| 4 | Safe Cart LocalStorage Hydration | Defend against corrupt/non-array `localStorage` data in `cart-context.tsx` to prevent client crashes | M2 | Survey (Explorer 2) |
| 5 | Transparent Shipping Fee Display | Display shipping cost (+50 EGP if <1000 EGP) in `checkout-modal.tsx` pre-submission | M2 | Survey (Explorer 2) |
| 6 | Customer Detail & Governorate Validation | Egyptian phone regex, 27 governorates whitelist, input string sanitization | M2 | Survey (Explorers 1 & 2) |
| 7 | Order Status Enum Enforcement | Whitelist status strings in `PATCH /api/orders` (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`) | M2 | Survey (Explorer 2) |
| 8 | Production Secret Enforcement | Fail-fast boot check for `AUTH_SECRET` in production; eliminate insecure fallback | M1 | Survey (Explorer 1) |
| 9 | Sliding-Window Rate Limiter Math Fix | Correct time window check in `rate-limiter.ts` to protect API routes across all 15 minutes | M1 | Survey (Explorer 1) |
| 10 | Client IP Resolution Security | Sanitize and harden `getClientIp` against spoofed `X-Forwarded-For` headers | M1 | Survey (Explorer 1) |
| 11 | Admin Media Upload Extension Derivation | Derive file extensions strictly from MIME magic bytes (.jpg, .png, .webp), not client filename | M1 | Survey (Explorer 1) |
| 12 | Storage Concurrency & Async Mutex | Serialize concurrent read-modify-write file operations in `src/lib/storage.ts` | M1 | Survey (Explorer 1) |
| 13 | Security Headers & Next Config | Add `next.config.mjs` with strict CSP, HSTS, X-Content-Type-Options, X-Frame-Options | M1 | Survey (Explorers 1 & 3) |
| 14 | Admin Products Price Management | Add `price` and `compareAtPrice` fields to `products-manager.tsx` and `POST/PUT /api/admin/products` | M3 | Survey (Explorer 3) |
| 15 | Brand Identity Purification (LKL Purge) | Remove tractor icons, agricultural pump/well-depth text, LKL tractor reviews, and Abu Hammad map | M3 | Survey (Explorer 3) |
| 16 | Phone & Contact Data Standardization | Standardize on official Ameer Store phone `01220086002` across all fallbacks, stores, and footers | M3 | Survey (Explorer 3) |
| 17 | Dead Agricultural Code Removal | Remove unused `interactive-equipment-advisor.tsx` and `floating-whatsapp.tsx` | M3 | Survey (Explorer 3) |
| 18 | Global Error Boundary | Add `src/app/global-error.tsx` for robust root error handling | M4 | Survey (Explorer 3) |
| 19 | Login Suspense Boundary | Wrap `useSearchParams()` in `<Suspense>` in `src/app/login/page.tsx` | M4 | Survey (Explorer 3) |
| 20 | Brand Gold Color Correction | Fix `tailwind.config.ts` mapping `brand.gold` to luxury gold tones instead of cyan `#56CFE1` | M4 | Survey (Explorer 3) |
| 21 | RTL Hero Aura Alignment | Fix `start-1/2 -translate-x-1/2` horizontal misalignment in `gsap-hero-showcase.tsx` | M4 | Survey (Explorer 3) |
| 22 | Catalog View Prop Synchronization | Synchronize `selectedCategory` when `initialCategorySlug` prop changes in `product-catalog-view.tsx` | M4 | Survey (Explorer 3) |
| 23 | E2E Test Suite Modernization (Tiers 1-4) | Update `scripts/run-tests.js` to assert Ameer Store perfume catalog and cover full 4-tier matrix | M5 | Survey (All 3) |
| 24 | Final Adversarial Coverage & Verification | Pass 100% E2E tests, TypeScript strict, Next.js build, and forensic audit clean verdict | M5 | Survey (All 3) |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Security Architecture, Secrets & Rate Limiting | Features 8, 9, 10, 11, 12, 13 (`env.ts`, `rate-limiter.ts`, `media/route.ts`, `storage.ts`, `next.config.mjs`) | None | DONE |
| M2 | Order Integrity, Pricing & Dual Checkout Flow | Features 1, 2, 3, 4, 5, 6, 7 (`orders/route.ts`, `orders-store.ts`, `checkout-modal.tsx`, `cart-context.tsx`, `cart-drawer.tsx`) | M1 (rate-limiter) | DONE |
| M3 | Brand Purification & Admin Product Management | Features 14, 15, 16, 17 (`products-manager.tsx`, `admin/products/route.ts`, `product-specifications.tsx`, `product-gallery.tsx`, `reviews.ts`, `store-location-map.tsx`, `settings-store.ts`, `content-store.ts`) | None | DONE |
| M4 | Code Quality, Next.js Resilience & UI/RTL Fixes | Features 18, 19, 20, 21, 22 (`global-error.tsx`, `login/page.tsx`, `tailwind.config.ts`, `gsap-hero-showcase.tsx`, `product-catalog-view.tsx`, `seo.ts`) | None | DONE |
| M5 | E2E Test Suite Modernization & Final Verification | Features 23, 24 (`scripts/run-tests.js`, full 4-tier test execution, `npm run build`, `tsc --noEmit`, forensic audit) | M1, M2, M3, M4 | DONE |

## Interface Contracts
### Client Checkout ↔ Order API (`POST /api/orders`)
- **Request**:
  ```typescript
  interface CreateOrderRequest {
    customerName: string; // 3-100 chars, trimmed, sanitized
    phone: string; // Egyptian phone: /^(010|011|012|015)[0-9]{8}$/
    governorate: string; // Must be one of 27 valid Egyptian governorates
    address: string; // 5-250 chars
    notes?: string;
    paymentMethod: "COD" | "WHATSAPP";
    items: Array<{
      id: string; // Valid product id existing in products-store
      quantity: number; // Integer, 1 <= quantity <= 50
    }>;
  }
  ```
- **Response**:
  ```typescript
  interface CreateOrderResponse {
    ok: boolean;
    order?: Order;
    message?: string;
  }
  ```
- **Server Responsibilities**:
  - Resolve prices authoritatively from `getProductsStore()`.
  - Calculate `subtotal = sum(product.price * quantity)`.
  - Calculate `shippingCost = subtotal >= 1000 ? 0 : 50`.
  - Calculate `total = subtotal + shippingCost`.
  - Reject order if any product does not exist or is unpublished.

### Admin Product API (`POST/PUT /api/admin/products`)
- **Payload**:
  ```typescript
  interface AdminProductPayload {
    id?: string;
    name: string;
    model?: string;
    brand?: string;
    categoryId: string;
    categoryName?: string;
    price: number; // Positive number, required
    compareAtPrice?: number; // Optional positive number
    shortDescription: string;
    description: string;
    specifications?: Record<string, string>;
    published: boolean;
    featured: boolean;
  }
  ```

## Code Layout
- `src/lib/env.ts` — Environment variables & security validation
- `src/lib/rate-limiter.ts` — Sliding-window IP rate limiter
- `src/lib/storage.ts` — Concurrency-safe JSON storage engine
- `src/lib/orders-store.ts` — Server-side order calculation & persistence
- `src/app/api/orders/route.ts` — Order creation & status update endpoints
- `src/app/api/admin/products/route.ts` — Product management API
- `src/components/admin/products-manager.tsx` — Admin product manager UI
- `src/components/cart/checkout-modal.tsx` — COD checkout modal with live pricing
- `src/components/cart/cart-drawer.tsx` — Cart drawer with synchronized WhatsApp flow
- `src/lib/cart-context.tsx` — Client-side cart state & safe hydration
- `next.config.mjs` — Production Next.js config with security headers
- `scripts/run-tests.js` — Automated verification & test suite
