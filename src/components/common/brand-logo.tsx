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
        className={`relative ${sizeMap[size]} shrink-0 rounded-full overflow-hidden shadow-sm border border-brand-neutral-200/80 bg-[#f7f5f2]`}
      >
        <Image
          src="/images/logo.png"
          alt="شعار أمير ستور الرسمي للعطور"
          fill
          className="object-cover scale-105"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col text-start min-w-0">
          <span
            className={`font-black tracking-tight text-brand-green-950 leading-tight truncate ${textSizes[size].title}`}
          >
            أمير ستور
          </span>
          <span className={`font-semibold text-brand-neutral-500 leading-none truncate ${textSizes[size].sub}`}>
            <span>AMIR STORE • عطور فاخرة</span>
          </span>
        </div>
      )}
    </div>
  );
}
