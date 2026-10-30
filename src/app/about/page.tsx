import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { ShieldCheck, Phone, ArrowLeft, MessageCircle, Sparkles, Award, Heart, Gift } from "lucide-react";
import { env } from "@/lib/env";

export const metadata = constructMetadata({
  title: "عن أمير ستور | دار العطور والعود الفاخر",
  description:
    "تعرف على فلسفة وقصة متجر أمير ستور، واكتشف شغفنا بانتقاء أندر أدهان العود الطبيعية والعطور الحصرية التي تجسد قمة الفخامة والأناقة.",
  canonicalUrl: "/about",
});

export default function AboutPage() {
  const phone1 = env.business.phone || "01220086002";
  const rawWhatsApp = env.business.whatsapp || "01220086002";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم، أود معرفة المزيد عن تشكيلة العطور المتوفرة لدى أمير ستور."
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 text-start text-white">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 text-xs font-bold text-amber-300">
          <Award className="h-4 w-4 text-amber-400" />
          <span>أصالة 100% • ثبات 72 ساعة وأناقة لا تُنسى</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-arabic">
          أمير ستور <br />
          <span className="liquid-gold-text">للعطور والعود الفاخر</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          انطلقت رحلتنا من شغف عميق بتراث العطور الشرقية الأصيلة والبحث المستمر عن أندر مصادر العود الطبيعي والزيوت العطرية النقية في العالم. نؤمن بأن العطر ليس مجرد لمسة جمالية، بل هو بصمة شخصية تعكس وقار وأناقة صاحبها.
        </p>
      </div>

      {/* Story & History Section */}
      <section className="rounded-3xl bg-gradient-to-br from-[#13161F] via-[#0D0F14] to-[#08090C] text-white p-8 sm:p-12 space-y-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] border border-amber-400/30">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-serif">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span>OUR MISSION & PERFUMERY PHILOSOPHY</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-arabic">
            رحلة البحث عن النقاء والتميز الملكي
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            من غابات كلمنتان بإندونيسيا إلى أرياف كمبوديا ومزارع الورد الطائفي وحقول الخزامى في فرنسا؛ نسافر لاختيار أنقى مستخلصات العود والزهور لنقدم لعملائنا في مصر والوطن العربي توليفات ملكية خاصة تجمع بين ثبات العود وفخامته وانتعاش العطور العالمية الحديثة.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-amber-400/20 text-center">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-amber-400/20">
              <span className="text-3xl font-black text-amber-400 block font-mono">100%</span>
              <span className="text-xs text-slate-300 mt-1 block">أدهان عود طبيعية صافية</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-amber-400/20">
              <span className="text-3xl font-black text-amber-400 block font-mono">+72H</span>
              <span className="text-xs text-slate-300 mt-1 block">ساعة ثبات مستمر</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-amber-400/20">
              <span className="text-3xl font-black text-amber-400 block font-serif">VIP</span>
              <span className="text-xs text-slate-300 mt-1 block">تغليف ملكي فاخر مجاناً</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div className="rounded-3xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-2xl p-8 space-y-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] card-lift">
          <div className="h-12 w-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-arabic">الأصالة والنقاء</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            لا نساوم على جودة الزيوت العطرية. نضمن أن كل قطرة دهن عود أو زجاجة عطر تخضع لمعايير نقاء صارمة خالية من أي شوائب أو مركبات كيميائية ضارة.
          </p>
        </div>

        <div className="rounded-3xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-2xl p-8 space-y-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] card-lift">
          <div className="h-12 w-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-arabic">الثبات الاستثنائي (72 ساعة)</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            نعتمد أعلى نسب التركيز العطري (Extrait de Parfum) لضمان أن يظل شذاك فواحاً وحاضراً معك طوال اليوم وفي أهم مناسباتك.
          </p>
        </div>

        <div className="rounded-3xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-2xl p-8 space-y-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] card-lift">
          <div className="h-12 w-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center">
            <Gift className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-arabic">التغليف وتجربة الإهداء</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            نهتم بأدق التفاصيل، من الزجاجة الكريستالية الثقيلة إلى الصندوق المخملي الفاخر وكارت الإهداء المجاني المرفق مع كل طلبية.
          </p>
        </div>
      </div>

      {/* Direct Action Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#13161F] via-[#0D0F14] to-[#08090C] text-white p-8 sm:p-12 space-y-8 border border-amber-400/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-serif">
              CUSTOMER CARE & ADVISORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-arabic">
              جاهزون لمساعدتك في اختيار عطرك القادم
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              إذا كنت تبحث عن توصية خاصة أو عطر يناسب مناسبة محددة، خبراؤنا في العطور جاهزون دائماً للإجابة على استفساراتكم عبر واتساب أو الهاتف مباشرة.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white px-7 py-4 text-sm font-bold shadow-md transition-all shrink-0 hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
          >
            <MessageCircle className="h-5 w-5" />
            <span>تواصل معنا عبر واتساب</span>
          </a>
        </div>

        <div className="pt-4 border-t border-amber-400/20 flex flex-wrap items-center gap-4">
          <a
            href={`tel:${phone1}`}
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-white/[0.04] hover:bg-amber-400/10 active:scale-95 text-white px-5 py-2.5 text-sm font-semibold transition-all backdrop-blur-sm"
          >
            <Phone className="h-4 w-4 text-amber-400" />
            <span>اتصال: {phone1}</span>
          </a>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] text-black px-6 py-2.5 text-sm font-black transition-all hover:brightness-110 active:scale-95"
          >
            <span>تصفح مجموعة العطور الملكية</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
