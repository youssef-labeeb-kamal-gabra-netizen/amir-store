import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/contact/contact-form";
import { StoreLocationMap } from "@/components/common/store-location-map";
import { env } from "@/lib/env";
import { getCustomSettings } from "@/lib/settings-store";
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, ExternalLink, Sparkles } from "lucide-react";

export const metadata = constructMetadata({
  title: "تواصل معنا | شركة لبيب كمال للأدوات والآلات الزراعية",
  description:
    "تواصل مع شركة لبيب كمال في الزقازيق بالشرقية للاستفسار عن أسعار ومواصفات الآلات الزراعية، محركات الرش، وطلمبات المياه وتوافر قطع الغيار.",
  canonicalUrl: "/contact",
});

interface ContactPageProps {
  searchParams: Promise<{
    product?: string;
    intent?: string;
  }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const initialProduct = params.product || "";
  const settings = getCustomSettings();

  const phone1 = settings.phone || env.business.phone || "01220792948";
  const phone2 = settings.secondaryPhone || env.business.secondaryPhone || "01114587917";
  const rawWhatsApp = settings.whatsapp || env.business.whatsapp || "01220792948";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم ورحمة الله، أود الاستفسار عن تفاصيل ومواصفات المعدات الزراعية المتوفرة لدى شركة لبيب كمال لبيب."
  )}`;
  const mapsUrl = settings.googleMapsUrl || env.business.googleMapsUrl || "https://maps.app.goo.gl/87VQjF6s9bEyF9yz7";
  const addressPhrase = settings.addressPhrase || env.business.addressPhrase || "طريق بنها - الزقازيق (طريق مصر الزراعي)، قرية الجديدة، مركز منيا القمح";
  const workingHours = settings.workingHours || "يومياً من 8:00 صباحاً حتى 9:00 مساءً";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 text-start">
      {/* Page Title */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-green-50 text-brand-green-800 border border-brand-green-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-brand-green-700" />
          <span>قنوات التواصل والاستفسار المباشر</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-neutral-900 tracking-tight">
          يسعدنا تواصلكم وخدمتكم
        </h1>
        <p className="text-base sm:text-lg text-brand-neutral-600 leading-relaxed">
          سواء كنت تبحث عن استشارة فنية لاختيار الموتور المناسب لأرضك، أو ترغب في الاستفسار عن توفر قطع غيار معينة، فريق شركة لبيب كمال لبيب في خدمتكم دائماً هاتفياً، عبر واتساب، أو بزيارة مقرنا بالجديدة (مركز منيا القمح).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-neutral-200 p-5 sm:p-8 lg:p-10 shadow-sm">
          <div className="mb-6 space-y-1">
            <h2 className="text-xl font-bold text-brand-neutral-900">
              نموذج طلب استفسار أو عرض مواصفات
            </h2>
            <p className="text-xs sm:text-sm text-brand-neutral-500">
              املأ البيانات التالية وسنتواصل معكم هاتفياً أو عبر واتساب لموافاتكم بكافة التفاصيل.
            </p>
          </div>

          <ContactForm initialProductSlug={initialProduct} whatsappNumber={rawWhatsApp} />
        </div>

        {/* Business Context & Direct Channels Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Channels Card */}
          <div className="rounded-3xl border border-brand-neutral-200 bg-white p-5 sm:p-8 space-y-6 shadow-sm">
            <h3 className="text-lg font-bold text-brand-neutral-900 border-b border-brand-neutral-100 pb-3">
              بيانات المقر والتواصل الفوري
            </h3>

            <div className="space-y-5 text-sm">
              {/* WhatsApp direct CTA */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <MessageCircle className="h-5 w-5 text-emerald-600" />
                  <span>مراسلة فورية عبر واتساب</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  تواصل معنا مباشرة عبر واتساب لتلقي الرد الفوري ومقاطع الفيديو وصور المعدات وقطع الغيار:
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white p-3 text-sm font-bold shadow-xs transition-all active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>مراسلة واتساب ({rawWhatsApp})</span>
                </a>
              </div>

              {/* Phone Calling */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-brand-gold-50 text-brand-gold-700 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-brand-neutral-900">الاتصال الهاتفي المباشر:</h4>
                  <div className="flex flex-col gap-1 font-mono font-bold text-brand-green-900 text-base mt-1">
                    <a href={`tel:${phone1}`} className="hover:text-brand-green-700 hover:underline">
                      {phone1}
                    </a>
                    <a href={`tel:${phone2}`} className="hover:text-brand-green-700 hover:underline">
                      {phone2}
                    </a>
                  </div>
                  <span className="text-xs text-brand-neutral-500 block mt-0.5">متاح طوال اليوم</span>
                </div>
              </div>

              {/* Physical Location & Google Maps */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-brand-green-50 text-brand-green-700 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-brand-neutral-900">المقر والعنوان الميداني:</h4>
                  <p className="text-brand-neutral-600 mt-0.5 leading-relaxed">
                    {addressPhrase}
                  </p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green-700 hover:text-brand-green-900 hover:underline mt-2"
                  >
                    <span>فتح الموقع على خرائط Google</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-brand-neutral-100 text-brand-neutral-700 shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-neutral-900">مواعيد العمل:</h4>
                  <p className="text-brand-neutral-600 mt-0.5">
                    {workingHours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Google Maps Frame */}
          <StoreLocationMap showDetails={false} />

          {/* Trust Banner */}
          <div className="rounded-3xl bg-brand-green-950 text-white p-6 sm:p-7 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-brand-gold-300">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">تأسسنا سنة 2005 (خبرة +20 عاماً)</span>
            </div>
            <p className="text-lg font-bold text-white">الجودة • الثقة • الخدمة المتميزة</p>
            <p className="text-xs text-brand-green-200 leading-relaxed">
              هدفنا الأول دائماً تقديم النصيحة الفنية السليمة لاختيار المعدة المناسبة لطبيعة أرضك ومحصولك، وتوفير الدعم المستمر وقطع الغيار الأصلية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
