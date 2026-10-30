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
    question: "كيف أختار قدرة موتور الرش وطراز الطلمبة المناسبة لمساحة مزرعتي؟",
    answer:
      "يعتمد الاختيار على مساحة الأرض ونوع المحصول؛ فالمساحات الصغيرة (أقل من 3 أفدنة) ومزارع الخضار تناسبها مجموعات الرش المحمولة بضغط 25-30 بار. بينما بساتين الموالح والفاكهة والمساحات الكبيرة تحتاج إلى طلمبات ثلاثية البساتم (بساتم سيراميك 45 بار) لتوفير رذاذ متناهي الصغر يصل لأعلى قمم الأشجار. فريقنا الهندسي متاح دائماً لحساب احتياجك الدقيق.",
  },
  {
    question: "هل تتوفر قطع الغيار الأصلية وبساتم السيراميك وجلود الضغط باستمرار؟",
    answer:
      "نعم بكل تأكيد؛ مبدأنا في شركة لبيب كمال هو عدم توريد أي معدة دون تأمين كامل لقطع غيارها ومستلزمات صيانتها في محلنا بالزقازيق على طريق مصر الزراعي، بدءاً من أطقم الجلود، صمامات الأمان، البساتم السيراميك والستانلس، وحتى خراطيم الرش المكبوسة.",
  },
  {
    question: "كيف أحدد قطر وطاقة طلمبة المياه المناسبة (2 أو 3 أو 4 بوصة)؟",
    answer:
      "يتحدد ذلك بناءً على منسوب المياه (عمق السحب من المصرف أو البئر) والمسافة الأفقية لنقل المياه حتى الحقل، ونوع شبكة الري (ري بالغمر أو تنقيط). طلمبات الـ 2 بوصة ممتازة للمسافات المتوسطة وتغذية الأحواض، بينما الـ 3 و 4 بوصة توفر تصرف مياه ضخم للري السريع وتغطية خطوط الري المتشعبة.",
  },
  {
    question: "ما هي النصائح العملية للمحافظة على محرك الديزل الزراعي وإطالة عمره؟",
    answer:
      "أهم خطوة هي الالتزام بمواعيد تغيير زيت المحرك (زيت ديزل مخصص للخدمة الشاقة)، وفحص وتنظيف فلتر الهواء يومياً من الأتربة خاصة في مواسم الحصاد والعزيق، وتفريغ أي شوائب أو مياه من فلتر السولار قبل بدء التشغيل، مع تجنب تشغيل المحرك تحت حمل زائد لفترات طويلة متصلة.",
  },
  {
    question: "هل يمكن شحن وتوصيل المعدات وقطع الغيار للمحافظات والمراكز المجاورة؟",
    answer:
      "نعم، بالإضافة إلى إمكانية الاستلام المباشر وفحص المعدة عملياً في مركزنا بالزقازيق، نوفر خدمة الشحن السريع والآمن لمختلف مراكز وقرى محافظة الشرقية والمحافظات المجاورة (الدقهلية، القليوبية، الإسماعيلية، الغربية وغيرها) عبر خطوط شحن مخصصة للمعدات الثقيلة.",
  },
  {
    question: "كيف يمكنني الحصول على عرض مواصفات واستشارة دون التزام بالشراء؟",
    answer:
      "يسعدنا تواصلكم في أي وقت عبر الاتصال الهاتفي أو رسائل واتساب المباشرة على الأرقام المسجلة، حيث يقوم فريقنا المتخصص بطلب بيانات مساحة أرضك وطبيعة المحصول وإرشادك للمعدة الأنسب فنياً واقتصادياً دون أي التزام مسبق.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const phone1 = env.business.phone || "01220792948";
  const rawWhatsApp = env.business.whatsapp || "01220792948";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم ورحمة الله، لدي استفسار فني بخصوص اختيار المعدة الزراعية المناسبة لأرضي."
  )}`;

  return (
    <section className="text-start space-y-8 my-14">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-green-50 text-brand-green-800 border border-brand-green-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="h-3.5 w-3.5 text-brand-green-700" />
          <span>الأسئلة الشائعة والإرشادات الفنية</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-neutral-900 tracking-tight">
          كل ما يهم المزارع قبل اختيار وتشغيل المعدات
        </h2>
        <p className="text-sm sm:text-base text-brand-neutral-600 leading-relaxed">
          إجابات واضحة ومباشرة من واقع خبرتنا الميدانية الممتدة لأكثر من 20 عاماً في قطاع الآلات الزراعية وأنظمة الري.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3 max-w-4xl">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-brand-neutral-200 bg-white overflow-hidden transition-all shadow-2xs hover:border-brand-green-600/30"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-start font-bold text-brand-neutral-900 hover:text-brand-green-800 transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-base sm:text-lg pe-4">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-brand-green-800 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-brand-neutral-600 leading-relaxed border-t border-brand-neutral-100 animate-fade-in">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions CTA */}
      <div className="p-6 rounded-3xl bg-white border border-brand-neutral-200 max-w-4xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h4 className="font-bold text-brand-neutral-900 text-base">هل لديك استفسار آخر أو حالة خاصة في مزرعتك؟</h4>
          <p className="text-xs sm:text-sm text-brand-neutral-600 mt-1">تواصل معنا الآن وسيجيبك أحد الفنيين المتخصصين على الفور.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-2xs transition-all active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            <span>مراسلة واتساب</span>
          </a>
          <a
            href={`tel:${phone1}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-brand-neutral-300 hover:bg-brand-neutral-100 text-brand-neutral-800 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all active:scale-95"
            dir="ltr"
          >
            <Phone className="h-4 w-4 text-brand-green-700" />
            <span>{phone1}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
