import { readStorageFile, writeStorageFile, withStorageMutex } from "@/lib/storage";
import { getProductsStore } from "@/lib/products-store";
import { Order, OrderStatus, CreateOrderInput, OrderItem } from "@/types/order";

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

/**
 * Returns all customer orders stored persistently on disk.
 */
export function getOrders(): Order[] {
  return readStorageFile<Order[]>(STORAGE_FILE, []);
}

/**
 * Retrieves an order by its unique ID.
 */
export function getOrderById(id: string): Order | null {
  const orders = getOrders();
  return orders.find((o) => o.id === id) || null;
}

/**
 * Creates and persists a new order atomically with authoritative server pricing.
 * Re-verifies every item against the catalog and guarantees serialized writes.
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  return withStorageMutex(STORAGE_FILE, async () => {
    const orders = getOrders();
    const catalog = getProductsStore();
    const catalogMap = new Map(catalog.map((p) => [p.id, p]));

    // Authoritative Item Validation & Pricing
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

      if (typeof item.quantity !== "number" || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 50) {
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

    // Unique collision-resistant Order ID
    let id = "";
    do {
      const rand = Math.floor(100000 + Math.random() * 900000);
      id = `AMR-${rand}`;
    } while (orders.some((o) => o.id === id));

    const now = new Date().toISOString();

    const newOrder: Order = {
      id,
      customerName: input.customerName.trim(),
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

    // Prepend so latest orders appear first
    const updatedOrders = [newOrder, ...orders];
    writeStorageFile(STORAGE_FILE, updatedOrders);

    return newOrder;
  });
}

/**
 * Updates an order status with enum whitelisting (Admin only operation).
 */
export async function updateOrderStatus(id: string, rawStatus: string): Promise<Order | null> {
  return withStorageMutex(STORAGE_FILE, async () => {
    if (!isValidOrderStatus(rawStatus)) {
      throw new Error(`حالة الطلب غير صالحة: ${rawStatus}`);
    }

    const canonicalStatus = normalizeOrderStatus(rawStatus);
    const orders = getOrders();
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
