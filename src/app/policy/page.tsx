import React from "react";
import { constructMetadata } from "@/lib/seo";
import { env } from "@/lib/env";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  PackageCheck,
  Clock,
  RotateCcw,
} from "lucide-react";

export const metadata = constructMetadata({
  title: "سياسة الضمان والمعاينة والاستبدال | أمير ستور",
  description:
    "تعرف على سياسة أمير ستور لضمان أصالة العطور 100%، حق المعاينة قبل الدفع، وخيارات الشحن لكافة محافظات مصر.",
  canonicalUrl: "/policy",
});

export default function PolicyPage() {
  const rawWhatsApp = env.business.whatsapp || "01220086002";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const formattedWhatsApp = cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp;
  const whatsappUrl = `https://wa.me/${formattedWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم، أود الاستفسار عن سياسة الضمان والمعاينة لدى متجر أمير ستور."
  )}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-14 text-start text-white">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold shadow-sm">
          <ShieldCheck className="h-4 w-4 text-amber-400" />
          <span>الثقة الملكية وضمان الأصالة 100%</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-arabic tracking-tight leading-tight">
          سياسة الضمان والمعاينة <br />
          <span className="liquid-gold-text">وحق الاستبدال الملكي</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          في متجر أمير ستور، نؤمن بأن العطر هو هوية شخصية وتجربة حسية فريدة. لذلك نضع بين يديك ميثاق ثقة يضمن لك الراحة والاطمئنان التام في كل خطوة مع حق الفحص والمعاينة قبل السداد.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1 */}
        <div className="p-7 rounded-3xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] space-y-4 card-lift">
          <div className="h-12 w-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <PackageCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-arabic">
            1. حق المعاينة الكاملة قبل الدفع (مع المندوب)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            يحق لجميع عملائنا في كافة محافظات مصر معاينة الشحنة والتأكد من سلامة الصندوق والتغليف الفاخر قبل سداد أي مبالغ للمندوب. إذا لم تكن راضياً عن الشحنة، يمكنك رفض الاستلام دون أي تكلفة.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="p-7 rounded-3xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] space-y-4 card-lift">
          <div className="h-12 w-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-arabic">
            2. مبادرة عينة التجربة المرفقة (Tester Sample)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            نرفق مع كل عطر تشتريه عينة تجريبية صغيرة مجانية بنفس الرائحة؛ لكي تجربها أولاً. إذا لم يعجبك العطر، يمكنك استرجاعه واسترداد كامل قيمته بشرط أن تظل الزجاجة الرئيسية في غلافها وسوليفانها الأصلي المغلق.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="p-7 rounded-3xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] space-y-4 card-lift">
          <div className="h-12 w-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-arabic">
            3. ضمان الثبات والفوحان 72 ساعة
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            جميع أدهان العود والعطور المنتقاة بمتجرنا مستخلصة من زيوت طبيعية نقية 100% ذات تركيز ملكي (Extrait de Parfum)، مع ضمان ثبات لا يقل عن 48 إلى 72 ساعة على الملابس والمقتنيات.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="p-7 rounded-3xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] space-y-4 card-lift">
          <div className="h-12 w-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Truck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-arabic">
            4. التوصيل السريع والتعويض الفوري ضد كسر الشحن
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            نستخدم عبوات حماية ووسائد هوائية مخصصة للزجاجات الكريستالية. وفي حالة حدوث أي تلف أو كسر أثناء الشحن نتحمل نحن المسؤولية كاملة ونرسل لك بديلاً فورياً في غضون 24-48 ساعة مجاناً.
          </p>
        </div>
      </div>

      {/* Return Conditions Section */}
      <div className="rounded-3xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-2xl p-7 sm:p-10 space-y-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-arabic border-b border-white/10 pb-4">
          شروط وإجراءات الاسترجاع والاستبدال
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-[#0D0F14] border border-amber-400/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
              <span>مهلة الاسترجاع والاستبدال</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              يحق لك طلب استبدال أو استرجاع المنتج خلال <strong>14 يوماً</strong> من تاريخ الاستلام في حالة عدم فتح الزجاجة الرئيسية.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D0F14] border border-amber-400/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <RotateCcw className="h-4 w-4 text-amber-400 shrink-0" />
              <span>طريقة استرداد الأموال</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              يتم استرداد كامل المبلغ نقداً عبر المندوب عند استلام المرتجع أو عبر المحافظ الإلكترونية والحسابات البنكية فور وصول الشحنة.
            </p>
          </div>
        </div>

        {/* WhatsApp direct support CTA */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
          <div className="space-y-1 text-start">
            <h4 className="font-bold text-white">هل لديك استفسار حول طلبك الحالي؟</h4>
            <p className="text-xs text-slate-400">فريق خدمة العملاء جاهز للرد على استفساراتكم عبر واتساب فوراً</p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white px-5 py-3 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 shrink-0"
          >
            <MessageCircle className="h-4 w-4" />
            <span>تواصل مع مسؤول الضمان عبر واتساب</span>
          </a>
        </div>
      </div>
    </div>
  );
}
