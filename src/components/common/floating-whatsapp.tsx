"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { env } from "@/lib/env";

export function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);
  const whatsappNum = (env.business.whatsapp || "01220792948").replace(/[^0-9]/g, "");
  const formattedNumber = whatsappNum.startsWith("0") ? `2${whatsappNum}` : whatsappNum;
  const prefilledText = encodeURIComponent(
    "السلام عليكم، أود الاستفسار عن الآلات والمعدات الزراعية وقطع الغيار لدى شركة لبيب كمال."
  );
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${prefilledText}`;

  return (
    <aside aria-label="مراسلة سريعة عبر واتساب" className="fixed bottom-6 start-6 z-40 flex flex-col items-start gap-2 select-none">
      {/* Interactive Tooltip Card */}
      {showTooltip && (
        <div className="relative animate-bounce bg-white border border-brand-neutral-200 rounded-2xl p-3 shadow-xl max-w-xs text-start text-xs hidden sm:block">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 end-2 text-brand-neutral-400 hover:text-brand-neutral-700"
            title="إخفاء التنبيه"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-emerald-800">خدمة عملاء LKL متواجدون</span>
          </div>
          <p className="text-brand-neutral-600 pe-4 leading-relaxed">
            اضغط هنا للتواصل الفوري عبر واتساب للاستفسار عن المواصفات والأسعار!
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل فوري عبر واتساب مع شركة لبيب كمال"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 hover:bg-[#20bd5a]"
      >
        <span className="absolute -top-1 -end-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-600 border-2 border-white" />
        </span>
        <MessageCircle className="h-7 w-7 transition-transform group-hover:scale-105" />
      </a>
    </aside>
  );
}
