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
      <tr style="border-bottom: 1px solid #EFEAE2;">
        <td style="padding: 12px 14px; text-align: right; font-size: 13px; color: #1F241C; font-weight: bold;">
          ${escapeHtml(item.name)}
          <div style="font-size: 11px; color: #7A8074; font-weight: normal; margin-top: 3px;">
            ${escapeHtml(item.model || "الحجم القياسي")}
          </div>
        </td>
        <td style="padding: 12px 14px; text-align: center; font-size: 13px; color: #1F241C;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 14px; text-align: left; font-size: 13px; color: #1F241C; font-family: monospace;">
          ${item.price.toLocaleString("ar-EG")} ج.م
        </td>
        <td style="padding: 12px 14px; text-align: left; font-size: 13px; color: #9A7B1C; font-weight: bold; font-family: monospace;">
          ${(item.price * item.quantity).toLocaleString("ar-EG")} ج.م
        </td>
      </tr>
    `
    )
    .join("");

  const shippingPhrase =
    order.shippingCost === 0
      ? '<span style="color: #15803d; font-weight: bold;">شحن مجاني 🎁</span>'
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
<body style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Cairo', Tahoma, Arial, sans-serif; direction: rtl; text-align: right; color: #1C2117;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F1EA; padding: 25px 10px;">
    <tr>
      <td align="center">
        <!-- Main Container Card -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #E5DFD3;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #1A2215; padding: 35px 25px 30px; text-align: center; border-bottom: 3px solid #D4AF37;">
              <div style="display: inline-block; padding: 6px 14px; background-color: rgba(212, 175, 55, 0.15); border: 1px solid #D4AF37; border-radius: 30px; color: #F3E5AB; font-size: 11px; letter-spacing: 2px; margin-bottom: 12px; font-weight: bold;">
                AMIR STORE • LUXURY PERFUMES
              </div>
              <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                أمير ستور للعطور والعود الفاخر
              </h1>
              <p style="margin: 6px 0 0; color: #D4AF37; font-size: 13px;">
                ${isAdmin ? "🔔 إشعار تسجيل طلب شراء جديد عبر المنصة" : "فاتورة شراء رسمية وتأكيد استلام الطلب"}
              </p>
            </td>
          </tr>

          <!-- Order Identity Badge -->
          <tr>
            <td style="padding: 24px 28px 10px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF8F5; border: 1px solid #EBE4D8; border-radius: 14px; padding: 16px 20px;">
                <tr>
                  <td style="text-align: right;">
                    <div style="font-size: 11px; color: #7B8275; margin-bottom: 3px;">رقم الطلب الرسمي:</div>
                    <div style="font-size: 20px; font-weight: 900; color: #1A2215; letter-spacing: 1px; font-family: monospace;">
                      ${escapeHtml(order.id)}
                    </div>
                  </td>
                  <td style="text-align: left;">
                    <div style="font-size: 11px; color: #7B8275; margin-bottom: 3px;">تاريخ التسجيل:</div>
                    <div style="font-size: 12px; font-weight: 600; color: #394232;">
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
              <h2 style="font-size: 14px; font-weight: 800; color: #1A2215; margin: 15px 0 10px; border-bottom: 1px solid #EBE4D8; padding-bottom: 6px;">
                بيانات العميل والتوصيل
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 13px; line-height: 1.8;">
                <tr>
                  <td width="30%" style="color: #7B8275;">اسم العميل:</td>
                  <td style="color: #1A2215; font-weight: bold;">${escapeHtml(order.customerName)}</td>
                </tr>
                <tr>
                  <td style="color: #7B8275;">رقم الهاتف:</td>
                  <td style="color: #1A2215; font-family: monospace; font-weight: bold;">${escapeHtml(order.phone)}</td>
                </tr>
                ${
                  order.customerEmail
                    ? `<tr><td style="color: #7B8275;">البريد الإلكتروني:</td><td style="color: #1A2215; font-family: monospace;">${escapeHtml(order.customerEmail)}</td></tr>`
                    : ""
                }
                <tr>
                  <td style="color: #7B8275;">المحافظة:</td>
                  <td style="color: #1A2215;">${escapeHtml(order.governorate)}</td>
                </tr>
                <tr>
                  <td style="color: #7B8275;">العنوان بالتفصيل:</td>
                  <td style="color: #1A2215;">${escapeHtml(order.address)}</td>
                </tr>
                <tr>
                  <td style="color: #7B8275;">طريقة الدفع:</td>
                  <td style="color: #1A2215; font-weight: bold;">
                    ${order.paymentMethod === "WHATSAPP" ? "طلب مباشر وموثق عبر واتساب" : "الدفع عند الاستلام (COD) مع حق المعاينة"}
                  </td>
                </tr>
                ${
                  order.notes
                    ? `<tr><td style="color: #7B8275;">ملاحظات / إهداء:</td><td style="color: #856404; background-color: #FFF9E6; padding: 4px 8px; border-radius: 6px;">${escapeHtml(order.notes)}</td></tr>`
                    : ""
                }
              </table>
            </td>
          </tr>

          <!-- Items Breakdown Table -->
          <tr>
            <td style="padding: 10px 28px 15px;">
              <h2 style="font-size: 14px; font-weight: 800; color: #1A2215; margin: 15px 0 10px; border-bottom: 1px solid #EBE4D8; padding-bottom: 6px;">
                تفاصيل العطور المختارة
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; width: 100%; border: 1px solid #EBE4D8; border-radius: 10px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #FAF8F5; border-bottom: 1px solid #EBE4D8;">
                    <th style="padding: 10px 14px; text-align: right; font-size: 12px; color: #5B6355;">المنتج</th>
                    <th style="padding: 10px 14px; text-align: center; font-size: 12px; color: #5B6355;">الكمية</th>
                    <th style="padding: 10px 14px; text-align: left; font-size: 12px; color: #5B6355;">السعر</th>
                    <th style="padding: 10px 14px; text-align: left; font-size: 12px; color: #5B6355;">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Financial Totals Box -->
          <tr>
            <td style="padding: 10px 28px 25px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF8F5; border: 1px solid #D4AF37; border-radius: 14px; padding: 18px 22px;">
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #5B6355;">المجموع الفرعي:</td>
                  <td style="padding: 4px 0; text-align: left; font-size: 14px; color: #1A2215; font-family: monospace;">
                    ${order.subtotal.toLocaleString("ar-EG")} ج.م
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #5B6355;">تكلفة الشحن والتوصيل:</td>
                  <td style="padding: 4px 0; text-align: left; font-size: 13px;">
                    ${shippingPhrase}
                  </td>
                </tr>
                <tr style="border-top: 1px dashed #D4AF37;">
                  <td style="padding: 12px 0 0; font-size: 15px; font-weight: 800; color: #1A2215;">
                    الإجمالي النهائي المستحق:
                  </td>
                  <td style="padding: 12px 0 0; text-align: left; font-size: 20px; font-weight: 900; color: #9A7B1C; font-family: monospace;">
                    ${order.total.toLocaleString("ar-EG")} ج.م
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Luxury Assurances Banner -->
          <tr>
            <td style="padding: 0 28px 25px;">
              <div style="background-color: #1A2215; border-radius: 12px; padding: 14px 18px; text-align: center; color: #FFFFFF;">
                <p style="margin: 0; font-size: 12px; color: #E8E2D6; line-height: 1.6;">
                  👑 <strong>مميزات حصرية لعملاء أمير ستور:</strong>
                  تغليف هدايا ملكي فاخر مجاني، مع إمكانية فحص ومعاينة العطر والتأكد من نقائه وثباته قبل السداد لمندوب الشحن.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer Information -->
          <tr>
            <td style="background-color: #FAF8F5; padding: 22px 28px; text-align: center; border-top: 1px solid #EBE4D8;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #1A2215; font-weight: bold;">
                خدمة العملاء ومتابعة الشحن والتوصيل:
              </p>
              <p style="margin: 0 0 10px; font-size: 13px; color: #9A7B1C; font-weight: bold; font-family: monospace;">
                هاتف / واتساب: <a href="https://wa.me/201220086002" style="color: #9A7B1C; text-decoration: none;">01220086002</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #8F968A;">
                أمير ستور — فخامة تدوم مع كل قطرة • أصالة التراث العربي • جمهورية مصر العربية
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
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
