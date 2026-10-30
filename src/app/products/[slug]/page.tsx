import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductsStore } from "@/lib/products-store";
import { CATEGORIES } from "@/data/catalog";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductSpecifications } from "@/components/products/product-specifications";
import { ProductCard } from "@/components/products/product-card";
import { ProductPurchaseActions } from "@/components/products/product-purchase-actions";
import { constructMetadata } from "@/lib/seo";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";

interface ProductDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductDetailsPageProps) {
  const { slug } = await params;
  const products = await getProductsStore();
  const product = products.find((p) => p.slug === slug);

  if (!product || !product.published) {
    return constructMetadata({
      title: "العطر غير موجود",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: `${product.name} | أمير ستور للعطور`,
    description: product.shortDescription,
    canonicalUrl: `/products/${product.slug}`,
  });
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { slug } = await params;
  const products = await getProductsStore();
  const product = products.find((p) => p.slug === slug);

  if (!product || !product.published) {
    notFound();
  }

  const relatedProducts = products.filter(
    (p) => p.published && p.categoryId === product.categoryId && p.id !== product.id
  ).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 text-start text-white">
      {/* Breadcrumbs Navigation */}
      <nav aria-label="مسار التصفح" className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-400">
        <Link href="/" className="hover:text-amber-300 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-amber-300 transition-colors">
          العطور
        </Link>
        <span>/</span>
        <Link
          href={`/products?category=${CATEGORIES.find((c) => c.id === product.categoryId)?.slug}`}
          className="hover:text-amber-300 transition-colors"
        >
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-white font-bold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Visual Gallery */}
        <div className="lg:col-span-6">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Identity, Specs, Inquiries */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 px-3.5 py-1 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>{product.categoryName}</span>
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug font-arabic">
              {product.name}
            </h1>
            {product.model && (
              <p className="text-sm font-semibold text-amber-300">
                الحجم والتركيز: {product.model}
              </p>
            )}
          </div>

          <div className="prose prose-invert prose-sm text-slate-300 leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Purchase Actions & Cart Integration */}
          <ProductPurchaseActions product={product} />

          {/* Verification check points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
              <span>عطر أصلي 100% ونقي</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
              <span>ثبات 72 ساعة وفوحان فائق</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
              <span>تغليف هدايا ملكي مجاني</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
              <span>معاينة العطر قبل الاستلام</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="pt-6">
        <ProductSpecifications specifications={product.specifications} />
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-amber-400/20 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-arabic">
              عطور أخرى في قسم {product.categoryName}
            </h3>
            <Link
              href={`/products?category=${CATEGORIES.find((c) => c.id === product.categoryId)?.slug || ""}`}
              className="text-xs sm:text-sm font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 active:scale-95 transition-all"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
