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
      "جميع أدهان العود والزيوت المتوفرة لدينا مستخلصة ومستوردة من مصادرها الطبيعية في إندونيسيا وكمبوديا بدون أي خلط أو تخفيف أو إضافات كيميائية. نضمن لك أصالة المنتج 100% مع إمكانية المعاينة والتجربة.",
  },
  {
    question: "ما هو الفرق بين تركيز Eau de Parfum و Extrait de Parfum؟",
    answer:
      "تركيز Extrait de Parfum هو أعلى درجات التركيز في عالم العطور؛ حيث يحتوي على نسبة زيوت نقية تصل إلى 30-35%، مما يمنحه فوحاناً استثنائياً وثباتاً يدوم لأيام على الملابس والأقمشة.",
  },
  {
    question: "كيف يمكنني طلب صندوق إهداء مخصص لشخص عزيز؟",
    answer:
      "عند تواصلك معنا عبر واتساب، يمكنك اختيار العطور والأدهان التي تفضل ضمها، وسيقوم فريقنا بتجهيز صندوق الإهداء الملكي المكسو بالمخمل وكتابة كارت الإهداء بالرسالة التي تختارها مجاناً بالكامل.",
  },
  {
    question: "كم يستغرق شحن وتوصيل الطلب لكافة المحافظات؟",
    answer:
      "نعتمد خطوط شحن سريعة وموثوقة، وتصل الشحنات خلال 24 إلى 48 ساعة لجميع مدن ومحافظات مصر، مع تغليف محكم يحمي الزجاجات الكريستالية من أي صدمات.",
  },
  {
    question: "هل تتوفر خدمة الدفع عند الاستلام والمعاينة؟",
    answer:
      "نعم، نوفر خدمة الدفع عند الاستلام، وتستطيع فحص الشحنة والتأكد من سلامة العبوة والتغليف أمام مندوب الشحن قبل سداد القيمة لضمان راحتك التامة.",
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
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-green-50 text-brand-green-800 border border-brand-green-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="h-3.5 w-3.5 text-brand-gold-600" />
          <span>الأسئلة الشائعة والاستفسارات</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-green-950 tracking-tight">
          كل ما ترغب في معرفته عن عطورنا
        </h2>
        <p className="text-sm sm:text-base text-brand-neutral-500 leading-relaxed">
          إجابات واضحة ومباشرة لأكثر الأسئلة التي يطرحها عملاؤنا حول جودة العطور، الثبات، والشحن.
        </p>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3 max-w-4xl">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "bg-white border-brand-green-800 shadow-oud-sm ring-1 ring-brand-green-800/10"
                  : "bg-white/80 border-brand-neutral-200 hover:border-brand-neutral-300"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-start font-bold text-sm sm:text-base text-brand-green-950 cursor-pointer focus:outline-none"
                aria-expanded={isOpen}
              >
                <span className="flex-1 leading-snug">{faq.question}</span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                    isOpen
                      ? "bg-brand-green-800 text-white rotate-180"
                      : "bg-brand-neutral-100 text-brand-neutral-600"
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-xs sm:text-sm text-brand-neutral-500 leading-relaxed border-t border-brand-neutral-100/60">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct Contact Prompt */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-brand-green-50 border border-brand-green-200 max-w-4xl">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-brand-green-950">
            هل لديك سؤال آخر أو ترغب في ترشيح عطر معين؟
          </h4>
          <p className="text-xs text-brand-neutral-500">
            فريق خدمة عملاء أمير ستور متاح دائماً للرد المباشر على استفساراتكم.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white px-4 py-2 text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            <span>واتساب</span>
          </a>
          <a
            href={`tel:${phone1}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-brand-green-50 text-brand-green-950 border border-brand-neutral-300 px-4 py-2 text-xs font-bold shadow-2xs transition-all active:scale-95"
          >
            <Phone className="h-4 w-4 text-brand-gold-600" />
            <span>اتصال</span>
          </a>
        </div>
      </div>
    </section>
  );
}
