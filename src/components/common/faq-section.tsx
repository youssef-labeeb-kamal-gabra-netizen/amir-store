"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Phone, MessageCircle } from "lucide-react";
import { env } from "@/lib/env";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "كيف أضمن أن دهن العود طبيعي وأصلي 100%؟",
    answer:
      "جميع أدهان العود والزيوت المتوفرة لدينا مستخلصة ومستوردة من مصادرها الطبيعية في إندونيسيا وكمبوديا بدون أي خلط أو تخفيف أو إضافات كيميائية. نضمن لك أصالة المنتج 100% مع إمكانية المعاينة والتجربة المباشرة قبل الدفع.",
  },
  {
    question: "ما هو الفرق بين تركيز Eau de Parfum و Extrait de Parfum؟",
    answer:
      "تركيز Extrait de Parfum هو أعلى درجات التركيز في عالم العطور؛ حيث يحتوي على نسبة زيوت نقية تصل إلى 30-35%، مما يمنحه فوحاناً استثنائياً وثباتاً يدوم لأكثر من 72 ساعة على الملابس والأقمشة.",
  },
  {
    question: "كيف يمكنني طلب صندوق إهداء مخصص لشخص عزيز؟",
    answer:
      "عند تواصلك معنا عبر واتساب، يمكنك اختيار العطور والأدهان التي تفضل ضمها، وسيقوم فريقنا بتجهيز صندوق الإهداء الملكي المكسو بالمخمل وكتابة كارت الإهداء بالرسالة التي تختارها مجاناً بالكامل.",
  },
  {
    question: "كم يستغرق شحن وتوصيل الطلب لكافة المحافظات؟",
    answer:
      "نعتمد خطوط شحن سريعة وموثوقة، وتصل الشحنات خلال 24 إلى 48 ساعة لجميع مدن ومحافظات جمهورية مصر العربية، مع تغليف محكم يحمي الزجاجات الكريستالية من أي صدمات.",
  },
  {
    question: "هل تتوفر خدمة الدفع عند الاستلام والمعاينة قبل الدفع؟",
    answer:
      "نعم، نوفر خدمة الدفع عند الاستلام (COD) مع حق المعاينة الكاملة؛ تستطيع فحص الشحنة وتجربة العينة المرفقة والتأكد من سلامة العبوة أمام مندوب الشحن قبل سداد القيمة.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const phone1 = env.business.phone || "01220086002";
  const rawWhatsApp = env.business.whatsapp || "01220086002";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم ورحمة الله، لدي استفسار بخصوص عطور ودهن عود أمير ستور."
  )}`;

  return (
    <section className="text-start space-y-8 my-14">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider font-serif">
          <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-arabic">
          كل ما ترغب في معرفته عن عطورنا وضمان الجودة
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          إجابات واضحة ومباشرة لأكثر الأسئلة التي يطرحها عملاؤنا حول جودة العطور، ثبات 72 ساعة، والشحن.
        </p>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3 max-w-4xl">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "bg-white/[0.04] border-amber-400/50 shadow-[0_4px_25px_rgba(212,175,55,0.15)] ring-1 ring-amber-400/20"
                  : "bg-white/[0.02] border-amber-400/15 hover:border-amber-400/35 hover:bg-white/[0.03]"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-start font-bold text-sm sm:text-base text-white cursor-pointer focus:outline-none"
                aria-expanded={isOpen}
              >
                <span className="flex-1 leading-snug">{faq.question}</span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${
                    isOpen
                      ? "bg-amber-400 text-black rotate-180 shadow-sm"
                      : "bg-white/10 text-amber-300"
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct Contact Prompt */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-amber-400/25 max-w-4xl backdrop-blur-md">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">
            هل لديك استفسار آخر أو ترغب في ترشيح عطر معين لذوقك؟
          </h4>
          <p className="text-xs text-slate-400">
            فريق خدمة عملاء متجر أمير ستور متاح دائماً للرد المباشر وتقديم الاستشارات العطرية.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white px-4 py-2 text-xs font-bold shadow-sm transition-all active:scale-95 border border-white/20"
          >
            <MessageCircle className="h-4 w-4" />
            <span>مراسلة واتساب</span>
          </a>
          <a
            href={`tel:${phone1}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] hover:bg-amber-400/15 text-white border border-amber-400/30 px-4 py-2 text-xs font-bold transition-all active:scale-95"
          >
            <Phone className="h-4 w-4 text-amber-400" />
            <span>اتصال مباشر</span>
          </a>
        </div>
      </div>
    </section>
  );
}
