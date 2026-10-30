import React from "react";
import { getCategoriesStore } from "@/lib/categories-store";
import { getProductsStore } from "@/lib/products-store";
import { CategoriesManager } from "@/components/admin/categories-manager";

export default async function AdminCategoriesPage() {
  const categories = getCategoriesStore();
  const products = await getProductsStore();

  return <CategoriesManager initialCategories={categories} products={products} />;
}
