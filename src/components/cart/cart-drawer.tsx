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
    clearCart,
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWhatsAppSubmitting, setIsWhatsAppSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 1000;
  const progressToFreeShipping = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const rawWhatsApp = env.business.whatsapp || "01220086002";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const formattedWhatsApp = cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp;

  const handleWhatsAppCheckout = async () => {
    if (items.length === 0 || isWhatsAppSubmitting) return;
    setIsWhatsAppSubmitting(true);

    try {
      // 1. Authoritative order registration with paymentMethod: "WHATSAPP"
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "عميل واتساب",
          phone: "01000000000",
          governorate: "القاهرة",
          address: "طلب مباشر عبر محادثة واتساب",
          paymentMethod: "WHATSAPP",
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      const orderId = data.ok && data.order ? data.order.id : `AMR-${Date.now().toString().slice(-6)}`;

      // 2. Build structured WhatsApp invoice
      const itemsList = items
        .map((i, index) => `${index + 1}. ${i.name} (عدد: ${i.quantity} × ${i.price} ج.م)`)
        .join("\n");

      const shippingText = subtotal >= FREE_SHIPPING_THRESHOLD ? "مجاني" : "50 ج.م";
      const totalAmount = subtotal >= FREE_SHIPPING_THRESHOLD ? subtotal : subtotal + 50;

      const message = encodeURIComponent(
        `السلام عليكم ورحمة الله،\nأود تأكيد طلب شراء من متجر أمير ستور للعطور:\n\n` +
          `📌 كود الطلب: ${orderId}\n` +
          `📦 محتويات السلة:\n${itemsList}\n\n` +
          `💰 المجموع الفرعي: ${subtotal.toLocaleString("ar-EG")} ج.م\n` +
          `🚚 الشحن: ${shippingText}\n` +
          `✨ الإجمالي: ${totalAmount.toLocaleString("ar-EG")} ج.م\n\n` +
          `أرجو تزويدي بموعد التوصيل، شكراً لكم.`
      );

      // Clear cart & open WhatsApp
      clearCart();
      setIsCartOpen(false);
      window.open(`https://wa.me/${formattedWhatsApp}?text=${message}`, "_blank");
    } catch {
      // Fallback direct WhatsApp if server fails
      const itemsList = items
        .map((i, index) => `${index + 1}. ${i.name} (عدد: ${i.quantity} × ${i.price} ج.م)`)
        .join("\n");

      const message = encodeURIComponent(
        `السلام عليكم ورحمة الله،\nأود شراء العطور التالية من متجر أمير ستور:\n\n${itemsList}\n\nالإجمالي: ${subtotal} ج.م\nأرجو المتابعة.`
      );
      window.open(`https://wa.me/${formattedWhatsApp}?text=${message}`, "_blank");
    } finally {
      setIsWhatsAppSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
        {/* Backdrop overlay */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsCartOpen(false)}
          aria-hidden="true"
        />

        {/* Slide-out Drawer (from right side in RTL) */}
        <aside
          className="relative w-full sm:w-[450px] max-w-[95vw] h-full bg-[#0D0F14] text-white shadow-2xl z-50 flex flex-col border-s border-amber-400/25 animate-in slide-in-from-right duration-300 text-start overflow-hidden"
          aria-label="سلة المشتريات"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-amber-400/20 bg-[#08090C] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-black flex items-center justify-center font-black">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2 font-arabic">
                  <span>سلة المشتريات الملكية</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400 text-black font-black">
                    {totalCount}
                  </span>
                </h3>
                <p className="text-[11px] text-amber-200/70">
                  متجر أمير ستور للعطور والعود الفاخر
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="إغلاق السلة"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="p-3 bg-white/[0.03] border-b border-amber-400/20 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-bold text-white">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-amber-400" />
                {remainingForFreeShipping > 0 ? (
                  <span>
                    أضف بقيمة{" "}
                    <strong className="text-amber-400">
                      {remainingForFreeShipping.toLocaleString("ar-EG")} ج.م
                    </strong>{" "}
                    للحصول على شحن مجاني
                  </span>
                ) : (
                  <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    تهانينا! حصلت على شحن مجاني لكافة المحافظات
                  </span>
                )}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {Math.round(progressToFreeShipping)}%
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="h-20 w-20 rounded-full bg-white/[0.04] border border-amber-400/20 flex items-center justify-center text-amber-400/40">
                  <ShoppingBag className="h-10 w-10 text-amber-400/40" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-white font-arabic">
                    سلة المشتريات فارغة حالياً
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    استكشف مجموعتنا الفاخرة من العطور الشرقية ودهن العود الملكي وأضف لمستك العطرية الخاصة!
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black font-black text-xs hover:brightness-110 transition-all active:scale-95"
                >
                  <span>تصفح العطور الآن</span>
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-2xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-xl hover:border-amber-400/40 transition-all shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-gradient-to-b from-[#13161F] to-[#08090C] shrink-0 border border-amber-400/20 p-1">
                    <Image
                      src={item.image || "/images/logo.png"}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-bold text-xs sm:text-sm text-white hover:text-amber-300 line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-400 p-1 rounded-md transition-colors"
                          title="حذف من السلة"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {item.model && (
                        <span className="text-[10px] text-amber-200/70">
                          {item.model}
                        </span>
                      )}
                    </div>

                    {/* Price and Counter */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs font-black text-amber-400 font-mono">
                        {(item.price * item.quantity).toLocaleString("ar-EG")} ج.م
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center border border-amber-400/30 rounded-lg overflow-hidden bg-black/40">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-white/10 text-slate-300 transition-colors"
                          title="إنقاص"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white select-none font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-white/10 text-slate-300 transition-colors"
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
            <div className="p-4 sm:p-5 border-t border-amber-400/20 bg-[#08090C] space-y-3 shrink-0">
              {/* Cost Summary */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>المجموع الفرعي ({totalCount} منتج):</span>
                  <span className="font-bold text-white font-mono">
                    {subtotal.toLocaleString("ar-EG")} ج.م
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>الشحن:</span>
                  <span className="font-bold text-emerald-400">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? "مجاني" : "يحسب عند التسليم"}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between font-black text-base text-white">
                  <span>الإجمالي:</span>
                  <span className="text-amber-400 font-mono">
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
                  className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] hover:brightness-110 active:scale-95 text-black font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="h-4 w-4 text-black" />
                  <span>إتمام الشراء (الدفع عند الاستلام والمعاينة)</span>
                </button>

                {/* 2. Synchronized WhatsApp Order Button */}
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  disabled={isWhatsAppSubmitting}
                  className="w-full py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white font-black text-xs sm:text-sm shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>
                    {isWhatsAppSubmitting ? "جاري إنشاء كود الطلب..." : "طلب فوري عبر محادثة واتساب"}
                  </span>
                </button>
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
