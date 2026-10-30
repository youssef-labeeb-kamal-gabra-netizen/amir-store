import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { Sparkles, ArrowLeft, Heart } from "lucide-react";

export const metadata = constructMetadata({
  title: "دليل نظام التصميم الملكي | أمير ستور",
  description: "العرض التفاعلي الشامل لتوكنز الألوان، المقاسات، والظلال لنظام Royal Obsidian Noir & Liquid Gold المعتمد لمتجر أمير ستور.",
  canonicalUrl: "/design-system",
});

const COLOR_TOKENS = [
  {
    token: "obsidian-950",
    name: "Deep Obsidian Noir",
    hex: "#08090C",
    role: "الخلفية العامة الفاخرة للواجهة (Onyx Black Canvas)",
    textColor: "#F8F9FA",
    border: "rgba(212, 175, 55, 0.3)",
  },
  {
    token: "obsidian-900",
    name: "Obsidian Surface Dark",
    hex: "#0D0F14",
    role: "الأسطح الثانوية والأشرطة العلوية (Surface Dark)",
    textColor: "#F8F9FA",
    border: "rgba(212, 175, 55, 0.25)",
  },
  {
    token: "obsidian-800",
    name: "Obsidian Card Glass",
    hex: "#13161F",
    role: "بطاقات العطور الزجاجية والأسطح المرفوعة (Glassmorphism)",
    textColor: "#F8F9FA",
    border: "rgba(212, 175, 55, 0.2)",
  },
  {
    token: "gold-400",
    name: "Royal Champagne Gold",
    hex: "#D4AF37",
    role: "هوية البراند الملكية، الأسعار، والأزرار الرئيسية (Brand Primary)",
    textColor: "#08090C",
    border: "#D4AF37",
  },
  {
    token: "gold-200",
    name: "Champagne Light",
    hex: "#F5E296",
    role: "عناصر التمييز، التوهج، واللمسات البراقة (Accent & Highlights)",
    textColor: "#08090C",
    border: "#F5E296",
  },
  {
    token: "text-ivory",
    name: "Crisp Ivory",
    hex: "#F8F9FA",
    role: "العناوين الملكية والنصوص البارزة فائقة الوضوح (Primary Text)",
    textColor: "#08090C",
    border: "rgba(255, 255, 255, 0.3)",
  },
  {
    token: "text-platinum",
    name: "Platinum Muted",
    hex: "#E2E8F0",
    role: "نصوص الفقرات والمحتوى العام المريح للعين (Secondary Text)",
    textColor: "#08090C",
    border: "rgba(255, 255, 255, 0.2)",
  },
];

const TYPOGRAPHY_LEVELS = [
  { level: "text-9", size: "45px", lh: "53.7px", usage: "العناوين الكبرى والشاشات العريضة (Display / Hero)", sample: "أمير ستور للعطور والعود الفاخر" },
  { level: "text-4xl", size: "35px", lh: "45.9px", usage: "عناوين الأقسام الرئيسية (Section Headings)", sample: "أندر أدهان العود الملكية الطبيعية" },
  { level: "text-3xl", size: "27px", lh: "38.0px", usage: "عناوين الصفحات الداخلية (Page Headings)", sample: "دهن عود كلمنتان طبيعي سوبر" },
  { level: "text-2xl", size: "25px", lh: "35.0px", usage: "عناوين البطاقات الكبيرة (Card Headings)", sample: "عطر أمير الملكي Extrait de Parfum" },
  { level: "text-xl", size: "18px", lh: "25.6px", usage: "العناوين الفرعية والمجموعات (Subheadings)", sample: "مزيج استثنائي من العود والعنبر والورد" },
  { level: "text-lg", size: "16px", lh: "22.4px", usage: "نصوص التأكيد والأزرار (Buttons & Emphasis)", sample: "اطلب الآن عبر واتساب — شحن فوري" },
  { level: "text-base", size: "14px", lh: "21.0px", usage: "نصوص الفقرات الافتراضية (Default Body Text)", sample: "ننتقي لك أرقى أدهان العود والزيوت العطرية النقية بدون أي إضافات كيميائية مع ضمان ثبات 72 ساعة." },
  { level: "text-sm", size: "12px", lh: "16.8px", usage: "التسميات والمواصفات (Labels & Secondary)", sample: "الحجم: 100 مل • تركيز Extrait 30% • أصلي 100%" },
  { level: "text-xs", size: "10px", lh: "14.4px", usage: "البيانات الإضافية والشارات (Captions & Badges)", sample: "ضمان أصالة ومعاينة مجانية قبل الدفع" },
];

const SHAPE_TOKENS = [
  { token: "radius-sm", value: "4px", usage: "البادجات الدقيقة وحقول الإدخال الصامتة" },
  { token: "radius-md", value: "50px", usage: "الأزرار البيضاوية ومربعات الخيارات (Pills)" },
  { token: "radius-lg", value: "80px", usage: "الحاويات الانسيابية وكروت العطور العريضة" },
  { token: "radius-full", value: "9999px", usage: "الأزرار الرئيسية وشارات التمييز الدائرية الكاملة" },
];

export default function DesignSystemPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 text-start text-white">
      {/* Page Header */}
      <div className="space-y-4 border-b border-amber-400/20 pb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 px-4 py-1.5 text-xs font-bold">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>Royal Obsidian Noir & Liquid Gold Palette Verified</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-arabic">
          لوحة نظام التصميم والهوية الملكية المعتمدة
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
          تم تطبيق وتضمين كامل لوحة ألوان <strong>Royal Obsidian Noir & Liquid Gold</strong> بدقة 100% داخل كود Tailwind ومكتبة الـ Tokens ومتحولات CSS الخاصة بمتجر <strong>أمير ستور</strong>.
        </p>
      </div>

      {/* 1. COLOR TOKENS */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-600 px-3 py-1 rounded-full font-serif">
            المجموعة الأولى
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 font-arabic">
            لوحة الألوان الملكية (Royal Obsidian Noir & Liquid Gold)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            جميع الألوان مستخرجة بالقيم السداسية العشرية (HEX) الدقيقة وتعمل كـ Tailwind Tokens ومتحولات CSS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {COLOR_TOKENS.map((item) => (
            <div
              key={item.token}
              className="rounded-3xl border bg-white/[0.03] backdrop-blur-2xl p-5 space-y-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] card-lift"
              style={{ borderColor: "rgba(212, 175, 55, 0.25)" }}
            >
              {/* Color Box */}
              <div
                className="h-28 w-full rounded-2xl flex flex-col justify-end p-3.5 shadow-inner transition-transform hover:scale-[1.02]"
                style={{
                  backgroundColor: item.hex,
                  border: `1px solid ${item.border}`,
                }}
              >
                <div
                  className="px-2.5 py-1 rounded-full text-xs font-mono font-bold w-fit shadow-xs backdrop-blur-xs"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.75)",
                    color: "#D4AF37",
                  }}
                >
                  {item.hex}
                </div>
              </div>

              {/* Token Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-amber-400">
                    {item.token}
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    {item.name}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.role}
                </p>
              </div>

              {/* Utility Classes helper */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>bg-{item.token}</span>
                <span>text-{item.token}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. LIVE INTERACTIVE BUTTONS & STATES */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-600 px-3 py-1 rounded-full font-serif">
            المجموعة الثانية
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 font-arabic">
            حالات الأزرار التفاعلية (Interactive Button States)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            الأزرار البيضاوية (Pills) بتوكنز الحواف <code className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-amber-300">radius-md (50px)</code> و <code className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-amber-300">radius-full (9999px)</code>.
          </p>
        </div>

        <div className="rounded-3xl border border-amber-400/25 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-8 space-y-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Primary Liquid Gold CTA */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Primary Liquid Gold CTA</span>
              <button
                type="button"
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] hover:brightness-110 active:scale-95 text-black font-black text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-black" />
                <span>شراء العطر الآن</span>
              </button>
            </div>

            {/* Accent WhatsApp Action */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">WhatsApp Instant (#25D366)</span>
              <button
                type="button"
                className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
              >
                <Heart className="h-4 w-4" />
                <span>طلب عبر واتساب</span>
              </button>
            </div>

            {/* Outline Button */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Obsidian Glass Outline</span>
              <button
                type="button"
                className="w-full py-3.5 px-6 rounded-full border border-amber-400/40 bg-white/[0.04] text-amber-300 hover:bg-amber-400/15 hover:border-amber-400 active:scale-95 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>تفاصيل المكونات</span>
              </button>
            </div>

            {/* Disabled State */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Disabled State</span>
              <button
                type="button"
                disabled
                className="w-full py-3.5 px-6 rounded-full bg-white/5 border border-white/10 text-slate-500 font-bold text-sm opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>نفدت الكمية</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHAPES & ELEVATION */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-600 px-3 py-1 rounded-full font-serif">
            المجموعة الثالثة
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 font-arabic">
            الأشكال، الحواف، والظلال (Shapes, Radius & Elevation)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SHAPE_TOKENS.map((shape) => (
            <div
              key={shape.token}
              className="bg-white/[0.03] border border-amber-400/20 p-5 space-y-3 flex flex-col items-center text-center shadow-sm"
              style={{ borderRadius: shape.value }}
            >
              <div
                className="h-12 w-12 bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center font-bold text-xs"
                style={{ borderRadius: shape.value }}
              >
                {shape.value}
              </div>
              <div>
                <span className="font-mono font-bold text-sm text-amber-400 block">{shape.token}</span>
                <span className="text-xs text-slate-400 mt-1 block">{shape.usage}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TYPOGRAPHY SCALE */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-600 px-3 py-1 rounded-full font-serif">
            المجموعة الرابعة
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 font-arabic">
            مقياس الخطوط والطباعة (Typography Scale)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            مقياس الأحجام من 10px حتى 45px مع خطوط Amiri للعناوين و Cairo للواجهات.
          </p>
        </div>

        <div className="rounded-3xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-2xl divide-y divide-white/10 overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
          {TYPOGRAPHY_LEVELS.map((t) => (
            <div key={t.level} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-start">
              <div className="w-48 shrink-0 flex items-center gap-3">
                <span className="font-mono font-bold text-xs bg-amber-400/15 border border-amber-400/30 text-amber-300 px-2.5 py-1 rounded-full">
                  {t.level}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {t.size} / {t.lh}
                </span>
              </div>
              <div className="flex-1 font-bold text-white font-arabic" style={{ fontSize: t.size }}>
                {t.sample}
              </div>
              <div className="text-xs text-slate-400 max-w-xs text-start lg:text-end shrink-0">
                {t.usage}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="pt-8 border-t border-amber-400/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-amber-300 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>العودة إلى الصفحة الرئيسية لمتجر أمير ستور</span>
        </Link>
        <Link href="/products" className="inline-flex items-center gap-2 font-bold text-amber-300 hover:text-white transition-colors">
          <span>تصفح تشكيلة العطور بالتوكنز الملكية الجديدة</span>
        </Link>
      </div>
    </div>
  );
}
