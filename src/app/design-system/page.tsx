import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { Sparkles, ArrowLeft, Heart } from "lucide-react";

export const metadata = constructMetadata({
  title: "دليل نظام التصميم OUD SHOP Design System | أمير ستور",
  description: "العرض التفاعلي الشامل لتوكنز الألوان، المقاسات، والظلال لنظام OUD SHOP المعتمد لمتجر أمير ستور.",
  canonicalUrl: "/design-system",
});

const COLOR_TOKENS = [
  {
    token: "color-6",
    name: "Surface",
    hex: "#EEEBE7",
    role: "الخلفية العامة والأسطح الأساسية للمتجر (Canvas & Surface)",
    textColor: "#2E3A24",
    border: "#DDDDDD",
  },
  {
    token: "color-1",
    name: "Border / Dark Olive",
    hex: "#2E3A24",
    role: "العناوين الرئيسية، هوية البراند، والحدود الداكنة (Brand Primary)",
    textColor: "#FFFFFF",
    border: "#2E3A24",
  },
  {
    token: "color-3",
    name: "Accent (Cyan)",
    hex: "#56CFE1",
    role: "الأزرار التفاعلية الحيوية وشارات التمييز (Interactive Accent)",
    textColor: "#12190e",
    border: "#56CFE1",
  },
  {
    token: "color-2",
    name: "Text Primary",
    hex: "#696969",
    role: "نصوص الفقرات والمحتوى العام المريح للعين (Body Text)",
    textColor: "#FFFFFF",
    border: "#696969",
  },
  {
    token: "color-4",
    name: "Text Light / Subtle",
    hex: "#DFDDD4",
    role: "الأسطح الثانوية والنصوص الهادئة (Surface Subtle / Text Light)",
    textColor: "#2E3A24",
    border: "#DDDDDD",
  },
  {
    token: "color-5",
    name: "Border Light",
    hex: "#DDDDDD",
    role: "حدود البطاقات والفواصل الناعمة (Card Borders & Dividers)",
    textColor: "#2E3A24",
    border: "#DDDDDD",
  },
  {
    token: "color-7",
    name: "Text Light / White",
    hex: "#FFFFFF",
    role: "أسطح البطاقات البيضاء والخلفيات المرفوعة (Card Surface & White)",
    textColor: "#2E3A24",
    border: "#DDDDDD",
  },
];

const TYPOGRAPHY_LEVELS = [
  { level: "text-9", size: "45px", lh: "53.7px", usage: "العناوين الكبرى والشاشات العريضة (Display / Hero)", sample: "أمير ستور للعطور الفاخرة" },
  { level: "text-4xl", size: "35px", lh: "45.9px", usage: "عناوين الأقسام الرئيسية (Section Headings)", sample: "أندر أدهان العود الملكية" },
  { level: "text-3xl", size: "27px", lh: "38.0px", usage: "عناوين الصفحات الداخلية (Page Headings)", sample: "دهن عود كلمنتان طبيعي سوبر" },
  { level: "text-2xl", size: "25px", lh: "35.0px", usage: "عناوين البطاقات الكبيرة (Card Headings)", sample: "عطر أمير الملكي Extrait de Parfum" },
  { level: "text-xl", size: "18px", lh: "25.6px", usage: "العناوين الفرعية والمجموعات (Subheadings)", sample: "مزيج استثنائي من العود والعنبر والورد" },
  { level: "text-lg", size: "16px", lh: "22.4px", usage: "نصوص التأكيد والأزرار (Buttons & Emphasis)", sample: "اطلب الآن عبر واتساب — شحن فوري" },
  { level: "text-base", size: "14px", lh: "21.0px", usage: "نصوص الفقرات الافتراضية (Default Body Text)", sample: "ننتقي لك أرقى أدهان العود والزيوت العطرية النقية بدون أي إضافات كيميائية مع ضمان ثبات 48 ساعة." },
  { level: "text-sm", size: "12px", lh: "16.8px", usage: "التسميات والمواصفات (Labels & Secondary)", sample: "الحجم: 100 مل • تركيز 30% • أصلي 100%" },
  { level: "text-xs", size: "10px", lh: "14.4px", usage: "البيانات الإضافية والشارات (Captions & Badges)", sample: "ضمان أصالة ومعاينة مجانية قبل الدفع" },
];

const SHAPE_TOKENS = [
  { token: "radius-sm", value: "3px", usage: "البادجات الدقيقة وحقول الإدخال الصامتة" },
  { token: "radius-md", value: "50px", usage: "الأزرار البيضاوية ومربعات الخيارات (Pills)" },
  { token: "radius-lg", value: "80px", usage: "الحاويات الانسيابية وكروت العطور العريضة" },
  { token: "radius-full", value: "9999px", usage: "الأزرار الرئيسية وشارات التمييز الدائرية الكاملة" },
];

const SPACING_TOKENS = [
  { token: "space-1", val: "2px" },
  { token: "space-2", val: "3px" },
  { token: "space-3", val: "5px" },
  { token: "space-4", val: "7px" },
  { token: "space-5", val: "8px" },
  { token: "space-6", val: "10px" },
  { token: "space-7", val: "12px" },
  { token: "space-8", val: "13px" },
  { token: "space-9", val: "15px" },
  { token: "space-10", val: "16px" },
  { token: "space-11", val: "23px" },
  { token: "space-12", val: "25px" },
  { token: "space-13", val: "26px" },
  { token: "space-14", val: "30px" },
  { token: "space-15", val: "38px" },
];

export default function DesignSystemPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 text-start">
      {/* Page Header */}
      <div className="space-y-4 border-b border-[#DDDDDD] pb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#2E3A24] text-[#56CFE1] px-4 py-1.5 text-xs font-bold">
          <Sparkles className="h-4 w-4 text-[#56CFE1]" />
          <span>OUD SHOP — Design System Tokens Verified</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#2E3A24] tracking-tight">
          لوحة نظام التصميم والهوية المعتمدة
        </h1>
        <p className="text-base sm:text-lg text-[#696969] max-w-3xl leading-relaxed">
          تم تطبيق وتضمين كامل التوكنز السبعة المحددة في مواصفات <strong>OUD SHOP</strong> بدقة 100% داخل كود Tailwind ومكتبة الـ Tokens الخاصة بمتجر <strong>أمير ستور</strong>.
        </p>
      </div>

      {/* 1. COLOR TOKENS */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-[#56CFE1] uppercase tracking-wider bg-[#2E3A24] px-3 py-1 rounded-full">
            المجموعة الأولى
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E3A24] mt-3">
            لوحة الألوان الأساسية (The 7 Exact Color Tokens)
          </h2>
          <p className="text-sm text-[#696969] mt-1">
            جميع الألوان مستخرجة بالقيم السداسية العشرية (HEX) الدقيقة وتعمل كـ Tailwind Tokens ومتحولات CSS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {COLOR_TOKENS.map((item) => (
            <div
              key={item.token}
              className="rounded-3xl border bg-white p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow"
              style={{ borderColor: "#DDDDDD" }}
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
                    backgroundColor: "rgba(255,255,255,0.85)",
                    color: "#2E3A24",
                  }}
                >
                  {item.hex}
                </div>
              </div>

              {/* Token Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-[#2E3A24]">
                    {item.token}
                  </span>
                  <span className="text-xs font-bold text-[#696969]">
                    {item.name}
                  </span>
                </div>
                <p className="text-xs text-[#696969] leading-relaxed">
                  {item.role}
                </p>
              </div>

              {/* Utility Classes helper */}
              <div className="pt-2 border-t border-[#DDDDDD] flex items-center justify-between text-[11px] font-mono text-[#696969]">
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
          <span className="text-xs font-bold text-[#56CFE1] uppercase tracking-wider bg-[#2E3A24] px-3 py-1 rounded-full">
            المجموعة الثانية
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E3A24] mt-3">
            حالات الأزرار التفاعلية (Interactive Button States)
          </h2>
          <p className="text-sm text-[#696969] mt-1">
            الأزرار البيضاوية (Pills) بتوكنز الحواف <code className="font-mono bg-white px-1.5 py-0.5 rounded">radius-md (50px)</code> و <code className="font-mono bg-white px-1.5 py-0.5 rounded">radius-full (9999px)</code>.
          </p>
        </div>

        <div className="rounded-3xl border border-[#DDDDDD] bg-white p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Primary Button */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#696969]">Primary CTA (#2E3A24)</span>
              <button
                type="button"
                className="w-full py-3.5 px-6 rounded-full bg-[#2E3A24] hover:bg-[#1a2215] active:scale-95 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-[#56CFE1]" />
                <span>شراء العطر الآن</span>
              </button>
            </div>

            {/* Accent Button */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#696969]">Accent Action (#56CFE1)</span>
              <button
                type="button"
                className="w-full py-3.5 px-6 rounded-full bg-[#56CFE1] hover:bg-[#3eb8cb] active:scale-95 text-[#12190e] font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="h-4 w-4" />
                <span>إضافة للمفضلة</span>
              </button>
            </div>

            {/* Outline Button */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#696969]">Outline (#2E3A24 border)</span>
              <button
                type="button"
                className="w-full py-3.5 px-6 rounded-full border-2 border-[#2E3A24] text-[#2E3A24] hover:bg-[#2E3A24] hover:text-white active:scale-95 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>تفاصيل المكونات</span>
              </button>
            </div>

            {/* Disabled State */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#696969]">Disabled State</span>
              <button
                type="button"
                disabled
                className="w-full py-3.5 px-6 rounded-full bg-[#DFDDD4] text-[#696969] font-bold text-sm opacity-60 cursor-not-allowed flex items-center justify-center gap-2"
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
          <span className="text-xs font-bold text-[#56CFE1] uppercase tracking-wider bg-[#2E3A24] px-3 py-1 rounded-full">
            المجموعة الثالثة
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E3A24] mt-3">
            الأشكال، الحواف، والظلال (Shapes, Radius & Elevation)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SHAPE_TOKENS.map((shape) => (
            <div
              key={shape.token}
              className="bg-white border border-[#DDDDDD] p-5 space-y-3 flex flex-col items-center text-center"
              style={{ borderRadius: shape.value }}
            >
              <div
                className="h-12 w-12 bg-[#2E3A24] text-[#56CFE1] flex items-center justify-center font-bold text-xs"
                style={{ borderRadius: shape.value }}
              >
                {shape.value}
              </div>
              <div>
                <span className="font-mono font-bold text-sm text-[#2E3A24] block">{shape.token}</span>
                <span className="text-xs text-[#696969] mt-1 block">{shape.usage}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Shadow SM */}
          <div
            className="p-6 rounded-3xl bg-white border border-[#DDDDDD] space-y-2 text-start"
            style={{ boxShadow: "1px 1px 3px 0px rgba(0, 0, 0, 0.3)" }}
          >
            <span className="font-mono font-bold text-sm text-[#2E3A24]">shadow-sm</span>
            <p className="text-xs font-mono text-[#696969]">rgba(0, 0, 0, 0.3) 1px 1px 3px 0px</p>
            <p className="text-xs text-[#696969] pt-1">يُستخدم للبطاقات العادية والعناصر القريبة من السطح.</p>
          </div>

          {/* Shadow MD */}
          <div
            className="p-6 rounded-3xl bg-white border border-[#DDDDDD] space-y-2 text-start"
            style={{ boxShadow: "0px 0px 6px 0px rgb(46, 58, 36)" }}
          >
            <span className="font-mono font-bold text-sm text-[#2E3A24]">shadow-md</span>
            <p className="text-xs font-mono text-[#696969]">rgb(46, 58, 36) 0px 0px 6px 0px (Oud Glow)</p>
            <p className="text-xs text-[#696969] pt-1">توهج أنيق بلون الأخضر الزيتي الداكن عند التحويم والتركيز.</p>
          </div>
        </div>
      </section>

      {/* 4. TYPOGRAPHY SCALE */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-[#56CFE1] uppercase tracking-wider bg-[#2E3A24] px-3 py-1 rounded-full">
            المجموعة الرابعة
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E3A24] mt-3">
            مقياس الخطوط والطباعة (Typography Scale)
          </h2>
          <p className="text-sm text-[#696969] mt-1">
            مقياس الأحجام من 10px حتى 45px مع ارتفاعات الأسطر (Line Heights) المتطابقة.
          </p>
        </div>

        <div className="rounded-3xl border border-[#DDDDDD] bg-white divide-y divide-[#DDDDDD] overflow-hidden">
          {TYPOGRAPHY_LEVELS.map((t) => (
            <div key={t.level} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-start">
              <div className="w-48 shrink-0 flex items-center gap-3">
                <span className="font-mono font-bold text-xs bg-[#EEEBE7] text-[#2E3A24] px-2.5 py-1 rounded-full">
                  {t.level}
                </span>
                <span className="text-xs text-[#696969] font-mono">
                  {t.size} / {t.lh}
                </span>
              </div>
              <div className="flex-1 font-bold text-[#2E3A24]" style={{ fontSize: t.size }}>
                {t.sample}
              </div>
              <div className="text-xs text-[#696969] max-w-xs text-start lg:text-end shrink-0">
                {t.usage}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SPACING SCALE */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-[#56CFE1] uppercase tracking-wider bg-[#2E3A24] px-3 py-1 rounded-full">
            المجموعة الخامسة
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E3A24] mt-3">
            مقياس المسافات (Spacing Scale — Base 4px Grid)
          </h2>
        </div>

        <div className="rounded-3xl border border-[#DDDDDD] bg-white p-6 overflow-x-auto">
          <div className="flex items-end gap-3 min-w-max pb-2">
            {SPACING_TOKENS.map((sp) => (
              <div key={sp.token} className="flex flex-col items-center gap-2">
                <div
                  className="bg-[#2E3A24] rounded-t-sm"
                  style={{ width: "24px", height: sp.val }}
                />
                <span className="text-[10px] font-mono font-bold text-[#2E3A24]">{sp.val}</span>
                <span className="text-[9px] font-mono text-[#696969]">{sp.token.replace("space-", "s-")}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="pt-8 border-t border-[#DDDDDD] flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-[#2E3A24] hover:text-[#56CFE1] transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>العودة إلى الصفحة الرئيسية لمتجر أمير ستور</span>
        </Link>
        <Link href="/products" className="inline-flex items-center gap-2 font-bold text-[#2E3A24] hover:text-[#56CFE1] transition-colors">
          <span>تصفح تشكيلة العطور بالتوكنز الجديدة</span>
        </Link>
      </div>
    </div>
  );
}
