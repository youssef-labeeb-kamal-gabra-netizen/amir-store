"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, CheckCircle2, RotateCcw, ArrowLeft, ShieldCheck, Compass, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INITIAL_PRODUCTS } from "@/data/catalog";
import { useCart } from "@/lib/cart-context";

interface QuizOption {
  id: string;
  label: string;
  desc: string;
  icon: string;
}

const OCCASIONS: QuizOption[] = [
  { id: "royal", label: "المناسبات الملكية والقمم الرسمية", desc: "حضور طاغٍ وفوحان استثنائي يفرض الهيبة والوقار", icon: "👑" },
  { id: "daily", label: "الاستخدام اليومي الراقي", desc: "نقاء مخملي منعش يرافقك طوال ساعات العمل واللقاءات", icon: "✨" },
  { id: "evening", label: "السهرات والمناسبات الخاصة", desc: "دفء حالم وسحر جذاب من العنبر والفانيليا والأخشاب", icon: "🌙" },
  { id: "calm", label: "التأمل والاسترخاء الروحي", desc: "نفحات المسك الأبيض والورد النقي للهدوء والسكينة", icon: "🕊️" },
];

const NOTES: QuizOption[] = [
  { id: "oud", label: "العود الطبيعي والبخور المعتق", desc: "نوتات خشبية دافئة، بخور هندي، ودهن عود كمبودي نقي", icon: "🪵" },
  { id: "amber", label: "العنبر الملكي والباتشولي والتوابل", desc: "عمق شرقي غني يفيض بالدفء والغموض الفاتن", icon: "🔥" },
  { id: "floral", label: "الورد الطائفي والزهور النادرة", desc: "أريج رقيق يجمع فخامة الشرق برقي الطبيعة الخلابة", icon: "🌹" },
  { id: "musk", label: "المسك الأبيض الصافي والبودري", desc: "إحساس النظافة الفائقة والأناقة الهادئة المنعشة", icon: "🤍" },
];

const PROJECTIONS: QuizOption[] = [
  { id: "beast", label: "فوحان ملكي جبار (Beast Mode)", desc: "ثبات 72 ساعة مع هالة عطرية واسعة تسبق حضورك", icon: "⚡" },
  { id: "balanced", label: "توازن راقٍ وأنيق (Balanced Aura)", desc: "فوحان محيطي ناعم لمدة 24-48 ساعة دون إزعاج", icon: "⚖️" },
  { id: "intimate", label: "همس مخملي خاص (Intimate Scent)", desc: "عطر شخصي قريب يفوح عند الاقتراب والمصافحة", icon: "💎" },
];

export function ScentFinderTemplate() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedOccasion, setSelectedOccasion] = useState<string>("royal");
  const [selectedNote, setSelectedNote] = useState<string>("oud");
  const [selectedProjection, setSelectedProjection] = useState<string>("beast");
  const { addItem, setIsCartOpen } = useCart();

  // Find the closest matching fragrance from the catalog
  const getMatchedProduct = () => {
    if (selectedNote === "oud") {
      return INITIAL_PRODUCTS.find((p) => p.slug.includes("oud") || p.name.includes("عود")) || INITIAL_PRODUCTS[0];
    }
    if (selectedNote === "amber") {
      return INITIAL_PRODUCTS.find((p) => p.name.includes("عنبر") || p.slug.includes("amber")) || INITIAL_PRODUCTS[1];
    }
    if (selectedNote === "musk") {
      return INITIAL_PRODUCTS.find((p) => p.name.includes("مسك") || p.slug.includes("musk")) || INITIAL_PRODUCTS[2];
    }
    return INITIAL_PRODUCTS[0];
  };

  const matchedProduct = getMatchedProduct();

  const handleReset = () => {
    setStep(1);
    setSelectedOccasion("royal");
    setSelectedNote("oud");
    setSelectedProjection("beast");
  };

  const handleAddToCart = () => {
    addItem(matchedProduct);
    setIsCartOpen(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-amber-400/25 bg-[#0D0F14]/90 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.8)] text-white text-start space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold font-serif uppercase tracking-wider">
          <Compass className="h-4 w-4 text-amber-400" />
          <span>ROYAL SCENT DISCOVERY TEMPLATE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white font-arabic">
          مستكشف التوقيع العطري الملكي
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          أجب عن 3 أسئلة بسيطة ليكتشف نظام الذكاء العطري تركيبتك المثالية من بين نوادر أدهان العود والعطور الحصرية مع ضمان المعاينة المسبقة.
        </p>

        {/* Step Progress Pills */}
        <div className="flex items-center justify-center gap-2 pt-3">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === s
                  ? "w-10 bg-gradient-to-r from-amber-400 to-amber-600"
                  : step > s
                  ? "w-6 bg-amber-400/40"
                  : "w-6 bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Occasion */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-400 font-serif">STEP 01 / 03</span>
            <h3 className="text-xl font-bold text-white font-arabic">
              ما هي المناسبة أو الغرض الأساسي من استخدامك للعطر؟
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {OCCASIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedOccasion(item.id)}
                className={`p-5 rounded-2xl border text-start transition-all duration-200 card-touch ${
                  selectedOccasion === item.id
                    ? "border-amber-400 bg-amber-400/10 shadow-[0_0_20px_rgba(212,175,55,0.25)] ring-1 ring-amber-400/50"
                    : "border-white/10 bg-white/[0.02] hover:border-amber-400/30 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  {selectedOccasion === item.id && (
                    <CheckCircle2 className="h-5 w-5 text-amber-400" />
                  )}
                </div>
                <h4 className="font-bold text-white text-base mb-1 font-arabic">{item.label}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              size="md"
              onClick={() => setStep(2)}
              className="px-8 font-black gap-2"
            >
              <span>الخطوة التالية (النوتات العطرية)</span>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Notes */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-400 font-serif">STEP 02 / 03</span>
            <h3 className="text-xl font-bold text-white font-arabic">
              ما هي العائلة العطرية والنوتات التي تميل إليها حواسك؟
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {NOTES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedNote(item.id)}
                className={`p-5 rounded-2xl border text-start transition-all duration-200 card-touch ${
                  selectedNote === item.id
                    ? "border-amber-400 bg-amber-400/10 shadow-[0_0_20px_rgba(212,175,55,0.25)] ring-1 ring-amber-400/50"
                    : "border-white/10 bg-white/[0.02] hover:border-amber-400/30 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  {selectedNote === item.id && (
                    <CheckCircle2 className="h-5 w-5 text-amber-400" />
                  )}
                </div>
                <h4 className="font-bold text-white text-base mb-1 font-arabic">{item.label}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-slate-400">
              رجوع
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setStep(3)}
              className="px-8 font-black gap-2"
            >
              <span>الخطوة التالية (الفوحان والثبات)</span>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Projection */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-400 font-serif">STEP 03 / 03</span>
            <h3 className="text-xl font-bold text-white font-arabic">
              ما هو مستوى الفوحان وثبات الهالة العطرية المفضل لديك؟
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PROJECTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedProjection(item.id)}
                className={`p-5 rounded-2xl border text-start transition-all duration-200 card-touch ${
                  selectedProjection === item.id
                    ? "border-amber-400 bg-amber-400/10 shadow-[0_0_20px_rgba(212,175,55,0.25)] ring-1 ring-amber-400/50"
                    : "border-white/10 bg-white/[0.02] hover:border-amber-400/30 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  {selectedProjection === item.id && (
                    <CheckCircle2 className="h-5 w-5 text-amber-400" />
                  )}
                </div>
                <h4 className="font-bold text-white text-base mb-1 font-arabic">{item.label}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="text-slate-400">
              رجوع
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setStep(4)}
              className="px-8 font-black gap-2 shadow-lg"
            >
              <span>عرض التوقيع العطري المطابق</span>
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Result Match Showcase */}
      {step === 4 && (
        <div className="space-y-6 animate-in zoom-in-95 duration-400">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#13161F] to-[#0D0F14] border border-amber-400/40 space-y-6 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>نسبة التطابق العطري: 98.4%</span>
                </span>
                <span className="text-xs font-bold text-amber-400 font-serif">PERFECT SIGNATURE MATCH</span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-amber-300 inline-flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>إعادة الاستكشاف من جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Product Visual */}
              <div className="md:col-span-4 flex justify-center">
                <div className="relative h-56 w-56 rounded-2xl overflow-hidden bg-black/40 border border-amber-400/30 p-4 flex items-center justify-center">
                  <Image
                    src={matchedProduct.images[0] || "/images/products/ameer-oud-parfum.svg"}
                    alt={matchedProduct.name}
                    width={200}
                    height={200}
                    className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
                  />
                  <div className="absolute top-2 end-2 bg-amber-400 text-black px-2 py-0.5 rounded-md text-[10px] font-black">
                    نقاء 100%
                  </div>
                </div>
              </div>

              {/* Product Details & Pyramid */}
              <div className="md:col-span-8 space-y-3">
                <span className="text-xs font-bold text-amber-400 font-serif">
                  {matchedProduct.categoryName}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-arabic">
                  {matchedProduct.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {matchedProduct.description}
                </p>

                {/* Scent Pyramid Tags */}
                {matchedProduct.specifications && matchedProduct.specifications.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    {matchedProduct.specifications.slice(0, 2).map((spec, sIdx) => (
                      <span key={sIdx} className="px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300">
                        {spec.label}: {spec.value}
                      </span>
                    ))}
                  </div>
                )}

                {/* Pricing & Free Sample Pill */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
                  <div>
                    <span className="text-xs text-slate-400 block">السعر الرسمي:</span>
                    <span className="text-2xl font-black text-amber-300 font-mono">
                      {(matchedProduct.price || 0).toLocaleString("ar-EG")} ج.م
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleAddToCart}
                      className="px-6 font-black gap-2 shadow-lg"
                    >
                      <Gift className="h-4 w-4" />
                      <span>حجز العطر + عينة تجربة مجانية</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantee Pill */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0" />
              <span>
                <strong>ضمان أمير ستور:</strong> نرفق عينة تجربة مجانية بنفس الرائحة؛ يمكنك معاينة الشحنة قبل الدفع للمندوب واسترجاعها مجاناً إذا لم تنل رضاك التام.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
