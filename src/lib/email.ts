import { Resend } from "resend";
import { Order } from "@/types/order";
import { env } from "@/lib/env";

/**
 * Transactional Email Service via Resend
 * Amir Store - Luxury Fragrance Platform
 *
 * Free Tier Specs:
 * - 3,000 emails per month free
 * - 100 emails per day
 * - High deliverability directly to inbox
 */

export interface SendEmailResult {
  success: boolean;
  simulated?: boolean;
  messageId?: string;
  error?: string;
}

export function isEmailConfigured(): boolean {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  return Boolean(apiKey && apiKey.length > 0);
}

export function getEmailServiceInfo() {
  const isConfigured = isEmailConfigured();
  return {
    provider: isConfigured ? "Resend Transactional API (Free Tier - 3,000/mo)" : "Development Simulation Console",
    isConfigured,
    freeTierQuota: "3,000 emails/month free, 100 emails/day",
  };
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

/**
 * Escapes HTML characters to prevent XSS and template injection in email clients.
 */
export function escapeHtml(str: unknown): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Generates an ultra-luxurious Arabic HTML email invoice
 * styled with Amir Store's royal gold and cashmere brand aesthetics.
 */
export function generateOrderInvoiceHtml(order: Order, options?: { forAdmin?: boolean }): string {
  const isAdmin = Boolean(options?.forAdmin);
  const itemsRows = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid rgba(212, 175, 55, 0.15);">
        <td style="padding: 14px 16px; text-align: right; font-size: 13px; color: #F8F9FA; font-weight: bold;">
          ${escapeHtml(item.name)}
          <div style="font-size: 11px; color: #D4AF37; font-weight: normal; margin-top: 3px;">
            ${escapeHtml(item.model || "الحجم القياسي")}
          </div>
        </td>
        <td style="padding: 14px 16px; text-align: center; font-size: 13px; color: #E2E8F0;">
          ${item.quantity}
        </td>
        <td style="padding: 14px 16px; text-align: left; font-size: 13px; color: #E2E8F0; font-family: monospace;">
          ${item.price.toLocaleString("ar-EG")} ج.م
        </td>
        <td style="padding: 14px 16px; text-align: left; font-size: 13px; color: #F5E296; font-weight: bold; font-family: monospace;">
          ${(item.price * item.quantity).toLocaleString("ar-EG")} ج.م
        </td>
      </tr>
    `
    )
    .join("");

  const shippingPhrase =
    order.shippingCost === 0
      ? '<span style="color: #4ade80; font-weight: bold;">شحن مجاني ملكي 🎁</span>'
      : `${order.shippingCost.toLocaleString("ar-EG")} ج.م`;

  const dateFormatted = new Date(order.createdAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isAdmin ? "إشعار طلب جديد للإدارة" : "فاتورة شراء رسمية — أمير ستور"}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #08090C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Cairo', Tahoma, Arial, sans-serif; direction: rtl; text-align: right; color: #F8F9FA;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #08090C; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Container Card -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #0D0F14; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.8); border: 1px solid rgba(212, 175, 55, 0.35);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #13161F; padding: 35px 25px 30px; text-align: center; border-bottom: 2px solid #D4AF37;">
              <div style="display: inline-block; padding: 6px 16px; background-color: rgba(212, 175, 55, 0.15); border: 1px solid #D4AF37; border-radius: 30px; color: #F5E296; font-size: 11px; letter-spacing: 2px; margin-bottom: 12px; font-weight: bold;">
                👑 AMIR STORE • ROYAL PERFUMES
              </div>
              <h1 style="margin: 0; color: #F8F9FA; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                أمير ستور للعطور والعود الفاخر
              </h1>
              <p style="margin: 8px 0 0; color: #D4AF37; font-size: 13px; font-weight: 600;">
                ${isAdmin ? "🔔 إشعار تسجيل طلب شراء جديد عبر المنصة" : "فاتورة شراء رسمية وتأكيد حجز الطلب"}
              </p>
            </td>
          </tr>

          <!-- Order Identity Badge -->
          <tr>
            <td style="padding: 24px 28px 10px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #10131A; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 14px; padding: 16px 20px;">
                <tr>
                  <td style="text-align: right;">
                    <div style="font-size: 11px; color: #94A3B8; margin-bottom: 3px;">رقم الطلب الرسمي:</div>
                    <div style="font-size: 20px; font-weight: 900; color: #F5E296; letter-spacing: 1px; font-family: monospace;">
                      ${escapeHtml(order.id)}
                    </div>
                  </td>
                  <td style="text-align: left;">
                    <div style="font-size: 11px; color: #94A3B8; margin-bottom: 3px;">تاريخ التسجيل:</div>
                    <div style="font-size: 12px; font-weight: 600; color: #E2E8F0;">
                      ${dateFormatted}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Customer & Delivery Information -->
          <tr>
            <td style="padding: 10px 28px 15px;">
              <h2 style="font-size: 14px; font-weight: 800; color: #D4AF37; margin: 15px 0 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 6px;">
                بيانات العميل والشحن
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 13px; line-height: 1.8;">
                <tr>
                  <td width="30%" style="color: #94A3B8;">اسم العميل:</td>
                  <td style="color: #F8F9FA; font-weight: bold;">${escapeHtml(order.customerName)}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8;">رقم الهاتف:</td>
                  <td style="color: #F8F9FA; font-family: monospace; font-weight: bold;">${escapeHtml(order.phone)}</td>
                </tr>
                ${
                  order.customerEmail
                    ? `<tr><td style="color: #94A3B8;">البريد الإلكتروني:</td><td style="color: #F8F9FA; font-family: monospace;">${escapeHtml(order.customerEmail)}</td></tr>`
                    : ""
                }
                <tr>
                  <td style="color: #94A3B8;">المحافظة:</td>
                  <td style="color: #F8F9FA;">${escapeHtml(order.governorate)}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8;">العنوان بالتفصيل:</td>
                  <td style="color: #F8F9FA;">${escapeHtml(order.address)}</td>
                </tr>
                <tr>
                  <td style="color: #94A3B8;">طريقة الدفع:</td>
                  <td style="color: #F5E296; font-weight: bold;">
                    ${order.paymentMethod === "WHATSAPP" ? "طلب مباشر وموثق عبر واتساب" : "الدفع عند الاستلام (COD) مع حق المعاينة"}
                  </td>
                </tr>
                ${
                  order.notes
                    ? `<tr><td style="color: #94A3B8;">ملاحظات / إهداء:</td><td style="color: #FDE68A; background-color: rgba(212, 175, 55, 0.1); padding: 4px 8px; border-radius: 6px;">${escapeHtml(order.notes)}</td></tr>`
                    : ""
                }
              </table>
            </td>
          </tr>

          <!-- Items Breakdown Table -->
          <tr>
            <td style="padding: 10px 28px 15px;">
              <h2 style="font-size: 14px; font-weight: 800; color: #D4AF37; margin: 15px 0 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 6px;">
                تفاصيل العطور المختارة
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; width: 100%; border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 10px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #13161F; border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
                    <th style="padding: 10px 14px; text-align: right; font-size: 12px; color: #D4AF37;">المنتج</th>
                    <th style="padding: 10px 14px; text-align: center; font-size: 12px; color: #D4AF37;">الكمية</th>
                    <th style="padding: 10px 14px; text-align: left; font-size: 12px; color: #D4AF37;">السعر</th>
                    <th style="padding: 10px 14px; text-align: left; font-size: 12px; color: #D4AF37;">الإجمالي</th>
                  </tr>
                </thead>
                <tbody style="background-color: #0D0F14;">
                  ${itemsRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Financial Totals Box -->
          <tr>
            <td style="padding: 10px 28px 25px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #13161F; border: 1px solid #D4AF37; border-radius: 14px; padding: 18px 22px;">
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #94A3B8;">المجموع الفرعي:</td>
                  <td style="padding: 4px 0; text-align: left; font-size: 14px; color: #F8F9FA; font-family: monospace;">
                    ${order.subtotal.toLocaleString("ar-EG")} ج.م
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #94A3B8;">تكلفة الشحن والتوصيل:</td>
                  <td style="padding: 4px 0; text-align: left; font-size: 13px;">
                    ${shippingPhrase}
                  </td>
                </tr>
                <tr style="border-top: 1px dashed rgba(212, 175, 55, 0.4);">
                  <td style="padding: 12px 0 0; font-size: 15px; font-weight: 800; color: #F8F9FA;">
                    الإجمالي النهائي المستحق:
                  </td>
                  <td style="padding: 12px 0 0; text-align: left; font-size: 20px; font-weight: 900; color: #F5E296; font-family: monospace;">
                    ${order.total.toLocaleString("ar-EG")} ج.م
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Luxury Assurances Banner -->
          <tr>
            <td style="padding: 0 28px 25px;">
              <div style="background-color: #08090C; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; padding: 14px 18px; text-align: center; color: #FFFFFF;">
                <p style="margin: 0; font-size: 12px; color: #E2E8F0; line-height: 1.6;">
                  👑 <strong>مزايا استثنائية لعملاء أمير ستور:</strong>
                  تغليف هدايا ملكي فاخر مجاني، مع عينة تجربة مرفقة وحق المعاينة الكاملة للعطر والتأكد من نقائه وثباته (72 ساعة) قبل السداد لمندوب الشحن.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer Information -->
          <tr>
            <td style="background-color: #10131A; padding: 22px 28px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);">
              <p style="margin: 0 0 6px; font-size: 12px; color: #F8F9FA; font-weight: bold;">
                خدمة العملاء ومتابعة الشحن والتوصيل (24/7):
              </p>
              <p style="margin: 0 0 10px; font-size: 13px; color: #D4AF37; font-weight: bold; font-family: monospace;">
                هاتف / واتساب: <a href="https://wa.me/201220086002" style="color: #D4AF37; text-decoration: none;">01220086002</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #94A3B8;">
                أمير ستور — فخامة تدوم مع كل قطرة • أصالة العود النقي • جمهورية مصر العربية
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
  `.trim();
}

/**
 * Sends transactional order confirmation emails via Resend:
 * 1. Invoice to customer if email is provided.
 * 2. Notification to verified store administrator(s).
 *
 * If RESEND_API_KEY is not configured, it gracefully logs a simulated
 * delivery in development without failing or interrupting the order checkout.
 */
export async function sendOrderEmails(order: Order): Promise<{
  customerResult?: SendEmailResult;
  adminResult?: SendEmailResult;
  simulated?: boolean;
}> {
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Amir Store <onboarding@resend.dev>";
  const adminEmails = env.auth.adminEmails;

  // 1. Simulation fallback when RESEND_API_KEY is not configured
  if (!isEmailConfigured()) {
    console.log(
      `[Email Service - Dev Simulation] RESEND_API_KEY not configured. Simulated invoice delivery for order ${order.id}:\n` +
      `  • To Customer: ${order.customerEmail || "(none provided)"}\n` +
      `  • To Admins: ${adminEmails.join(", ")}\n` +
      `  • Total: ${order.total} EGP`
    );
    return {
      simulated: true,
      customerResult: { success: true, simulated: true },
      adminResult: { success: true, simulated: true },
    };
  }

  const resend = getResendClient();
  if (!resend) {
    return {
      simulated: true,
      customerResult: { success: false, error: "Resend client initialization failed" },
    };
  }

  const results: {
    customerResult?: SendEmailResult;
    adminResult?: SendEmailResult;
    simulated?: boolean;
  } = {};

  // 2. Send invoice to Customer if email was provided
  if (order.customerEmail && order.customerEmail.includes("@")) {
    try {
      const customerHtml = generateOrderInvoiceHtml(order, { forAdmin: false });
      const res = await resend.emails.send({
        from: fromEmail,
        to: order.customerEmail,
        subject: `فاتورة طلبك رقم ${order.id} | أمير ستور للعطور الفاخرة`,
        html: customerHtml,
      });

      if (res.error) {
        console.warn("[Email Service] Resend customer email error:", res.error);
        results.customerResult = { success: false, error: res.error.message };
      } else {
        results.customerResult = { success: true, messageId: res.data?.id };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("[Email Service] Customer email failed:", msg);
      results.customerResult = { success: false, error: msg };
    }
  }

  // 3. Send order notification to Store Administrator(s)
  if (adminEmails.length > 0) {
    try {
      const adminHtml = generateOrderInvoiceHtml(order, { forAdmin: true });
      // In Resend free onboarding domain, sending is restricted to verified account holder
      const adminRecipients: string | string[] = fromEmail.includes("onboarding@resend.dev")
        ? adminEmails[0]
        : (adminEmails.length === 1 ? adminEmails[0] : adminEmails);

      const res = await resend.emails.send({
        from: fromEmail,
        to: adminRecipients,
        subject: `🔔 طلب شراء جديد [${order.id}] بمبلغ ${order.total.toLocaleString("ar-EG")} ج.م — أمير ستور`,
        html: adminHtml,
      });

      if (res.error) {
        console.warn("[Email Service] Resend admin email error:", res.error);
        results.adminResult = { success: false, error: res.error.message };
      } else {
        results.adminResult = { success: true, messageId: res.data?.id };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("[Email Service] Admin email failed:", msg);
      results.adminResult = { success: false, error: msg };
    }
  }

  return results;
}
