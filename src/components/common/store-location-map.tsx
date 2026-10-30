"use client";

import React, { useState } from "react";
import { MapPin, Navigation, ExternalLink, Phone, Check, Copy, Share2 } from "lucide-react";
import { env } from "@/lib/env";

interface StoreLocationMapProps {
  className?: string;
  showDetails?: boolean;
}

export function StoreLocationMap({ className = "", showDetails = true }: StoreLocationMapProps) {
  const [copied, setCopied] = useState(false);

  // Official showroom location in Zagazig, Sharkia, Egypt
  const latitude = 30.58768;
  const longitude = 31.502;
  const placeName = "أمير ستور — للعطور الفاخرة ودهن العود";
  const addressArabic = "الزقازيق، محافظة الشرقية، جمهورية مصر العربية (شحن سريع ومعاينة لكافة المحافظات)";
  const directMapsUrl = env.business.googleMapsUrl || `https://maps.google.com/?q=${latitude},${longitude}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  // Google Maps Embed URL for Zagazig, Sharkia, Egypt
  const embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110034.4068393539!2d31.43265882489242!3d30.587680015091723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f7f05256e29783%3A0xc331a98075f10255!2sZagazig%2C%20Al-Sharqia%20Governorate!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg";

  const copyCoordinates = () => {
    navigator.clipboard.writeText(`${latitude}, ${longitude}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: placeName,
        text: `موقع ${placeName} على خرائط جوجل:`,
        url: directMapsUrl,
      }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`موقع ${placeName}:\n${directMapsUrl}`)}`, '_blank');
    }
  };

  return (
    <div className={`overflow-hidden rounded-3xl border border-amber-400/20 bg-[#0D0F14] shadow-2xl ${className}`}>
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-[#0D0F14] via-[#13161F] to-[#0D0F14] p-5 sm:p-6 text-white text-start border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-3 py-1 text-[11px] sm:text-xs font-semibold text-amber-300 border border-amber-400/30 backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>معرضنا ونقاط الانطلاق المعتمدة</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-white font-arabic">{placeName}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span>{addressArabic}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <a
              href={directMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 active:brightness-95 px-4 py-2.5 text-xs sm:text-sm font-black text-black transition-all shadow-md active:scale-95 w-full sm:w-auto"
            >
              <ExternalLink className="h-4 w-4" />
              <span>فتح تطبيق الخرائط</span>
            </a>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-amber-400/30 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-amber-300 transition-all active:scale-95 w-full sm:w-auto backdrop-blur-sm"
            >
              <Navigation className="h-4 w-4 text-amber-300" />
              <span>الاتجاهات والمسار</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Map Iframe */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-[#08090C] min-h-[320px]">
        <iframe
          title="موقع معرض أمير ستور على خرائط جوجل"
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0 opacity-90 hover:opacity-100 transition-opacity"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Floating Quick Action Overlay */}
        <div className="absolute top-4 start-4 z-10 hidden sm:flex items-center gap-2 bg-[#0D0F14]/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-lg border border-amber-400/30 text-xs font-semibold text-amber-300">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>المعرض مفتوح وجاهز لاستقبالكم وخدمتكم</span>
        </div>
      </div>

      {/* Details & Actions Footer */}
      {showDetails && (
        <div className="p-6 bg-[#08090C] border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-start text-xs sm:text-sm">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#0D0F14] border border-amber-400/20">
              <div className="h-8 w-8 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-white">العنوان بالتفصيل:</p>
                <p className="text-slate-300 mt-0.5 leading-relaxed">
                  الزقازيق، محافظة الشرقية، مصر — شحن ومعاينة لكافة محافظات جمهورية مصر العربية
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#0D0F14] border border-amber-400/20">
              <div className="h-8 w-8 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-white">أرقام التواصل:</p>
                <p className="text-amber-300 font-mono font-bold mt-0.5" dir="ltr">
                  01220086002
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">متاحون للرد والاستفسار وتحديد الطلبات</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0D0F14] border border-amber-400/20">
              <div className="space-y-0.5">
                <p className="font-bold text-white">الإحداثيات ورمز الخريطة:</p>
                <p className="text-amber-300 text-xs font-mono" dir="ltr">
                  {latitude.toFixed(5)}, {longitude.toFixed(5)}
                </p>
                <p className="text-[11px] text-slate-400 font-semibold" dir="ltr">
                  Plus Code: HGP2+3X الزقازيق
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={copyCoordinates}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-400/20 hover:text-amber-300 text-slate-300 transition-colors"
                  title="نسخ الإحداثيات"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={shareLocation}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-400/20 hover:text-amber-300 text-slate-300 transition-colors"
                  title="مشاركة الموقع"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
