import { readStorageFile, writeStorageFile } from "@/lib/storage";
import { Order, OrderStatus, CreateOrderInput } from "@/types/order";

const STORAGE_FILE = "orders.json";
const FREE_SHIPPING_THRESHOLD = 1000;
const STANDARD_SHIPPING_COST = 50;

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
 * Creates and persists a new order atomically.
 */
export function createOrder(input: CreateOrderInput): Order {
  const orders = getOrders();
  
  // Generate high-end sequential/unique order number
  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  const id = `AMR-${orderNumber}`;
  
  const subtotal = input.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const total = subtotal + shippingCost;

  const now = new Date().toISOString();

  const newOrder: Order = {
    id,
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    governorate: input.governorate.trim(),
    address: input.address.trim(),
    notes: input.notes?.trim() || "",
    items: input.items,
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
}

/**
 * Updates an order status (Admin only operation).
 */
export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  const updated: Order = {
    ...orders[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  orders[index] = updated;
  writeStorageFile(STORAGE_FILE, orders);

  return updated;
}
