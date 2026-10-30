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
import { GsapStaggerReveal } from "@/components/motion/gsap-stagger-reveal";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { OlfactoryPyramid3D } from "@/components/products/olfactory-pyramid-3d";
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
  Compass,
  Award,
} from "lucide-react";
import { env } from "@/lib/env";

const SCENT_NOTES_BAR = [
  { note: "عود كلمنتan طبيعي", type: "خشب بخوري نفاث", icon: "🪵", tag: "نوتة أصيلة" },
  { note: "عود كمبودي معتق", type: "سويت بلسمي دافئ", icon: "👑", tag: "نادر جداً" },
  { note: "عنبر أشهب ملكي", type: "فوحان ملكي فاخر", icon: "✨", tag: "فوحان استثنائي" },
  { note: "مسك أبيض بودري", type: "نظافة وأناقة نقية", icon: "🌸", tag: "انتعاش دائم" },
  { note: "زعفران كشميري", type: "توابل شرقية أرستقراطية", icon: "🔥", tag: "نخب أول" },
  { note: "ورد طائفي فاخر", type: "زهري ملكي مخملي", icon: "🌹", tag: "تقطير أول" },
];

export default async function HomePage() {
  const products = await getProductsStore();
  const featuredProducts = products.filter((p) => p.published && p.featured).slice(0, 4);
  const approvedReviews = getApprovedReviews();

  const phone1 = env.business.phone || "01220086002";
  const rawWhatsApp = env.business.whatsapp || "01220086002";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم، أود الاستفسار عن تشكيلة العطور الملكية ودهن العود المتاحة لدى متجر أمير ستور."
  )}`;

  return (
    <div className="flex flex-col gap-14 sm:gap-20 pb-20 bg-[#08090C] text-[#F8F9FA] overflow-x-hidden">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0D0F14] via-[#08090C] to-[#08090C] text-white pt-10 sm:pt-16 pb-16 sm:pb-24 text-start border-b border-amber-400/15">
        {/* Ambient Gold Radial Auras */}
        <div className="absolute top-1/4 start-1/4 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 end-10 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-7">
              {/* Live Store Badge & Tester Guarantee Pill */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/70 border border-amber-400/40 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white shadow-[0_0_15px_rgba(212,175,55,0.2)] backdrop-blur-md">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
                  </span>
                  <span>متجر أمير ستور الرسمي • دار العطور والعود الفاخر</span>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] border border-amber-400/25 px-3 py-1 text-xs font-semibold text-amber-200/90 backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>معاينة وعينات تجربة مجانية</span>
                </div>
              </div>

              {/* Title & Tagline with GSAP Text Reveal */}
              <GsapTextReveal>
                <div className="space-y-3">
                  <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white font-arabic">
                    أمير ستور <br className="hidden sm:inline" />
                    <span className="liquid-gold-text drop-shadow-[0_4px_20px_rgba(212,175,55,0.45)]">
                      للعطور والعود الفاخر
                    </span>
                  </h1>
                  <p className="text-base xs:text-lg sm:text-2xl text-amber-100 font-extrabold font-serif tracking-wide">
                    ✨ دهن عود نقي • عطور شرقية وفرنسية • بخور ومسك ملكي
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mt-4">
                  ننتقي لك أرقى أدهان العود الطبيعية والعطور الحصرية التي تجمع بين عبق التراث الشرقي الأصيل وأناقة الابتكار الفرنسي، مع ضمان الفوحان وثبات 72 ساعة حقيقي ومعاينة كاملة قبل الدفع.
                </p>
              </GsapTextReveal>

              {/* Magnetic Action Buttons (Pills) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <Link href="/products" className="w-full">
                  <MagneticButton
                    type="button"
                    className="w-full py-4 px-5 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] hover:brightness-110 active:scale-95 text-black font-black text-sm sm:text-base shadow-[0_0_25px_rgba(212,175,55,0.45)] flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Sparkles className="h-5 w-5 text-black" />
                    <span>تصفح العطور الملكية</span>
                    <ArrowLeft className="h-5 w-5 text-black" />
                  </MagneticButton>
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <MagneticButton
                    type="button"
                    className="w-full py-4 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white font-black text-sm sm:text-base shadow-[0_0_20px_rgba(37,211,102,0.35)] flex items-center justify-center gap-2 cursor-pointer border border-white/20 transition-all"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>اطلب عبر واتساب</span>
                  </MagneticButton>
                </a>

                <a href={`tel:${phone1}`} className="w-full">
                  <MagneticButton
                    type="button"
                    glow={false}
                    className="w-full py-4 px-4 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-amber-400/30 transition-all"
                  >
                    <Phone className="h-4 w-4 text-amber-400" />
                    <span>اتصال: {phone1}</span>
                  </MagneticButton>
                </a>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-5 border-t border-amber-400/20 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-xs sm:text-sm text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>أصالة 100% ونقاء معتمد</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>ثبات 72 ساعة يدوم لأيام</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>شحن وتوصيل فوري لكافة المدن</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card / 3D Flacon Showcase */}
            <div className="lg:col-span-5">
              <GsapHeroShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Gold Ticker Banner */}
      <div className="bg-[#0D0F14] text-white text-xs sm:text-sm py-3 px-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-y border-amber-400/20 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-black shrink-0 font-serif">
              ROYAL VIP
            </span>
            <span className="text-slate-300 font-medium text-xs sm:text-sm truncate sm:overflow-visible sm:whitespace-normal">
              ✨ شحن مجاني للطلبات من 1000 ج.م • ضمان استبدال ومعاينة كاملة 72 ساعة • هدايا وتغليف مخملي ملكي مجاناً
            </span>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 text-black text-xs font-black active:scale-95 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0 cursor-pointer"
          >
            <MessageCircle className="h-3.5 w-3.5 text-black" />
            <span>طلب عطر مخصص</span>
          </a>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 min-w-0">
        {/* 2. FRAGRANCE PYRAMID & SCENT NOTES EXPLORATION BAR */}
        <section className="space-y-6 text-start">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-amber-400/20 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase font-serif flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>FRAGRANCE PYRAMID & OLFACTORY NOTES</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-arabic">
                استكشف النوتات العطرية والمكونات النادرة
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                مستخلصات طبيعية مقطرة بعناية لتمنحك هالة عطرية ساحرة لا تُنسى
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-300 hover:text-amber-200 transition-colors"
            >
              <span>جميع العطور ({products.filter((p) => p.published).length} منتج)</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <GsapStaggerReveal className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {SCENT_NOTES_BAR.map((item) => (
              <div
                key={item.note}
                className="group relative rounded-2xl bg-white/[0.03] border border-amber-400/20 hover:border-amber-400/60 p-4 text-center backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] card-touch cursor-pointer transition-all hover:bg-white/[0.06]"
              >
                <div className="text-2xl mb-2 group-hover:scale-125 transition-transform">
                  {item.icon}
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-white line-clamp-1">
                  {item.note}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {item.type}
                </p>
                <span className="mt-2 inline-block text-[9px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  {item.tag}
                </span>
              </div>
            ))}
          </GsapStaggerReveal>
        </section>

        {/* 3. THE 4 ROYAL FRAGRANCE CATEGORIES */}
        <section className="space-y-6 text-start">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-amber-400/20 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase font-serif flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-amber-400" />
                <span>ROYAL FRAGRANCE COLLECTIONS</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-arabic">
                اختر الفئة العطرية الملكية
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                أربعة مسارات عطرية استثنائية تناسب كل الأذواق الرفيعة
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-300 hover:text-amber-200 transition-colors"
            >
              <span>عرض الكتالوج كاملاً</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Category 1: Pure Oud Oils */}
            <Link
              href="/products?category=pure-oud-oils"
              className="group rounded-3xl border border-amber-400/20 hover:border-amber-400/60 bg-white/[0.03] backdrop-blur-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] card-lift flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-white font-arabic">
                    دهن العود والزيوت النقية
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    أدهان عود كلمنتان وكمبودي وتراد طبيعية صافية 100% بنكهات بخورية ملكية ساحرة.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-300">
                <span>تصفح أدهان العود</span>
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Category 2: Royal Oriental */}
            <Link
              href="/products?category=oriental-perfumes"
              className="group rounded-3xl border border-amber-400/20 hover:border-amber-400/60 bg-white/[0.03] backdrop-blur-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] card-lift flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <Flame className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-white font-arabic">
                    عطور شرقية ملكية
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    توليفات ملكية خاصة تمزج العود والعنبر مع الورد الطائفي والزعفران الكشميري.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-300">
                <span>تصفح العطور الشرقية</span>
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Category 3: French Perfumes */}
            <Link
              href="/products?category=french-perfumes"
              className="group rounded-3xl border border-amber-400/20 hover:border-amber-400/60 bg-white/[0.03] backdrop-blur-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] card-lift flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <Heart className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-white font-arabic">
                    عطور فرنسية حصرية
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    إبداعات عطرية عالمية دافئة بنفحات الفانيليا، التوباكو، والجلود الإيطالية الفاخرة.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-300">
                <span>تصفح العطور الفرنسية</span>
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Category 4: Musk & Bakhoor */}
            <Link
              href="/products?category=musk-and-amber"
              className="group rounded-3xl border border-amber-400/20 hover:border-amber-400/60 bg-white/[0.03] backdrop-blur-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] card-lift flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <Wind className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-white font-arabic">
                    المسك والعنبر والبخور
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    مسك أبيض بودري نقي وكسر عود مروكي طبيعي لتعطير المجالس والمناسبات الرسمية.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-300">
                <span>تصفح المسك والبخور</span>
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* 4. FEATURED PRODUCTS (Royal Collection Showcase) */}
        <section className="text-start space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-amber-400/20 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase font-serif flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-amber-400" />
                <span>TOP BESTSELLERS & SIGNATURE FLACONS</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-arabic">
                عطور مختارة من أمير ستور
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                توليفات ملكية حازت على أعلى تقييمات الثبات والفوحان لدى عملائنا
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 active:scale-95 transition-all"
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

        {/* 5. INTERACTIVE 3D OLFACTORY ARCHITECTURE & MOLECULAR PYRAMID */}
        <OlfactoryPyramid3D />

        {/* 6. CRAFTSMANSHIP STORYTELLING ("رحلة العود الملكي") */}
        <section className="relative rounded-3xl bg-gradient-to-br from-[#13161F] via-[#0D0F14] to-[#08090C] border border-amber-400/30 p-8 sm:p-12 lg:p-16 text-start shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="absolute top-0 end-0 w-96 h-96 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 text-xs font-bold text-amber-300 uppercase tracking-widest font-serif">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>THE ROYAL OUD JOURNEY • رحلة العود الملكي</span>
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight font-arabic">
              من غابات كلمنتان إلى أرقى قوارير الكريستال: <br />
              <span className="liquid-gold-text">قصة شغف بالعبير الطبيعي الصافي</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              في متجر أمير ستور، نعتبر العطر فناً راقياً وبصمة تدوم في الذاكرة. نسافر شخصياً إلى أعماق غابات إندونيسيا وجبال كمبوديا لاقتناء قطع العود الطبيعي النادر، ثم نخضع كل قطرة دهن لاختبارات نقاء صارمة خالية تماماً من أي مواد كيميائية، لتصلك التحفة العطرية بكامل وقارها وفخامتها الملكية.
            </p>

            {/* 3 Luxury Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-amber-400/20">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-amber-400/20 text-center">
                <span className="text-3xl font-black text-amber-400 block font-serif">100%</span>
                <span className="text-xs text-slate-300 mt-1 block font-semibold">مستخلصات عطرية طبيعية صافية</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-amber-400/20 text-center">
                <span className="text-3xl font-black text-amber-400 block font-serif">+72H</span>
                <span className="text-xs text-slate-300 mt-1 block font-semibold">ثبات وفوحان مستمر لأيام</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-amber-400/20 text-center">
                <span className="text-3xl font-black text-amber-400 block font-serif">ROYAL VIP</span>
                <span className="text-xs text-slate-300 mt-1 block font-semibold">تغليف مخملي فاخر مجاناً</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. THREE INVIOLABLE STANDARDS (Why Amir Store) */}
        <section className="rounded-3xl bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-10 text-start space-y-6 border border-amber-400/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-amber-400 tracking-wider uppercase font-serif">
              WHY AMIR STORE • لماذا أمير ستور؟
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-arabic">
              ثلاثة معايير لا نتنازل عنها في كل قطرة عطر
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-3 bg-white/[0.02] p-6 rounded-3xl border border-amber-400/15 card-lift">
              <div className="h-12 w-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center shadow-sm">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-arabic">نقاء وأصالة 100%</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                لا نستخدم إلا الزيوت العطرية النقية وأخشاب العود الطبيعية المعتمدة، بدون أي تخفيف أو خلط بمواد اصطناعية.
              </p>
            </div>

            <div className="space-y-3 bg-white/[0.02] p-6 rounded-3xl border border-amber-400/15 card-lift">
              <div className="h-12 w-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center shadow-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-arabic">ثبات وفوحان 72 ساعة</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                تركيزات عالية ومتقنة (Extrait de Parfum) تضمن لك بقاء العطر فواحاً وملفتاً للنظر لأيام على الأقمشة.
              </p>
            </div>

            <div className="space-y-3 bg-white/[0.02] p-6 rounded-3xl border border-amber-400/15 card-lift">
              <div className="h-12 w-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center shadow-sm">
                <Gift className="h-6 w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-arabic">تغليف هدايا ملكي مجاناً</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                يصلك كل طلب مغلفاً بعناية فائقة في علب مخملية فاخرة تليق بذوقك الرفيع وجاهزة للإهداء المباشر لأحبائك.
              </p>
            </div>
          </div>
        </section>

        {/* 7. INSPECTION & 72-HOUR GUARANTEE POLICY BANNER */}
        <section className="rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent border border-amber-400/40 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(212,175,55,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-start">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
              <ShieldCheck className="h-4 w-4" />
              <span>ضمان التجربة والأمان الكامل</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-arabic">
              حق المعاينة قبل الدفع + ضمان ثبات 72 ساعة
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              نفخر بجودة عطورنا! نمنحك حق فتح الشحنة وتجربة العينة المرفقة أمام مندوب التوصيل قبل دفع أي قرش، مع إمكانية الاسترجاع والاستبدال خلال 72 ساعة.
            </p>
          </div>
          <Link
            href="/policy"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.08] hover:bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs sm:text-sm font-bold transition-all shrink-0 active:scale-95"
          >
            <span>تفاصيل سياسة الضمان</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </section>

        {/* 8. VIP CUSTOMER REVIEWS */}
        <ReviewsSection initialReviews={approvedReviews} />

        {/* 9. FAQ */}
        <FAQSection />

        {/* 10. CONTACT CTA BANNER */}
        <ContactCTA />
      </div>
    </div>
  );
}
