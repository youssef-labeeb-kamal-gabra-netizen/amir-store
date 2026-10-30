import React from "react";
import { getProductsStore } from "@/lib/products-store";
import { getCategoriesStore } from "@/lib/categories-store";
import { ProductCatalogView } from "@/components/products/product-catalog-view";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "كتالوج الآلات والمعدات الزراعية",
  description:
    "استعرض أحدث محركات الرش، طلمبات ومحركات مياه الري، محركات الديزل، ومستلزمات شبكات الري وقطع الغيار المعتمدة لدى شركة لبيب كمال.",
  canonicalUrl: "/products",
});

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const initialCategory = params.category || "";
  const products = getProductsStore();
  const categories = getCategoriesStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <ProductCatalogView
        products={products}
        categories={categories}
        initialCategorySlug={initialCategory}
      />
    </div>
  );
}
