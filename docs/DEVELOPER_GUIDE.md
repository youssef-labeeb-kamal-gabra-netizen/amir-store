# دليل المطور والمعمارية الشاملة — متجر أمير ستور (Ameer Store)
## Official Developer & Architecture Guide

---

## 1. نظرة عامة على المشروع والهوية الفاخرة (Overview & Identity)

**أمير ستور (Ameer Store)** هي منصة تجارة إلكترونية متخصصة في عرض واقتناء أفخر أنواع دهن العود المعتق، العطور الفرنسية والشرقية، المسك الطبيعي، والبخور المروكي الفاخر داخل جمهورية مصر العربية.

### المبادئ الحاكمة (Core Constitution)
1. **منع فبركة البيانات نهائياً (Zero Fabrication):**
   - يمنع منعاً باتاً اختراع أسعار منتجات، مواصفات فنية، أو أرقام هواتف وهمية.
   - الرقم المعتمد للمتجر: `+20 12 20086002` (01220086002).
2. **العربية أولاً والاتجاه الصحيح (Arabic-First & RTL-Correct):**
   - الواجهة الأساسية عربية بالكامل من اليمين لليسار (`dir="rtl"`).
   - استخدام الخصائص المنطقية (Logical Properties) مثل `ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`.
3. **التسعير السيادي الحصري من السيرفر (Server-Authoritative Pricing):**
   - تُحسب أسعار كافة المنتجات وتكاليف الشحن حصراً على الخادم. أي سعر أو إجمالي يرسله المتصفح يتم تجاهله كلياً لمنع التلاعب.
4. **أمان لوحة التحكم (Server-Side Authorization):**
   - التحقق من صلاحية المشرف يتم على السيرفر حصراً عبر ملفات تعريف ارتباط مشفرة وموقعة برمز HMAC-SHA256 مع دعم إبطال الجلسات (JTI Revocation).

---

## 2. التقنيات وحزم التشغيل (Tech Stack)

| الطبقة | التقنية المعتمدة | الاستخدام |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | العرض المزدوج (SSR + RSC) وخوادم الـ API |
| **UI Library** | React 19 | مكونات الواجهة الحديثة ودعم Server Actions |
| **Language** | TypeScript 5 (Strict Mode) | انضباط الأنواع الصارم ومنع أي استخدام غير مبرر لـ `any` |
| **Styling** | Tailwind CSS 3 | نظام التصميم الملكي والخصائص المنطقية لـ RTL |
| **Animation** | GSAP 3 & `@gsap/react` | حركات ناعمة وفخمة (Quiet Luxury) متوافقة مع RTL |
| **Database** | Vercel Postgres / Neon / PostgreSQL | قاعدة البيانات العلاقية الإنتاجية للمنتجات والطلبات |
| **Local Storage** | Atomic JSON + `withStorageMutex` | محرك تخزين محلي ذري متزامن للطوارئ وبيئة التطوير |
| **Icons** | Lucide React | أيقونات الواجهة ولوحة التحكم |
| **Fonts** | Amiri, Cinzel, Cairo | خطوط العناوين الملكية والنصوص الرقمية المتناسقة |

---

## 3. الهيكلة البرمجية للمجلدات (Directory Structure)

```text
E:\ameer-store\
├── docs/                      # التوثيق المعماري ودليل المطورين
│   ├── ARCHITECTURE_ASSESSMENT.md
│   └── DEVELOPER_GUIDE.md     # هذا الملف (دليل المطور)
├── data/                      # ملفات التخزين المحلي الاحتياطية (JSON)
│   ├── orders.json
│   ├── products.json
│   ├── categories.json
│   └── inquiries.json
├── public/                    # الوسائط والأصول الثابتة والصور الفاخرة
│   ├── images/
│   │   ├── logo.png
│   │   └── products/          # صور الفيكتور عالية الدقة للعطور
├── scripts/                   # حزم الاختبارات المؤتمتة والفحص الأمني
│   ├── run-tests.js           # جناح الاختبارات الآلية (86 اختباراً)
│   ├── verify-all.js          # مدقق المعايير والشهادات الأمنية
│   └── adversarial-challenge-2.js
├── src/
│   ├── app/                   # مسارات Next.js App Router والـ APIs
│   │   ├── layout.tsx         # الهيكل العام والهيدر والفوتر والخطوط
│   │   ├── page.tsx           # الصفحة الرئيسية الفاخرة (Hero, Showcase, Reviews)
│   │   ├── products/          # صفحات الكتالوج وتفاصيل العطور
│   │   │   ├── page.tsx       # معرض العطور مع الفلترة والتصنيفات
│   │   │   └── [slug]/page.tsx# صفحة تفاصيل العطر والهرم العطري
│   │   ├── admin/             # لوحة تحكم المسؤول (محمية بصلاحيات المشرف)
│   │   │   ├── page.tsx       # ملخص الإحصائيات والمبيعات
│   │   │   ├── products/      # إضافة وتعديل وتسعير العطور
│   │   │   ├── orders/        # متابعة حالات الشحن والطلبات
│   │   │   ├── categories/    # إدارة الأقسام
│   │   │   ├── reviews/       # اعتماد مراجعات العملاء
│   │   │   └── settings/      # إعدادات المتجر وبيانات الاتصال
│   │   └── api/               # نقاط النهاية البرمجية (API Routes)
│   │       ├── orders/        # مسار تسجيل وتحديث الطلبات
│   │       ├── admin/         # مسارات العمليات الإدارية المشفرة
│   │       └── auth/          # مسارات المصادقة وتسجيل الدخول
│   ├── components/            # مكونات الواجهة (مفصولة المسؤولية)
│   │   ├── layout/            # Navbar, Footer, MobileNav
│   │   ├── products/          # ProductCard, ProductGallery, Specs
│   │   ├── cart/              # CartDrawer, CartItem, CheckoutModal
│   │   ├── admin/             # جداول الإدارة والنماذج التفاعلية
│   │   ├── motion/            # مكونات GSAP المتوافقة مع السيرفر
│   │   └── common/            # ReviewsSection, FAQ, Toast
│   ├── data/
│   │   └── catalog.ts         # الكتالوج الأساسي المعتمد للأقسام والمنتجات
│   ├── lib/                   # محركات الأعمال والأمان والتخزين
│   │   ├── db.ts              # محول قاعدة بيانات PostgreSQL الهجين والترحيل الآلي
│   │   ├── orders-store.ts    # منطق تسجيل وتحديث الطلبات والتسعير السيادي
│   │   ├── products-store.ts  # مخزن المنتجات والربط مع PostgreSQL/JSON
│   │   ├── auth.ts            # توقيع والتحقق من الجلسات (HMAC-SHA256)
│   │   ├── rate-limiter.ts    # محدد معدل الطلبات (Sliding Window IP Limiter)
│   │   ├── storage.ts         # التخزين الذري المحلي وقفل التزامن Mutex
│   │   └── env.ts             # القراءة الآمنة لمتغيرات البيئة والتحقق الصارم
│   └── types/                 # تعريفات TypeScript الصارمة (Product, Order, User)
├── deploy.bat                 # سكربت الفحص الشامل والرفع المباشر إلى Vercel
├── next.config.mjs            # ترويسات الأمان الصارمة (CSP, HSTS, X-Frame)
└── package.json
```

---

## 4. محرك قواعد البيانات الهجين (Hybrid Database Adapter)

تم تصميم النظام ليعمل بنمطين مرنين دون أي تعديل في الكود:

```text
                     ┌───────────────────────────┐
                     │ isPostgresConfigured() ?  │
                     └─────────────┬─────────────┘
                                   │
                 ┌─────────────────┴─────────────────┐
                 │                                   │
               [ نعم ]                             [ لا ]
                 ▼                                   ▼
   ┌──────────────────────────┐        ┌──────────────────────────┐
   │ Vercel Postgres / Neon   │        │ Atomic Persistent JSON   │
   │ - Connection Pooling     │        │ - In-Memory Storage Mutex│
   │ - Auto-DDL Migrations    │        │ - Safe Temp-File Renames │
   │ - Parameterized SQL ($1) │        │ - Graceful OS Temp Fallback│
   └──────────────────────────┘        └──────────────────────────┘
```

### آليات الترحيل التلقائي (Automatic Database Migration)
عند تشغيل السيرفر ووجود متغير `POSTGRES_URL` أو `DATABASE_URL`:
1. تُنشأ الجداول تلقائياً في PostgreSQL إذا لم تكن موجودة:
   - `products` (مع فهارس `slug`, `category_id`, `published`, `featured`).
   - `orders` (مع فهارس `status`, `phone`, `created_at`).
   - `contact_requests` (مع فهارس `user_email`, `status`).
2. إذا كان جدول المنتجات فارغاً، يتم زرع الكتالوج الملكي الأولي تلقائياً (`INITIAL_PRODUCTS`).

---

## 5. التدفق المزدوج للطلبات والتسعير السيادي (Dual Checkout Flow)

يدعم المتجر مسارين للشراء:

### 1. الدفع عند الاستلام (Cash on Delivery - COD)
- يدخل العميل بياناته (الاسم الثلاثي، رقم هاتف مصري صالح، المحافظة، العنوان التفصيلي).
- يُرسل الطلب إلى `/api/orders` (POST).
- يتحقق السيرفر من أسعار كل عطر مباشرة من الكتالوج ويضرب في الكميات.
- **سياسة الشحن:**
  - إذا كان المجموع الفرعي $\ge 1000$ ج.م $\rightarrow$ **شحن مجاني** (0 ج.م).
  - إذا كان المجموع الفرعي $< 1000$ ج.م $\rightarrow$ **شحن قياسي** (+50 ج.م).
- يُنشأ كود فريد غير قابل للتكرار بصيغة `AMR-XXXXXX`، ويُحفظ الطلب، وتُفرغ السلة.

### 2. الطلب المباشر والموثق عبر الواتساب (WhatsApp Direct Order)
- يضغط العميل على زر "إتمام الطلب عبر الواتساب".
- يُسجل الطلب أولاً على السيرفر كطلب رسمي بنمط `paymentMethod: "WHATSAPP"`.
- يحصل على كود رسمي `AMR-XXXXXX`.
- يُفتح تطبيق الواتساب متضمناً كود الطلب وتفاصيل العطور والكميات والإجمالي الدقيق إلى هاتف المتجر الرسمي `01220086002`.

---

## 6. التحصينات الأمنية (Security Architecture)

1. **ترويسات HTTP الصارمة (HTTP Security Headers):**
   - **Content-Security-Policy (CSP):** تقييد مصادر السكربتات والوسائط لمنع هجمات XSS.
   - **Strict-Transport-Security (HSTS):** إجبار التشفير بـ `max-age=63072000; includeSubDomains; preload`.
   - **X-Frame-Options: DENY:** منع هجمات تضمين النوافذ الوهمية (Clickjacking).
   - **X-Content-Type-Options: nosniff:** منع هجمات تخمين نوع الملفات (MIME Sniffing).
2. **الحماية ضد حقن البيانات (Input Sanitization & Injection Defense):**
   - تنظيف جميع حقول النصوص من وسوم HTML و `<script>`.
   - الاستعلامات البارامترية في PostgreSQL تمنع بنسبة 100% حقن SQL (SQL Injection).
3. **تقييد معدل الطلبات (Rate Limiting):**
   - حد أقصى 5 طلبات شراء كل 10 دقائق لكل عنوان IP لمنع إغراق السيرفر أو استنزاف التخزين.
4. **تأمين لوحة التحكم:**
   - توقيع جلسات المشرف برمز HMAC-SHA256 السري.
   - التحقق الصارم من بريد المشرف المعتمد على مستوى الخادم.

---

## 7. نظام التصميم والأنيميشن بـ GSAP (Design System & Motion)

### لوحة الألوان الملكية (Royal Palette)
- **الذهب الخالص (Royal Gold):** `#D4AF37` / `text-brand-gold-400`
- **الكشمير الفاخر (Cashmere):** `#FBF9F5` / `bg-brand-cashmere`
- **الزيتوني المعتق (Deep Forest Olive):** `#2E3A24` / `bg-brand-olive`
- **الرمادي الداكن للنصوص:** `#1A1D16` / `text-brand-neutral-900`

### قواعد تحريك GSAP
1. يجب استخدام خطاف `useGSAP` داخل مكونات واجهة العميل (`"use client"`).
2. دعم الاتجاه المنطقي لـ RTL: أي إزاحة أفقية يجب أن تراعي اتجاه اليمين واليسار دون التسبب في تمرير أفقي (Horizontal Overflow).
3. التحقق الدائم من اكتمال تحميل عناصر الـ DOM والتأكد من تنظيف الذاكرة في `onUnmount`.

---

## 8. دليل أوامر التطوير وضمان الجودة (Developer Commands)

```bash
# 1. تثبيت الاعتماديات
npm install

# 2. تشغيل خادم التطوير المحلي
npm run dev

# 3. فحص انضباط الأنواع (TypeScript Strict Check)
npm run typecheck

# 4. تدقيق الكود ومعايير الأمان (ESLint)
npm run lint

# 5. تشغيل حزمة الاختبارات الآلية الشاملة والتحدي التنافسي (104 اختبارات)
npm run test:all

# 6. بناء النسخة الإنتاجية
npm run build

# 7. الفحص الشامل والرفع المباشر إلى Vercel
deploy.bat
```

---

## 9. الرفع بنقرة واحدة على Vercel (1-Click Vercel Deployment)

يمكن لأي مطور أو مالك للمشروع نشر المتجر فوراً على Vercel مع كامل المتغيرات المهيأة:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYourUsername%2Fameer-store&env=AUTH_SECRET,ADMIN_EMAILS,NEXT_PUBLIC_APP_URL,NEXT_PUBLIC_BUSINESS_PHONE,NEXT_PUBLIC_BUSINESS_WHATSAPP&envDescription=Configuring%20Ameer%20Store%20Luxury%20Perfume%20Platform)

### المتغيرات المطلوبة للإنتاج:
- `AUTH_SECRET`: مفتاح سري عشوائي لا يقل عن 32 حرفاً لتوقيع الجلسات.
- `ADMIN_EMAILS`: البريد الإلكتروني للمشرف (مثل: `yousseflabeeb256@gmail.com`).
- `NEXT_PUBLIC_APP_URL`: رابط الدومين بعد الرفع (مثل: `https://ameer-store.vercel.app`).
- `POSTGRES_URL` (موصى به للإنتاج): يتم تفعيله بنقرة واحدة عبر ربط Vercel Postgres من تبويب Storage، أو وضع رابط Neon المجاني.
- `CLOUDINARY_URL` (موصى به لرفع الصور): تخزين سحابي مجاني 25GB للصور.
- `RESEND_API_KEY` (موصى به للفواتير): إرسال 3,000 إيميل وفاتورة مجاناً شهرياً.

---

## 10. تفعيل الخدمات السحابية المجانية في دقيقتين (Free Cloud Services Setup in 2 Minutes)

جميع الخدمات المعتمدة في متجر أمير ستور تتبع مبدأ **"مجانية 100% ومصممة للاستخدام الإنتاجي الاحترافي"** مع هبوط آمن وتلقائي (Graceful Fallback) في حال عدم توفر المفاتيح:

### 1. قاعدة البيانات السحابية (PostgreSQL on Neon / Vercel Postgres)
- **الباقة المجانية:** 0.5 GiB تخزين مجاني دائم مع معالجة سحابية فورية ونسخ احتياطي تلقائي.
- **خطوات التفعيل في دقيقتين:**
  1. أنشئ حساباً مجانياً على [Neon.tech](https://neon.tech) أو توجه لتبويب **Storage** داخل مشروعك على Vercel واختر **Create Database -> Postgres**.
  2. انسخ رابط الاتصال المجمع (Pooled Connection String) الذي يبدأ بـ `postgres://...` أو `postgresql://...`.
  3. أضف الرابط في ملف `.env.local` محلياً أو في إعدادات **Environment Variables** على Vercel تحت اسم:
     ```env
     POSTGRES_URL="postgres://default:your-password@ep-cool-fog-123456.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require"
     ```
  4. بمجرد إعادة تشغيل السيرفر، يتولى محرك `src/lib/db.ts` إنشاء الجداول (`products`, `orders`, `contact_requests`) وفهارس البحث وزرع العطور الملكية الثمانية تلقائياً دون كتابة أي أوامر يدوية.

---

### 2. التخزين السحابي لصور المنتجات (Cloudinary Free Tier)
- **الباقة المجانية:** 25 جيجابايت شهرياً مجاناً (25 Monthly Credits) مع شبكة توزيع محتوى عالمية فائقة السرعة (Global CDN) وضغط تلقائي بصيغة WebP.
- **خطوات التفعيل في دقيقتين:**
  1. أنشئ حساباً مجانياً على [Cloudinary.com](https://cloudinary.com).
  2. من لوحة التحكم الرئيسية (Dashboard)، انسخ رابط `API Environment variable` (الذي يبدأ بـ `cloudinary://...`).
  3. أضف المفتاح في ملف `.env.local` أو في إعدادات Vercel:
     ```env
     CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
     ```
     *(أو يمكنك إدخال `CLOUDINARY_CLOUD_NAME` و `CLOUDINARY_API_KEY` و `CLOUDINARY_API_SECRET` منفصلين)*.
  4. الآن عند قيام المشرف برفع صور جديدة للعطور من لوحة التحكم `/admin/media`، سيتم رفعها مباشرة لسحابة Cloudinary وتوليد روابط CDN السريعة وحفظها مع المنتجات. وفي حال عدم إدخال المفتاح، يهبط النظام تلقائياً للتخزين المحلي في `public/uploads/`.

---

### 3. خدمة فواتير البريد الإلكتروني التلقائية (Resend Free Tier)
- **الباقة المجانية:** 3,000 رسالة بريد إلكتروني شهرياً مجاناً (100 رسالة يومياً) تصل مباشرة لصندوق الوارد (Inbox).
- **خطوات التفعيل في دقيقتين:**
  1. أنشئ حساباً مجانياً على [Resend.com](https://resend.com).
  2. انتقل إلى تبويب **API Keys** واضغط على **Create API Key**، ثم انسخ المفتاح الذي يبدأ بـ `re_...`.
  3. أضف المفتاح في ملف `.env.local` أو في إعدادات Vercel:
     ```env
     RESEND_API_KEY="re_123456789_abcdefghijklmnopqrstuv"
     ```
  4. عند قيام أي عميل بطلب شراء، سيقوم النظام تلقائياً بـ:
     - إرسال فاتورة ملكية باللغة العربية بتنسيق HTML فاخر للعميل (إذا كتب بريده الإلكتروني).
     - إرسال إشعار فوري لبريد المشرف (`ADMIN_EMAILS`) بتفاصيل العميل والعطور وإجمالي الفاتورة.
     - في حال عدم إدخال المفتاح، يعمل النظام بنمط المحاكاة (Simulation Mode) ويسجل الفاتورة في كونسول السيرفر دون أي تعطل للطلب.

