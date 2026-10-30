import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { ShieldCheck, Phone, ArrowLeft, MessageCircle, Sparkles, Award, Heart, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 text-start">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-green-50 border border-brand-green-200 px-3.5 py-1 text-xs font-bold text-brand-green-800">
          <Award className="h-4 w-4 text-brand-gold-600" />
          <span>أصالة 100% • ثبات وأناقة لا تُنسى</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-green-950 tracking-tight leading-tight">
          أمير ستور <br />
          <span className="text-brand-gold-600">للعطور والعود الفاخر</span>
        </h1>
        <p className="text-base sm:text-lg text-brand-neutral-500 leading-relaxed">
          انطلقت رحلتنا من شغف عميق بتراث العطور الشرقية الأصيلة والبحث المستمر عن أندر مصادر العود الطبيعي والزيوت العطرية النقية في العالم. نؤمن بأن العطر ليس مجرد لمسة جمالية، بل هو بصمة شخصية تعكس وقار وأناقة صاحبها.
        </p>
      </div>

      {/* Story & History Section */}
      <section className="rounded-3xl bg-gradient-to-br from-[#2E3A24] via-[#242e1d] to-[#1a2215] text-white p-8 sm:p-12 space-y-6 shadow-xl border border-brand-green-900/40">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            <span>رسالتنا وفلسفتنا في صناعة العطور</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            رحلة البحث عن النقاء والتميز
          </h2>
          <p className="text-sm sm:text-base text-oud-surfaceLight leading-relaxed">
            من غابات كلمنتان بإندونيسيا إلى أرياف كمبوديا ومزارع الورد الطائفي وحقول الخزامى في فرنسا؛ نسافر لاختيار أنقى مستخلصات العود والزهور لنقدم لعملائنا في مصر والوطن العربي توليفات ملكية خاصة تجمع بين ثبات العود وفخامته وانتعاش العطور العالمية الحديثة.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl font-black text-brand-gold-400 block">100%</span>
              <span className="text-xs text-oud-surfaceLight mt-1 block">أدهان عود طبيعية صافية</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl font-black text-brand-gold-400 block">+48</span>
              <span className="text-xs text-oud-surfaceLight mt-1 block">ساعة ثبات مستمر</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl font-black text-brand-gold-400 block">VIP</span>
              <span className="text-xs text-oud-surfaceLight mt-1 block">تغليف ملكي فاخر مجاناً</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="rounded-3xl border border-brand-neutral-200 bg-white p-8 space-y-4 shadow-oud-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-brand-green-100 text-brand-green-800 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-brand-green-950">الأصالة والنقاء</h3>
          <p className="text-sm text-brand-neutral-500 leading-relaxed">
            لا نساوم على جودة الزيوت العطرية. نضمن أن كل قطرة دهن عود أو زجاجة عطر تخضع لمعايير نقاء صارمة خالية من أي شوائب أو مركبات كيميائية ضارة.
          </p>
        </div>

        <div className="rounded-3xl border border-brand-neutral-200 bg-white p-8 space-y-4 shadow-oud-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-brand-gold-100 text-brand-gold-600 flex items-center justify-center">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-brand-green-950">الثبات الاستثنائي</h3>
          <p className="text-sm text-brand-neutral-500 leading-relaxed">
            نعتمد أعلى نسب التركيز العطري (Extrait de Parfum) لضمان أن يظل شذاك فواحاً وحاضراً معك طوال اليوم وفي أهم مناسباتك.
          </p>
        </div>

        <div className="rounded-3xl border border-brand-neutral-200 bg-white p-8 space-y-4 shadow-oud-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-brand-green-100 text-brand-green-800 flex items-center justify-center">
            <Gift className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-brand-green-950">التغليف وتجربة الإهداء</h3>
          <p className="text-sm text-brand-neutral-500 leading-relaxed">
            نهتم بأدق التفاصيل، من الزجاجة الكريستالية الثقيلة إلى الصندوق المخملي الفاخر وكارت الإهداء المجاني المرفق مع كل طلبية.
          </p>
        </div>
      </div>

      {/* Direct Action Banner */}
      <div className="rounded-3xl bg-brand-green-900 text-white p-8 sm:p-12 space-y-8 border border-brand-green-950 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider">
              خدمة العملاء والطلبات
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              جاهزون لمساعدتك في اختيار عطرك القادم
            </h2>
            <p className="text-sm sm:text-base text-oud-surfaceLight leading-relaxed">
              إذا كنت تبحث عن توصية خاصة أو عطر يناسب مناسبة محددة، خبراؤنا في العطور جاهزون دائماً للإجابة على استفساراتكم عبر واتساب أو الهاتف مباشرة.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white px-7 py-4 text-sm font-bold shadow-md transition-all shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <MessageCircle className="h-5 w-5" />
            <span>تواصل معنا عبر واتساب</span>
          </a>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-4">
          <a
            href={`tel:${phone1}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 active:scale-95 text-white px-5 py-2.5 text-sm font-semibold transition-all backdrop-blur-sm"
          >
            <Phone className="h-4 w-4 text-brand-gold-400" />
            <span>اتصال: {phone1}</span>
          </a>

          <Link href="/products">
            <Button variant="outline" size="md" className="rounded-full border-white/30 text-white hover:bg-white/10 active:scale-95">
              تصفح مجموعة العطور
              <ArrowLeft className="h-4 w-4 ms-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
