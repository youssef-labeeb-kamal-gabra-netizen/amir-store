"use client";

import React from "react";
import Link from "next/link";
import { Phone, MessageCircle, Tractor } from "lucide-react";
import { env } from "@/lib/env";
import type { BusinessSettings } from "@/types/settings";

interface MobileActionBarProps {
  settings?: Partial<BusinessSettings>;
}

export function MobileActionBar({ settings }: MobileActionBarProps = {}) {
  const phone1 = settings?.phone || env.business.phone || "01220792948";
  const rawWhatsApp = settings?.whatsapp || env.business.whatsapp || "01220792948";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const formattedWhatsApp = cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp;
  const whatsappUrl = `https://wa.me/${formattedWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم، أود الاستفسار عن الآلات والمعدات الزراعية لدى شركة لبيب كمال."
  )}`;

  return (
    <nav
      aria-label="أزرار التواصل السريع للموبايل"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-neutral-200 px-3 py-2 shadow-2xl"
    >
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* 1. Phone Call - Dark Emerald */}
        <a
          href={`tel:${phone1}`}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-[#064e3b] hover:bg-[#022c22] active:bg-[#022c22] text-white active:scale-90 transition-all shadow-md cursor-pointer btn-touch border border-emerald-800"
        >
          <Phone className="h-5 w-5 mb-0.5 text-amber-300" />
          <span className="text-[11px] font-black tracking-tight">اتصل بالمحل</span>
        </a>

        {/* 2. WhatsApp Direct - Vibrant WhatsApp Green */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-[#25D366] text-white hover:bg-[#20ba59] active:scale-90 active:bg-[#1da851] shadow-lg transition-all cursor-pointer btn-touch border border-emerald-400"
        >
          <span className="absolute -top-1 -end-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>
          <MessageCircle className="h-5 w-5 mb-0.5" />
          <span className="text-[11px] font-black tracking-tight">واتساب مباشر</span>
        </a>

        {/* 3. Catalog - Sunny Golden Wheat */}
        <Link
          href="/products"
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white active:scale-90 transition-all shadow-md cursor-pointer btn-touch border border-amber-400"
        >
          <Tractor className="h-5 w-5 mb-0.5 text-white" />
          <span className="text-[11px] font-black tracking-tight">كل الماكينات</span>
        </Link>
      </div>
    </nav>
  );
}
