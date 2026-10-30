export type OrderStatus =
  | "NEW"          // جديد
  | "PROCESSING"   // جاري التجهيز
  | "SHIPPED"      // تم الشحن مع المندوب
  | "DELIVERED"    // تم الاستلام والتحصيل
  | "CANCELLED";   // ملغي

export interface OrderItem {
  id: string;
  name: string;
  model?: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail?: string;
  phone: string;
  governorate: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: "COD" | "WHATSAPP";
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail?: string;
  phone: string;
  governorate: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  paymentMethod?: "COD" | "WHATSAPP";
}

