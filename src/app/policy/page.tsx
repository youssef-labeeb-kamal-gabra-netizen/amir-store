import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { env } from "@/lib/env";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  ArrowRight,
  PackageCheck,
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 text-start">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
          <ShieldCheck className="h-4 w-4 text-amber-600" />
          <span>الثقة الملكية وضمان الأصالة 100%</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-green-950 font-arabic tracking-tight">
          سياسة الضمان والمعاينة والاستبدال
        </h1>
        <p className="text-sm sm:text-base text-brand-neutral-500 leading-relaxed">
          في متجر أمير ستور، نؤمن بأن العطر هو هوية شخصية وتجربة حسية فريدة. لذلك نضع بين يديك ميثاق ثقة يضمن لك الراحة والاطمئنان التام في كل خطوة.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1 */}
        <div className="p-6 rounded-3xl border border-brand-neutral-200 bg-white shadow-sm space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-brand-green-50 flex items-center justify-center text-brand-green-800">
            <PackageCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-brand-green-950 font-arabic">
            1. حق المعاينة الكاملة قبل الدفع (مع المندوب)
          </h3>
          <p className="text-xs sm:text-sm text-brand-neutral-600 leading-relaxed">
            يحق لجميع عملائنا في كافة محافظات مصر معاينة الشحنة والتأكد من سلامة الصندوق والتغليف الفاخر قبل سداد أي مبالغ للمندوب. إذا لم تكن راضياً عن الشحنة، يمكنك رفض الاستلام دون أي تكلفة.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="p-6 rounded-3xl border border-brand-neutral-200 bg-white shadow-sm space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-brand-green-950 font-arabic">
            2. مبادرة عينة التجربة المرفقة (Tester Sample)
          </h3>
          <p className="text-xs sm:text-sm text-brand-neutral-600 leading-relaxed">
            نرفق مع كل عطر تشتريه عينة تجريبية صغيرة مجانية بنفس الرائحة؛ لكي تجربها أولاً. إذا لم يعجبك العطر، يمكنك استرجاعه واسترداد كامل قيمته بشرط أن تظل الزجاجة الرئيسية في غلافها وسوليفانها الأصلي المغلق.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="p-6 rounded-3xl border border-brand-neutral-200 bg-white shadow-sm space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-800">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-brand-green-950 font-arabic">
            3. ضمان الثبات والفوحان 72 ساعة
          </h3>
          <p className="text-xs sm:text-sm text-brand-neutral-600 leading-relaxed">
            جميع أدهان العود والعطور المنتقاة بمتجرنا مستخلصة من زيوت طبيعية نقية 100% ذات تركيز ملكي (Extrait de Parfum)، مع ضمان ثبات لا يقل عن 48 إلى 72 ساعة على الملابس والمقتنيات.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="p-6 rounded-3xl border border-brand-neutral-200 bg-white shadow-sm space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-800">
            <Truck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-brand-green-950 font-arabic">
            4. التوصيل السريع والتعويض الفوري ضد كسر الشحن
          </h3>
          <p className="text-xs sm:text-sm text-brand-neutral-600 leading-relaxed">
            نستخدم عبوات حماية ووسائد هوائية مخصصة للزجاجات الكريستالية. وفي حالة حدوث أي تلف أو كسر أثناء الشحن نتحمل نحن المسؤولية كاملة ونرسل لك بديلاً فورياً في غضون 24-48 ساعة مجاناً.
          </p>
        </div>
      </div>

      {/* FAQs on Returns */}
      <div className="rounded-3xl border border-brand-neutral-200 bg-brand-neutral-50 p-6 sm:p-10 space-y-6">
        <h3 className="text-xl font-bold text-brand-green-950 font-arabic">
          أسئلة شائعة حول الاستبدال والاسترجاع
        </h3>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-white border border-brand-neutral-200 space-y-1.5">
            <h4 className="font-bold text-brand-green-950 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>ما هي المدة المسموح بها للاسترجاع؟</span>
            </h4>
            <p className="text-brand-neutral-600 ps-6">
              يمكنك طلب الاسترجاع أو الاستبدال خلال <strong>14 يوماً</strong> من تاريخ استلام الطلب، شريطة عدم فتح الغلاف الخارجي للزجاجة الرئيسية.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-brand-neutral-200 space-y-1.5">
            <h4 className="font-bold text-brand-green-950 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>كيف أسترد أموالي في حالة الاسترجاع؟</span>
            </h4>
            <p className="text-brand-neutral-600 ps-6">
              يتم تحويل المبلغ كاملاً إلى حسابك البنكي أو محفظتك الإلكترونية (فودافون كاش / إنستاباي) فور استلام الشحنة وفحص سلامة التغليف.
            </p>
          </div>
        </div>
      </div>

      {/* Direct Contact CTA */}
      <div className="rounded-3xl bg-brand-green-950 text-white p-8 sm:p-10 text-center space-y-5">
        <h3 className="text-xl sm:text-2xl font-bold font-arabic">
          لديك استفسار خاص أو ترغب في استبدال طلبك؟
        </h3>
        <p className="text-xs sm:text-sm text-brand-neutral-300 max-w-lg mx-auto leading-relaxed">
          فريق خدمة عملاء أمير ستور متواجد لمساعدتك يومياً من 10 صباحاً وحتى 11 مساءً عبر واتساب أو الهاتف المباشر.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            <span>محادثة واتساب فورية</span>
          </a>
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all active:scale-95"
          >
            <span>العودة لكتالوج العطور</span>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
