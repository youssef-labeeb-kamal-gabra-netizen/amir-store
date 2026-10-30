"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Clock, Wind, Flame, ShieldCheck, ChevronLeft } from "lucide-react";

interface NoteTier {
  id: number;
  nameAr: string;
  nameFr: string;
  subtitle: string;
  duration: string;
  sillage: string;
  description: string;
  notes: Array<{ name: string; origin: string; icon: string }>;
  color: string;
}

const PYRAMID_TIERS: NoteTier[] = [
  {
    id: 1,
    nameAr: "النوتات العليا (قمة العطر)",
    nameFr: "Strate I • Notes de Tête",
    subtitle: "الإشراقة الأولى والانطباع الحاسم",
    duration: "0 — 30 دقيقة",
    sillage: "فوحان ابتدائي: 25%",
    description: "انفجار جزيئي أولي خفيف ومنعش يثير الحواس بلمسات متبلة نقية تفتح آفاق العطر.",
    notes: [
      { name: "هيل غواتيمالي فاخر", origin: "جبال غواتيمالا", icon: "🌿" },
      { name: "فلفل سيتشوان الوردي", origin: "المناطق الجبلية", icon: "✨" },
      { name: "خشب الورد المدغشقري", origin: "غابات مدغشقر", icon: "🌸" },
    ],
    color: "#D4AF37",
  },
  {
    id: 2,
    nameAr: "قلب العطر (جوهر الشخصية)",
    nameFr: "Strate II • Notes de Cœur",
    subtitle: "الهوية الملكية والعمق الروحي",
    duration: "30 دقيقة — 4 ساعات",
    sillage: "فوحان محوري: 50%",
    description: "مركز الثقل العطري الحقيقي؛ مزيج غني ومخمور من الأخشاب النادرة التي تمتزج بحرارة البشرة لتعطي تفرداً لا يُنسى.",
    notes: [
      { name: "عود كوه كونغ المعتق 20 سنة", origin: "كمبوديا العتيقة", icon: "🪵" },
      { name: "خشب الصندل الميسوري النادر", origin: "ميسور، الهند", icon: "🏛️" },
      { name: "نجيل الهند الهاييتي الصافي", origin: "هاييتي", icon: "🌾" },
    ],
    color: "#C8A24A",
  },
  {
    id: 3,
    nameAr: "قاعدة العطر (الأثر الخالد)",
    nameFr: "Strate III • Notes de Fond",
    subtitle: "الثبات الملحمي والهالة الملكية",
    duration: "4 ساعات — 48+ ساعة",
    sillage: "ثبات واستقرار: 100%",
    description: "الركيزة الخالدة التي تلتصق بالثياب والجسد؛ زيوت بلسمية راتنجية معقدة تبقى شامخة لساعات طويلة كرمز للفخامة والوقار.",
    notes: [
      { name: "عنبر أشهب ملكي نادر", origin: "سواحل المحيط الهندي", icon: "👑" },
      { name: "حبوب التونكا الفنزويلية", origin: "فنزويلا الاستوائية", icon: "🌰" },
      { name: "فانيليا بوربون المدخنة", origin: "جزيرة ريونيون", icon: "🍯" },
    ],
    color: "#775A04",
  },
];

export function OlfactoryPyramid3D() {
  const [activeTier, setActiveTier] = useState<number>(2); // Default to Heart

  const selectedTier = PYRAMID_TIERS.find((t) => t.id === activeTier) || PYRAMID_TIERS[1];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="olfactory-pyramid">
      {/* Ambient Gold Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold-200 text-xs font-medium tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            الهندسة العطرية المتقدمة · AMIR STORE OLFACTORY ATELIER
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-wide mb-4">
            تفكيك الهرم العطري <span className="gold-text">ثلاثي الأبعاد</span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            استكشف التركيب الجزيئي وطبقات التبخير الحراري لكل عطر في دار أمير ستور؛ حيث صُممت كل قطرة لتتفتح تدريجياً عبر الزمن كلوحة فنية نادرة.
          </p>
        </div>

        {/* Interactive Pyramid Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Visual Pyramid Model (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-full max-w-md flex flex-col items-center gap-3 relative">
              {/* Tier 1 Button Shape */}
              <button
                onClick={() => setActiveTier(1)}
                className={`w-[60%] py-4 px-6 rounded-2xl transition-all duration-500 relative flex flex-col items-center justify-center border ${
                  activeTier === 1
                    ? "bg-gradient-to-r from-gold-300/30 to-gold-500/30 border-gold-400 shadow-gold-glow scale-105"
                    : "bg-obsidian-900/80 border-gold/20 hover:border-gold/50 opacity-80 hover:opacity-100"
                }`}
              >
                <span className="text-xs text-gold-200 font-serif tracking-wider">STRATE I</span>
                <span className="text-sm sm:text-base font-bold text-white">القمة · Top Notes</span>
                <span className="text-[11px] text-gray-400">0 — 30 دقيقة</span>
              </button>

              {/* Tier 2 Button Shape */}
              <button
                onClick={() => setActiveTier(2)}
                className={`w-[80%] py-5 px-6 rounded-2xl transition-all duration-500 relative flex flex-col items-center justify-center border ${
                  activeTier === 2
                    ? "bg-gradient-to-r from-gold-400/30 to-gold-600/30 border-gold-400 shadow-gold-glow scale-105"
                    : "bg-obsidian-900/80 border-gold/20 hover:border-gold/50 opacity-80 hover:opacity-100"
                }`}
              >
                <span className="text-xs text-gold-200 font-serif tracking-wider">STRATE II · قلب العطر</span>
                <span className="text-base sm:text-lg font-bold text-white">القلب · Heart Notes</span>
                <span className="text-[11px] text-gray-400">30 دقيقة — 4 ساعات</span>
              </button>

              {/* Tier 3 Button Shape */}
              <button
                onClick={() => setActiveTier(3)}
                className={`w-full py-6 px-6 rounded-2xl transition-all duration-500 relative flex flex-col items-center justify-center border ${
                  activeTier === 3
                    ? "bg-gradient-to-r from-gold-500/30 to-gold-700/30 border-gold-400 shadow-gold-glow scale-105"
                    : "bg-obsidian-900/80 border-gold/20 hover:border-gold/50 opacity-80 hover:opacity-100"
                }`}
              >
                <span className="text-xs text-gold-200 font-serif tracking-wider">STRATE III · الأساس السيادي</span>
                <span className="text-lg sm:text-xl font-bold text-white">القاعدة · Base Notes</span>
                <span className="text-[11px] text-gray-400">4 — 48+ ساعة ثابتة</span>
              </button>
            </div>

            <p className="text-xs text-gold-200/60 text-center mt-6 tracking-widest">
              اضغط على أي طبقة لاكتشاف المكونات والنوتات العطرية التفصيلية
            </p>
          </div>

          {/* Right Column: Dynamic Tier Inspector Card (7 cols) */}
          <div className="lg:col-span-7">
            <div className="glass-obsidian rounded-3xl p-6 sm:p-10 border border-gold/30 shadow-2xl relative overflow-hidden">
              {/* Card Header & Metrics */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gold/20 mb-6">
                <div>
                  <span className="text-xs font-serif text-gold-300 tracking-widest uppercase block mb-1">
                    {selectedTier.nameFr}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif">
                    {selectedTier.nameAr}
                  </h3>
                  <p className="text-sm text-gold-200/80 mt-1">{selectedTier.subtitle}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/10 border border-gold/20 text-xs text-gold-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedTier.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/10 border border-gold/20 text-xs text-gold-300">
                    <Wind className="w-3.5 h-3.5" />
                    <span>{selectedTier.sillage}</span>
                  </div>
                </div>
              </div>

              {/* Narrative Description */}
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-8">
                {selectedTier.description}
              </p>

              {/* Notes List */}
              <div>
                <h4 className="text-xs font-bold text-gold-200 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-gold-400" />
                  المكونات الطبيعية النقية في هذه الطبقة:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedTier.notes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-obsidian-950/70 border border-gold/15 hover:border-gold/40 transition-all duration-300 group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{note.icon}</div>
                      <div className="font-bold text-white text-sm mb-1">{note.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <span>المصدر:</span>
                        <span className="text-gold-200/70">{note.origin}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality & Extraction Assurance */}
              <div className="mt-8 pt-6 border-t border-gold/15 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-2 text-gold-200">
                  <ShieldCheck className="w-4 h-4 text-gold-400" />
                  <span>زيوت عطرية أصلية 100% معتقة بالطريقة الفرنسية والسويسرية التقليدية</span>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1 text-gold-300 hover:text-gold-200 font-semibold group"
                >
                  <span>تصفح العطور التي تحتوي هذه النوتة</span>
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OlfactoryPyramid3D;
