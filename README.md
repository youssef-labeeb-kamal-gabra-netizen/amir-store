# أمير ستور للعطور الفاخرة والعود الملكي — Ameer Store

> **فخامة تدوم مع كل قطرة • أصالة التراث العربي • زيوت نقية ودهن عود معتق**  
> جمهورية مصر العربية — خدمة الشحن لكافة المحافظات  
> هاتف / واتساب معتمد: `+20 12 20086002`

المنصة الرسمية المخصصة لعرض واقتناء أفخر أنواع دهن العود المعتق، العطور الفرنسية والشرقية، المسك الطبيعي، والبخور المروكي، مع لوحة تحكم إدارية متكاملة، ونظام شراء مزدوج فائق الأمان (الدفع عند الاستلام + الطلب الفوري الموثق عبر الواتساب)، مبني باللغة العربية أولاً (Arabic-first & RTL-correct) بأحدث معايير الهدوء الفخم (Quiet Luxury) وتأثيرات الحركة المتقدمة بـ GSAP.

---

## ⚡ الرفع بنقرة واحدة على Vercel (1-Click Deployment)

يمكنك رفع المنصة فوراً على استضافة Vercel السحابية فائقة الأمان بضغطة زر واحدة:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYourUsername%2Fameer-store&env=AUTH_SECRET,ADMIN_EMAILS,NEXT_PUBLIC_APP_URL,NEXT_PUBLIC_BUSINESS_PHONE,NEXT_PUBLIC_BUSINESS_WHATSAPP&envDescription=Configuring%20Ameer%20Store%20Luxury%20Perfume%20Platform)

أو استخدم أداة الرفع المؤتمتة محلياً عبر سطر الأوامر:
```bash
deploy.bat
```
تقوم أداة `deploy.bat` تلقائياً بفحص الأنواع (Typecheck)، تدقيق الأمان (ESLint)، تشغيل حزمة الاختبارات الـ 86، بناء النسخة الإنتاجية، ثم رفع المتجر مباشرة إلى Vercel الإنتاجي بنجاح تام.

---

## 🛠 التقنيات المستخدمة (Tech Stack)
- **الإطار البرمجي (Framework):** [Next.js 15](https://nextjs.org/) (App Router & React 19)
- **لغة البرمجة:** [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode)
- **قواعد البيانات:** محرك هجين يدعم Vercel Postgres / Neon مع الترحيل التلقائي للجداول (Auto-DDL) والزرع التلقائي للكتالوج الأولي، مع هبوط آمن للتخزين الذري المحلي المتزامن `withStorageMutex`
- **الأنيميشن والحركة:** [GSAP 3](https://greensock.com/gsap/) و `@gsap/react` مع دعم الإحداثيات المنطقية لـ RTL
- **التصميم وتنسيق الواجهات:** [Tailwind CSS](https://tailwindcss.com/) مع نظام رموز تصميم مخصص لعلامة أمير ستور (Cashmere, Deep Forest Olive, Royal Metallic Gold `#D4AF37`)
- **الأيقونات:** [Lucide React](https://lucide.dev/)
- **الخطوط:** Amiri للنصوص الملكية، Cinzel للرموز اللاتينية، و Cairo للتصفح السريع
- **إدارة الأمان والطلبات:** Server-Authoritative Pricing لحساب الأسعار حصراً على السيرفر، مع قفل التخزين المتزامن `withStorageMutex` لمنع تعارض الطلبات

---

## 🚀 بدء التشغيل المحلي (Getting Started)

1. **تثبيت الحزم البرمجية:**
   ```bash
   npm install
   ```

2. **إعداد متغيرات البيئة:**
   قم بمراجعة ملف `.env.local` والتأكد من إعداد `AUTH_SECRET` و `ADMIN_EMAILS`.

3. **تشغيل خادم التطوير:**
   ```bash
   npm run dev
   ```
   افتح المتصفح على [http://localhost:3000](http://localhost:3000).

4. **فحص الأنواع وتدقيق الشيفرة والاختبارات الآلية:**
   ```bash
   npm run typecheck
   npm run lint
   npm test
   npm run build
   ```

---

## 🧪 حزمة الاختبارات الآلية الشاملة
تتضمن المنصة حزمة اختبارات مؤتمتة رباعية المستويات (`scripts/run-tests.js`) تضم 86 اختباراً بنسبة نجاح 100%:
- **Tier 1:** تغطية الميزات الأساسية والكتالوج ونظام الأسعار.
- **Tier 2:** صد محاولات الاختراق، التلاعب بالأسعار، والمدخلات الخبيثة.
- **Tier 3:** التفاعل المركب بين السلة، الشحن، التزامن، والتدفق المزدوج.
- **Tier 4:** محاكاة رحلات الشراء الواقعية من الاختيار حتى التسليم.

---

## 📚 التوثيق ودليل المطورين
لمعرفة التفاصيل المعمارية الكاملة وتوزيع المسؤوليات وتكوين الجداول والأنيميشن، يرجى مراجعة [دليل المطور الشامل](docs/DEVELOPER_GUIDE.md).
