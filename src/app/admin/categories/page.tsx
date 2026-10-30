import React from "react";
import { getCategoriesStore } from "@/lib/categories-store";
import { getProductsStore } from "@/lib/products-store";
import { CategoriesManager } from "@/components/admin/categories-manager";

export default function AdminCategoriesPage() {
  const categories = getCategoriesStore();
  const products = getProductsStore();

  return <CategoriesManager initialCategories={categories} products={products} />;
}
