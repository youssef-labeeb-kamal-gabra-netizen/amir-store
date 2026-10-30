import { Category } from "@/types/product";
import { CATEGORIES } from "@/data/catalog";
import { readStorageFile, writeStorageFile } from "@/lib/storage";

const STORAGE_FILE = "categories.json";

export function getCategoriesStore(): Category[] {
  return readStorageFile<Category[]>(STORAGE_FILE, CATEGORIES);
}

export function addCategory(data: Omit<Category, "id">): Category {
  const store = getCategoriesStore();
  const newCat: Category = {
    ...data,
    id: `cat-${Date.now()}`,
  };
  store.push(newCat);
  writeStorageFile(STORAGE_FILE, store);
  return newCat;
}

export function updateCategory(id: string, updates: Partial<Omit<Category, "id">>): Category | null {
  const store = getCategoriesStore();
  const index = store.findIndex((c) => c.id === id);
  if (index === -1) return null;
  store[index] = { ...store[index], ...updates };
  writeStorageFile(STORAGE_FILE, store);
  return store[index];
}

export function deleteCategory(id: string): boolean {
  const store = getCategoriesStore();
  const index = store.findIndex((c) => c.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  writeStorageFile(STORAGE_FILE, store);
  return true;
}
