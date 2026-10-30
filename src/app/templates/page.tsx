"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, Gift, Award, FileText, Sparkles } from "lucide-react";
import { ScentFinderTemplate } from "@/components/templates/scent-finder-template";
import { BespokeGiftBoxTemplate } from "@/components/templates/bespoke-gift-box-template";
import { SampleSetTemplate } from "@/components/templates/sample-set-template";
import { InvoiceTemplate } from "@/components/templates/invoice-template";

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState<"quiz" | "gift" | "sample" | "invoice">("quiz");

  const tabs = [
    {
      id: "quiz",
      label: "مستكشف التوقيع العطري",
      desc: "تحليل النوتات والهرم العطري",
      icon: Compass,
    },
    {
      id: "gift",
      label: "مصمم صناديق الإهداء الملكية",
      desc: "تنسيق مخصص مع كارت مذهب",
      icon: Gift,
    },
    {
      id: "sample",
      label: "باقة الاستكشاف (5 عينات)",
      desc: "قسيمة استرداد 100%",
      icon: Award,
    },
    {
      id: "invoice",
      label: "فاتورة وشهادة الأصالة",
      desc: "نموذج رسمي قابل للطباعة",
      icon: FileText,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 text-start text-white">
      {/* Breadcrumbs Navigation */}
      <nav aria-label="مسار التصفح" className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
        <Link href="/" className="hover:text-amber-300 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-white font-bold">قوالب التجربة الملكية الفاخرة</span>
      </nav>

      {/* Page Title & Vision */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider font-serif">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>ROYAL BOUTIQUE TEMPLATES & AUTOMATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-arabic tracking-tight leading-tight">
          قوالب وتجارب <br />
          <span className="liquid-gold-text">دار أمير ستور الملكية</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          منظومة متكاملة من القوالب التفاعلية المصممة خصيصاً لمساعدتك على استكشاف نوتاتك المفضلة، تخصيص صناديق الإهداء الملكية، وتجربة العطور في منزلك بكل طمأنينة.
        </p>
      </div>

      {/* Interactive Tabs Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`p-4 rounded-2xl border text-start transition-all duration-200 card-touch ${
                isActive
                  ? "border-amber-400 bg-amber-400/15 shadow-[0_0_20px_rgba(212,175,55,0.25)] ring-1 ring-amber-400/40"
                  : "border-white/10 bg-white/[0.02] hover:border-amber-400/30 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    isActive ? "bg-amber-400 text-black font-bold" : "bg-white/5 text-amber-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-arabic">{tab.label}</h3>
                  <p className="text-[11px] text-slate-400">{tab.desc}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Template Container */}
      <div className="pt-4">
        {activeTab === "quiz" && <ScentFinderTemplate />}
        {activeTab === "gift" && <BespokeGiftBoxTemplate />}
        {activeTab === "sample" && <SampleSetTemplate />}
        {activeTab === "invoice" && <InvoiceTemplate />}
      </div>
    </div>
  );
}
