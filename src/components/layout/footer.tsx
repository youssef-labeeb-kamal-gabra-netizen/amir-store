import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/common/brand-logo";
import { MapPin, Phone, Clock, MessageCircle, ExternalLink, Sparkles } from "lucide-react";
import { env } from "@/lib/env";
import type { BusinessSettings } from "@/types/settings";

interface FooterProps {
  settings?: Partial<BusinessSettings>;
}

export function Footer({ settings }: FooterProps = {}) {
  const currentYear = new Date().getFullYear();
  const phone1 = settings?.phone || env.business.phone || "01220792948";
  const phone2 = settings?.secondaryPhone || env.business.secondaryPhone || "01114587917";
  const rawWhatsApp = settings?.whatsapp || env.business.whatsapp || "01220792948";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم، أود الاستفسار عن الآلات والمعدات الزراعية المتوفرة لدى شركة لبيب كمال."
  )}`;
  const mapsUrl = settings?.googleMapsUrl || env.business.googleMapsUrl || "https://maps.app.goo.gl/87VQjF6s9bEyF9yz7";
  const addressPhrase = settings?.addressPhrase || env.business.addressPhrase || "طريق بنها - الزقازيق (طريق مصر الزراعي)، قرية الجديدة، مركز منيا القمح";
  const workingHours = settings?.workingHours || "يومياً من 8:00 صباحاً حتى 9:00 مساءً";
  const slogan = settings?.slogan || env.business.slogan || "الجودة • الثقة • الخدمة المتميزة";

  return (
    <footer className="mt-auto border-t border-emerald-950/80 bg-[#021811] text-brand-neutral-300 text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-28 sm:pb-24 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & History */}
          <div className="space-y-4">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10 w-fit">
              <BrandLogo size="md" />
            </div>
            <p className="text-sm text-brand-neutral-300 leading-relaxed">
              تأسسنا كمحل رسمي عام 2005 مع بدايات وجذور مهنية عريقة قبل ذلك، لنضع بين أيديكم أكثر من 20 عاماً من الخبرة في توفير أحدث محركات الرش، طلمبات المياه، محركات الديزل، وقطع الغيار الأصلية.
            </p>
            <div className="pt-2 flex flex-col gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                <Sparkles className="h-3.5 w-3.5 text-brand-gold-400" />
                <span>{slogan}</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white border-b border-emerald-900/60 pb-2">
              روابط سريعة
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-300 active:scale-95 transition-all inline-block">
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-emerald-300 active:scale-95 transition-all inline-block">
                  كتالوج الآلات والمعدات
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-300 active:scale-95 transition-all inline-block">
                  عن شركة لبيب كمال وتاريخنا
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-emerald-300 active:scale-95 transition-all inline-block">
                  الخدمات والدعم الفني
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-300 active:scale-95 transition-all inline-block">
                  التواصل وطلب عرض سعر
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white border-b border-emerald-900/60 pb-2">
              أقسام المعدات
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-neutral-300">
              <li>
                <Link href="/products?category=spray-motors" className="hover:text-emerald-300 active:scale-95 transition-all inline-block">
                  محركات ومجموعات الرش
                </Link>
              </li>
              <li>
                <Link href="/products?category=water-pumps" className="hover:text-emerald-300 active:scale-95 transition-all inline-block">
                  طلمبات ومحركات المياه والري
                </Link>
              </li>
              <li>
                <Link href="/products?category=diesel-motors" className="hover:text-emerald-300 active:scale-95 transition-all inline-block">
                  محركات الديزل الزراعية
                </Link>
              </li>
              <li>
                <Link href="/products?category=agricultural-tools" className="hover:text-emerald-300 active:scale-95 transition-all inline-block">
                  الآلات والأدوات الزراعية
                </Link>
              </li>
              <li>
                <Link href="/products?category=spare-parts" className="hover:text-emerald-300 active:scale-95 transition-all inline-block">
                  قطع الغيار الأصلية والمستلزمات
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Numbers & Google Maps */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white border-b border-brand-neutral-800 pb-2">
              أرقام التواصل والموقع
            </h4>
            <div className="space-y-3 text-sm text-brand-neutral-300">
              {/* Phones */}
              <div className="flex items-start gap-2.5">
                <Phone className="h-5 w-5 text-brand-gold-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-brand-neutral-400 font-semibold">أرقام الهاتف:</span>
                  <div className="flex flex-wrap gap-2 font-mono font-bold text-white mt-0.5">
                    <a href={`tel:${phone1}`} className="hover:text-brand-gold-400 underline decoration-dotted">
                      {phone1}
                    </a>
                    <span>•</span>
                    <a href={`tel:${phone2}`} className="hover:text-brand-gold-400 underline decoration-dotted">
                      {phone2}
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-2.5">
                <MessageCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-brand-neutral-400 font-semibold">مراسلة واتساب:</span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-bold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>{rawWhatsApp}</span>
                    <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700">
                      رد فوري
                    </span>
                  </a>
                </div>
              </div>

              {/* Google Maps link & address */}
              <div className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-brand-gold-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-brand-neutral-400 font-semibold">مقرنا بالشرقية:</span>
                  <span className="text-xs text-brand-neutral-300 mt-0.5">
                    {addressPhrase}
                  </span>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold-400 hover:text-brand-gold-300 hover:underline mt-1"
                  >
                    <span>فتح الموقع على خرائط Google</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-center gap-2.5 pt-1 text-xs text-brand-neutral-400">
                <Clock className="h-4 w-4 text-brand-gold-400 shrink-0" />
                <span>{workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="mt-12 pt-6 border-t border-brand-neutral-800 text-xs text-brand-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {currentYear} شركة لبيب كمال للأدوات والآلات الزراعية (LKL). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-brand-gold-400 font-semibold">تأسسنا عام 2005 (خبرة +20 عاماً)</span>
            <span>•</span>
            <span>الزقازيق — مصر</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
