import { Order } from "@/types/order";
import { sendOrderEmails } from "@/lib/email";
import { processOrderAutomation, AutomationResult } from "./order-automation";

/**
 * Multi-channel Notification Automation Pipeline
 */
export interface NotificationDispatchResult {
  orderId: string;
  automation: AutomationResult;
  emailDispatched: boolean;
  whatsAppUrl: string;
  timestamp: string;
}

export async function dispatchOrderNotifications(order: Order): Promise<NotificationDispatchResult> {
  const automation = processOrderAutomation(order);

  // Trigger transactional email
  let emailDispatched = false;
  try {
    const emailRes = await sendOrderEmails(order);
    emailDispatched = Boolean(emailRes.customerResult?.success || emailRes.adminResult?.success || emailRes.simulated);
  } catch (err) {
    console.error("[Notification Automation] Email delivery failed:", err);
  }

  return {
    orderId: order.id,
    automation,
    emailDispatched,
    whatsAppUrl: automation.whatsAppDispatchUrl,
    timestamp: new Date().toISOString(),
  };
}
