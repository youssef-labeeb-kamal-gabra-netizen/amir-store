"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { Sparkles, MessageCircle, ShoppingBag, Eye } from "lucide-react";
import { env } from "@/lib/env";
import { useCart } from "@/lib/cart-context";

export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const price = product.price || 1200;
  const compareAtPrice = product.compareAtPrice;
  const discountPercent =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const rawWhatsApp = env.business.whatsapp || "01220086002";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const formattedWhatsApp = cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp;
  const inquiryMessage = encodeURIComponent(
    `السلام عليكم ورحمة الله، أود طلب وشراء عطر: ${product.name} (بسعر ${price.toLocaleString("ar-EG")} ج.م) من متجر أمير ستور.`
  );
  const whatsappHref = `https://wa.me/${formattedWhatsApp}?text=${inquiryMessage}`;

  // Extract scent pyramid preview from specifications if available
  const topNotes = product.specifications?.find((s) => s.label.includes("قمة") || s.label.includes("افتتاحية"))?.value;
  const heartNotes = product.specifications?.find((s) => s.label.includes("قلب"))?.value;
  const baseNotes = product.specifications?.find((s) => s.label.includes("قاعدة"))?.value;
  const scentPyramidPreview = topNotes || heartNotes || baseNotes || product.model || "نوتات عطرية طبيعية فاخرة";

  return (
    <div className="flex flex-col h-full bg-white/[0.03] backdrop-blur-2xl border border-amber-400/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] card-lift shine-sweep overflow-hidden group transition-all duration-300 text-start">
      {/* Product Image Container / Flacon Pedestal */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-[#13161F] to-[#08090C] flex items-center justify-center border-b border-amber-400/15">
        <Link href={`/products/${product.slug}`} className="absolute inset-0 p-4 flex items-center justify-center">
          {product.images && product.images[0] ? (
            <div className="relative w-full h-full">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain group-hover:scale-108 transition-transform duration-500 ease-out drop-shadow-[0_8px_20px_rgba(212,175,55,0.25)]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center text-amber-300/40 p-4 text-center">
              <Sparkles className="h-12 w-12 text-amber-400/50 mb-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xs font-serif font-bold text-amber-200/60">
                {product.brand || "أمير ستور للعطور"}
              </span>
            </div>
          )}
        </Link>

        {/* Ambient Pedestal Light */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-amber-400/10 to-transparent pointer-events-none" />

        {/* Category Pill */}
        {product.categoryName && (
          <span className="absolute top-3 end-3 rounded-full bg-black/75 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-amber-300 shadow-sm border border-amber-400/30 pointer-events-none">
            {product.categoryName}
          </span>
        )}

        {/* Discount Badge */}
        {discountPercent && (
          <span className="absolute top-3 start-3 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white px-2.5 py-0.5 text-[10px] font-extrabold shadow-md pointer-events-none">
            خصم {discountPercent}%
          </span>
        )}

        {/* Pure Oil Authenticity Pill */}
        <span className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-black/80 text-amber-200 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium border border-amber-400/40 shadow-sm pointer-events-none">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>دهن عود نقي 100%</span>
        </span>
      </div>

      {/* Card Header & Scent Notes */}
      <div className="p-4 sm:p-5 pb-1 space-y-2">
        {/* Scent Pyramid Tag */}
        <div className="flex items-center gap-1 text-[11px] font-medium text-amber-300/90 bg-amber-400/10 border border-amber-400/25 px-2.5 py-0.5 rounded-full w-fit max-w-full truncate">
          <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
          <span className="truncate">{scentPyramidPreview}</span>
        </div>

        <Link href={`/products/${product.slug}`} className="block group-hover:text-amber-300 transition-colors">
          <h3 className="text-sm sm:text-base font-extrabold text-white line-clamp-2 leading-snug font-arabic">
            {product.name}
          </h3>
        </Link>
      </div>

      {/* Card Content */}
      <div className="px-4 sm:px-5 py-2 flex-1 flex flex-col justify-between">
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {product.shortDescription}
        </p>

        {/* Pricing Display */}
        <div className="flex items-baseline gap-2 pt-2 border-t border-white/10">
          <span className="text-lg sm:text-xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
            {price.toLocaleString("ar-EG")} <span className="text-xs font-bold text-amber-200/80">ج.م</span>
          </span>
          {compareAtPrice && compareAtPrice > price && (
            <span className="text-xs text-slate-500 line-through">
              {compareAtPrice.toLocaleString("ar-EG")} ج.م
            </span>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-3 sm:p-4 pt-2 flex flex-col gap-2 border-t border-amber-400/15 bg-white/[0.01]">
        {/* Row 1: Add to Cart (Metallic Liquid Gold CTA) */}
        <button
          type="button"
          onClick={() => addItem(product)}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-3 bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] hover:brightness-110 active:scale-95 text-black font-black text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
        >
          <ShoppingBag className="h-4 w-4 text-black" />
          <span>أضف إلى السلة</span>
        </button>

        {/* Row 2: WhatsApp Direct & View Details */}
        <div className="flex items-center gap-2 w-full">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full py-2 px-2.5 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white font-bold text-[11px] shadow-sm transition-all active:scale-95 border border-white/20"
            title="طلب سريع عبر واتساب"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>طلب واتساب</span>
          </a>

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center gap-1 rounded-full py-2 px-3 border border-amber-400/30 bg-white/[0.04] hover:bg-amber-400/15 hover:border-amber-400/60 text-amber-200 hover:text-white font-bold text-[11px] transition-all"
            title="معاينة تفاصيل العطر"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>التفاصيل</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
