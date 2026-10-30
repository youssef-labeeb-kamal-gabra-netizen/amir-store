import React from "react";
import { getProductsStore } from "@/lib/products-store";
import { CATEGORIES } from "@/data/catalog";
import { ProductsManager } from "@/components/admin/products-manager";

export default function AdminProductsPage() {
  const products = getProductsStore();
  const categories = CATEGORIES;

  return <ProductsManager initialProducts={products} categories={categories} />;
}
