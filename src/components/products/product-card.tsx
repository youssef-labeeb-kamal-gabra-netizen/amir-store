import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageCircle, Info } from "lucide-react";
import { env } from "@/lib/env";

export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const rawWhatsApp = env.business.whatsapp || "01220792948";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const formattedWhatsApp = cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp;
  const inquiryMessage = encodeURIComponent(
    `السلام عليكم ورحمة الله، أود الاستفسار عن توفر وسعر عطر: ${product.name} لدى متجر أمير ستور.`
  );
  const whatsappHref = `https://wa.me/${formattedWhatsApp}?text=${inquiryMessage}`;

  return (
    <Card className="flex flex-col h-full bg-white border border-brand-neutral-200 rounded-3xl shadow-oud-sm hover:shadow-xl hover:border-brand-green-800/40 card-touch overflow-hidden group">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-brand-neutral-50 flex items-center justify-center border-b border-brand-neutral-200/60">
        {product.images && product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-brand-neutral-400 p-4 text-center">
            <Sparkles className="h-12 w-12 text-brand-green-800/40 mb-2 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xs font-medium text-brand-neutral-500">
              {product.brand || "أمير ستور للعطور"}
            </span>
          </div>
        )}

        {/* Category Pill */}
        {product.categoryName && (
          <span className="absolute top-3 end-3 rounded-full bg-white/95 backdrop-blur-sm px-3.5 py-1 text-xs font-bold text-brand-green-800 shadow-xs border border-brand-neutral-200">
            {product.categoryName}
          </span>
        )}

        {/* Availability Pill */}
        <span className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-brand-green-950/90 text-white backdrop-blur-md px-3 py-1 text-xs font-medium border border-brand-gold-400/40 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-brand-gold-400 animate-pulse" />
          <span>عطر أصلي 100%</span>
        </span>
      </div>

      <CardHeader className="p-5 pb-2">
        {product.model && (
          <span className="text-xs font-semibold text-brand-green-800 bg-brand-green-50 border border-brand-green-200 px-2.5 py-0.5 rounded-full inline-block w-fit mb-1">
            الحجم: {product.model}
          </span>
        )}
        <Link href={`/products/${product.slug}`} className="hover:text-brand-gold-600 transition-colors">
          <h3 className="text-base sm:text-lg font-bold text-brand-green-950 line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="px-5 py-2 flex-1">
        <p className="text-xs sm:text-sm text-brand-neutral-500 line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-3 flex flex-col sm:flex-row gap-2 border-t border-brand-neutral-200/60">
        <Link href={`/products/${product.slug}`} className="w-full sm:flex-1">
          <Button variant="outline" size="sm" className="w-full justify-center gap-1.5 font-bold rounded-full py-2.5 text-xs sm:text-sm border-brand-neutral-200 hover:border-brand-green-800 hover:bg-brand-green-800 hover:text-white transition-all cursor-pointer">
            <Info className="h-4 w-4" />
            <span>تفاصيل العطر</span>
          </Button>
        </Link>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:flex-1"
        >
          <Button variant="primary" size="sm" className="w-full justify-center gap-1.5 font-bold rounded-full py-2.5 text-xs sm:text-sm bg-brand-green-800 hover:bg-brand-green-900 active:bg-brand-green-950 text-white shadow-sm transition-all cursor-pointer">
            <MessageCircle className="h-4 w-4 text-brand-gold-400" />
            <span>اطلب الآن</span>
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
