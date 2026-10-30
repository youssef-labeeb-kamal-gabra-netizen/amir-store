import crypto from "crypto";
import { Product } from "@/types/product";
import { INITIAL_PRODUCTS } from "@/data/catalog";
import { readStorageFile, writeStorageFile } from "@/lib/storage";

const STORAGE_FILE = "products.json";

export function getProductsStore(): Product[] {
  return readStorageFile<Product[]>(STORAGE_FILE, INITIAL_PRODUCTS);
}

export function getPublishedProducts(): Product[] {
  return getProductsStore().filter((p) => p.published);
}

export function addProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
  const store = getProductsStore();
  const id = `prod-${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  const newProduct: Product = {
    ...productData,
    id,
    createdAt: now,
    updatedAt: now,
  };

  store.unshift(newProduct);
  writeStorageFile(STORAGE_FILE, store);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Product | null {
  const store = getProductsStore();
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return null;

  store[index] = {
    ...store[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  writeStorageFile(STORAGE_FILE, store);
  return store[index];
}

export function deleteProduct(id: string): boolean {
  const store = getProductsStore();
  const filtered = store.filter((p) => p.id !== id);
  if (filtered.length === store.length) return false;

  writeStorageFile(STORAGE_FILE, filtered);
  return true;
}

export function toggleProductPublished(id: string): Product | null {
  const store = getProductsStore();
  const product = store.find((p) => p.id === id);
  if (!product) return null;

  product.published = !product.published;
  product.updatedAt = new Date().toISOString();

  writeStorageFile(STORAGE_FILE, store);
  return product;
}
