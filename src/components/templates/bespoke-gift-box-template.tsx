"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Gift, CheckCircle2, MessageCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INITIAL_PRODUCTS } from "@/data/catalog";
import { useCart } from "@/lib/cart-context";

interface BoxStyle {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
  price: number;
}

const BOX_STYLES: BoxStyle[] = [
  { id: "noir", name: "صندوق المخمل الأسود الأوبسيديان الملكي", colorName: "Obsidian Noir", colorHex: "#0D0F14", price: 350 },
  { id: "emerald", name: "صندوق الجلد الفاخر الزمردي الإمبراطوري", colorName: "Royal Emerald", colorHex: "#064E3B", price: 400 },
  { id: "ivory", name: "صندوق الحرير العاجي والمذهب الخاص", colorName: "Champagne Ivory", colorHex: "#78350F", price: 380 },
];

export function BespokeGiftBoxTemplate() {
  const [selectedBox, setSelectedBox] = useState<BoxStyle>(BOX_STYLES[0]);
  const [selectedPerfumeId, setSelectedPerfumeId] = useState<string>(INITIAL_PRODUCTS[0]?.id || "p1");
  const [includeOudOil, setIncludeOudOil] = useState<boolean>(true);
  const [includeIncenseChips, setIncludeIncenseChips] = useState<boolean>(true);
  const [calligraphyText, setCalligraphyText] = useState<string>("مع أطيب الأمنيات وأرقى عبارات التقدير والإعزاز");
  const { addItem, setIsCartOpen } = useCart();

  const primaryPerfume = INITIAL_PRODUCTS.find((p) => p.id === selectedPerfumeId) || INITIAL_PRODUCTS[0];
  const primaryPrice = primaryPerfume.price || 0;
  const oudOilPrice = includeOudOil ? 650 : 0;
  const incensePrice = includeIncenseChips ? 450 : 0;
  const totalPrice = selectedBox.price + primaryPrice + oudOilPrice + incensePrice;

  const handleAddToCart = () => {
    addItem({
      id: `box-${Date.now().toString(36)}`,
      name: `صندوق إهداء ملكي مخصص: ${primaryPerfume.name} (${selectedBox.name})`,
      slug: `bespoke-box-${Date.now().toString(36)}`,
      description: "صندوق إهداء ملكي مخصص مع كارت إهداء بالخط العربي المذهب",
      shortDescription: "صندوق إهداء فاخر مخصص",
      categoryId: "perfume-gift-sets",
      categoryName: "باقات وهدايا العطور",
      price: totalPrice,
      images: [primaryPerfume.images[0] || "/images/products/royal-gift-box.svg"],
      model: "صندوق إهداء متكامل مع كارت تهنئة مذهب",
      specifications: [],
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsCartOpen(true);
  };

  const whatsappOrderUrl = `https://wa.me/201220086002?text=${encodeURIComponent(
    `السلام عليكم، أرغب في حجز صندوق إهداء ملكي خاص:\n\n` +
      `• نوع الصندوق: ${selectedBox.name}\n` +
      `• العطر الأساسي: ${primaryPerfume.name} (${primaryPrice} ج.م)\n` +
      (includeOudOil ? `• إضافة دهن عود تراد معتق نقي (650 ج.م)\n` : "") +
      (includeIncenseChips ? `• إضافة رقائق عود كمبودي طبيعي 20 جم (450 ج.م)\n` : "") +
      `• عبارة كارت الإهداء: "${calligraphyText}"\n\n` +
      `💰 الإجمالي النهائي: ${totalPrice.toLocaleString("ar-EG")} ج.م (شحن مجاني ومعاينة)`
  )}`;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-amber-400/25 bg-[#0D0F14]/90 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.8)] text-white text-start space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold font-serif uppercase tracking-wider">
          <Gift className="h-4 w-4 text-amber-400" />
          <span>BESPOKE ROYAL GIFT BOX BUILDER</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white font-arabic">
          مصمم صناديق الإهداء الملكية المخصصة
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          صمم هديتك الفاخرة بنفسك: اختر نوع الصندوق المخملي، العطر الرئيسي، ودهن العود النقي ورقائق البخور، مع كارت إهداء مطبوع بالخط العربي المذهب مجاناً.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configuration Steps */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Box Style */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-amber-300 font-serif tracking-wider uppercase">
              1. اختر طراز ولون الصندوق الملكي:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BOX_STYLES.map((box) => (
                <button
                  key={box.id}
                  type="button"
                  onClick={() => setSelectedBox(box)}
                  className={`p-3.5 rounded-2xl border text-start transition-all duration-200 card-touch ${
                    selectedBox.id === box.id
                      ? "border-amber-400 bg-amber-400/10 shadow-[0_0_15px_rgba(212,175,55,0.2)] ring-1 ring-amber-400/40"
                      : "border-white/10 bg-white/[0.02] hover:border-amber-400/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="h-4 w-4 rounded-full border border-white/30"
                      style={{ backgroundColor: box.colorHex }}
                    />
                    {selectedBox.id === box.id && <CheckCircle2 className="h-4 w-4 text-amber-400" />}
                  </div>
                  <h4 className="text-xs font-bold text-white font-arabic leading-tight">{box.name}</h4>
                  <span className="text-[11px] text-amber-300 font-mono block mt-1">
                    +{box.price} ج.م
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Primary Fragrance Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-amber-300 font-serif tracking-wider uppercase">
              2. اختر العطر الرئيسي (100 مل):
            </label>
            <select
              value={selectedPerfumeId}
              onChange={(e) => setSelectedPerfumeId(e.target.value)}
              className="w-full rounded-xl border border-amber-400/30 bg-[#13161F] p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer font-arabic"
            >
              {INITIAL_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.id} className="bg-[#0D0F14] text-white">
                  {prod.name} — {(prod.price || 0).toLocaleString("ar-EG")} ج.م ({prod.categoryName})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Luxury Add-ons Checkboxes */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-amber-300 font-serif tracking-wider uppercase">
              3. الإضافات الملكية الفاخرة داخل الصندوق:
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeOudOil}
                    onChange={(e) => setIncludeOudOil(e.target.checked)}
                    className="h-4 w-4 rounded accent-amber-400 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">
                      تولة دهن عود تراد معتق نقي (12 مل)
                    </span>
                    <span className="text-[11px] text-slate-400">تقطير نقي 100% مع قارورة كريستالية مذهبة</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300">+650 ج.م</span>
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeIncenseChips}
                    onChange={(e) => setIncludeIncenseChips(e.target.checked)}
                    className="h-4 w-4 rounded accent-amber-400 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">
                      عبوة رقائق عود كمبودي طبيعي فاخر (20 جم)
                    </span>
                    <span className="text-[11px] text-slate-400">كسر بخور فاخرة للمجالس والمناسبات</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300">+450 ج.م</span>
              </label>
            </div>
          </div>

          {/* 4. Calligraphy Dedication Card */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-amber-300 font-serif tracking-wider uppercase">
              4. نص كارت الإهداء الملكي المذهب (مجاني):
            </label>
            <textarea
              rows={2}
              value={calligraphyText}
              onChange={(e) => setCalligraphyText(e.target.value)}
              placeholder="اكتب العبارة أو الإهداء الذي تود طباعته بالخط المذهب داخل الصندوق..."
              className="w-full rounded-xl border border-amber-400/30 bg-[#13161F] p-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Right: Live Box Preview & Total */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-b from-[#13161F] to-[#0D0F14] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-amber-300 font-serif">LIVE BOX SUMMARY</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 text-[10px] font-bold border border-amber-400/20">
                شحن ومعاينة مجانية
              </span>
            </div>

            {/* Visual Box Rendering */}
            <div className="relative aspect-[4/3] rounded-2xl bg-black/60 border border-white/10 p-4 flex flex-col items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{ backgroundColor: selectedBox.colorHex }}
              />
              <Image
                src={primaryPerfume.images[0] || "/images/products/royal-gift-box.svg"}
                alt="Bespoke Gift Box"
                width={160}
                height={160}
                className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] z-10"
              />
              <div className="z-10 mt-2 text-center">
                <span className="text-xs font-bold text-amber-300 font-arabic block truncate max-w-[220px]">
                  {primaryPerfume.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  {selectedBox.name}
                </span>
              </div>
            </div>

            {/* Calligraphy Card Preview */}
            {calligraphyText && (
              <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-start space-y-1">
                <span className="text-[10px] text-amber-300 font-serif block">كارت الإهداء المذهب:</span>
                <p className="text-xs text-white italic font-arabic">&ldquo;{calligraphyText}&rdquo;</p>
              </div>
            )}

            {/* Total Price & Triggers */}
            <div className="pt-2 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">الإجمالي الشامل للتجهيز والتغليف:</span>
                <span className="text-2xl font-black text-amber-300 font-mono">
                  {totalPrice.toLocaleString("ar-EG")} ج.م
                </span>
              </div>

              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddToCart}
                  className="w-full font-black gap-2 shadow-lg justify-center"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>إضافة الصندوق المخصص لسلة المشتريات</span>
                </Button>

                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white py-3 px-4 font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>طلب مباشر عبر مستشار الهدايا الملكية (واتساب)</span>
                </a>
              </div>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                يصلك الصندوق مغلفاً بشريط ساتان مذهب مع بطاقة ضمان الجودة والمعاينة الكاملة قبل الدفع.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
