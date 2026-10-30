"use client";

import React from "react";
import { Printer, ShieldCheck, QrCode, Award, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface InvoiceTemplateProps {
  orderId?: string;
  customerName?: string;
  phone?: string;
  governorate?: string;
  address?: string;
  createdAt?: string;
  items?: Array<{ name: string; quantity: number; price: number; model?: string }>;
  subtotal?: number;
  shippingCost?: number;
  total?: number;
}

export function InvoiceTemplate({
  orderId = "AMR-998877",
  customerName = "م. أحمد عبد الله",
  phone = "01012345678",
  governorate = "القاهرة",
  address = "التجمع الخامس، شارع التسعين الشمالي",
  createdAt = new Date().toISOString(),
  items = [
    { name: "عطر أمير العود الملكي (Extrait de Parfum 35%)", quantity: 1, price: 1450, model: "قارورة زجاج كريستال 100 مل" },
    { name: "دهن عود كمبودي ملكي معتق 20 سنة نقي", quantity: 1, price: 2100, model: "تولة مذهبة 12 مل" },
  ],
  subtotal = 3550,
  shippingCost = 0,
  total = 3550,
}: InvoiceTemplateProps) {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(createdAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sha256Stamp = `AMR-VERIFIED-${orderId}-${Math.abs(orderId.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)).toString(16).toUpperCase()}`;

  return (
    <div className="max-w-4xl mx-auto my-6 sm:my-10 px-4">
      {/* Action Bar (Hidden in Print) */}
      <div className="flex items-center justify-between gap-4 mb-6 no-print">
        <div className="flex items-center gap-2 text-xs text-gold-300">
          <Award className="w-4 h-4 text-gold-400" />
          <span>وثيقة إلكترونية رسمية معتمدة من دار أمير ستور</span>
        </div>
        <Button
          onClick={handlePrint}
          variant="primary"
          className="bg-gold hover:bg-gold-300 text-obsidian-950 font-bold px-6 py-2.5 rounded-xl shadow-gold-glow flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة الفاتورة والشهادة (PDF)</span>
        </Button>
      </div>

      {/* Main Archival Certificate Container */}
      <div className="bg-surface border border-gold/40 rounded-2xl p-6 sm:p-12 text-obsidian-950 relative overflow-hidden shadow-2xl">
        {/* Subtle Luxury Corner Ornaments (Design 1) */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold-600/50 pointer-events-none" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold-600/50 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold-600/50 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold-600/50 pointer-events-none" />

        {/* Certificate Header */}
        <div className="text-center pb-8 border-b border-gold/20 relative">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 shadow-md">
              <div className="w-full h-full rounded-full bg-surface-lowest flex items-center justify-center text-3xl">
                👑
              </div>
            </div>
          </div>
          <p className="text-[11px] font-serif text-gold-700 tracking-[0.25em] uppercase font-bold mb-1">
            ✦ HAUTE PARFUMERIE & CRYO-FLACONNAGE IMPÉRIAL ✦
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-obsidian-850 tracking-wide mb-2">
            فاتورة الشراء الملكية وشهادة الأصالة المعتمدة
          </h1>
          <p className="text-xs text-stone-600 max-w-xl mx-auto leading-relaxed">
            صادرة رسمياً عن دار <strong className="text-obsidian-950">أمير ستور — AMIR STORE</strong> لتوثيق ملكية القوارير الملكية الأصلية والزيوت المعتقة.
          </p>
        </div>

        {/* Reference & Order Dossier Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-gold/20 text-xs">
          <div>
            <span className="text-stone-500 block mb-1">رقم الوثيقة / الطلب:</span>
            <span className="font-mono font-bold text-gold-800 text-sm">{orderId}</span>
          </div>
          <div>
            <span className="text-stone-500 block mb-1">تاريخ الإصدار:</span>
            <span className="font-bold text-obsidian-900">{formattedDate}</span>
          </div>
          <div>
            <span className="text-stone-500 block mb-1">حالة الدفع:</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
              معتمد ومؤكد
            </span>
          </div>
          <div>
            <span className="text-stone-500 block mb-1">طريقة الاستلام:</span>
            <span className="font-bold text-obsidian-900">شحن مبرد آمن 18°C</span>
          </div>
        </div>

        {/* Customer Dossier */}
        <div className="py-6 border-b border-gold/20 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-surface-low border border-gold/15">
            <h3 className="font-bold text-obsidian-900 mb-2 uppercase tracking-wider text-[11px] text-gold-800">
              بيانات صاحب الاقتناء الملكي:
            </h3>
            <p className="font-bold text-sm text-obsidian-900 mb-1">{customerName}</p>
            <p className="text-stone-600">الهاتف: {phone}</p>
            <p className="text-stone-600">المحافظة: {governorate}</p>
            <p className="text-stone-600">العنوان: {address}</p>
          </div>

          <div className="p-4 rounded-xl bg-surface-low border border-gold/15">
            <h3 className="font-bold text-obsidian-900 mb-2 uppercase tracking-wider text-[11px] text-gold-800">
              دار الإصدار والضمان:
            </h3>
            <p className="font-bold text-sm text-obsidian-900 mb-1">أمير ستور — AMIR STORE</p>
            <p className="text-stone-600">هاتف وخدمة العملاء: +20 12 20086002</p>
            <p className="text-stone-600">الضمان: استرداد كامل خلال 14 يوماً مع الحفاظ على الغلاف الأصلي</p>
            <p className="text-stone-600">التوصيل: متوفر لكافة محافظات جمهورية مصر العربية (27 محافظة)</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="py-6 border-b border-gold/20 overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-gold/20 text-stone-500 uppercase tracking-wider text-[11px]">
                <th className="pb-3 pr-2">العطر / المستحضر النادر</th>
                <th className="pb-3 text-center">المواصفات والحجم</th>
                <th className="pb-3 text-center">الكمية</th>
                <th className="pb-3 text-left pl-2">السعر الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-surface-low/50">
                  <td className="py-3.5 pr-2 font-bold text-obsidian-900">
                    {item.name}
                  </td>
                  <td className="py-3.5 text-center text-stone-600">{item.model || "—"}</td>
                  <td className="py-3.5 text-center font-bold text-obsidian-900">{item.quantity}</td>
                  <td className="py-3.5 text-left pl-2 font-bold text-gold-800">
                    {(item.price * item.quantity).toLocaleString("ar-EG")} ج.م
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Security Verification Hash */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Digital Signature & Verification Seal */}
          <div className="flex items-center gap-4 text-xs">
            <div className="w-16 h-16 p-2 rounded-xl bg-surface-lowest border border-gold/30 flex items-center justify-center">
              <QrCode className="w-12 h-12 text-obsidian-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-gold-800 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>شهادة أصالة مشفرة رقمياً</span>
              </div>
              <p className="font-mono text-[10px] text-stone-500 tracking-wider">
                HASH: {sha256Stamp}
              </p>
              <p className="text-[10px] text-stone-500">امسح الرمز للتحقق من قيد الشحنة في سجلات الدار</p>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>المجموع الجزئي:</span>
              <span className="font-bold text-obsidian-900">{subtotal.toLocaleString("ar-EG")} ج.م</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>تكلفة الشحن والتأمين:</span>
              <span className="font-bold text-emerald-800">
                {shippingCost === 0 ? "شحن ملكي مجاني" : `${shippingCost} ج.م`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-gold/20 text-gold-800">
              <span>الإجمالي النهائي المستحق:</span>
              <span className="text-base text-obsidian-950 font-serif font-extrabold">
                {total.toLocaleString("ar-EG")} ج.م
              </span>
            </div>
          </div>
        </div>

        {/* Footer Authenticity Guarantee */}
        <div className="pt-6 border-t border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500 text-center sm:text-right">
          <p>
            دار أمير ستور تضمن نقاء الزيوت العطرية 100% وثبات الرائحة الممتد لأكثر من 24 ساعة.
          </p>
          <div className="flex items-center gap-1 text-gold-700 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>صُنع بحرفية وعناية ملكية · القاهرة</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceTemplate;
