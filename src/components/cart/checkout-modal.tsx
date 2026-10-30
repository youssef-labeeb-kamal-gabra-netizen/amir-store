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
  Mail,
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
  const [email, setEmail] = useState("");
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
    email?: string;
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
          customerEmail: email.trim() || undefined,
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
        email: email.trim() || undefined,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0D0F14] text-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.8)] border border-amber-400/30 overflow-hidden text-start">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-amber-400/20 bg-[#08090C]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-black flex items-center justify-center font-black">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-arabic">
                {orderSuccess ? "تم استلام طلبك بنجاح!" : "إتمام الشراء (الدفع عند الاستلام)"}
              </h3>
              <p className="text-xs text-slate-400">
                شحن لكافة محافظات مصر مع إمكانية المعاينة قبل الدفع
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {orderSuccess ? (
            <div className="text-center space-y-5 py-4">
              <div className="inline-flex p-3 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300">
                <CheckCircle2 className="h-14 w-14" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-white font-arabic">
                  شكراً لك يا {orderSuccess.name}!
                </h4>
                <p className="text-sm text-slate-300 mt-1">
                  رقم طلبك هو: <strong className="text-amber-400 font-mono text-base">{orderSuccess.orderId}</strong>
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  سيتم تجهيز طلبك بعناية مع تغليف هدايا ملكي مجاني، وسيتواصل معك مندوب الشحن قبل التسليم.
                </p>
              </div>

              {/* Order quick summary box */}
              <div className="rounded-2xl bg-white/[0.03] border border-amber-400/20 p-4 text-start text-xs space-y-2">
                <div className="flex justify-between font-bold text-white">
                  <span>المحافظة والعنوان:</span>
                  <span>{orderSuccess.governorate} - {orderSuccess.address}</span>
                </div>
                <div className="flex justify-between font-bold text-white">
                  <span>المبلغ المطلوب عند الاستلام:</span>
                  <span className="text-amber-400 font-mono text-sm">{orderSuccess.total.toLocaleString("ar-EG")} ج.م</span>
                </div>
                {orderSuccess.email && (
                  <div className="flex items-center gap-1.5 pt-1 text-[11px] text-amber-300 font-semibold border-t border-white/10">
                    <Mail className="h-3.5 w-3.5 text-amber-400" />
                    <span>تم إرسال نسخة من الفاتورة إلى: {orderSuccess.email}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <a
                  href={getWhatsAppConfirmationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white font-black py-3.5 px-6 shadow-md transition-all active:scale-95 text-sm border border-white/20"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>تأكيد الطلب عبر واتساب ومتابعة الشحن</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center rounded-full border border-amber-400/30 hover:bg-white/10 text-slate-300 font-bold py-3 text-xs"
                >
                  متابعة التسوق في المتجر
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Order mini summary with transparent pricing */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-amber-400/25 space-y-1.5 text-xs text-white">
                <div className="flex items-center justify-between font-bold">
                  <span>عدد المنتجات ({items.reduce((s, i) => s + i.quantity, 0)}):</span>
                  <span className="font-mono text-amber-300">{subtotal.toLocaleString("ar-EG")} ج.م</span>
                </div>
                <div className="flex items-center justify-between font-medium text-slate-400">
                  <span>رسوم الشحن والتوصيل:</span>
                  <span className={shippingCost === 0 ? "text-emerald-400 font-bold" : "font-bold font-mono text-white"}>
                    {shippingCost === 0 ? "مجاني (للطلبات 1000+ ج.م)" : "50 ج.م"}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between font-black text-xs sm:text-sm text-white">
                  <span>المبلغ الإجمالي عند الاستلام:</span>
                  <span className="text-sm sm:text-base text-amber-400 font-black font-mono">
                    {finalTotal.toLocaleString("ar-EG")} ج.م
                  </span>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  الاسم بالكامل <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/60" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: محمد أحمد"
                    className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-amber-400/30 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white/[0.04] text-white"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  رقم الهاتف (للتواصل والتسليم) <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/60" />
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010XXXXXXXX / 012XXXXXXXX"
                    className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-amber-400/30 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white/[0.04] text-white text-start"
                  />
                </div>
              </div>

              {/* Email Address (Optional for Invoice) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  البريد الإلكتروني (اختياري — لاستلام فاتورة الشراء)
                </label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/60" />
                  <input
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@domain.com"
                    className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-amber-400/30 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white/[0.04] text-white text-start"
                  />
                </div>
              </div>

              {/* Governorate Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  المحافظة <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/60" />
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-amber-400/30 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-[#13161F] text-white"
                  >
                    {EGYPT_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov} className="bg-[#13161F] text-white">
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Detailed Address */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  العنوان بالتفصيل (المدينة - الحي - الشارع - رقم العقار) <span className="text-amber-400">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="مثال: المعادي - شارع النصر - برج الياسمين الدور الرابع"
                  className="w-full p-2.5 rounded-xl border border-amber-400/30 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white/[0.04] text-white resize-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  ملاحظات إضافية أو كتابة إهداء (اختياري)
                </label>
                <div className="relative">
                  <FileText className="absolute start-3 top-3 h-4 w-4 text-amber-400/60" />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: برجاء وضع كارت إهداء باسم (سارة)"
                    className="w-full ps-9 pe-3 py-2 rounded-xl border border-amber-400/30 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white/[0.04] text-white"
                  />
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-300 bg-white/[0.02] p-2.5 rounded-xl border border-amber-400/20">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                  <span>معاينة العطر قبل الاستلام</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-amber-400" />
                  <span>دفع نقدي عند الاستلام</span>
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] hover:brightness-110 active:scale-95 text-black font-black text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
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
