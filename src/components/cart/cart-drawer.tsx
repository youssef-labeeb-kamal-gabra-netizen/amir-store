"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { CheckoutModal } from "./checkout-modal";
import { env } from "@/lib/env";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  Truck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalCount,
    subtotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 1000;
  const progressToFreeShipping = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const rawWhatsApp = env.business.whatsapp || "01220086002";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const formattedWhatsApp = cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp;

  const generateWhatsAppOrderUrl = () => {
    const itemsList = items
      .map(
        (i) =>
          `• ${i.name} (${i.model || "الحجم القياسي"}) × ${i.quantity} = ${(i.price * i.quantity).toLocaleString("ar-EG")} ج.م`
      )
      .join("\n");

    const message = encodeURIComponent(
      `السلام عليكم ورحمة الله،\nأود إتمام طلب وشراء المنتجات التالية من متجر أمير ستور:\n\n` +
      `${itemsList}\n\n` +
      `الإجمالي: ${subtotal.toLocaleString("ar-EG")} ج.م\n` +
      `الشحن: ${subtotal >= FREE_SHIPPING_THRESHOLD ? "مجاني لكافة المحافظات" : "حسب المحافظة"}\n\n` +
      `برجاء إفادتي بتفاصيل الشحن والتوصيل. شكراً لكم!`
    );

    return `https://wa.me/${formattedWhatsApp}?text=${message}`;
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-brand-green-950/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsCartOpen(false)}
          aria-hidden="true"
        />

        {/* Slide-out Drawer (from right side in RTL) */}
        <aside
          className="relative w-full sm:w-[450px] max-w-[95vw] h-full bg-white shadow-2xl z-50 flex flex-col border-s border-brand-neutral-200 animate-in slide-in-from-right duration-300 text-start overflow-hidden"
          aria-label="سلة المشتريات"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-brand-neutral-200 bg-brand-neutral-50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-brand-green-800 text-brand-gold-400 flex items-center justify-center font-bold">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-brand-green-950 flex items-center gap-2">
                  <span>سلة المشتريات</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-green-800 text-white font-bold">
                    {totalCount}
                  </span>
                </h3>
                <p className="text-[11px] text-brand-neutral-500">
                  متجر أمير ستور للعطور والعود الفاخر
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-brand-neutral-500 hover:text-brand-neutral-900 hover:bg-brand-neutral-200 transition-colors cursor-pointer"
              aria-label="إغلاق السلة"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="p-3 bg-brand-green-50/80 border-b border-brand-green-200/60 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-bold text-brand-green-950">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-brand-gold-600" />
                {remainingForFreeShipping > 0 ? (
                  <span>
                    أضف بقيمة{" "}
                    <strong className="text-brand-green-800">
                      {remainingForFreeShipping.toLocaleString("ar-EG")} ج.م
                    </strong>{" "}
                    للحصول على شحن مجاني
                  </span>
                ) : (
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-brand-gold-500" />
                    تهانينا! حصلت على شحن مجاني لجميع المحافظات
                  </span>
                )}
              </span>
              <span className="text-[11px] text-brand-neutral-500">
                {Math.round(progressToFreeShipping)}%
              </span>
            </div>
            <div className="w-full h-2 bg-brand-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-gold-500 to-emerald-600 transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="h-20 w-20 rounded-full bg-brand-neutral-100 flex items-center justify-center text-brand-neutral-400">
                  <ShoppingBag className="h-10 w-10 text-brand-green-800/40" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-brand-green-950">
                    سلة المشتريات فارغة حالياً
                  </h4>
                  <p className="text-xs text-brand-neutral-500 max-w-xs leading-relaxed">
                    استكشف مجموعتنا الفاخرة من العطور الشرقية ودهن العود الملكي وأضف لمستك العطرية الخاصة!
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-green-800 text-white font-bold text-xs hover:bg-brand-green-900 transition-all active:scale-95"
                >
                  <span>تصفح العطور الآن</span>
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-2xl border border-brand-neutral-200 bg-white hover:border-brand-green-300 transition-all shadow-2xs"
                >
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-brand-neutral-50 shrink-0 border border-brand-neutral-200">
                    <Image
                      src={item.image || "/images/logo.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-bold text-xs sm:text-sm text-brand-green-950 hover:text-brand-gold-600 line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-brand-neutral-400 hover:text-red-600 p-1 rounded-md transition-colors"
                          title="حذف من السلة"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {item.model && (
                        <span className="text-[10px] text-brand-neutral-500">
                          {item.model}
                        </span>
                      )}
                    </div>

                    {/* Price and Counter */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs font-black text-brand-green-950">
                        {(item.price * item.quantity).toLocaleString("ar-EG")} ج.م
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center border border-brand-neutral-200 rounded-lg overflow-hidden bg-brand-neutral-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-brand-neutral-200 text-brand-neutral-700 transition-colors"
                          title="إنقاص"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-brand-neutral-900 select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-brand-neutral-200 text-brand-neutral-700 transition-colors"
                          title="زيادة"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Checkout Actions */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-brand-neutral-200 bg-brand-neutral-50/90 space-y-3 shrink-0">
              {/* Cost Summary */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-brand-neutral-600">
                  <span>المجموع الفرعي ({totalCount} منتج):</span>
                  <span className="font-bold text-brand-neutral-900">
                    {subtotal.toLocaleString("ar-EG")} ج.م
                  </span>
                </div>
                <div className="flex justify-between text-brand-neutral-600">
                  <span>الشحن:</span>
                  <span className="font-bold text-emerald-700">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? "مجاني" : "يحسب عند التسليم"}
                  </span>
                </div>
                <div className="pt-2 border-t border-brand-neutral-200 flex justify-between font-black text-base text-brand-green-950">
                  <span>الإجمالي التقريبي:</span>
                  <span className="text-brand-green-900">
                    {subtotal.toLocaleString("ar-EG")} ج.م
                  </span>
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* 1. Cash on Delivery Checkout */}
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3 px-4 rounded-full bg-brand-green-800 hover:bg-brand-green-900 active:bg-brand-green-950 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="h-4 w-4 text-brand-gold-400" />
                  <span>إتمام الشراء (الدفع عند الاستلام)</span>
                </button>

                {/* 2. Direct WhatsApp Order */}
                <a
                  href={generateWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>طلب فوري عبر محادثة واتساب</span>
                </a>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
