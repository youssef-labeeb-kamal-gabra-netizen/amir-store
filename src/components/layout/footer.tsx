import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/common/brand-logo";
import { Phone, Clock, MessageCircle, Sparkles, ShieldCheck, MapPin } from "lucide-react";
import { env } from "@/lib/env";
import type { BusinessSettings } from "@/types/settings";

interface FooterProps {
  settings?: Partial<BusinessSettings>;
}

export function Footer({ settings }: FooterProps = {}) {
  const currentYear = new Date().getFullYear();
  const phone1 = settings?.phone || env.business.phone || "01220086002";
  const phone2 = settings?.secondaryPhone || env.business.secondaryPhone || "01220086002";
  const rawWhatsApp = settings?.whatsapp || env.business.whatsapp || "01220086002";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp}?text=${encodeURIComponent(
    "السلام عليكم، أود الاستفسار عن تشكيلة العطور والعود المتاحة لدى متجر أمير ستور."
  )}`;
  const workingHours = settings?.workingHours || "خدمة العملاء متاحة يومياً من 10:00 صباحاً حتى 11:00 مساءً";
  const slogan = settings?.slogan || env.business.slogan || "عطور فاخرة • ثبات وأناقة لا تُنسى";

  return (
    <footer className="mt-auto border-t border-amber-400/20 bg-[#08090C] text-slate-300 text-start relative overflow-hidden">
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-amber-400/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-28 sm:pb-24 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & History */}
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-amber-400/25 backdrop-blur-md w-fit shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <BrandLogo size="md" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              متجر أمير ستور — وجهتك الأولى لأرقى العطور الشرقية والفرنسية وأندر أدهان العود الطبيعية النقية. نجمع بين أصالة التراث والتميز العصري بضمان ثبات 72 ساعة.
            </p>
            <div className="pt-2 flex flex-col gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 px-3.5 py-1.5 text-xs font-semibold text-amber-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                <span>{slogan}</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white border-b border-amber-400/20 pb-2 flex items-center gap-2">
              <span className="text-amber-400">✦</span>
              <span>روابط المتجر</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-300 active:scale-95 transition-all inline-block">
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-amber-300 active:scale-95 transition-all inline-block">
                  تشكيلة العطور بالكامل
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-300 active:scale-95 transition-all inline-block">
                  عن أمير ستور وقصتنا
                </Link>
              </li>
              <li>
                <Link href="/policy" className="hover:text-amber-300 active:scale-95 transition-all inline-block text-amber-300 font-semibold">
                  🛡️ سياسة الضمان والمعاينة (72 ساعة)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-300 active:scale-95 transition-all inline-block">
                  تواصل معنا وطلب عطر خاص
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white border-b border-amber-400/20 pb-2 flex items-center gap-2">
              <span className="text-amber-400">✦</span>
              <span>أقسام العطور الملكية</span>
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/products?category=pure-oud-oils" className="hover:text-amber-300 active:scale-95 transition-all inline-block">
                  دهن العود والزيوت النقية
                </Link>
              </li>
              <li>
                <Link href="/products?category=oriental-perfumes" className="hover:text-amber-300 active:scale-95 transition-all inline-block">
                  عطور شرقية ملكية
                </Link>
              </li>
              <li>
                <Link href="/products?category=french-perfumes" className="hover:text-amber-300 active:scale-95 transition-all inline-block">
                  عطور فرنسية حصرية
                </Link>
              </li>
              <li>
                <Link href="/products?category=musk-and-amber" className="hover:text-amber-300 active:scale-95 transition-all inline-block">
                  المسك والعنبر الفاخر
                </Link>
              </li>
              <li>
                <Link href="/products?category=bakhoor-and-incense" className="hover:text-amber-300 active:scale-95 transition-all inline-block">
                  بخور ومعمول ودخون
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Numbers & WhatsApp */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white border-b border-amber-400/20 pb-2 flex items-center gap-2">
              <span className="text-amber-400">✦</span>
              <span>الطلب والتواصل الرسمي</span>
            </h4>
            <div className="space-y-3.5 text-sm text-slate-300">
              {/* WhatsApp */}
              <div className="flex items-start gap-2.5">
                <MessageCircle className="h-5 w-5 text-[#25D366] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-semibold">مراسلة واتساب المباشرة:</span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-bold text-[#25D366] hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <span>{rawWhatsApp}</span>
                    <span className="text-[10px] bg-black/60 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40 font-bold">
                      رد فوري
                    </span>
                  </a>
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-start gap-2.5">
                <Phone className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-semibold">خدمة العملاء عبر الهاتف:</span>
                  <div className="flex flex-wrap gap-2 font-mono font-bold text-white mt-0.5">
                    <a href={`tel:${phone1}`} className="hover:text-amber-300 underline decoration-dotted text-amber-200">
                      {phone1}
                    </a>
                    <span className="text-amber-400/40">•</span>
                    <a href={`tel:${phone2}`} className="hover:text-amber-300 underline decoration-dotted text-amber-200">
                      {phone2}
                    </a>
                  </div>
                </div>
              </div>

              {/* Shipping Assurance */}
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                <span>شحن وتوصيل فوري لكافة محافظات ومدن مصر</span>
              </div>

              {/* Guarantee */}
              <div className="flex items-center gap-2 pt-1 text-xs text-amber-300 font-bold">
                <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
                <span>ضمان أصالة 100% ومعاينة مجانية قبل الدفع</span>
              </div>

              {/* Working Hours */}
              <div className="flex items-center gap-2.5 pt-1 text-xs text-slate-400">
                <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="mt-12 pt-6 border-t border-amber-400/15 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {currentYear} متجر أمير ستور للعطور والعود الفاخر (Amir Store). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-amber-300 font-bold">عطور فاخرة • أصالة وثبات 72 ساعة</span>
            <span className="text-amber-400/30">•</span>
            <span>جمهورية مصر العربية</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
