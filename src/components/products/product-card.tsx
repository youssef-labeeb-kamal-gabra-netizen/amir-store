"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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

  return (
    <Card className="flex flex-col h-full bg-white border border-brand-neutral-200 rounded-3xl shadow-oud-sm hover:shadow-xl hover:border-brand-green-800/40 card-touch overflow-hidden group transition-all duration-300">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-brand-neutral-50 flex items-center justify-center border-b border-brand-neutral-200/60">
        <Link href={`/products/${product.slug}`} className="absolute inset-0">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center text-brand-neutral-400 p-4 text-center">
              <Sparkles className="h-12 w-12 text-brand-green-800/40 mb-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xs font-medium text-brand-neutral-500">
                {product.brand || "أمير ستور للعطور"}
              </span>
            </div>
          )}
        </Link>

        {/* Category Pill */}
        {product.categoryName && (
          <span className="absolute top-3 end-3 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-brand-green-800 shadow-xs border border-brand-neutral-200 pointer-events-none">
            {product.categoryName}
          </span>
        )}

        {/* Discount Badge */}
        {discountPercent && (
          <span className="absolute top-3 start-3 rounded-full bg-red-600 text-white px-2.5 py-0.5 text-[10px] font-extrabold shadow-sm pointer-events-none">
            خصم {discountPercent}%
          </span>
        )}

        {/* Authenticity Pill */}
        <span className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-brand-green-950/90 text-white backdrop-blur-md px-2.5 py-1 text-[11px] font-medium border border-brand-gold-400/40 shadow-sm pointer-events-none">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold-400 animate-pulse" />
          <span>أصلي 100%</span>
        </span>
      </div>

      <CardHeader className="p-4 sm:p-5 pb-1">
        {product.model && (
          <span className="text-[11px] font-semibold text-brand-green-800 bg-brand-green-50 border border-brand-green-200 px-2.5 py-0.5 rounded-full inline-block w-fit mb-1">
            {product.model}
          </span>
        )}
        <Link href={`/products/${product.slug}`} className="hover:text-brand-gold-600 transition-colors">
          <h3 className="text-sm sm:text-base font-extrabold text-brand-green-950 line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="px-4 sm:px-5 py-2 flex-1 flex flex-col justify-between">
        <p className="text-xs text-brand-neutral-500 line-clamp-2 leading-relaxed mb-3">
          {product.shortDescription}
        </p>

        {/* Pricing Display */}
        <div className="flex items-baseline gap-2 pt-2 border-t border-brand-neutral-100">
          <span className="text-base sm:text-lg font-black text-brand-green-950">
            {price.toLocaleString("ar-EG")} <span className="text-xs font-bold text-brand-neutral-600">ج.م</span>
          </span>
          {compareAtPrice && compareAtPrice > price && (
            <span className="text-xs text-brand-neutral-400 line-through">
              {compareAtPrice.toLocaleString("ar-EG")} ج.م
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-3 sm:p-4 pt-2 flex flex-col gap-2 border-t border-brand-neutral-200/60 bg-brand-neutral-50/50">
        {/* Row 1: Add to Cart */}
        <button
          type="button"
          onClick={() => addItem(product)}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-3 bg-brand-green-800 hover:bg-brand-green-900 active:bg-brand-green-950 text-white font-extrabold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <ShoppingBag className="h-4 w-4 text-brand-gold-400" />
          <span>أضف إلى السلة</span>
        </button>

        {/* Row 2: WhatsApp Direct & View Details */}
        <div className="flex items-center gap-2 w-full">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full py-2 px-2.5 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white font-bold text-[11px] shadow-2xs transition-all active:scale-95"
            title="طلب سريع عبر واتساب"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>طلب واتساب</span>
          </a>

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center gap-1 rounded-full py-2 px-3 border border-brand-neutral-300 hover:border-brand-green-800 hover:bg-white text-brand-neutral-700 hover:text-brand-green-900 font-bold text-[11px] transition-all"
            title="معاينة تفاصيل العطر"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>التفاصيل</span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
