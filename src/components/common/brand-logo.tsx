import React from "react";
import { Sparkles } from "lucide-react";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function BrandLogo({ className = "", size = "md", showText = true }: BrandLogoProps) {
  const sizeMap = {
    sm: "h-8 w-8 sm:h-9 sm:w-9",
    md: "h-9 w-9 sm:h-11 sm:w-11",
    lg: "h-12 w-12 sm:h-14 sm:w-14",
    xl: "h-16 w-16 sm:h-20 sm:w-20",
  };

  const textSizes = {
    sm: { title: "text-xs sm:text-sm", sub: "text-[9px] sm:text-[10px]" },
    md: { title: "text-sm sm:text-base font-extrabold", sub: "text-[10px] sm:text-xs" },
    lg: { title: "text-base sm:text-xl font-extrabold", sub: "text-xs" },
    xl: { title: "text-xl sm:text-2xl font-black", sub: "text-sm" },
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {/* Luxury Oud Emblem */}
      <div
        className={`relative ${sizeMap[size]} shrink-0 rounded-full flex items-center justify-center bg-brand-green-800 text-brand-gold-400 shadow-sm border border-brand-green-900/30`}
      >
        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>

      {showText && (
        <div className="flex flex-col text-start min-w-0">
          <span
            className={`font-black tracking-tight text-brand-green-950 leading-tight truncate ${textSizes[size].title}`}
          >
            أمير ستور
          </span>
          <span className={`font-semibold text-brand-neutral-500 leading-none truncate ${textSizes[size].sub}`}>
            <span>للعطور والعود الفاخر • AMEER</span>
          </span>
        </div>
      )}
    </div>
  );
}
