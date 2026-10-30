import React from "react";
import Link from "next/link";
import Image from "next/image";
import { constructMetadata } from "@/lib/seo";
import { ShieldCheck, Wrench, Phone, ArrowLeft, MessageCircle, MapPin, ExternalLink, Sparkles, Award, Tractor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";

export const metadata = constructMetadata({
  title: "عن شركة لبيب كمال لبيب للأدوات والآلات الزراعية | مسيرة 20 عاماً",
  description:
    "تعرف على تاريخ ومسيرة شركة لبيب كمال لبيب بالزقازيق منذ تأسيسها كمحل عام 2005 وبداياتها العريقة، وخبرتنا الممتدة لأكثر من 20 عاماً في خدمة وتطوير القطاع الزراعي.",
  canonicalUrl: "/about",
});

export default function AboutPage() {
  const phone1 = env.business.phone || "01220792948";
  const phone2 = env.business.secondaryPhone || "01114587917";
  const rawWhatsApp = env.business.whatsapp || "01220792948";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم، أود معرفة المزيد عن المعدات والآلات الزراعية لدى شركة لبيب كمال لبيب."
  )}`;
  const mapsUrl = env.business.googleMapsUrl || "https://maps.app.goo.gl/87VQjF6s9bEyF9yz7";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 text-start">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-green-50 border border-brand-green-200 px-3.5 py-1 text-xs font-bold text-brand-green-800">
          <Award className="h-4 w-4 text-brand-green-700" />
          <span>تأسسنا كمحل سنة 2005 • خبرة تتجاوز 20 عاماً</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-neutral-900 tracking-tight leading-tight">
          شركة لبيب كمال لبيب <br />
          <span className="text-brand-green-800">للأدوات والآلات الزراعية</span>
        </h1>
        <p className="text-base sm:text-lg text-brand-neutral-600 leading-relaxed">
          انطلقت مسيرتنا في قلب محافظة الشرقية بالزقازيق. تأسسنا رسمياً كمحل في عام 2005، ولكن جذورنا وبداياتنا المهنية بدأت قبل ذلك بسنوات عديدة، لنتوج أكثر من عقدين من الخبرة العميقة في خدمة الفلاح والمزارع المصري وتوفير أحدث معدات الرش والري ومحركات الديزل وقطع الغيار المعتمدة.
        </p>
      </div>

      {/* Official Business Banner Showcase */}
      <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden shadow-xl border border-brand-neutral-200">
        <Image
          src="/images/business-card-banner.jpg"
          alt="كارت وهوية شركة لبيب كمال لبيب"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 sm:p-10">
          <div className="text-white space-y-1">
            <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider">LABIB KAMAL LABIB • LKL</span>
            <h3 className="text-xl sm:text-3xl font-black text-white">الجودة • الثقة • الخدمة المتميزة</h3>
          </div>
        </div>
      </div>

      {/* Story & History Section */}
      <section className="rounded-3xl bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#022c22] text-white p-8 sm:p-12 space-y-6 shadow-xl border border-emerald-800/40">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            <span>قصة بدايتنا وخبرتنا المتوارثة</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            من البدايات الأولى إلى الريادة في محافظة الشرقية
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            بدأت رحلتنا من الشغف بالهندسة الميكانيكية الزراعية وتلبية احتياجات أهالينا المزارعين في القرى والمراكز. افتتحنا محلنا التجاري في الزقازيق عام 2005 بعد سنوات من العمل والخبرة الميدانية في فحص وصيانة المواتير والآلات. وقد وضعنا منذ اليوم الأول مبدأً ثابتاً لا نحيد عنه: <strong>الأمانة التامة والصدق في جودة القطعة قبل البيع وبعده</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl font-black text-brand-gold-400 block">+20</span>
              <span className="text-xs text-emerald-200 mt-1 block">عاماً من الخبرة الزراعية</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl font-black text-brand-gold-400 block">2005</span>
              <span className="text-xs text-emerald-200 mt-1 block">تأسيس المحل بالزقازيق</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl font-black text-brand-gold-400 block">100%</span>
              <span className="text-xs text-emerald-200 mt-1 block">قطع غيار وبضاعة أصلية</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="rounded-3xl border border-brand-neutral-200 bg-white p-8 space-y-4 shadow-xs hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-brand-green-100 text-brand-green-800 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-brand-neutral-900">الجودة والاعتمادية</h3>
          <p className="text-sm text-brand-neutral-600 leading-relaxed">
            ننتقي الآلات ومجموعات الرش وطلمبات المياه المصنوعة من أفضل المواد المقاومة للتآكل والصدأ، والقادرة على تحمل ساعات العمل الطويلة في الظروف الميدانية الصعبة.
          </p>
        </div>

        <div className="rounded-3xl border border-brand-neutral-200 bg-white p-8 space-y-4 shadow-xs hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-brand-gold-100 text-brand-gold-800 flex items-center justify-center">
            <Tractor className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-brand-neutral-900">الثقة والشفافية</h3>
          <p className="text-sm text-brand-neutral-600 leading-relaxed">
            نبني علاقات طويلة الأمد مع عملائنا تقوم على الوضوح التام في بيان المواصفات والقدرات الفعلية لكل معدة، دون أي مبالغات أو وعود غير دقيقة.
          </p>
        </div>

        <div className="rounded-3xl border border-brand-neutral-200 bg-white p-8 space-y-4 shadow-xs hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-brand-green-100 text-brand-green-800 flex items-center justify-center">
            <Wrench className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-brand-neutral-900">الخدمة المتميزة والدعم</h3>
          <p className="text-sm text-brand-neutral-600 leading-relaxed">
            لا ينتهي دورنا عند تسليم المعدّة؛ بل نوفر المشورة الفنية الدقيقة لتشغيلها السليم ونحرص على توفير قطع الغيار الأصلية ومستلزمات الصيانة دائماً.
          </p>
        </div>
      </div>

      {/* Location and Direct Action Banner */}
      <div className="rounded-3xl bg-[#021811] text-white p-8 sm:p-12 space-y-8 border border-emerald-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-brand-gold-400 uppercase tracking-wider">
              المقر الجغرافي
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              محافظة الشرقية — جمهورية مصر العربية
            </h2>
            <p className="text-sm sm:text-base text-brand-neutral-300 leading-relaxed">
              يقع مقرنا الرئيسي في محافظة الشرقية على طريق بنها - الزقازيق (طريق مصر الزراعي، قرية الجديدة، مركز منيا القمح)، وهو موقع استراتيجي يتيح سهولة الوصول لعملائنا في كافة مراكز وقرى محافظة الشرقية والمحافظات المجاورة.
            </p>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gold-600 hover:bg-brand-gold-500 active:bg-brand-gold-700 text-white px-6 py-3.5 text-sm font-bold shadow-md transition-all shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <MapPin className="h-4 w-4" />
            <span>فتح الموقع على خرائط Google</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="pt-4 border-t border-emerald-900/60 flex flex-wrap items-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white px-5 py-3 text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            <span>مراسلة واتساب ({rawWhatsApp})</span>
          </a>

          <a
            href={`tel:${phone1}`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 active:scale-95 text-white px-4 py-3 text-sm font-semibold transition-all backdrop-blur-sm"
          >
            <Phone className="h-4 w-4 text-brand-gold-300" />
            <span>اتصال: {phone1} • {phone2}</span>
          </a>

          <Link href="/products">
            <Button variant="outline" size="md" className="border-white/30 text-white hover:bg-white/10 active:scale-95">
              تصفح الكتالوج
              <ArrowLeft className="h-4 w-4 ms-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
