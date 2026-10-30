import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function BrandLogo({ className = "", size = "md", showText = true }: BrandLogoProps) {
  const sizeMap = {
    sm: "h-8 w-8 sm:h-9 sm:w-9",
    md: "h-10 w-10 sm:h-12 sm:w-12",
    lg: "h-14 w-14 sm:h-16 sm:w-16",
    xl: "h-20 w-20 sm:h-24 sm:w-24",
  };

  const textSizes = {
    sm: { title: "text-xs sm:text-sm", sub: "text-[9px] sm:text-[10px]" },
    md: { title: "text-sm sm:text-base font-extrabold", sub: "text-[10px] sm:text-xs" },
    lg: { title: "text-base sm:text-xl font-extrabold", sub: "text-xs" },
    xl: { title: "text-xl sm:text-2xl font-black", sub: "text-sm" },
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {/* Official Golden Royal Monogram Emblem */}
      <div
        className={`relative ${sizeMap[size]} shrink-0 rounded-full overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.35)] border border-amber-400/50 bg-[#0D0F14] p-0.5`}
      >
        <div className="relative h-full w-full rounded-full overflow-hidden">
          <Image
            src="/images/logo.png"
            alt="شعار أمير ستور الرسمي - دار العطور والعود الفاخر"
            fill
            className="object-cover scale-105"
            priority
          />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-start min-w-0">
          <span
            className={`font-black tracking-tight text-white font-arabic leading-tight truncate flex items-center gap-1.5 ${textSizes[size].title}`}
          >
            <span>أمير ستور</span>
            <span className="text-[10px] text-amber-400 font-serif font-bold uppercase tracking-widest hidden sm:inline">
              ROYAL
            </span>
          </span>
          <span className={`font-semibold text-amber-200/80 leading-none truncate ${textSizes[size].sub}`}>
            <span>AMIR STORE • دار العطور الفاخرة</span>
          </span>
        </div>
      )}
    </div>
  );
}
