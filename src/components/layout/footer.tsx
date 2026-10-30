import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/common/brand-logo";
import { Phone, Clock, MessageCircle, Sparkles, ShieldCheck } from "lucide-react";
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
    "السلام عليكم، أود الاستفسار عن تشكيلة العطور والعود المتاحة لدى متجر أمير ستور."
  )}`;
  const workingHours = settings?.workingHours || "خدمة العملاء متاحة يومياً من 10:00 صباحاً حتى 11:00 مساءً";
  const slogan = settings?.slogan || env.business.slogan || "عطور فاخرة • ثبات وأناقة لا تُنسى";

  return (
    <footer className="mt-auto border-t border-brand-green-950 bg-[#161d12] text-oud-surfaceLight text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-28 sm:pb-24 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & History */}
          <div className="space-y-4">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10 w-fit">
              <BrandLogo size="md" />
            </div>
            <p className="text-sm text-oud-surfaceLight/80 leading-relaxed">
              متجر أمير ستور — وجهتك الأولى لأرقى العطور الشرقية والفرنسية وأندر أدهان العود الطبيعية النقية. نجمع بين أصالة التراث والتميز العصري.
            </p>
            <div className="pt-2 flex flex-col gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-950/80 border border-brand-gold-400/40 px-3 py-1.5 text-xs font-semibold text-brand-gold-300">
                <Sparkles className="h-3.5 w-3.5 text-brand-gold-400" />
                <span>{slogan}</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white border-b border-brand-green-800 pb-2">
              روابط المتجر
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-gold-400 active:scale-95 transition-all inline-block">
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-brand-gold-400 active:scale-95 transition-all inline-block">
                  تشكيلة العطور بالكامل
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-gold-400 active:scale-95 transition-all inline-block">
                  عن أمير ستور وقصتنا
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-gold-400 active:scale-95 transition-all inline-block">
                  تواصل معنا وطلب عطر خاص
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white border-b border-brand-green-800 pb-2">
              أقسام العطور
            </h4>
            <ul className="space-y-2.5 text-sm text-oud-surfaceLight/80">
              <li>
                <Link href="/products?category=pure-oud-oils" className="hover:text-brand-gold-400 active:scale-95 transition-all inline-block">
                  دهن العود والزيوت النقية
                </Link>
              </li>
              <li>
                <Link href="/products?category=oriental-perfumes" className="hover:text-brand-gold-400 active:scale-95 transition-all inline-block">
                  عطور شرقية ملكية
                </Link>
              </li>
              <li>
                <Link href="/products?category=french-perfumes" className="hover:text-brand-gold-400 active:scale-95 transition-all inline-block">
                  عطور فرنسية حصرية
                </Link>
              </li>
              <li>
                <Link href="/products?category=musk-and-amber" className="hover:text-brand-gold-400 active:scale-95 transition-all inline-block">
                  المسك والعنبر الفاخر
                </Link>
              </li>
              <li>
                <Link href="/products?category=bakhoor-and-incense" className="hover:text-brand-gold-400 active:scale-95 transition-all inline-block">
                  بخور ومعمول ودخون
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Numbers & WhatsApp */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white border-b border-brand-green-800 pb-2">
              الطلب والتواصل
            </h4>
            <div className="space-y-3 text-sm text-oud-surfaceLight/80">
              {/* WhatsApp */}
              <div className="flex items-start gap-2.5">
                <MessageCircle className="h-5 w-5 text-[#25D366] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-brand-neutral-400 font-semibold">مراسلة واتساب المباشرة:</span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-bold text-[#25D366] hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>{rawWhatsApp}</span>
                    <span className="text-[10px] bg-brand-green-950 text-brand-gold-400 px-2 py-0.5 rounded-full border border-brand-gold-400/40">
                      رد سريع
                    </span>
                  </a>
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-start gap-2.5">
                <Phone className="h-5 w-5 text-brand-gold-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-brand-neutral-400 font-semibold">خدمة العملاء عبر الهاتف:</span>
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

              {/* Guarantee */}
              <div className="flex items-center gap-2 pt-2 text-xs text-brand-gold-400 font-bold">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>ضمان أصالة 100% وإمكانية المعاينة قبل الاستلام</span>
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
        <div className="mt-12 pt-6 border-t border-brand-green-900/60 text-xs text-brand-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {currentYear} متجر أمير ستور للعطور والعود الفاخر (Ameer Store). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-brand-gold-400 font-semibold">عطور فاخرة • أصالة وثبات</span>
            <span>•</span>
            <span>جمهورية مصر العربية</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
