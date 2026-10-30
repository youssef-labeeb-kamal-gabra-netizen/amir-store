import React from "react";
import { constructMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/contact/contact-form";
import { StoreLocationMap } from "@/components/common/store-location-map";
import { env } from "@/lib/env";
import { getCustomSettings } from "@/lib/settings-store";
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, ExternalLink, Sparkles } from "lucide-react";

export const metadata = constructMetadata({
  title: "تواصل معنا | دار أمير ستور للعطور والعود الفاخر",
  description:
    "تواصل مع متجر أمير ستور للاستفسار عن تشكيلة العطور الشرقية والفرنسية وأدهان العود وطلبات الإهداء الملكية والتوصيل لكافة المحافظات.",
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

  const phone1 = settings.phone || env.business.phone || "01220086002";
  const phone2 = settings.secondaryPhone || env.business.secondaryPhone || "01220086002";
  const rawWhatsApp = settings.whatsapp || env.business.whatsapp || "01220086002";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم ورحمة الله، أود الاستفسار عن تفاصيل العطور والعود المتوفرة لدى متجر أمير ستور."
  )}`;
  const mapsUrl = settings.googleMapsUrl || env.business.googleMapsUrl || "";
  const addressPhrase = settings.addressPhrase || env.business.addressPhrase || "شحن وتوصيل فوري لكافة محافظات ومدن مصر مع حق المعاينة قبل الاستلام";
  const workingHours = settings.workingHours || "خدمة العملاء متاحة يومياً من 10:00 صباحاً حتى 11:00 مساءً";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 text-start text-white">
      {/* Page Title */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>خدمة عملاء وطلبات خاصة VIP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-arabic tracking-tight leading-tight">
          يسعدنا تواصلكم واختيار <br />
          <span className="liquid-gold-text">عطركم الملكي المفضل</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          سواء كنت تبحث عن استشارة فنية لاختيار العطر المناسب لشخصيتك ومناسبتك، أو ترغب في تجهيز صناديق إهداء ملكية خاصة، فريق أمير ستور في خدمتكم دائماً هاتفياً أو عبر واتساب مع شحن فوري لباب منزلك.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Contact Form Column */}
        <div className="lg:col-span-7 rounded-3xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
          <div className="mb-6 space-y-1.5 border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white font-arabic">
              نموذج طلب استفسار أو عرض مواصفات
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              املأ البيانات التالية وسنتواصل معكم هاتفياً أو عبر واتساب لموافاتكم بكافة التفاصيل.
            </p>
          </div>

          <ContactForm initialProductSlug={initialProduct} whatsappNumber={rawWhatsApp} />
        </div>

        {/* Business Context & Direct Channels Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Channels Card */}
          <div className="rounded-3xl border border-amber-400/20 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-8 space-y-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-bold text-white font-arabic border-b border-white/10 pb-3">
              بيانات المقر والتواصل الفوري
            </h3>

            <div className="space-y-5 text-sm">
              {/* WhatsApp direct CTA */}
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <MessageCircle className="h-5 w-5 text-[#25D366]" />
                  <span>مراسلة فورية عبر واتساب</span>
                </div>
                <p className="text-xs text-emerald-200/80 leading-relaxed">
                  تواصل معنا مباشرة عبر واتساب لتلقي الرد الفوري وترشيحات العطور وتفاصيل الشحن والمعاينة:
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white p-3.5 text-sm font-bold shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>مراسلة واتساب ({rawWhatsApp})</span>
                </a>
              </div>

              {/* Phone Calling */}
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white">الاتصال الهاتفي المباشر:</h4>
                  <div className="flex flex-col gap-1 font-mono font-bold text-amber-300 text-base mt-1">
                    <a href={`tel:${phone1}`} className="hover:text-amber-200 hover:underline">
                      {phone1}
                    </a>
                    {phone2 && phone2 !== phone1 && (
                      <a href={`tel:${phone2}`} className="hover:text-amber-200 hover:underline">
                        {phone2}
                      </a>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">متاح طوال اليوم (24/7)</span>
                </div>
              </div>

              {/* Physical Location & Google Maps */}
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white">المقر ونطاق التوصيل:</h4>
                  <p className="text-slate-300 mt-0.5 text-xs sm:text-sm leading-relaxed">
                    {addressPhrase}
                  </p>
                  {mapsUrl ? (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 hover:underline mt-2"
                    >
                      <span>فتح الموقع على خرائط Google</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">مواعيد العمل:</h4>
                  <p className="text-slate-300 mt-0.5 text-xs sm:text-sm">
                    {workingHours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Google Maps Frame */}
          <StoreLocationMap showDetails={false} />

          {/* Trust Banner */}
          <div className="rounded-3xl bg-[#0D0F14] text-white p-6 sm:p-7 space-y-3 shadow-lg border border-amber-400/20">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider font-serif">ضمان الأصالة والجودة الملكية</span>
            </div>
            <p className="text-lg font-bold text-white font-arabic">فخامة تدوم • أصالة العود • عبير لا يُنسى</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              هدفنا تقديم أرقى تجربة عطرية ملكية مع ضمان خلو جميع الزيوت من أي إضافات كيميائية ضارة، وإتاحة حق المعاينة الكاملة عند الاستلام لجميع محافظات مصر.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
