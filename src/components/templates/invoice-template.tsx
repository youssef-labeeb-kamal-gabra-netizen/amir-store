"use client";

import React from "react";
import { Printer, ShieldCheck } from "lucide-react";
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
    { name: "عطر أمير العود الملكي (Extrait de Parfum)", quantity: 1, price: 1450, model: "100 مل" },
    { name: "دهن عود كمبودي ملكي معتق نقي", quantity: 1, price: 2100, model: "تولة كاملة 12 مل" },
  ],
  subtotal = 3550,
  shippingCost = 0,
  total = 3550,
}: InvoiceTemplateProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const formattedDate = new Date(createdAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 text-start">
      {/* Action Bar (Hidden during print) */}
      <div className="flex items-center justify-between print:hidden">
        <span className="text-xs font-bold text-amber-300 font-serif">
          OFFICIAL INVOICE & AUTHENTICITY CERTIFICATE
        </span>
        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 font-bold">
          <Printer className="h-4 w-4" />
          <span>طباعة الفاتورة / تصدير PDF</span>
        </Button>
      </div>

      {/* Main Invoice Card (Print-optimized) */}
      <div className="rounded-3xl border border-amber-400/30 bg-[#0D0F14] p-8 sm:p-12 shadow-2xl text-white space-y-8 print:bg-white print:text-black print:border-black print:p-4">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-amber-400/20 pb-6 print:border-black">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-400 font-serif print:text-amber-800">
              AMIR STORE • LUXURY PERFUMES & OUD
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white print:text-black font-arabic">
              أمير ستور — دار العطور والعود الفاخر
            </h1>
            <p className="text-xs text-slate-400 print:text-neutral-600">
              فاتورة شراء رسمية وشهادة ضمان أصالة العطور 100%
            </p>
          </div>

          <div className="text-start sm:text-end space-y-1">
            <span className="text-xs text-slate-400 print:text-neutral-600 block">رقم الفاتورة:</span>
            <span className="text-xl font-mono font-black text-amber-300 print:text-black">
              #{orderId}
            </span>
            <span className="text-xs text-slate-400 print:text-neutral-600 block mt-0.5">
              التاريخ: {formattedDate}
            </span>
          </div>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm bg-white/[0.02] print:bg-neutral-100 p-5 rounded-2xl border border-white/5 print:border-neutral-300">
          <div className="space-y-1">
            <span className="text-slate-400 print:text-neutral-600 block">اسم العميل:</span>
            <span className="font-bold text-white print:text-black text-base">{customerName}</span>
            <span className="text-slate-400 print:text-neutral-600 block mt-2">رقم الهاتف:</span>
            <span className="font-mono text-amber-300 print:text-black" dir="ltr">{phone}</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 print:text-neutral-600 block">وجهة الشحن والتوصيل:</span>
            <span className="font-bold text-white print:text-black">{governorate} — {address}</span>
            <span className="text-slate-400 print:text-neutral-600 block mt-2">طريقة السداد:</span>
            <span className="text-emerald-400 print:text-emerald-800 font-bold">الدفع عند الاستلام مع حق المعاينة</span>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-amber-400/20 text-amber-300 print:text-black print:border-black font-bold">
                <th className="py-3 text-start">المنتج والتركيز</th>
                <th className="py-3 text-center">الكمية</th>
                <th className="py-3 text-end">سعر الوحدة</th>
                <th className="py-3 text-end">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 print:divide-neutral-300">
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3.5 text-start">
                    <span className="font-bold text-white print:text-black block">{item.name}</span>
                    {item.model && <span className="text-xs text-slate-400 print:text-neutral-600">{item.model}</span>}
                  </td>
                  <td className="py-3.5 text-center font-mono">{item.quantity}</td>
                  <td className="py-3.5 text-end font-mono">{item.price.toLocaleString("ar-EG")} ج.م</td>
                  <td className="py-3.5 text-end font-mono font-bold text-amber-300 print:text-black">
                    {(item.price * item.quantity).toLocaleString("ar-EG")} ج.م
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Seal */}
        <div className="pt-4 border-t border-amber-400/20 print:border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-sm">
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 print:text-amber-800 font-bold">
              <ShieldCheck className="h-4 w-4" />
              <span>ميثاق الأصالة والضمان الملكي 72 ساعة</span>
            </div>
            <p className="text-[11px] text-slate-400 print:text-neutral-600 leading-relaxed">
              تضمن دار أمير ستور نقاء الزيوت بنسبة 100%، وخلوها من الإضافات الكيميائية، مع حق المعاينة ورفض الاستلام دون أي تكلفة في حالة عدم الرضا.
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-2 bg-[#13161F] print:bg-neutral-100 p-4 rounded-2xl border border-amber-400/20 print:border-neutral-300">
            <div className="flex justify-between text-xs text-slate-300 print:text-neutral-700">
              <span>المجموع الفرعي:</span>
              <span className="font-mono">{subtotal.toLocaleString("ar-EG")} ج.م</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300 print:text-neutral-700">
              <span>الشحن والتوصيل:</span>
              <span>{shippingCost === 0 ? "مجاني 🎁" : `${shippingCost} ج.م`}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-amber-300 print:text-black pt-2 border-t border-white/10 print:border-neutral-300">
              <span>الإجمالي المستحق:</span>
              <span className="font-mono text-base">{total.toLocaleString("ar-EG")} ج.م</span>
            </div>
          </div>
        </div>

        {/* Footer Official Seal */}
        <div className="pt-4 border-t border-white/5 print:border-neutral-300 text-center text-[11px] text-slate-400 print:text-neutral-600">
          <span>أمير ستور للعطور والعود الفاخر • هاتف وواتساب: 01220086002 • جمهورية مصر العربية</span>
        </div>
      </div>
    </div>
  );
}
