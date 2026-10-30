import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductsStore } from "@/lib/products-store";
import { CATEGORIES } from "@/data/catalog";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductSpecifications } from "@/components/products/product-specifications";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { constructMetadata } from "@/lib/seo";
import { env } from "@/lib/env";
import { MessageCircle, Phone, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

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
      title: "المنتج غير موجود",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: `${product.name} | شركة لبيب كمال`,
    description: product.shortDescription,
    canonicalUrl: `/products/${product.slug}`,
  });
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { slug } = await params;
  const products = getProductsStore();
  const product = products.find((p) => p.slug === slug);

  // Strictly reject draft/unpublished products from direct access (Phase 5, Item 1)
  if (!product || !product.published) {
    notFound();
  }

  const relatedProducts = products.filter(
    (p) => p.published && p.categoryId === product.categoryId && p.id !== product.id
  ).slice(0, 3);

  const rawWhatsApp = env.business.whatsapp || "01220792948";
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, "");
  const formattedWhatsApp = cleanWhatsApp.startsWith("0") ? `2${cleanWhatsApp}` : cleanWhatsApp;
  const defaultWhatsAppMsg = encodeURIComponent(
    `السلام عليكم ورحمة الله، أود الاستفسار عن توفر وسعر ومواصفات المعدة: ${product.name} (طراز: ${product.model || "غير محدد"}) لدى شركة لبيب كمال.`
  );
  const whatsappHref = `https://wa.me/${formattedWhatsApp}?text=${defaultWhatsAppMsg}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 text-start">
      {/* Breadcrumbs Navigation */}
      <nav aria-label="مسار التصفح" className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-brand-neutral-500">
        <Link href="/" className="hover:text-brand-green-800 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-brand-green-800 transition-colors">
          المنتجات
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
            <span className="inline-block rounded-md bg-brand-green-100 text-brand-green-800 px-3 py-1 text-xs font-bold">
              {product.categoryName}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-neutral-900 tracking-tight leading-snug">
              {product.name}
            </h1>
            {product.model && (
              <p className="text-sm font-semibold text-brand-gold-700">
                طراز / كود الموديل: {product.model} {product.brand && `(${product.brand})`}
              </p>
            )}
          </div>

          <div className="prose prose-sm text-brand-neutral-600 leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Genuine Inquiry & Trust Box (No fake prices) */}
          <div className="rounded-2xl border border-brand-neutral-200 bg-brand-neutral-50 p-6 space-y-4">
            <div className="flex items-start gap-3 text-start">
              <ShieldCheck className="h-6 w-6 text-brand-green-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-brand-neutral-900">
                  استفسر مباشرة عن الأسعار والمواصفات
                </h4>
                <p className="text-xs text-brand-neutral-600 mt-1 leading-relaxed">
                  نظراً لتنوع القدرات الفنية وملحقات التشغيل، يسعدنا تزويدكم بعرض سعر فني مخصص واختيار أفضل تهيئة مناسبة لأرضكم ومصدر المياه لديكم.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1"
              >
                <Button variant="primary" size="lg" className="w-full justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white font-black shadow-md btn-touch rounded-2xl py-4 text-sm sm:text-base cursor-pointer">
                  <MessageCircle className="h-5 w-5" />
                  <span>اسأل عن السعر والمواصفات بالواتساب</span>
                </Button>
              </a>
              <Link href={`/contact?product=${encodeURIComponent(product.slug)}`} className="w-full sm:flex-1">
                <Button variant="outline" size="lg" className="w-full justify-center gap-2 font-black border-2 border-emerald-600 bg-emerald-50 text-emerald-950 hover:bg-emerald-100 hover:border-emerald-700 rounded-2xl py-4 text-sm sm:text-base btn-touch cursor-pointer">
                  <Phone className="h-4 w-4 text-emerald-700" />
                  <span>طلب اتصال تليفوني بالمحل</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Verification check points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-brand-neutral-600 pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-green-700 shrink-0" />
              <span>قطع غيار ومستلزمات متوفرة</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-green-700 shrink-0" />
              <span>فحص واختبار قبل التسليم</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-green-700 shrink-0" />
              <span>دعم فني واستشارات متخصصة</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-green-700 shrink-0" />
              <span>الاستلام في الزقازيق أو الشحن</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Section (TASK 061) */}
      <div className="pt-6">
        <ProductSpecifications specifications={product.specifications} />
      </div>

      {/* Related Products Section (TASK 067) */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-brand-neutral-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold text-brand-neutral-900">
              معدات ذات صلة في قسم {product.categoryName}
            </h3>
            <Link
              href={`/products?category=${CATEGORIES.find((c) => c.id === product.categoryId)?.slug || ""}`}
              className="text-xs sm:text-sm font-bold text-brand-green-700 hover:text-brand-green-800 flex items-center gap-1 active:scale-95 transition-all"
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
