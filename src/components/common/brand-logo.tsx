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
    md: "h-9 w-9 sm:h-12 sm:w-12",
    lg: "h-12 w-12 sm:h-16 sm:w-16",
    xl: "h-16 w-16 sm:h-24 sm:w-24",
  };

  const textSizes = {
    sm: { title: "text-xs sm:text-sm", sub: "text-[9px] sm:text-[10px]" },
    md: { title: "text-sm sm:text-lg", sub: "text-[10px] sm:text-xs" },
    lg: { title: "text-base sm:text-xl", sub: "text-xs" },
    xl: { title: "text-xl sm:text-2xl", sub: "text-sm" },
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {/* Official Golden Wheat Wreath Emblem */}
      <div
        className={`relative ${sizeMap[size]} shrink-0 rounded-full p-0.5 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-md ring-1 ring-amber-400/40 overflow-hidden bg-brand-green-950`}
      >
        <Image
          src="/images/logo.png"
          alt="شعار شركة لبيب كمال لبيب"
          fill
          className="object-cover scale-110"
          sizes="96px"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col text-start min-w-0">
          <span
            className={`font-black tracking-tight text-brand-neutral-900 leading-none truncate ${textSizes[size].title}`}
          >
            شركة لبيب كمال لبيب
          </span>
          <span className={`font-bold text-brand-gold-600 mt-1 leading-none truncate ${textSizes[size].sub}`}>
            <span className="hidden sm:inline">للأدوات والآلات الزراعية • </span>
            <span className="sm:hidden">آلات زراعية • </span>
            <span>LKL</span>
          </span>
        </div>
      )}
    </div>
  );
}
