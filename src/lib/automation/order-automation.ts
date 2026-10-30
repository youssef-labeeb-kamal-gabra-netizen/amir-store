import { Order } from "@/types/order";

/**
 * Amir Store - Order Processing & Security Automation Engine
 */

export interface AutomationResult {
  orderId: string;
  fraudScore: number;
  isFlagged: boolean;
  assignedVipGift?: string;
  deliveryEstimateDays: number;
  deliverySlaDescription: string;
  whatsAppDispatchUrl: string;
  autoApproved: boolean;
}

const SAME_DAY_GOVERNORATES = ["القاهرة", "الجيزة", "الشرقية", "القليوبية"];
const OFFICIAL_STORE_PHONE = "201220086002";

/**
 * Calculates security fraud risk score (0-100).
 * Lower is better. Score >= 70 flags order for manual review.
 */
export function calculateOrderFraudScore(order: Order): number {
  let score = 0;

  // 1. Phone number format validation (Egyptian standard: 11 digits, starts with 010/011/012/015)
  const cleanPhone = order.phone.replace(/[^0-9]/g, "");
  const isEgyptianMobile = /^(010|011|012|015)[0-9]{8}$/.test(cleanPhone);
  if (!isEgyptianMobile) {
    score += 40;
  }

  // 2. Quantity checks
  const totalUnits = order.items.reduce((acc, item) => acc + item.quantity, 0);
  if (totalUnits > 15) {
    score += 25;
  }

  // 3. Subtotal checks
  if (order.total > 25000) {
    score += 20;
  }

  // 4. Address completeness check
  if (!order.address || order.address.trim().length < 8) {
    score += 25;
  }

  return Math.min(score, 100);
}

/**
 * Evaluates complimentary VIP fragrance gift rules:
 * Orders >= 1000 EGP get an authentic 2ml royal sample vial automatically.
 */
export function evaluateVipGiftAllocation(order: Order): string | undefined {
  if (order.subtotal >= 1000) {
    // Dynamic sample matching based on items
    const hasOud = order.items.some((i) => i.name.includes("عود"));
    if (hasOud) {
      return "عينة ملكية مجانية 2 مل: دهن عود تراد معتق نقي 100%";
    }
    return "عينة ملكية مجانية 2 مل: عطر أمير العود (Extrait de Parfum)";
  }
  return undefined;
}

/**
 * Calculates delivery SLA estimation based on destination governorate.
 */
export function calculateDeliverySla(governorate: string): { days: number; description: string } {
  const isPriority = SAME_DAY_GOVERNORATES.some((g) => governorate.includes(g));
  if (isPriority) {
    return {
      days: 1,
      description: "شحن سريع خلال 24 ساعة لباب المنزل مع حق المعاينة",
    };
  }
  return {
    days: 2,
    description: "شحن لكافة المحافظات خلال 48 إلى 72 ساعة كحد أقصى مع حق المعاينة",
  };
}

/**
 * Generates an automated WhatsApp dispatch message URL for the store concierge.
 */
export function generateWhatsAppDispatchUrl(order: Order, vipGift?: string): string {
  const itemsText = order.items
    .map((item) => `  • ${item.name} (${item.quantity} × ${item.price} ج.م)`)
    .join("\n");

  const message =
    `👑 *أمير ستور — تأكيد حجز طلب جديد*\n` +
    `--------------------------------\n` +
    `• كود الطلب: *${order.id}*\n` +
    `• العميل: ${order.customerName}\n` +
    `• الهاتف: ${order.phone}\n` +
    `• المحافظة: ${order.governorate}\n` +
    `• العنوان: ${order.address}\n\n` +
    `📦 *تفاصيل المنتجات:*\n${itemsText}\n` +
    (vipGift ? `🎁 *هدية الطلب:* ${vipGift}\n` : "") +
    `\n💰 *الإجمالي المستحق:* ${order.total.toLocaleString("ar-EG")} ج.م (${
      order.shippingCost === 0 ? "شحن مجاني" : `شامل ${order.shippingCost} ج.م شحن`
    })\n` +
    `🛡️ *الضمان:* الدفع عند الاستلام مع حق المعاينة قبل السداد.`;

  return `https://wa.me/${OFFICIAL_STORE_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Main automated order processor pipeline
 */
export function processOrderAutomation(order: Order): AutomationResult {
  const fraudScore = calculateOrderFraudScore(order);
  const isFlagged = fraudScore >= 70;
  const assignedVipGift = evaluateVipGiftAllocation(order);
  const { days: deliveryEstimateDays, description: deliverySlaDescription } = calculateDeliverySla(
    order.governorate
  );
  const whatsAppDispatchUrl = generateWhatsAppDispatchUrl(order, assignedVipGift);

  return {
    orderId: order.id,
    fraudScore,
    isFlagged,
    assignedVipGift,
    deliveryEstimateDays,
    deliverySlaDescription,
    whatsAppDispatchUrl,
    autoApproved: !isFlagged,
  };
}
