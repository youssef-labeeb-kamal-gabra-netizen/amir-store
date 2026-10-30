"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Tractor,
  SprayCan,
  Waves,
  Cpu,
  Pipette,
  Wrench,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { env } from "@/lib/env";
import { INITIAL_PRODUCTS } from "@/data/catalog";
import { Product } from "@/types/product";

interface AdvisorProps {
  className?: string;
  defaultOpenModal?: boolean;
}

export function InteractiveEquipmentAdvisor({ className = "" }: AdvisorProps) {
  const [step, setStep] = useState<number>(1);
  const [need, setNeed] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [fuel, setFuel] = useState<string>("");
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);

  const rawWhatsApp = env.business.whatsapp || "01220792948";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const formattedWhatsApp = cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp;

  const handleNeedSelect = (value: string) => {
    setNeed(value);
    setStep(2);
  };

  const handleAreaSelect = (value: string) => {
    setArea(value);
    setStep(3);
  };

  const handleFuelSelect = (value: string) => {
    setFuel(value);
    calculateRecommendation(need, area, value);
    setStep(4);
  };

  const calculateRecommendation = (selNeed: string, selArea: string, selFuel: string) => {
    // Intelligent matching rule
    if (selNeed === "spray") {
      setRecommendedProduct(
        INITIAL_PRODUCTS.find((p) => p.id === "prod-1") || INITIAL_PRODUCTS[0]
      );
    } else if (selNeed === "water-pump") {
      if (selFuel === "diesel" || selArea === "large") {
        setRecommendedProduct(
          INITIAL_PRODUCTS.find((p) => p.id === "prod-3") || INITIAL_PRODUCTS[2]
        );
      } else {
        setRecommendedProduct(
          INITIAL_PRODUCTS.find((p) => p.id === "prod-2") || INITIAL_PRODUCTS[1]
        );
      }
    } else if (selNeed === "diesel") {
      setRecommendedProduct(
        INITIAL_PRODUCTS.find((p) => p.id === "prod-3") || INITIAL_PRODUCTS[2]
      );
    } else if (selNeed === "irrigation") {
      setRecommendedProduct(
        INITIAL_PRODUCTS.find((p) => p.id === "prod-4") || INITIAL_PRODUCTS[3]
      );
    } else if (selNeed === "tiller") {
      setRecommendedProduct(
        INITIAL_PRODUCTS.find((p) => p.id === "prod-5") || INITIAL_PRODUCTS[4]
      );
    } else {
      setRecommendedProduct(
        INITIAL_PRODUCTS.find((p) => p.id === "prod-6") || INITIAL_PRODUCTS[5]
      );
    }
  };

  const resetAdvisor = () => {
    setStep(1);
    setNeed("");
    setArea("");
    setFuel("");
    setRecommendedProduct(null);
  };

  const getWhatsAppMessage = () => {
    if (!recommendedProduct) return "";
    const text = `السلام عليكم ورحمة الله، استخدمت مستشار المعدات التفاعلي على موقع شركة لبيب كمال لبيب:
• الاحتياج: ${getNeedLabel(need)}
• المساحة: ${getAreaLabel(area)}
• نوع التشغيل المفضل: ${getFuelLabel(fuel)}
المعدة المقترحة: ${recommendedProduct.name} (${recommendedProduct.model || ""})
أود الاستفسار عن توفرها وأفضل خيارات الاستلام والدعم الفني.`;
    return encodeURIComponent(text);
  };

  const getNeedLabel = (val: string) => {
    switch (val) {
      case "spray":
        return "رش ومكافحة آفات زراعية";
      case "water-pump":
        return "سحب ورفع مياه ري للحقل";
      case "diesel":
        return "محرك ديزل شاق لإدارة الطلمبات";
      case "irrigation":
        return "شبكات وفلاتر ري حديث";
      case "tiller":
        return "عزاقة وخدمة وتقليب التربة";
      default:
        return "قطع غيار وصيانة";
    }
  };

  const getAreaLabel = (val: string) => {
    switch (val) {
      case "small":
        return "أرض صغيرة أو حديقة (أقل من فدان)";
      case "medium":
        return "مساحة متوسطة (من 1 إلى 5 أفدنة)";
      case "large":
        return "مزارع واسعة (أكثر من 5 أفدنة)";
      default:
        return "تشغيل ميداني متنوع";
    }
  };

  const getFuelLabel = (val: string) => {
    switch (val) {
      case "petrol":
        return "بنزين (خفيف وسهل الحركة)";
      case "diesel":
        return "ديزل / سولار (خدمة شاقة وعزم عالي)";
      default:
        return "أي نوع مناسب";
    }
  };

  return (
    <div
      className={`rounded-3xl border border-brand-neutral-200 bg-white p-6 sm:p-10 shadow-xs relative overflow-hidden text-start ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-brand-neutral-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-green-50 text-brand-green-800 border border-brand-green-200 px-3 py-1 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5 text-brand-gold-600" />
            <span>نظام التفاعل المباشر الذكي</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-brand-neutral-900">
            مستشار اختيار المعدة الزراعية المناسبة
          </h3>
          <p className="text-xs sm:text-sm text-brand-neutral-600">
            أجب على 3 أسئلة بسيطة، ليقترح عليك النظام المعدة الأفضل لطبيعة عملك ومساحة أرضك
          </p>
        </div>

        {step > 1 && (
          <button
            type="button"
            onClick={resetAdvisor}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-neutral-300 text-xs font-bold text-brand-neutral-700 hover:bg-brand-neutral-100 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-brand-neutral-500" />
            <span>البدء من جديد</span>
          </button>
        )}
      </div>

      {/* Step Progress Indicator */}
      <div className="flex items-center gap-2 py-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              step >= i ? "bg-brand-green-700" : "bg-brand-neutral-200"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Core Need */}
      {step === 1 && (
        <div className="space-y-5 py-2">
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">الخطوة الأولى (1 من 3)</span>
            <h4 className="text-xl sm:text-2xl font-black text-brand-neutral-900">
              عاوز تعمل إيه بأرضك أو مزرعتك؟
            </h4>
            <p className="text-xs sm:text-sm text-brand-neutral-600">
              اضغط على أي عملية تناسبك بالصورة والرمز:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              {
                id: "water-pump",
                title: "سحب ورفع مياه الري",
                desc: "طلمبات ومواتير مياه للترع والآبار وري الغيط",
                icon: Waves,
                color: "bg-blue-50 text-blue-700 border-blue-200 group-hover:bg-blue-600",
                badge: "ري وسحب مياه",
              },
              {
                id: "spray",
                title: "رش المحاصيل ومكافحة الآفات",
                desc: "مواتير رش ظهر بنزين ورشاشات ضغط عالي للمبيدات",
                icon: SprayCan,
                color: "bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-amber-600",
                badge: "رش ومكافحة",
              },
              {
                id: "diesel",
                title: "موتور بتر ديزل خدمة شاقة",
                desc: "محركات ديزل 1 سلندر أصلية (Petter) لعزم ري جبار",
                icon: Cpu,
                color: "bg-emerald-50 text-emerald-800 border-emerald-200 group-hover:bg-emerald-700",
                badge: "بتر ديزل أصلي",
              },
              {
                id: "tiller",
                title: "عزاقة وتقليب خدمة الأرض",
                desc: "عزاقات زراعية لحرث وتجهيز التربة للزراعة",
                icon: Tractor,
                color: "bg-green-50 text-green-700 border-green-200 group-hover:bg-green-600",
                badge: "عزاقات وحرث",
              },
              {
                id: "irrigation",
                title: "شبكات وفلاتر ري بالتنقيط",
                desc: "فلاتر ديسك ومحابس وشبكات ري حديث لترشيد المياه",
                icon: Pipette,
                color: "bg-cyan-50 text-cyan-700 border-cyan-200 group-hover:bg-cyan-600",
                badge: "شبكات ري حديث",
              },
              {
                id: "parts",
                title: "قطع غيار وصيانة مواتير",
                desc: "بساتم، شنابر، فواني رش، خراطيم، وسيور أصلية",
                icon: Wrench,
                color: "bg-orange-50 text-orange-700 border-orange-200 group-hover:bg-orange-600",
                badge: "قطع غيار متوفرة",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNeedSelect(item.id)}
                  className="flex items-start gap-4 p-4 sm:p-5 rounded-3xl border-2 border-brand-neutral-200 bg-white hover:border-brand-green-600 hover:shadow-xl active:scale-95 transition-all duration-200 group text-start cursor-pointer relative overflow-hidden"
                >
                  <div className={`p-3.5 rounded-2xl border ${item.color} group-hover:text-white transition-all duration-200 shrink-0 shadow-xs`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="inline-block text-[10px] font-black uppercase tracking-wider text-brand-neutral-500">
                      {item.badge}
                    </span>
                    <h5 className="font-black text-brand-neutral-900 group-hover:text-brand-green-800 transition-colors text-base sm:text-lg leading-snug">
                      {item.title}
                    </h5>
                    <p className="text-xs text-brand-neutral-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Area / Usage Scale */}
      {step === 2 && (
        <div className="space-y-5 py-2">
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">الخطوة الثانية (2 من 3)</span>
            <h4 className="text-xl sm:text-2xl font-black text-brand-neutral-900">
              مساحة أرضك كام تقريباً؟
            </h4>
            <p className="text-xs sm:text-sm text-brand-neutral-600">
              اختر المساحة التقريبية لاقتراح قوة الحصان والموتور المناسب
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                id: "small",
                title: "🌱 أرض صغيرة أو جنينة",
                subtitle: "أقل من فدان واحد",
                desc: "استخدام خفيف، رش مساحات صغيرة، ري سريع",
                color: "hover:border-emerald-500",
              },
              {
                id: "medium",
                title: "🌾 غيط أو حقل متوسط",
                subtitle: "من 1 إلى 5 أفدنة",
                desc: "المساحة التقليدية لغالبية المزارعين بالشرقية ومصر",
                color: "hover:border-amber-500",
              },
              {
                id: "large",
                title: "🚜 مزرعة كبيرة أو مشروع",
                subtitle: "أكتر من 5 أفدنة",
                desc: "ري ساعات طويلة متواصلة، سحب مياه غزيرة",
                color: "hover:border-blue-500",
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleAreaSelect(item.id)}
                className={`p-6 rounded-3xl border-2 border-brand-neutral-200 bg-white ${item.color} hover:shadow-xl active:scale-95 transition-all duration-200 text-start group cursor-pointer space-y-2`}
              >
                <div className="h-6 w-6 rounded-full border-2 border-brand-neutral-300 group-hover:border-brand-green-700 group-hover:bg-brand-green-50 transition-colors" />
                <h5 className="font-black text-brand-neutral-900 text-lg group-hover:text-brand-green-800">
                  {item.title}
                </h5>
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-brand-neutral-100 text-brand-neutral-800 text-xs font-bold">
                  {item.subtitle}
                </span>
                <p className="text-xs text-brand-neutral-500 leading-relaxed pt-1">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-neutral-600 hover:text-brand-neutral-900 active:scale-95 transition-all pt-2 cursor-pointer"
          >
            <ArrowRight className="h-4 w-4" />
            <span>الرجوع للخطوة السابقة</span>
          </button>
        </div>
      )}

      {/* Step 3: Engine Type / Mobility Preference */}
      {step === 3 && (
        <div className="space-y-5 py-2">
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">الخطوة الثالثة (3 من 3)</span>
            <h4 className="text-xl sm:text-2xl font-black text-brand-neutral-900">
              بتحب الموتور يشتغل بنزين ولا ديزل؟
            </h4>
            <p className="text-xs sm:text-sm text-brand-neutral-600">
              كل نوع وله ميزته حسب طريقة شغلك في الأرض
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                id: "petrol",
                title: "⛽ بنزين (خفيف الوزن وسريع الحركة)",
                desc: "دوارة سهلة، خفيف تقدر تشيله على دراعك أو تنقله في عربية بكل سهولة.",
                badge: "الأسهل في النقل والمشاوير",
                color: "hover:border-amber-500",
              },
              {
                id: "diesel",
                title: "🛢️ ديزل / سولار (بتر الإنجليزي PH1 عزم جبار)",
                desc: "يتحمل العمل الشاق لساعات وأيام ويوفر جداً في استهلاك السولار وتكلفة التشغيل.",
                badge: "الأوفر والأطول عمراً في الغيط",
                color: "hover:border-emerald-600",
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleFuelSelect(item.id)}
                className={`p-6 rounded-3xl border-2 border-brand-neutral-200 bg-white ${item.color} hover:shadow-xl active:scale-95 transition-all duration-200 text-start group cursor-pointer space-y-2`}
              >
                <div className="h-6 w-6 rounded-full border-2 border-brand-neutral-300 group-hover:border-brand-green-700 group-hover:bg-brand-green-50 transition-colors" />
                <h5 className="font-black text-brand-neutral-900 text-lg group-hover:text-brand-green-800">
                  {item.title}
                </h5>
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold">
                  {item.badge}
                </span>
                <p className="text-xs text-brand-neutral-600 leading-relaxed pt-1">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-neutral-600 hover:text-brand-neutral-900 active:scale-95 transition-all pt-2 cursor-pointer"
          >
            <ArrowRight className="h-4 w-4" />
            <span>الرجوع للخطوة السابقة</span>
          </button>
        </div>
      )}

      {/* Step 4: Final Recommendation & Instant Action */}
      {step === 4 && recommendedProduct && (
        <div className="space-y-6 py-2 animate-fadeIn">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-4 py-1.5 text-sm font-black shadow-sm">
            <CheckCircle2 className="h-5 w-5 text-amber-300" />
            <span>🎉 مبروك! لقينا أنسب ماكنة تناسب أرضك واحتياجك بالظبط:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-emerald-50/60 p-6 sm:p-8 rounded-3xl border-2 border-emerald-300 shadow-md items-center">
            {/* Product Image */}
            <div className="md:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border-2 border-emerald-200 shadow-sm">
              <Image
                src={recommendedProduct.images[0]}
                alt={recommendedProduct.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <span className="absolute top-3 end-3 rounded-full bg-amber-500 text-white font-black text-xs px-3 py-1 shadow-md">
                ترشيح مثالي لأرضك ⭐
              </span>
            </div>

            {/* Product Details */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-1">
                <span className="inline-block text-xs font-black text-emerald-800 bg-emerald-200/80 px-2.5 py-0.5 rounded-lg">
                  {recommendedProduct.categoryName} • كود: {recommendedProduct.model || "LKL"}
                </span>
                <h4 className="text-xl sm:text-2xl lg:text-3xl font-black text-brand-neutral-900 leading-snug">
                  {recommendedProduct.name}
                </h4>
              </div>

              <p className="text-xs sm:text-sm text-brand-neutral-700 leading-relaxed font-medium">
                {recommendedProduct.shortDescription}
              </p>

              {/* Specs Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {recommendedProduct.specifications.slice(0, 4).map((spec, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border border-emerald-200 text-xs shadow-2xs"
                  >
                    <span className="text-emerald-700 font-bold block text-[10px]">{spec.label}</span>
                    <span className="font-bold text-brand-neutral-900 leading-snug">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/${formattedWhatsApp}?text=${getWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] px-5 py-4 text-sm sm:text-base font-black text-white shadow-lg active:scale-95 transition-all text-center cursor-pointer border border-emerald-400"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>اسأل عن سعر ومواصفات الماكنة دي على واتساب</span>
                </a>

                <Link
                  href={`/products/${recommendedProduct.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-white border-2 border-emerald-600 hover:bg-emerald-50 active:scale-95 px-5 py-4 text-xs sm:text-sm font-black text-emerald-900 transition-all text-center shadow-xs"
                >
                  <span>عرض التفاصيل والصور</span>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
