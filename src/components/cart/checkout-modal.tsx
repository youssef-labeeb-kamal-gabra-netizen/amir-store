"use client";

import React, { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { env } from "@/lib/env";
import {
  X,
  CheckCircle2,
  Phone,
  User,
  MapPin,
  FileText,
  Truck,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EGYPT_GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "الشرقية",
  "القليوبية",
  "البحيرة",
  "الغربية",
  "المنوفية",
  "دمياط",
  "كفر الشيخ",
  "بورسعيد",
  "الإسماعيلية",
  "السويس",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "البحر الأحمر",
  "مطروح",
  "الوادي الجديد",
  "شمال سيناء",
  "جنوب سيناء",
];

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, subtotal, clearCart } = useCart();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState(EGYPT_GOVERNORATES[0]);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<null | {
    orderId: string;
    itemsSummary: string;
    total: number;
    governorate: string;
    address: string;
    phone: string;
    name: string;
  }>(null);

  if (!isOpen) return null;

  const rawWhatsApp = env.business.whatsapp || "01220086002";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const formattedWhatsApp = cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp;

  const FREE_SHIPPING_THRESHOLD = 1000;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50;
  const finalTotal = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert("يرجى ملء جميع الحقول المطلوبة: الاسم، رقم الهاتف، والعنوان بالتفصيل.");
      return;
    }

    const cleanPhone = phone.replace(/[\s\-()]/g, "").trim();
    const normalizedPhone = cleanPhone.startsWith("+20")
      ? cleanPhone.slice(3)
      : cleanPhone.startsWith("0020")
      ? cleanPhone.slice(4)
      : cleanPhone.startsWith("20") && cleanPhone.length === 12
      ? cleanPhone.slice(2)
      : cleanPhone;

    if (!/^(010|011|012|015)[0-9]{8}$/.test(normalizedPhone)) {
      alert("يرجى كتابة رقم هاتف مصري صحيح (11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: fullName,
          phone: normalizedPhone,
          governorate,
          address,
          notes,
          items: items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
          })),
          paymentMethod: "COD",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "فشل تسجيل الطلب");
      }

      const itemsSummary = items
        .map((i) => `• ${i.name} (${i.model || "الحجم القياسي"}) × ${i.quantity} = ${(i.price * i.quantity).toLocaleString("ar-EG")} ج.م`)
        .join("\n");

      setOrderSuccess({
        orderId: data.order.id,
        itemsSummary,
        total: data.order.total,
        governorate,
        address,
        phone: normalizedPhone,
        name: fullName,
      });

      clearCart();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع أثناء إرسال الطلب";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppConfirmationUrl = () => {
    if (!orderSuccess) return "#";
    const msg = encodeURIComponent(
      `السلام عليكم ورحمة الله،\nلقد قمت بطلب أوردر جديد من موقع أمير ستور:\n` +
      `رقم الطلب: ${orderSuccess.orderId}\n` +
      `الاسم: ${orderSuccess.name}\n` +
      `الهاتف: ${orderSuccess.phone}\n` +
      `المحافظة: ${orderSuccess.governorate}\n` +
      `العنوان: ${orderSuccess.address}\n\n` +
      `المنتجات:\n${orderSuccess.itemsSummary}\n\n` +
      `الإجمالي: ${orderSuccess.total.toLocaleString("ar-EG")} ج.م (الدفع عند الاستلام)\n` +
      (notes ? `ملاحظات: ${notes}\n` : "") +
      `برجاء تأكيد الطلب وسرعة الشحن. شكراً لكم!`
    );
    return `https://wa.me/${formattedWhatsApp}?text=${msg}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-green-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-brand-neutral-200 overflow-hidden text-start">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-neutral-200 bg-brand-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-brand-green-800 text-brand-gold-400 flex items-center justify-center font-bold">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-brand-green-950">
                {orderSuccess ? "تم استلام طلبك بنجاح!" : "إتمام الشراء (الدفع عند الاستلام)"}
              </h3>
              <p className="text-xs text-brand-neutral-500">
                شحن لجميع محافظات مصر مع إمكانية المعاينة قبل الدفع
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-brand-neutral-400 hover:text-brand-neutral-800 hover:bg-brand-neutral-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {orderSuccess ? (
            <div className="text-center space-y-5 py-4">
              <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-14 w-14" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-brand-green-950">
                  شكراً لك يا {orderSuccess.name}!
                </h4>
                <p className="text-sm text-brand-neutral-600 mt-1">
                  رقم طلبك هو: <strong className="text-brand-green-800 text-base">{orderSuccess.orderId}</strong>
                </p>
                <p className="text-xs text-brand-neutral-500 mt-2">
                  سيتم تجهيز طلبك بعناية مع تغليف هدايا ملكي مجاني، وسيتواصل معك مندوب الشحن قبل التسليم.
                </p>
              </div>

              {/* Order quick summary box */}
              <div className="rounded-2xl bg-brand-neutral-50 border border-brand-neutral-200 p-4 text-start text-xs space-y-2">
                <div className="flex justify-between font-bold text-brand-green-950">
                  <span>المحافظة والعنوان:</span>
                  <span>{orderSuccess.governorate} - {orderSuccess.address}</span>
                </div>
                <div className="flex justify-between font-bold text-brand-green-950">
                  <span>المبلغ المطلوب عند الاستلام:</span>
                  <span className="text-brand-gold-600 text-sm">{orderSuccess.total.toLocaleString("ar-EG")} ج.م</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <a
                  href={getWhatsAppConfirmationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white font-bold py-3.5 px-6 shadow-md transition-all active:scale-95 text-sm"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>تأكيد الطلب عبر واتساب ومتابعة الشحن</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center rounded-full border border-brand-neutral-300 hover:bg-brand-neutral-50 text-brand-neutral-800 font-bold py-3 text-xs"
                >
                  متابعة التسوق في المتجر
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Order mini summary with transparent pricing */}
              <div className="p-3.5 rounded-2xl bg-brand-green-50/70 border border-brand-green-200/80 space-y-1.5 text-xs text-brand-green-950">
                <div className="flex items-center justify-between font-bold">
                  <span>عدد المنتجات ({items.reduce((s, i) => s + i.quantity, 0)}):</span>
                  <span>{subtotal.toLocaleString("ar-EG")} ج.م</span>
                </div>
                <div className="flex items-center justify-between font-medium text-brand-neutral-700">
                  <span>رسوم الشحن والتوصيل:</span>
                  <span className={shippingCost === 0 ? "text-emerald-700 font-bold" : "font-bold"}>
                    {shippingCost === 0 ? "مجاني (للطلبات 1000+ ج.م)" : "50 ج.م"}
                  </span>
                </div>
                <div className="pt-2 border-t border-brand-green-200 flex items-center justify-between font-black text-xs sm:text-sm text-brand-green-950">
                  <span>المبلغ الإجمالي عند الاستلام:</span>
                  <span className="text-sm sm:text-base text-brand-green-900 font-black">
                    {finalTotal.toLocaleString("ar-EG")} ج.م
                  </span>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-brand-green-950 mb-1">
                  الاسم بالكامل <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-neutral-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: محمد أحمد"
                    className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-brand-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-green-700 bg-white"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-brand-green-950 mb-1">
                  رقم الهاتف (للتواصل والتسليم) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-neutral-400" />
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010XXXXXXXX / 012XXXXXXXX"
                    className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-brand-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-green-700 bg-white text-start"
                  />
                </div>
              </div>

              {/* Governorate Selection */}
              <div>
                <label className="block text-xs font-bold text-brand-green-950 mb-1">
                  المحافظة <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-neutral-400" />
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-brand-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-green-700 bg-white"
                  >
                    {EGYPT_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Detailed Address */}
              <div>
                <label className="block text-xs font-bold text-brand-green-950 mb-1">
                  العنوان بالتفصيل (المدينة - الحي - الشارع - رقم العقار) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="مثال: المعادي - شارع النصر - برج الياسمين الدور الرابع"
                  className="w-full p-2.5 rounded-xl border border-brand-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-green-700 bg-white resize-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-brand-green-950 mb-1">
                  ملاحظات إضافية أو كتابة إهداء (اختياري)
                </label>
                <div className="relative">
                  <FileText className="absolute start-3 top-3 h-4 w-4 text-brand-neutral-400" />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: برجاء وضع كارت إهداء باسم (سارة)"
                    className="w-full ps-9 pe-3 py-2 rounded-xl border border-brand-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-green-700 bg-white"
                  />
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-brand-neutral-600 bg-brand-neutral-50 p-2.5 rounded-xl border border-brand-neutral-200">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-gold-600" />
                  <span>معاينة العطر قبل الاستلام</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-brand-green-800" />
                  <span>دفع نقدي عند الاستلام</span>
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 rounded-full bg-brand-green-800 hover:bg-brand-green-900 active:bg-brand-green-950 text-white font-extrabold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>جاري تسجيل الطلب...</span>
                ) : (
                  <span>تأكيد الطلب — {finalTotal.toLocaleString("ar-EG")} ج.م (الدفع عند الاستلام)</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
