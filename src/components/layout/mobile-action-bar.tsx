"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, Sparkles, ShoppingBag } from "lucide-react";
import { env } from "@/lib/env";
import { useCart } from "@/lib/cart-context";
import type { BusinessSettings } from "@/types/settings";

interface MobileActionBarProps {
  settings?: Partial<BusinessSettings>;
}

export function MobileActionBar({ settings }: MobileActionBarProps = {}) {
  const { totalCount, setIsCartOpen } = useCart();
  const rawWhatsApp = settings?.whatsapp || env.business.whatsapp || "01220086002";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const formattedWhatsApp = cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp;
  const whatsappUrl = `https://wa.me/${formattedWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم، أود الاستفسار عن تشكيلة العطور والعود الفاخر لدى متجر أمير ستور."
  )}`;

  return (
    <nav
      aria-label="أزرار التواصل السريع للموبايل"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-neutral-200 px-3 py-2 shadow-2xl"
    >
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* 1. Cart Drawer Trigger - Deep Forest Green */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-brand-green-800 hover:bg-brand-green-900 active:bg-brand-green-950 text-white active:scale-90 transition-all shadow-md cursor-pointer btn-touch border border-brand-green-700"
        >
          <div className="relative mb-0.5">
            <ShoppingBag className="h-5 w-5 text-brand-gold-400" />
            {totalCount > 0 && (
              <span className="absolute -top-2 -end-2 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white shadow-xs">
                {totalCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-black tracking-tight">سلة المشتريات</span>
        </button>

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

        {/* 3. Perfumes Catalog - Gold / Earthy Luxury */}
        <Link
          href="/products"
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-brand-gold-600 hover:bg-brand-gold-700 active:bg-brand-gold-800 text-white active:scale-90 transition-all shadow-md cursor-pointer btn-touch border border-brand-gold-500"
        >
          <Sparkles className="h-5 w-5 mb-0.5 text-white" />
          <span className="text-[11px] font-black tracking-tight">مجموعة العطور</span>
        </Link>
      </div>
    </nav>
  );
}
