## 2026-10-30T13:41:16Z
You are Worker 2 (Brand & UI Hardening Worker).
Your Working Directory: E:\ameer-store\.agents\teamwork\worker_impl_2\
Your Parent Orchestrator ID: dbe60015-7af9-4298-a52b-536f980ce583

MANDATORY FIRST STEP:
Read E:\ameer-store\.agents\teamwork\ORIGINAL_REQUEST.md and E:\ameer-store\.agents\teamwork\orchestrator\PROJECT.md before doing any work. Also review explorer findings at:
- `E:\ameer-store\.agents\teamwork\explorer_survey_3\analysis.md`

STRICT PROJECT BOUNDARY:
Operate strictly within E:\ameer-store. DO NOT touch, inspect, or modify anything in E:\WEB or any external directory.

WRITE OWNERSHIP:
You exclusively own:
- `src/components/admin/products-manager.tsx`
- `src/app/api/admin/products/route.ts`
- `src/components/products/product-specifications.tsx`
- `src/components/products/product-gallery.tsx`
- `src/data/reviews.ts`
- `src/components/common/store-location-map.tsx`
- `src/lib/settings-store.ts`
- `src/lib/content-store.ts`
- `src/app/global-error.tsx`
- `src/app/login/page.tsx`
- `tailwind.config.ts`
- `src/components/motion/gsap-hero-showcase.tsx`
- `src/components/products/product-catalog-view.tsx`
- `src/lib/seo.ts`
- Deletion of `src/components/common/interactive-equipment-advisor.tsx` and `src/components/common/floating-whatsapp.tsx`
- About/Contact/FAQ pages where fallback numbers (`01220792948`, `01114587917`) or LKL agricultural references appear.
Do NOT edit order routes, checkout modal, cart drawer, rate limiter, or storage files (owned by Worker 1). Do NOT edit scripts/ (owned by Test Writer).

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

OBJECTIVE:
Implement Milestone 3 (Brand Purification & Admin Product Management) and Milestone 4 (Code Quality, Next.js Resilience & UI/RTL Fixes) in Ameer Store.

TASKS TO IMPLEMENT:
1. Admin Product Management:
   - In `src/components/admin/products-manager.tsx`, add form input fields for `price` (سعر البيع ج.م) and `compareAtPrice` (السعر قبل الخصم ج.م). Include them in edit/create payloads.
   - In `src/app/api/admin/products/route.ts`, parse and validate `price` and `compareAtPrice` in POST and PUT operations so perfume prices are preserved and updated correctly.
2. Complete Brand Purification (Zero Agricultural Remnants):
   - In `src/components/products/product-specifications.tsx`, replace agricultural machinery text ("البيانات والملامح الفنية للمعدة", well-depth, pump pressures, Zagazig technicians) with luxury perfume specifications ("المواصفات العطرية والتركيبة", Top notes, Heart notes, Base notes, Longevity, Sillage, Concentration).
   - In `src/components/products/product-gallery.tsx`, replace the `<Tractor />` icon fallback with an elegant luxury perfume bottle icon (e.g. `<Sparkles />` or `<Flame />` or `<Gem />`).
   - In `src/data/reviews.ts`, replace agricultural motor/tiller reviews with genuine luxury perfume customer reviews (Oud, Musk, French perfumes, sillage, longevity).
   - In `src/components/common/store-location-map.tsx`, replace "شركة لبيب كمال للآلات الزراعية" and Abu Hammad coordinates with Ameer Store luxury perfume showroom in Zagazig, Sharkia, Egypt.
   - In `src/lib/settings-store.ts` and `src/lib/content-store.ts`, replace any LKL copy and standardize phone numbers to official Ameer Store phone `01220086002`.
   - Update fallback phones across `about/page.tsx`, `contact/page.tsx`, `faq-section.tsx`, `contact-cta.tsx` to `01220086002`.
   - Delete dead code files: `src/components/common/interactive-equipment-advisor.tsx` and `src/components/common/floating-whatsapp.tsx`.
3. Code Quality, Next.js Resilience & UI/RTL:
   - Create `src/app/global-error.tsx` for Next.js root error boundary.
   - In `src/app/login/page.tsx`, wrap the component using `useSearchParams()` in a `<Suspense>` boundary.
   - In `tailwind.config.ts`, fix the `brand.gold` palette to authentic luxury gold tones (`#D4AF37`, `#C5A059`, `#E5C158`, `#B38F2E`) instead of cyan `#56CFE1`.
   - In `src/components/motion/gsap-hero-showcase.tsx`, fix the RTL aura translation (`start-1/2 -translate-x-1/2`).
   - In `src/components/products/product-catalog-view.tsx`, synchronize `selectedCategory` when `initialCategorySlug` prop changes.
   - In `src/lib/seo.ts`, fix default OG image reference.

VERIFICATION REQUIREMENTS:
Run:
- `npm run typecheck` (`tsc --noEmit`) -> Must pass with 0 errors.
- `npm run lint` -> Must pass with 0 errors.
- `npm run build` -> Must pass with 0 errors.

OUTPUT REQUIREMENTS:
- Update `progress.md` in your directory.
- Write `handoff.md` with Observation, Logic Chain, Caveats, Conclusion, and Verification results.
- Send completion message to parent orchestrator via `send_message`.
