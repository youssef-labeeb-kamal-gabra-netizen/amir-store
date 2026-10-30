import { readStorageFile, writeStorageFile, withStorageMutex } from "@/lib/storage";
import { getProductsStore } from "@/lib/products-store";
import { Order, OrderStatus, CreateOrderInput, OrderItem } from "@/types/order";
import {
  isPostgresConfigured,
  executeQuery,
  ensurePostgresTables,
  rowToOrder,
  OrderDbRow,
} from "@/lib/db";

const STORAGE_FILE = "orders.json";
export const FREE_SHIPPING_THRESHOLD = 1000;
export const STANDARD_SHIPPING_COST = 50;

export const VALID_ORDER_STATUSES = [
  "NEW",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export function isValidOrderStatus(status: string): boolean {
  return VALID_ORDER_STATUSES.includes(status as (typeof VALID_ORDER_STATUSES)[number]);
}

export function normalizeOrderStatus(status: string): OrderStatus {
  switch (status.toLowerCase()) {
    case "pending":
    case "new":
      return "NEW";
    case "confirmed":
    case "processing":
      return "PROCESSING";
    case "shipped":
      return "SHIPPED";
    case "delivered":
      return "DELIVERED";
    case "cancelled":
    case "canceled":
      return "CANCELLED";
    default:
      return (status.toUpperCase() as OrderStatus) || "NEW";
  }
}

async function getOrdersFromPostgres(): Promise<Order[]> {
  try {
    const ok = await ensurePostgresTables();
    if (!ok) throw new Error("PostgreSQL tables not initialized");
    const rows = await executeQuery<OrderDbRow>("SELECT * FROM orders ORDER BY created_at DESC");
    return rows.map(rowToOrder);
  } catch (err) {
    console.warn("[Orders Store] PostgreSQL getOrders failed, falling back to local JSON storage:", err);
    return readStorageFile<Order[]>(STORAGE_FILE, []);
  }
}

/**
 * Returns all customer orders from PostgreSQL (if configured)
 * or falls back cleanly to the local atomic JSON storage engine.
 */
export function getOrders(): Promise<Order[]> | Order[] {
  if (isPostgresConfigured()) {
    return getOrdersFromPostgres();
  }
  return readStorageFile<Order[]>(STORAGE_FILE, []);
}

/**
 * Retrieves an order by its unique ID.
 */
export function getOrderById(id: string): Promise<Order | null> | Order | null {
  if (isPostgresConfigured()) {
    return (async () => {
      try {
        const ok = await ensurePostgresTables();
        if (!ok) throw new Error("PostgreSQL tables not initialized");
        const rows = await executeQuery<OrderDbRow>("SELECT * FROM orders WHERE id = $1", [id]);
        if (rows.length === 0) return null;
        return rowToOrder(rows[0]);
      } catch (err) {
        console.warn("[Orders Store] PostgreSQL getOrderById failed, falling back to local JSON storage:", err);
        const orders = readStorageFile<Order[]>(STORAGE_FILE, []);
        return orders.find((o) => o.id === id) || null;
      }
    })();
  }
  const orders = readStorageFile<Order[]>(STORAGE_FILE, []);
  return orders.find((o) => o.id === id) || null;
}

/**
 * Creates and persists a new order atomically with authoritative server pricing.
 * Re-verifies every item against the catalog and guarantees serialized writes.
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  // 1. Authoritative Item Validation & Pricing against Catalog
  const catalog = await getProductsStore();
  const catalogMap = new Map(catalog.map((p) => [p.id, p]));

  if (!input.items || !Array.isArray(input.items) || input.items.length === 0) {
    throw new Error("سلة المشتريات فارغة! يرجى اختيار منتجات أولاً.");
  }

  if (input.items.length > 20) {
    throw new Error("لا يمكن إضافة أكثر من 20 منتج في الطلب الواحد.");
  }

  const verifiedItems: OrderItem[] = input.items.map((item) => {
    if (!item || typeof item.id !== "string" || !item.id.trim()) {
      throw new Error("معرف المنتج غير صالح أو مفقود.");
    }

    const product = catalogMap.get(item.id.trim());
    if (!product || !product.published) {
      throw new Error(`المنتج المطلوب (${item.name || item.id}) غير متوفر حالياً أو غير منشور.`);
    }

    const authoritativePrice = product.price;
    if (typeof authoritativePrice !== "number" || isNaN(authoritativePrice) || authoritativePrice <= 0) {
      throw new Error(`سعر المنتج (${product.name}) غير محدد بدقة في النظام.`);
    }

    if (
      typeof item.quantity !== "number" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 50
    ) {
      throw new Error(`الكمية المطلوبة للمنتج (${product.name}) يجب أن تكون عدداً صحيحاً بين 1 و 50 قطعة.`);
    }
    const qty = item.quantity;

    return {
      id: product.id,
      name: product.name,
      model: product.model || item.model || "الحجم القياسي",
      price: authoritativePrice,
      quantity: qty,
      image: product.images?.[0] || item.image || "/images/logo.png",
    };
  });

  // Authoritative Server-Side Calculation (Client prices are completely ignored)
  const subtotal = verifiedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const total = subtotal + shippingCost;

  // 2. PostgreSQL Storage Branch (with graceful fallback on connection issue)
  if (isPostgresConfigured()) {
    try {
      const ok = await ensurePostgresTables();
      if (!ok) throw new Error("PostgreSQL tables not initialized");
      let id = "";
      let attempts = 0;
      let exists = true;
      while (exists && attempts < 10) {
        attempts++;
        const rand = Math.floor(100000 + Math.random() * 900000);
        id = `AMR-${rand}`;
        const existing = await executeQuery<{ id: string }>(
          "SELECT id FROM orders WHERE id = $1",
          [id]
        );
        if (existing.length === 0) exists = false;
      }
      if (exists) {
        id = `AMR-${Date.now().toString().slice(-6)}`;
      }

      const now = new Date().toISOString();
      const newOrder: Order = {
        id,
        customerName: input.customerName.trim(),
        customerEmail: input.customerEmail ? input.customerEmail.trim().toLowerCase() : undefined,
        phone: input.phone.trim(),
        governorate: input.governorate.trim(),
        address: input.address.trim(),
        notes: input.notes?.trim() || "",
        items: verifiedItems,
        subtotal,
        shippingCost,
        total,
        paymentMethod: input.paymentMethod || "COD",
        status: "NEW",
        createdAt: now,
        updatedAt: now,
      };

      await executeQuery(
        `INSERT INTO orders (
           id, customer_name, customer_email, phone, governorate, address, notes,
           items, subtotal, shipping_cost, total, payment_method, status,
           created_at, updated_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          newOrder.id,
          newOrder.customerName,
          newOrder.customerEmail || null,
          newOrder.phone,
          newOrder.governorate,
          newOrder.address,
          newOrder.notes || null,
          JSON.stringify(newOrder.items),
          newOrder.subtotal,
          newOrder.shippingCost,
          newOrder.total,
          newOrder.paymentMethod,
          newOrder.status,
          newOrder.createdAt,
          newOrder.updatedAt,
        ]
      );

      return newOrder;
    } catch (err) {
      console.warn("[Orders Store] PostgreSQL insert failed, falling back to local storage mutex:", err);
    }
  }

  // 3. Fallback: Atomic In-Memory Storage Mutex for JSON file
  return withStorageMutex(STORAGE_FILE, async () => {
    const orders = readStorageFile<Order[]>(STORAGE_FILE, []);

    let id = "";
    do {
      const rand = Math.floor(100000 + Math.random() * 900000);
      id = `AMR-${rand}`;
    } while (orders.some((o) => o.id === id));

    const now = new Date().toISOString();
    const newOrder: Order = {
      id,
      customerName: input.customerName.trim(),
      customerEmail: input.customerEmail ? input.customerEmail.trim().toLowerCase() : undefined,
      phone: input.phone.trim(),
      governorate: input.governorate.trim(),
      address: input.address.trim(),
      notes: input.notes?.trim() || "",
      items: verifiedItems,
      subtotal,
      shippingCost,
      total,
      paymentMethod: input.paymentMethod || "COD",
      status: "NEW",
      createdAt: now,
      updatedAt: now,
    };

    const updatedOrders = [newOrder, ...orders];
    writeStorageFile(STORAGE_FILE, updatedOrders);

    return newOrder;
  });
}

/**
 * Updates an order status with enum whitelisting (Admin only operation).
 */
export async function updateOrderStatus(id: string, rawStatus: string): Promise<Order | null> {
  if (!isValidOrderStatus(rawStatus)) {
    throw new Error(`حالة الطلب غير صالحة: ${rawStatus}`);
  }

  const canonicalStatus = normalizeOrderStatus(rawStatus);

  if (isPostgresConfigured()) {
    try {
      const ok = await ensurePostgresTables();
      if (!ok) throw new Error("PostgreSQL tables not initialized");
      const now = new Date().toISOString();
      const rows = await executeQuery<OrderDbRow>(
        "UPDATE orders SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *",
        [canonicalStatus, now, id]
      );
      if (rows.length > 0) {
        return rowToOrder(rows[0]);
      }
      return null;
    } catch (err) {
      console.warn("[Orders Store] PostgreSQL update failed, falling back to local storage mutex:", err);
    }
  }

  return withStorageMutex(STORAGE_FILE, async () => {
    const orders = readStorageFile<Order[]>(STORAGE_FILE, []);
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return null;

    const updated: Order = {
      ...orders[index],
      status: canonicalStatus,
      updatedAt: new Date().toISOString(),
    };

    orders[index] = updated;
    writeStorageFile(STORAGE_FILE, orders);

    return updated;
  });
}
