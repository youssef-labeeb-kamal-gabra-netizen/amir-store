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
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#08090C]/90 backdrop-blur-2xl border-t border-amber-400/25 px-3 py-2 shadow-[0_-4px_30px_rgba(0,0,0,0.8)]"
    >
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* 1. Cart Drawer Trigger */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-white/[0.04] border border-amber-400/30 hover:bg-amber-400/10 active:bg-amber-400/20 text-white active:scale-90 transition-all shadow-sm cursor-pointer btn-touch"
        >
          <div className="relative mb-0.5">
            <ShoppingBag className="h-5 w-5 text-amber-400" />
            {totalCount > 0 && (
              <span className="absolute -top-2 -end-2 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-[10px] font-black text-black shadow-xs animate-pulse">
                {totalCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-black tracking-tight text-white">سلة المشتريات</span>
        </button>

        {/* 2. WhatsApp Direct */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-[#25D366] text-white hover:bg-[#20ba59] active:scale-90 active:bg-[#1da851] shadow-lg transition-all cursor-pointer btn-touch border border-white/20"
        >
          <span className="absolute -top-1 -end-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>
          <MessageCircle className="h-5 w-5 mb-0.5" />
          <span className="text-[11px] font-black tracking-tight">واتساب مباشر</span>
        </a>

        {/* 3. Perfumes Catalog */}
        <Link
          href="/products"
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] text-black active:scale-90 transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] cursor-pointer btn-touch"
        >
          <Sparkles className="h-5 w-5 mb-0.5 text-black" />
          <span className="text-[11px] font-black tracking-tight">مجموعة العطور</span>
        </Link>
      </div>
    </nav>
  );
}
