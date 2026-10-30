import { Pool } from "@neondatabase/serverless";
import { Product } from "@/types/product";
import { Order, OrderStatus } from "@/types/order";
import { INITIAL_PRODUCTS } from "@/data/catalog";

/**
 * Universal PostgreSQL Database Adapter for Vercel Postgres / Neon / Supabase.
 *
 * Supports Dual-Engine Storage:
 * 1. If POSTGRES_URL or DATABASE_URL is configured (Vercel Postgres connected):
 *    Executes high-performance parameterized SQL queries via connection pooling.
 * 2. If not configured yet (local testing or before user links database in Vercel):
 *    Reports isPostgresConfigured() = false so the caller safely falls back
 *    to the local atomic JSON storage engine (withStorageMutex).
 */

let globalPool: Pool | null = null;
let migrationPromise: Promise<boolean> | null = null;

export function isPostgresConfigured(): boolean {
  const url =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING;
  return Boolean(url && url.trim().length > 0);
}

export function getDatabaseConnectionString(): string | null {
  return (
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    null
  );
}

export function getDatabaseInfo() {
  const isConfigured = isPostgresConfigured();
  return {
    provider: isConfigured ? "Vercel Postgres (Neon / Serverless)" : "Atomic Persistent Storage (JSON)",
    isConfigured,
    mode: isConfigured ? "PostgreSQL Relational DB" : "Encrypted Local File Storage",
  };
}

function getPool(): Pool {
  if (!globalPool) {
    const connectionString = getDatabaseConnectionString();
    if (!connectionString) {
      throw new Error("قاعدة بيانات PostgreSQL غير مهيأة في متغيرات البيئة (POSTGRES_URL).");
    }
    globalPool = new Pool({ connectionString });
  }
  return globalPool;
}

/**
 * Executes a parameterized SQL query safely against PostgreSQL.
 * Parameterized queries guarantee 100% protection against SQL Injection.
 */
export async function executeQuery<T = Record<string, unknown>>(
  sqlQuery: string,
  params: unknown[] = []
): Promise<T[]> {
  const pool = getPool();
  const res = await pool.query(sqlQuery, params);
  return res.rows as T[];
}

/**
 * Ensures required database tables exist if running on a fresh PostgreSQL database,
 * and automatically seeds the luxury perfumes catalog if the table is empty.
 */
export async function ensurePostgresTables(): Promise<boolean> {
  if (!isPostgresConfigured()) return false;
  if (migrationPromise) return migrationPromise;

  migrationPromise = (async () => {
    try {
      const ddl = `
        CREATE TABLE IF NOT EXISTS products (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            category_id VARCHAR(64) NOT NULL,
            category_name VARCHAR(255) NOT NULL,
            model VARCHAR(128),
            brand VARCHAR(128),
            price NUMERIC(10, 2) NOT NULL,
            compare_at_price NUMERIC(10, 2),
            short_description TEXT,
            description TEXT,
            images JSONB DEFAULT '[]'::jsonb,
            specifications JSONB DEFAULT '[]'::jsonb,
            featured BOOLEAN DEFAULT false,
            published BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
        CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
        CREATE INDEX IF NOT EXISTS idx_products_published ON products(published);
        CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

        CREATE TABLE IF NOT EXISTS orders (
            id VARCHAR(64) PRIMARY KEY,
            customer_name VARCHAR(255) NOT NULL,
            phone VARCHAR(64) NOT NULL,
            governorate VARCHAR(128) NOT NULL,
            address TEXT NOT NULL,
            notes TEXT,
            items JSONB NOT NULL,
            subtotal NUMERIC(10, 2) NOT NULL,
            shipping_cost NUMERIC(10, 2) NOT NULL,
            total NUMERIC(10, 2) NOT NULL,
            payment_method VARCHAR(32) NOT NULL DEFAULT 'COD',
            status VARCHAR(32) NOT NULL DEFAULT 'NEW',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
        CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
        CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

        CREATE TABLE IF NOT EXISTS contact_requests (
            id VARCHAR(64) PRIMARY KEY,
            user_id VARCHAR(64),
            user_email VARCHAR(255),
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(64) NOT NULL,
            email VARCHAR(255),
            product VARCHAR(255),
            message TEXT NOT NULL,
            status VARCHAR(32) NOT NULL DEFAULT 'NEW',
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_contact_requests_user_email ON contact_requests(user_email);
        CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
      `;

      await executeQuery(ddl);

      // Seed luxury products if products table is empty
      const countRes = await executeQuery<{ count: string }>("SELECT COUNT(*) AS count FROM products");
      if (countRes.length > 0 && parseInt(countRes[0].count, 10) === 0) {
        for (const prod of INITIAL_PRODUCTS) {
          await executeQuery(
            `INSERT INTO products (
               id, name, slug, category_id, category_name, model, brand,
               price, compare_at_price, short_description, description,
               images, specifications, featured, published, created_at, updated_at
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
             ON CONFLICT (id) DO NOTHING`,
            [
              prod.id,
              prod.name,
              prod.slug,
              prod.categoryId,
              prod.categoryName,
              prod.model || null,
              prod.brand || null,
              prod.price,
              prod.compareAtPrice || null,
              prod.shortDescription || null,
              prod.description || null,
              JSON.stringify(prod.images || []),
              JSON.stringify(prod.specifications || []),
              Boolean(prod.featured),
              Boolean(prod.published),
              prod.createdAt || new Date().toISOString(),
              prod.updatedAt || new Date().toISOString(),
            ]
          );
        }
      }

      return true;
    } catch (err) {
      console.error("[Database] Auto-migration warning:", err);
      // Reset migration promise so a subsequent request can retry if this was a transient error
      migrationPromise = null;
      return false;
    }
  })();

  return migrationPromise;
}

// ============================================================================
// Entity Row Converters
// ============================================================================

export interface ProductDbRow {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category_name: string;
  model: string | null;
  brand: string | null;
  price: string | number;
  compare_at_price: string | number | null;
  short_description: string | null;
  description: string | null;
  images: string[] | string | null;
  specifications: unknown[] | string | null;
  featured: boolean;
  published: boolean;
  created_at: string | Date;
  updated_at: string | Date;
}

export function rowToProduct(row: ProductDbRow): Product {
  let images: string[] = [];
  if (Array.isArray(row.images)) {
    images = row.images;
  } else if (typeof row.images === "string") {
    try {
      const parsed = JSON.parse(row.images);
      if (Array.isArray(parsed)) images = parsed;
    } catch {
      images = [];
    }
  }

  let specifications: Product["specifications"] = [];
  if (Array.isArray(row.specifications)) {
    specifications = row.specifications as Product["specifications"];
  } else if (typeof row.specifications === "string") {
    try {
      const parsed = JSON.parse(row.specifications);
      if (Array.isArray(parsed)) specifications = parsed;
    } catch {
      specifications = [];
    }
  }

  const rawPrice = typeof row.price === "number" ? row.price : parseFloat(String(row.price || 0));
  const price = isNaN(rawPrice) ? 0 : rawPrice;

  let compareAtPrice: number | undefined = undefined;
  if (row.compare_at_price !== null && row.compare_at_price !== undefined) {
    const rawCompare =
      typeof row.compare_at_price === "number"
        ? row.compare_at_price
        : parseFloat(String(row.compare_at_price));
    if (!isNaN(rawCompare) && rawCompare > 0) {
      compareAtPrice = rawCompare;
    }
  }

  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    categoryId: String(row.category_id),
    categoryName: String(row.category_name),
    model: row.model ? String(row.model) : undefined,
    brand: row.brand ? String(row.brand) : undefined,
    price,
    compareAtPrice,
    shortDescription: row.short_description ? String(row.short_description) : "",
    description: row.description ? String(row.description) : "",
    images: Array.isArray(images) ? images : [],
    specifications: Array.isArray(specifications) ? specifications : [],
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

export interface OrderDbRow {
  id: string;
  customer_name: string;
  phone: string;
  governorate: string;
  address: string;
  notes: string | null;
  items: unknown[] | string;
  subtotal: string | number;
  shipping_cost: string | number;
  total: string | number;
  payment_method: string;
  status: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export function rowToOrder(row: OrderDbRow): Order {
  let items: Order["items"] = [];
  if (Array.isArray(row.items)) {
    items = row.items as Order["items"];
  } else if (typeof row.items === "string") {
    try {
      const parsed = JSON.parse(row.items);
      if (Array.isArray(parsed)) items = parsed;
    } catch {
      items = [];
    }
  }

  const rawSubtotal =
    typeof row.subtotal === "number" ? row.subtotal : parseFloat(String(row.subtotal || 0));
  const subtotal = isNaN(rawSubtotal) ? 0 : rawSubtotal;

  const rawShipping =
    typeof row.shipping_cost === "number"
      ? row.shipping_cost
      : parseFloat(String(row.shipping_cost || 0));
  const shippingCost = isNaN(rawShipping) ? 0 : rawShipping;

  const rawTotal =
    typeof row.total === "number" ? row.total : parseFloat(String(row.total || 0));
  const total = isNaN(rawTotal) ? 0 : rawTotal;

  return {
    id: String(row.id),
    customerName: String(row.customer_name),
    phone: String(row.phone),
    governorate: String(row.governorate),
    address: String(row.address),
    notes: row.notes ? String(row.notes) : "",
    items: Array.isArray(items) ? items : [],
    subtotal,
    shippingCost,
    total,
    paymentMethod: row.payment_method === "WHATSAPP" ? "WHATSAPP" : "COD",
    status: (row.status as OrderStatus) || "NEW",
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}
