"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image Display / Flacon Pedestal */}
      <div className="relative aspect-[4/3] w-full rounded-3xl border border-amber-400/25 bg-gradient-to-b from-[#13161F] to-[#08090C] flex items-center justify-center overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] p-6">
        {images && images[selectedIdx] ? (
          <div className="relative w-full h-full">
            <Image
              src={images[selectedIdx]}
              alt={productName}
              fill
              className="object-contain drop-shadow-[0_10px_30px_rgba(212,175,55,0.35)]"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <Sparkles className="h-20 w-20 text-amber-400/60 mb-3" />
            <span className="text-sm font-bold text-white">{productName}</span>
            <span className="text-xs text-amber-200/60 mt-1">صورة توضيحية لقارورة العطر</span>
          </div>
        )}

        {/* Ambient Pedestal Light */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-amber-400/10 to-transparent pointer-events-none" />
      </div>

      {/* Thumbnails if multiple images exist */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`عرض الصورة رقم ${idx + 1}`}
              onClick={() => setSelectedIdx(idx)}
              className={cn(
                "relative h-20 w-20 rounded-2xl border-2 bg-[#13161F] flex items-center justify-center shrink-0 transition-all overflow-hidden cursor-pointer active:scale-95 p-1",
                selectedIdx === idx
                  ? "border-amber-400 ring-2 ring-amber-400/30 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "border-amber-400/20 hover:border-amber-400/50"
              )}
            >
              <Image src={img} alt="" fill className="object-contain p-1" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
