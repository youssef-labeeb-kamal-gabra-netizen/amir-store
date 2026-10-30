import React from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import { env } from "@/lib/env";

export function ContactCTA() {
  const rawWhatsApp = env.business.whatsapp || "01220086002";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const formattedWhatsApp = cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp;
  const whatsappUrl = `https://wa.me/${formattedWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم ورحمة الله، أود الحصول على ترشيح وتوصية لاختيار عطر أو دهن عود مناسب من متجر أمير ستور."
  )}`;

  return (
    <section className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2E3A24] via-[#242e1d] to-[#1a2215] p-6 sm:p-10 lg:p-14 text-white shadow-xl my-12 text-start border border-brand-green-900/40">
      <div className="relative z-10 max-w-3xl space-y-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 border border-brand-gold-400/40 px-3.5 py-1 text-xs font-semibold text-brand-gold-300 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-brand-gold-400" />
          <span>استشارة وتنسيق إهداء خاص VIP</span>
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug">
          هل تبحث عن توقيعك العطري الخاص أو هدية فاخرة تليق بأحبائك؟
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-oud-surfaceLight leading-relaxed max-w-2xl">
          فريق أمير ستور جاهز لتزويدكم بأفضل الترشيحات العطرية المخصصة وتجهيز صناديق الإهداء الملكية مع كارت إهداء مجاني وشحن فوري لباب المنزل.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] px-7 py-4 text-sm sm:text-base font-black text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 cursor-pointer w-full sm:w-auto"
          >
            <MessageCircle className="h-5 w-5 shrink-0" />
            <span>تواصل عبر واتساب فوراً ({rawWhatsApp})</span>
          </a>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold-400 hover:bg-brand-gold-500 text-brand-green-950 px-7 py-4 text-sm sm:text-base font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-95 w-full sm:w-auto cursor-pointer"
          >
            <span>استعراض تشكيلة العطور</span>
            <ArrowLeft className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </div>

      {/* Subtle decorative background circle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl" aria-hidden="true">
        <div className="absolute end-0 bottom-0 w-72 h-72 rounded-full bg-brand-gold-400/10 blur-3xl" />
      </div>
    </section>
  );
}
