"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { env } from "@/lib/env";
import type { BusinessSettings } from "@/types/settings";

interface WhatsAppFloatingButtonProps {
  settings?: Partial<BusinessSettings>;
}

export function WhatsAppFloatingButton({ settings }: WhatsAppFloatingButtonProps = {}) {
  const [showNotification, setShowNotification] = useState(true);
  const rawNumber = settings?.whatsapp || env.business.whatsapp || "01220792948";
  const cleanNumber = rawNumber.replace(/[^0-9]/g, "");
  const formattedNumber = cleanNumber.startsWith("0") ? `2${cleanNumber}` : cleanNumber;

  const defaultMessage = encodeURIComponent(
    "السلام عليكم ورحمة الله، أود الاستفسار عن الآلات والمعدات الزراعية وقطع الغيار لدى شركة لبيب كمال."
  );

  const href = `https://wa.me/${formattedNumber}?text=${defaultMessage}`;

  return (
    <aside aria-label="مراسلة سريعة عبر واتساب" className="hidden md:flex fixed bottom-6 start-6 z-50 flex-col items-start gap-2 select-none">
      {/* Interactive Tooltip Card */}
      {showNotification && (
        <div className="relative animate-bounce bg-white border border-brand-neutral-200 rounded-2xl p-3 shadow-xl max-w-xs text-start text-xs hidden sm:block">
          <button
            onClick={() => setShowNotification(false)}
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
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل فوري عبر واتساب مع شركة لبيب كمال"
        className="group relative flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 hover:bg-[#20bd5a] focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        <span className="absolute -top-1 -end-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-600 border-2 border-white" />
        </span>
        <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
        <span className="text-xs sm:text-sm font-bold tracking-wide">راسلنا على واتساب</span>
      </a>
    </aside>
  );
}
