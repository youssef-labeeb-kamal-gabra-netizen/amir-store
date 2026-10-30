import crypto from "crypto";
import { Product } from "@/types/product";
import { INITIAL_PRODUCTS } from "@/data/catalog";
import { readStorageFile, writeStorageFile } from "@/lib/storage";
import {
  isPostgresConfigured,
  executeQuery,
  ensurePostgresTables,
  rowToProduct,
  ProductDbRow,
} from "@/lib/db";

const STORAGE_FILE = "products.json";

/**
 * Retrieves all luxury perfume products from PostgreSQL (if configured)
 * or falls back cleanly to the local atomic JSON storage engine.
 */
async function getProductsFromPostgres(): Promise<Product[]> {
  try {
    await ensurePostgresTables();
    const rows = await executeQuery<ProductDbRow>("SELECT * FROM products ORDER BY created_at DESC");
    return rows.map(rowToProduct);
  } catch (err) {
    console.warn("[Products Store] PostgreSQL connection failed, falling back to local JSON storage:", err);
    return readStorageFile<Product[]>(STORAGE_FILE, INITIAL_PRODUCTS);
  }
}

export function getProductsStore(): Promise<Product[]> | Product[] {
  if (isPostgresConfigured()) {
    return getProductsFromPostgres();
  }
  return readStorageFile<Product[]>(STORAGE_FILE, INITIAL_PRODUCTS);
}

export async function getPublishedProducts(): Promise<Product[]> {
  const products = await getProductsStore();
  return products.filter((p) => p.published);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProductsStore();
  return products.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProductsStore();
  return products.find((p) => p.id === id) || null;
}

export function addProduct(
  productData: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<Product> | Product {
  const id = `prod-${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  const newProduct: Product = {
    ...productData,
    id,
    createdAt: now,
    updatedAt: now,
  };

  if (isPostgresConfigured()) {
    return (async () => {
      try {
        await ensurePostgresTables();
        await executeQuery(
          `INSERT INTO products (
             id, name, slug, category_id, category_name, model, brand,
             price, compare_at_price, short_description, description,
             images, specifications, featured, published, created_at, updated_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
          [
            newProduct.id,
            newProduct.name,
            newProduct.slug,
            newProduct.categoryId,
            newProduct.categoryName,
            newProduct.model || null,
            newProduct.brand || null,
            newProduct.price ?? 0,
            newProduct.compareAtPrice || null,
            newProduct.shortDescription || null,
            newProduct.description || null,
            JSON.stringify(newProduct.images || []),
            JSON.stringify(newProduct.specifications || []),
            Boolean(newProduct.featured),
            Boolean(newProduct.published),
            newProduct.createdAt,
            newProduct.updatedAt,
          ]
        );
        return newProduct;
      } catch (err) {
        console.warn("[Products Store] PostgreSQL addProduct failed, falling back to local storage:", err);
        const store = readStorageFile<Product[]>(STORAGE_FILE, INITIAL_PRODUCTS);
        store.unshift(newProduct);
        writeStorageFile(STORAGE_FILE, store);
        return newProduct;
      }
    })();
  }

  const store = readStorageFile<Product[]>(STORAGE_FILE, INITIAL_PRODUCTS);
  store.unshift(newProduct);
  writeStorageFile(STORAGE_FILE, store);
  return newProduct;
}

export function updateProduct(
  id: string,
  updates: Partial<Omit<Product, "id" | "createdAt">>
): Promise<Product | null> | Product | null {
  if (isPostgresConfigured()) {
    return (async () => {
      try {
        await ensurePostgresTables();
        const existingRows = await executeQuery<ProductDbRow>(
          "SELECT * FROM products WHERE id = $1",
          [id]
        );
        if (existingRows.length === 0) return null;

        const current = rowToProduct(existingRows[0]);
        const updated: Product = {
          ...current,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        await executeQuery(
          `UPDATE products SET
             name = $1, slug = $2, category_id = $3, category_name = $4,
             model = $5, brand = $6, price = $7, compare_at_price = $8,
             short_description = $9, description = $10, images = $11,
             specifications = $12, featured = $13, published = $14, updated_at = $15
           WHERE id = $16`,
          [
            updated.name,
            updated.slug,
            updated.categoryId,
            updated.categoryName,
            updated.model || null,
            updated.brand || null,
            updated.price ?? 0,
            updated.compareAtPrice || null,
            updated.shortDescription || null,
            updated.description || null,
            JSON.stringify(updated.images || []),
            JSON.stringify(updated.specifications || []),
            Boolean(updated.featured),
            Boolean(updated.published),
            updated.updatedAt,
            id,
          ]
        );
        return updated;
      } catch (err) {
        console.warn("[Products Store] PostgreSQL updateProduct failed, falling back to local storage:", err);
        const store = readStorageFile<Product[]>(STORAGE_FILE, INITIAL_PRODUCTS);
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
    })();
  }

  const store = readStorageFile<Product[]>(STORAGE_FILE, INITIAL_PRODUCTS);
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

export function deleteProduct(id: string): Promise<boolean> | boolean {
  if (isPostgresConfigured()) {
    return (async () => {
      try {
        await ensurePostgresTables();
        const res = await executeQuery<{ id: string }>(
          "DELETE FROM products WHERE id = $1 RETURNING id",
          [id]
        );
        return res.length > 0;
      } catch (err) {
        console.warn("[Products Store] PostgreSQL deleteProduct failed, falling back to local storage:", err);
        const store = readStorageFile<Product[]>(STORAGE_FILE, INITIAL_PRODUCTS);
        const filtered = store.filter((p) => p.id !== id);
        if (filtered.length === store.length) return false;

        writeStorageFile(STORAGE_FILE, filtered);
        return true;
      }
    })();
  }

  const store = readStorageFile<Product[]>(STORAGE_FILE, INITIAL_PRODUCTS);
  const filtered = store.filter((p) => p.id !== id);
  if (filtered.length === store.length) return false;

  writeStorageFile(STORAGE_FILE, filtered);
  return true;
}

export function toggleProductPublished(id: string): Promise<Product | null> | Product | null {
  if (isPostgresConfigured()) {
    return (async () => {
      try {
        await ensurePostgresTables();
        const existingRows = await executeQuery<ProductDbRow>(
          "SELECT * FROM products WHERE id = $1",
          [id]
        );
        if (existingRows.length === 0) return null;

        const current = rowToProduct(existingRows[0]);
        const nextPublished = !current.published;
        const now = new Date().toISOString();

        await executeQuery(
          "UPDATE products SET published = $1, updated_at = $2 WHERE id = $3",
          [nextPublished, now, id]
        );

        return {
          ...current,
          published: nextPublished,
          updatedAt: now,
        };
      } catch (err) {
        console.warn("[Products Store] PostgreSQL toggleProductPublished failed, falling back to local storage:", err);
        const store = readStorageFile<Product[]>(STORAGE_FILE, INITIAL_PRODUCTS);
        const product = store.find((p) => p.id === id);
        if (!product) return null;

        product.published = !product.published;
        product.updatedAt = new Date().toISOString();

        writeStorageFile(STORAGE_FILE, store);
        return product;
      }
    })();
  }

  const store = readStorageFile<Product[]>(STORAGE_FILE, INITIAL_PRODUCTS);
  const product = store.find((p) => p.id === id);
  if (!product) return null;

  product.published = !product.published;
  product.updatedAt = new Date().toISOString();

  writeStorageFile(STORAGE_FILE, store);
  return product;
}
