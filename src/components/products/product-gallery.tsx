"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Tractor } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-[4/3] w-full rounded-3xl border border-brand-neutral-200 bg-brand-neutral-900/5 flex items-center justify-center overflow-hidden shadow-md">
        {images && images[selectedIdx] ? (
          <Image
            src={images[selectedIdx]}
            alt={productName}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-brand-neutral-400">
            <Tractor className="h-24 w-24 text-brand-green-700/40 mb-3" />
            <span className="text-sm font-bold text-brand-neutral-600">{productName}</span>
            <span className="text-xs text-brand-neutral-400 mt-1">صورة توضيحية للمعدّة</span>
          </div>
        )}
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
                "relative h-20 w-20 rounded-2xl border-2 bg-brand-neutral-100 flex items-center justify-center shrink-0 transition-all overflow-hidden cursor-pointer active:scale-95",
                selectedIdx === idx
                  ? "border-brand-green-600 ring-2 ring-brand-green-200 shadow-sm"
                  : "border-brand-neutral-200 hover:border-brand-neutral-400"
              )}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
