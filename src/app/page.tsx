import React from "react";
import Link from "next/link";
import { getProductsStore } from "@/lib/products-store";
import { getApprovedReviews } from "@/lib/reviews-store";
import { ProductCard } from "@/components/products/product-card";
import { ContactCTA } from "@/components/common/contact-cta";
import { ReviewsSection } from "@/components/common/reviews-section";
import { FAQSection } from "@/components/common/faq-section";
import { GsapHeroShowcase } from "@/components/motion/gsap-hero-showcase";
import { GsapTextReveal } from "@/components/motion/gsap-text-reveal";
import { GsapReveal } from "@/components/motion/gsap-reveal";
import {
  ShieldCheck,
  CheckCircle2,
  Phone,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  Gift,
  Heart,
  Flame,
  Wind,
} from "lucide-react";
import { env } from "@/lib/env";

export default async function HomePage() {
  const products = await getProductsStore();
  const featuredProducts = products.filter((p) => p.published && p.featured).slice(0, 4);
  const approvedReviews = getApprovedReviews();

  const phone1 = env.business.phone || "01220086002";
  const rawWhatsApp = env.business.whatsapp || "01220086002";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم، أود الاستفسار عن تشكيلة العطور ودهن العود المتاحة لدى متجر أمير ستور."
  )}`;

  return (
    <div className="flex flex-col gap-12 sm:gap-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2E3A24] via-[#242e1d] to-[#1a2215] text-white pt-12 sm:pt-20 pb-16 sm:pb-24 text-start">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-brand-gold-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 end-10 w-80 h-80 bg-brand-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Active Live Store Status & Guarantee Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/40 border border-brand-gold-400/40 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white shadow-sm backdrop-blur-md">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-gold-400" />
                  </span>
                  <span>متجر أمير ستور الرسمي • أفخم العطور والعود الأصلي</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-semibold text-brand-gold-300">
                  <Sparkles className="h-3.5 w-3.5 text-brand-gold-400" />
                  <span>ثبات وأصالة 100% مضمونة</span>
                </div>
              </div>

              {/* Title & Tagline with GSAP Text Reveal */}
              <GsapTextReveal>
                <div className="space-y-3">
                  <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white font-arabic">
                    أمير ستور <br className="hidden sm:inline" />
                    <span className="text-amber-300 drop-shadow-[0_2px_12px_rgba(212,175,55,0.4)]">
                      للعطور والعود الفاخر
                    </span>
                  </h1>
                  <p className="text-base xs:text-lg sm:text-2xl text-oud-surfaceLight font-extrabold font-serif">
                    ✨ دهن عود نقي • عطور شرقية وفرنسية • بخور ومسك ملكي
                  </p>
                </div>

                <p className="text-sm sm:text-base text-oud-surfaceLight/90 leading-relaxed max-w-xl mt-4">
                  ننتقي لك أرقى أدهان العود الطبيعية والعطور الحصرية التي تجمع بين عبق التراث الشرقي الأصيل وأناقة الابتكار الفرنسي، مع ضمان الفوحان والثبات الطويل.
                </p>
              </GsapTextReveal>

              {/* Action Buttons (Pills) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <Link href="/products" className="w-full">
                  <button
                    type="button"
                    className="w-full py-4 px-4 rounded-full bg-brand-gold-400 hover:bg-brand-gold-500 text-brand-green-950 font-black text-sm sm:text-base shadow-xl btn-touch flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <Sparkles className="h-5 w-5 text-brand-green-950" />
                    <span>تصفح العطور</span>
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white font-black text-sm sm:text-base shadow-xl btn-touch flex items-center justify-center gap-2 cursor-pointer border border-white/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>اطلب عبر واتساب</span>
                </a>

                <a
                  href={`tel:${phone1}`}
                  className="w-full py-4 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base shadow-xl btn-touch flex items-center justify-center gap-2 cursor-pointer border border-white/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Phone className="h-4 w-4 text-brand-gold-400" />
                  <span>اتصال مباشر</span>
                </a>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-4 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-xs sm:text-sm text-oud-surfaceLight font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-gold-400 shrink-0" />
                  <span>أصالة 100% ونقاء معتمد</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-gold-400 shrink-0" />
                  <span>ثبات عالي يدوم لأيام</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-gold-400 shrink-0" />
                  <span>شحن وتوصيل فوري لكافة المدن</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card / Brand Showcase with GSAP Motion */}
            <div className="lg:col-span-5">
              <GsapHeroShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Ticker Banner */}
      <div className="bg-white text-brand-neutral-800 text-xs sm:text-sm py-2.5 sm:py-3 px-3 sm:px-4 shadow-2xs border-y border-brand-neutral-200 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-green-800" />
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-green-50 text-brand-green-800 border border-brand-green-200 text-[11px] font-black shrink-0">حصري</span>
            <span className="text-brand-neutral-700 font-medium text-xs sm:text-sm truncate sm:overflow-visible sm:whitespace-normal">
              ✨ شحن مجاني للطلبات المميزة • عطور طبيعية أصلية 100% • تغليف هدايا فاخر مجاناً
            </span>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-green-800 hover:bg-brand-green-900 text-white text-xs font-bold active:scale-95 transition-all shadow-2xs shrink-0 cursor-pointer"
          >
            <MessageCircle className="h-3.5 w-3.5 text-brand-gold-400" />
            <span>طلب عطر مخصص</span>
          </a>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-20 min-w-0">
        {/* 2. THE 4 FRAGRANCE CATEGORIES */}
        <section className="space-y-6 text-start">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-brand-neutral-200 pb-4">
            <div>
              <span className="text-xs font-bold text-brand-green-800 tracking-wider uppercase">
                تشكيلة المتجر
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-900 tracking-tight mt-1">
                اختر الفئة العطرية المفضلة
              </h2>
              <p className="text-xs sm:text-sm text-brand-neutral-500 mt-0.5">
                تصفح أندر الروائح والأدهان المختارة بعناية فائقة
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-green-800 hover:text-brand-green-900 active:scale-95 transition-all"
            >
              <span>عرض كل العطور ({products.filter((p) => p.published).length} منتج)</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Category 1: Pure Oud Oils */}
            <Link
              href="/products?category=pure-oud-oils"
              className="group rounded-3xl border border-brand-neutral-200 hover:border-brand-green-800 bg-white p-5 shadow-oud-sm hover:shadow-xl card-touch flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-brand-green-50 flex items-center justify-center text-brand-green-800 group-hover:scale-110 group-hover:bg-brand-green-800 group-hover:text-white transition-all duration-300">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-brand-green-950">
                    دهن العود والزيوت النقية
                  </h3>
                  <p className="text-xs text-brand-neutral-500 leading-relaxed">
                    أدهان عود كلمنتان وكمبودي وتراد طبيعية صافية 100% بنكهات بخورية ساحرة.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-brand-neutral-100 flex items-center justify-between text-xs font-bold text-brand-green-800">
                <span>تصفح أدهان العود</span>
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Category 2: Royal Oriental */}
            <Link
              href="/products?category=oriental-perfumes"
              className="group rounded-3xl border border-brand-neutral-200 hover:border-brand-green-800 bg-white p-5 shadow-oud-sm hover:shadow-xl card-touch flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-brand-gold-50 flex items-center justify-center text-brand-gold-600 group-hover:scale-110 group-hover:bg-brand-gold-400 group-hover:text-brand-green-950 transition-all duration-300">
                  <Flame className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-brand-green-950">
                    عطور شرقية ملكية
                  </h3>
                  <p className="text-xs text-brand-neutral-500 leading-relaxed">
                    توليفات ملكية خاصة تمزج العود والعنبر مع الورد الطائفي والزعفران.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-brand-neutral-100 flex items-center justify-between text-xs font-bold text-brand-green-800">
                <span>تصفح العطور الشرقية</span>
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Category 3: French Perfumes */}
            <Link
              href="/products?category=french-perfumes"
              className="group rounded-3xl border border-brand-neutral-200 hover:border-brand-green-800 bg-white p-5 shadow-oud-sm hover:shadow-xl card-touch flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-brand-green-50 flex items-center justify-center text-brand-green-800 group-hover:scale-110 group-hover:bg-brand-green-800 group-hover:text-white transition-all duration-300">
                  <Heart className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-brand-green-950">
                    عطور فرنسية حصرية
                  </h3>
                  <p className="text-xs text-brand-neutral-500 leading-relaxed">
                    إبداعات عطرية عالمية دافئة بنفحات الفانيليا، التوباكو، والجلود الفاخرة.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-brand-neutral-100 flex items-center justify-between text-xs font-bold text-brand-green-800">
                <span>تصفح العطور الفرنسية</span>
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Category 4: Musk & Bakhoor */}
            <Link
              href="/products?category=musk-and-amber"
              className="group rounded-3xl border border-brand-neutral-200 hover:border-brand-green-800 bg-white p-5 shadow-oud-sm hover:shadow-xl card-touch flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-brand-gold-50 flex items-center justify-center text-brand-gold-600 group-hover:scale-110 group-hover:bg-brand-gold-400 group-hover:text-brand-green-950 transition-all duration-300">
                  <Wind className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-brand-green-950">
                    المسك والعنبر والبخور
                  </h3>
                  <p className="text-xs text-brand-neutral-500 leading-relaxed">
                    مسك أبيض بودري نقي وكسر عود مروكي طبيعي لتعطير المجالس والمنازل.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-brand-neutral-100 flex items-center justify-between text-xs font-bold text-brand-green-800">
                <span>تصفح المسك والبخور</span>
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* 3. FEATURED PRODUCTS */}
        <section className="text-start space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-brand-neutral-200 pb-4">
            <div>
              <span className="text-xs font-bold text-brand-green-800 tracking-wider uppercase">
                الأكثر طلباً وتميزاً
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-900 tracking-tight mt-1">
                عطور مختارة من أمير ستور
              </h2>
              <p className="text-xs sm:text-sm text-brand-neutral-500 mt-0.5">
                توليفات حصرية حازت على إعجاب وتقدير عملائنا
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-bold text-brand-green-800 hover:text-brand-green-900 flex items-center gap-1 active:scale-95 transition-all"
            >
              <span>تصفح الكتالوج بالكامل</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <GsapReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </GsapReveal>
        </section>

        {/* 4. WHY AMEER STORE (Trust Signals) */}
        <section className="rounded-3xl bg-white p-6 sm:p-10 text-start space-y-6 border border-brand-neutral-200 shadow-oud-sm">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-brand-green-800 tracking-wider uppercase">
              لماذا أمير ستور؟
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-900 tracking-tight mt-1">
              ثلاثة معايير لا نتنازل عنها في كل قطرة عطر
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-3 bg-brand-neutral-50 p-6 rounded-3xl border border-brand-neutral-200/80 card-touch">
              <div className="h-12 w-12 rounded-2xl bg-brand-green-800 text-brand-gold-400 flex items-center justify-center shadow-xs">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-brand-green-950">نقاء وأصالة 100%</h3>
              <p className="text-xs sm:text-sm text-brand-neutral-500 leading-relaxed">
                لا نستخدم إلا الزيوت العطرية النقية وأخشاب العود الطبيعية المعتمدة، بدون أي تخفيف أو مواد ضارة.
              </p>
            </div>

            <div className="space-y-3 bg-brand-neutral-50 p-6 rounded-3xl border border-brand-neutral-200/80 card-touch">
              <div className="h-12 w-12 rounded-2xl bg-brand-green-800 text-brand-gold-400 flex items-center justify-center shadow-xs">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-brand-green-950">ثبات وفوحان استثنائي</h3>
              <p className="text-xs sm:text-sm text-brand-neutral-500 leading-relaxed">
                تركيزات عالية ومتقنة (Extrait de Parfum) تضمن لك بقاء العطر فواحاً وملفتاً لساعات طويلة.
              </p>
            </div>

            <div className="space-y-3 bg-brand-neutral-50 p-6 rounded-3xl border border-brand-neutral-200/80 card-touch">
              <div className="h-12 w-12 rounded-2xl bg-brand-green-800 text-brand-gold-400 flex items-center justify-center shadow-xs">
                <Gift className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-brand-green-950">تغليف هدايا ملكي مجاناً</h3>
              <p className="text-xs sm:text-sm text-brand-neutral-500 leading-relaxed">
                يصلك كل طلب مغلفاً بعناية فائقة في صناديق مخملية فاخرة تليق بذوقك الرفيع وجاهزة للإهداء المباشر.
              </p>
            </div>
          </div>
        </section>

        {/* 5. CUSTOMER REVIEWS */}
        <ReviewsSection initialReviews={approvedReviews} />

        {/* 6. FAQ */}
        <FAQSection />

        {/* 7. CONTACT CTA BANNER */}
        <ContactCTA />
      </div>
    </div>
  );
}
