"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/lib/cart-context";
import { env } from "@/lib/env";
import { ShoppingBag, MessageCircle, Plus, Minus, Truck, ShieldCheck } from "lucide-react";

interface ProductPurchaseActionsProps {
  product: Product;
}

export function ProductPurchaseActions({ product }: ProductPurchaseActionsProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const price = product.price || 1200;
  const compareAtPrice = product.compareAtPrice;
  const discountPercent =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const rawWhatsApp = env.business.whatsapp || "01220086002";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const formattedWhatsApp = cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp;

  const orderWhatsAppMsg = encodeURIComponent(
    `السلام عليكم ورحمة الله،\nأود طلب وشراء عطر: ${product.name}\n` +
    `الحجم/النوع: ${product.model || "القياسي"}\n` +
    `الكمية: ${quantity}\n` +
    `السعر الإجمالي: ${(price * quantity).toLocaleString("ar-EG")} ج.م\n` +
    `من متجر أمير ستور. برجاء إفادتي بتفاصيل الشحن والتوصيل.`
  );
  const whatsappHref = `https://wa.me/${formattedWhatsApp}?text=${orderWhatsAppMsg}`;

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="space-y-6">
      {/* Price Block */}
      <div className="p-4 rounded-2xl bg-brand-neutral-50 border border-brand-neutral-200/80 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-brand-neutral-500 block mb-1">
            السعر الحالي:
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-black text-brand-green-950">
              {price.toLocaleString("ar-EG")}{" "}
              <span className="text-sm font-bold text-brand-neutral-600">ج.م</span>
            </span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-sm text-brand-neutral-400 line-through">
                {compareAtPrice.toLocaleString("ar-EG")} ج.م
              </span>
            )}
          </div>
        </div>

        {discountPercent && (
          <span className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-black shadow-xs">
            وفر {discountPercent}%
          </span>
        )}
      </div>

      {/* Quantity & Cart Actions Box */}
      <div className="rounded-3xl border border-brand-neutral-200 bg-white p-5 sm:p-6 space-y-4 shadow-oud-sm">
        <div className="flex items-center justify-between pb-2">
          <label className="text-xs sm:text-sm font-bold text-brand-green-950">
            الكمية المطلوبة:
          </label>
          {/* Stepper */}
          <div className="flex items-center border border-brand-neutral-300 rounded-xl overflow-hidden bg-brand-neutral-50">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2.5 hover:bg-brand-neutral-200 text-brand-neutral-700 transition-colors"
              title="إنقاص"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 text-sm font-extrabold text-brand-neutral-900 select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2.5 hover:bg-brand-neutral-200 text-brand-neutral-700 transition-colors"
              title="زيادة"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dual CTA Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* 1. Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-4 px-6 rounded-full bg-brand-green-800 hover:bg-brand-green-900 active:bg-brand-green-950 text-white font-extrabold text-sm sm:text-base shadow-md transition-all active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <ShoppingBag className="h-5 w-5 text-brand-gold-400" />
            <span>
              أضف إلى السلة ({(price * quantity).toLocaleString("ar-EG")} ج.م)
            </span>
          </button>

          {/* 2. Direct WhatsApp Order */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="h-5 w-5" />
            <span>طلب فوري عبر واتساب مباشرة</span>
          </a>
        </div>

        {/* Reassurance text */}
        <div className="pt-2 border-t border-brand-neutral-100 grid grid-cols-2 gap-2 text-[11px] text-brand-neutral-600">
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-brand-green-800" />
            <span>شحن لجميع المحافظات</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-gold-600" />
            <span>معاينة العطر قبل الدفع</span>
          </span>
        </div>
      </div>
    </div>
  );
}
