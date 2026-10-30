## 2026-10-30T14:30:32Z
From: dbe60015-7af9-4298-a52b-536f980ce583 (Parent Orchestrator)
Role: Worker Remediation 1 (Remediation & Hardening Worker)
Working Directory: E:\ameer-store\.agents\teamwork\worker_remediation_1\

Tasks:
Remediate all input validation, phone normalization, and brand purity issues identified by Reviewer 2, Challenger 1, and Challenger 2.

TASK 1: INPUT VALIDATION & PHONE NORMALIZATION
1. `src/lib/orders-store.ts` (lines 90-105):
   - Strict quantity check: enforce that `item.quantity` is a strict integer number between 1 and 50.
   - DO NOT call `Math.floor(Number(item.quantity))` prior to validation. Reject fractional numbers (`1.5`), booleans, strings, or arrays with an error.
   - Validate:
     ```typescript
     if (typeof item.quantity !== "number" || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 50) {
       throw new Error(`كمية غير صالحة للمنتج ${item.id}: يجب أن تكون رقماً صحيحاً بين 1 و 50`);
     }
     ```
2. `src/app/api/orders/route.ts`:
   - Fix `normalizeEgyptianPhone`:
     When user inputs international format like `+2010...` or `002010...` or `2010...`, stripping `+20` leaves 10 digits (`10...`, `11...`, `12...`, `15...`). If clean phone is 10 digits starting with `10`, `11`, `12`, or `15`, prepend `'0'` to produce the standard 11-digit Egyptian mobile number (`010...`).
   - Fix XSS sanitization:
     Strip `<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>` tags completely including their inner text, or reject requests with `<script>` tags outright.
   - At the API route level, validate each item's quantity: `typeof item.quantity === "number" && Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 50`.
3. `src/app/api/admin/media/route.ts` line 194:
   - In catch block, if error is authorization-related, return HTTP 403 Forbidden rather than 500.

TASK 2: COMPLETE BRAND PURIFICATION
1. `src/components/account/customer-inquiries-client.tsx`:
   - Line 200: Replace "أي ماكينة أو قطعة غيار" with "أي عطر أو تركيبة خاصة".
   - Lines 250 & 345: Replace "المعدة المطلوبة" / "المعدة أو الصنف المطلوب" with "العطر أو المنتج المطلوب".
   - Line 351: Replace placeholder `مثال: موتور رشاش، طلمبة مياه، قطع غيار بيتر...` with `مثال: عطر أمير العود، دهن عود كمبودي معتق، مسك الختام...`.
   - Line 364: Replace "وسيتواصل معك الفني المختص فوراً..." with "وسيتواصل معك خبير العطور المختص فوراً...".
2. `src/components/admin/categories-manager.tsx`:
   - Replace "الأقسام والتصنيفات الزراعية" with "أقسام وتصنيفات المتجر".
   - Replace "قسم زراعي" / "القسم الزراعي" with "قسم العطور".
   - Replace placeholder `مثال: محركات الديزل الزراعية` with `مثال: العطور الشرقية والفرنسية`.
   - Replace "طبيعة المعدات المدرجة" with "طبيعة العطور المدرجة".
3. `src/components/admin/media-manager.tsx`:
   - Replace "رفع صورة معدة زراعية جديدة" with "رفع صورة عطر جديد".
   - Replace "لوصف المعدة بمحركات البحث" with "لوصف العطر بمحركات البحث".
   - Replace placeholder `مثال: صورة تفصيلية لموتور رش زراعي 450 بار` with `مثال: صورة تفصيلية لزجاجة عطر أمير العود الفاخر`.
4. `src/components/admin/contact-requests-manager.tsx` & `src/components/contact/contact-form.tsx`:
   - Replace "المعدة المطلوبة" with "العطر أو المنتج المطلوب".
5. `src/components/common/reviews-section.tsx` & `src/components/admin/reviews-manager.tsx`:
   - Replace `<Wrench />` icon with `<Sparkles />`, and label with "العطر:".
6. `src/app/admin/audit/page.tsx`:
   - Replace `admin@lkl-egypt.com` with `admin@ameer-store.com`.
   - Replace "6 منتجات زراعية معتمدة" with "كتالوج العطور الفاخرة المعتمد".
   - Replace "موتور رش زراعي عالي الضغط" with "عطر ملكي فاخر".
7. `src/components/admin/settings-manager.tsx`:
   - Replace Minya al-Qamh placeholder with Zagazig luxury perfume showroom address, and slogan with luxury perfume slogan.
8. `src/app/api/auth/callback/google/route.ts`:
   - Replace `"مستخدم LKL"` with `"عميل أمير ستور"`.
9. `src/lib/env.ts`:
   - Replace `"https://lkl-store.vercel.app"` with `"https://ameer-store.vercel.app"`.
   - Clean up any legacy comments referring to old numbers or agricultural heritage.
10. `src/lib/auth.ts`:
    - Rename session cookie constants: `SESSION_COOKIE_NAME = "ameer_session"`, `ameer_oauth_state`, `ameer_oauth_pkce`.
11. `src/lib/storage.ts` & `src/lib/rate-limiter.ts`:
    - Clean up internal comments and cache keys (`__lkl_storage_cache` -> `__ameer_storage_cache`, `lkl_storage` -> `ameer_storage`).
12. `src/db/seed.sql` & `src/db/schema.sql`:
    - Clean up legacy agricultural seeds/tables to perfume store tables.

VERIFICATION REQUIREMENTS:
Run:
- `npm run typecheck` (`tsc --noEmit`) -> 0 errors.
- `npm run lint` -> 0 errors.
- `node scripts/run-tests.js` -> 86/86 passing.
- `node scripts/verify-all.js` -> passing.
- `node scripts/challenger-adversarial-tests.js` -> all pass.
- `node scripts/adversarial-challenge-2.js` -> all pass (0 brand leaks).
- `npm run build` -> 41/41 routes compile with 0 errors.
