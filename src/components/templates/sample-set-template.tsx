"use client";

import React from "react";
import { CheckCircle2, ShoppingBag, MessageCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

const SAMPLES = [
  { name: "دهن عود كمبودي معتق نقي", note: "عود طبيعي، بخور، أخشاب غابات معتقة", volume: "3 مل" },
  { name: "عطر أمير العود الملكي", note: "عود كمبودي، عنبر ملكي، زعفران كشميري", volume: "3 مل" },
  { name: "عنبر الفخامة والباتشولي", note: "عنبر أحمر دافئ، فانيليا مدغشقر، توابل شرقية", volume: "3 مل" },
  { name: "مسك الختام والحرير الأبيض", note: "مسك غزال أبيض، زنبق الوادي، قطرات الندى", volume: "3 مل" },
  { name: "ورد الطائف والعود الإمبراطوري", note: "ورد طائفي نخب أول، دهن عود تراد، بلسم ملكي", volume: "3 مل" },
];

export function SampleSetTemplate() {
  const { addItem, setIsCartOpen } = useCart();
  const price = 490;

  const handleAddToCart = () => {
    addItem({
      id: "discovery-flight-5x3ml",
      name: "باقة الاستكشاف الملكية (5 عينات ميني فاخرة 3 مل)",
      slug: "discovery-flight-5x3ml",
      description: "5 زجاجات كريستالية ميني 3 مل مع قسيمة شراء مستردة 100%",
      shortDescription: "باقة عينات ملكية 5x3 مل",
      categoryId: "perfume-gift-sets",
      categoryName: "باقات وهدايا العطور",
      price,
      images: ["/images/products/royal-gift-box.svg"],
      model: "5 زجاجات كريستالية ميني 3 مل + قسيمة شراء مستردة 100%",
      specifications: [],
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsCartOpen(true);
  };

  const whatsappUrl = `https://wa.me/201220086002?text=${encodeURIComponent(
    "السلام عليكم، أرغب في حجز باقة الاستكشاف الملكية (5 عينات ميني 3 مل) بقيمة 490 ج.م مع قسيمة الشراء المستردة."
  )}`;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-amber-400/25 bg-[#0D0F14]/90 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.8)] text-white text-start space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold font-serif uppercase tracking-wider">
          <Award className="h-4 w-4 text-amber-400" />
          <span>ROYAL DISCOVERY FLIGHT TEMPLATE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white font-arabic">
          باقة الاستكشاف الملكية (5 عينات فاخرة)
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          جرب أندر 5 تركيبات عطرية ملكية وأدهان عود في منزلك بكل راحة، مع قسيمة شراء بقيمة الباقة كاملة تُخصم عند شرائك أي زجاجة عطر بالحجم الكبير (100 مل).
        </p>
      </div>

      {/* Grid of 5 Miniature Vials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SAMPLES.map((sample, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-amber-400/20 bg-white/[0.02] hover:border-amber-400/40 hover:bg-white/[0.04] transition-all space-y-3 card-lift"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">✨</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
                {sample.volume}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-arabic">{sample.name}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{sample.note}</p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-amber-300 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
              <span>تركيز ملكي (Extrait de Parfum)</span>
            </div>
          </div>
        ))}

        {/* Voucher Guarantee Card */}
        <div className="p-5 rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-400/15 via-[#13161F] to-[#0D0F14] space-y-3 flex flex-col justify-between shadow-lg">
          <div className="space-y-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black font-serif">
              100% VOUCHER BACK
            </span>
            <h4 className="text-sm font-black text-white font-arabic">
              استرداد كامل لقيمة الباقة!
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              تحصل داخل الصندوق على كود خصم بقيمة <strong>490 ج.م</strong> يُخصم مباشرة عند طلبك لأي زجاجة عطر بالحجم الكبير.
            </p>
          </div>
          <div className="text-[11px] text-amber-300 font-bold font-arabic">
            تعتبر الباقة مجانية بالكامل عند شراء عطرك المفضل!
          </div>
        </div>
      </div>

      {/* Pricing & Order Actions */}
      <div className="p-6 rounded-3xl bg-[#08090C] border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs text-slate-400 block">سعر باقة الاستكشاف المتكاملة:</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-amber-300 font-mono">
              {price.toLocaleString("ar-EG")} ج.م
            </span>
            <span className="text-xs text-slate-400 line-through">750 ج.م</span>
            <span className="text-xs text-emerald-400 font-bold">وفر 260 ج.م</span>
          </div>
          <span className="text-xs text-slate-400 block mt-1">شحن سريع ومعاينة لكافة المحافظات</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Button
            variant="primary"
            size="md"
            onClick={handleAddToCart}
            className="font-black gap-2 shadow-lg px-7"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>طلب باقة الاستكشاف الآن</span>
          </Button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-950/50 text-emerald-300 py-3 px-5 text-xs font-bold transition-all active:scale-95 text-center"
          >
            <MessageCircle className="h-4 w-4" />
            <span>استفسار واتساب</span>
          </a>
        </div>
      </div>
    </div>
  );
}
