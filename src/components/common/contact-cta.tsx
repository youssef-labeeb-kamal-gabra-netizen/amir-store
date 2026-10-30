import React from "react";
import Link from "next/link";
import { Phone, ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import { env } from "@/lib/env";

export function ContactCTA() {
  const rawWhatsApp = env.business.whatsapp || "01220792948";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const formattedWhatsApp = cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp;
  const whatsappUrl = `https://wa.me/${formattedWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم ورحمة الله، أود الحصول على استشارة فنية لاختيار الموتور أو الطلمبة المناسبة لأرضي من شركة لبيب كمال."
  )}`;

  return (
    <section className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#022c22] p-6 sm:p-10 lg:p-14 text-white shadow-xl my-12 text-start border border-emerald-800/40">
      <div className="relative z-10 max-w-3xl space-y-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-1 text-xs font-semibold text-emerald-200 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-brand-gold-400" />
          <span>استشارات فنية ومواصفات هندسية دقيقة</span>
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug">
          هل تحتاج إلى مشورة لاختيار الموتور أو الطلمبة الزراعية المناسبة لأرضك؟
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
          فريق شركة لبيب كمال في الزقازيق جاهز لتزويدك بكافة المواصفات والقدرات الفنية وتحديد أنسب الحلول لنظام الري والزراعة الخاص بك بدون أي تكلفة استشارية.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] px-6 py-4 text-sm sm:text-base font-black text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 cursor-pointer w-full sm:w-auto"
          >
            <MessageCircle className="h-5 w-5 shrink-0" />
            <span>مراسلة واتساب فورية ({rawWhatsApp})</span>
          </a>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-gold-500 hover:bg-brand-gold-600 active:bg-brand-gold-700 border-2 border-brand-gold-300 px-6 py-4 text-sm sm:text-base font-black text-brand-neutral-950 shadow-xl transition-all hover:scale-[1.02] active:scale-95 w-full sm:w-auto cursor-pointer"
          >
            <Phone className="h-5 w-5 shrink-0" />
            <span>طلب تواصل ومواصفات</span>
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white hover:bg-emerald-50 active:bg-emerald-100 border-2 border-white px-6 py-4 text-sm sm:text-base font-black text-brand-green-950 shadow-xl transition-all hover:scale-[1.02] active:scale-95 w-full sm:w-auto cursor-pointer"
          >
            <span>استعراض كتالوج الماكينات</span>
            <ArrowLeft className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </div>

      {/* Subtle decorative background circle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl" aria-hidden="true">
        <div className="absolute end-0 bottom-0 w-72 h-72 rounded-full bg-brand-green-700/20 blur-3xl" />
      </div>
    </section>
  );
}
