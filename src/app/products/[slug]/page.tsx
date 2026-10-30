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
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface ProductDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductDetailsPageProps) {
  const { slug } = await params;
  const products = getProductsStore();
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
  const products = getProductsStore();
  const product = products.find((p) => p.slug === slug);

  if (!product || !product.published) {
    notFound();
  }

  const relatedProducts = products.filter(
    (p) => p.published && p.categoryId === product.categoryId && p.id !== product.id
  ).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 text-start">
      {/* Breadcrumbs Navigation */}
      <nav aria-label="مسار التصفح" className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-brand-neutral-500">
        <Link href="/" className="hover:text-brand-green-800 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-brand-green-800 transition-colors">
          العطور
        </Link>
        <span>/</span>
        <Link
          href={`/products?category=${CATEGORIES.find((c) => c.id === product.categoryId)?.slug}`}
          className="hover:text-brand-green-800 transition-colors"
        >
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-brand-neutral-900 font-semibold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
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
            <span className="inline-block rounded-full bg-brand-green-50 text-brand-green-800 border border-brand-green-200 px-3.5 py-1 text-xs font-bold">
              {product.categoryName}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-green-950 tracking-tight leading-snug">
              {product.name}
            </h1>
            {product.model && (
              <p className="text-sm font-semibold text-brand-gold-600">
                الحجم والتركيز: {product.model}
              </p>
            )}
          </div>

          <div className="prose prose-sm text-brand-neutral-600 leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Purchase Actions & Cart Integration */}
          <ProductPurchaseActions product={product} />

          {/* Verification check points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-brand-neutral-600 pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-gold-600 shrink-0" />
              <span>عطر أصلي 100% ونقي</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-gold-600 shrink-0" />
              <span>ثبات وفوحان فائق</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-gold-600 shrink-0" />
              <span>تغليف هدايا ملكي مجاني</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-gold-600 shrink-0" />
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
        <section className="pt-10 border-t border-brand-neutral-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold text-brand-green-950">
              عطور أخرى في قسم {product.categoryName}
            </h3>
            <Link
              href={`/products?category=${CATEGORIES.find((c) => c.id === product.categoryId)?.slug || ""}`}
              className="text-xs sm:text-sm font-bold text-brand-green-800 hover:text-brand-green-900 flex items-center gap-1 active:scale-95 transition-all"
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
