import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/data/catalog";
import { getProductsStore } from "@/lib/products-store";
import { getContactRequests } from "@/lib/contact-requests";
import { getOrders } from "@/lib/orders-store";
import {
  Sparkles,
  Layers,
  Inbox,
  ArrowLeft,
  ShoppingBag,
  TrendingUp,
  Package,
  Clock,
  ShieldCheck,
  Star,
  ExternalLink,
  PlusCircle,
} from "lucide-react";

export const metadata = {
  title: "مركز قيادة الدار الملكية (Command Center) | أمير ستور",
};

export default async function AdminDashboardPage() {
  const products = await getProductsStore();
  const categories = CATEGORIES;
  const requests = getContactRequests();
  const orders = await getOrders();

  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.published).length;
  const totalOrdersCount = orders.length;
  const newOrdersCount = orders.filter((o) => o.status === "NEW").length;
  const processingOrdersCount = orders.filter((o) => o.status === "PROCESSING").length;
  const deliveredOrdersCount = orders.filter((o) => o.status === "DELIVERED").length;
  const totalRevenue = orders
    .filter((o) => o.status === "DELIVERED" || o.status === "NEW" || o.status === "PROCESSING")
    .reduce((sum, o) => sum + o.total, 0);
  const pendingRequestsCount = requests.filter((r) => r.status === "NEW").length;

  return (
    <div className="min-h-screen bg-admin-bg text-stone-200 font-sans">
      {/* Top Header Plinth (Design 3 Command Center Style) */}
      <header className="sticky top-0 z-40 bg-admin-surface/95 backdrop-blur-xl border-b border-admin-border px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-admin-gold to-gold-300 shadow-md">
              <div className="w-full h-full rounded-full bg-admin-bg flex items-center justify-center text-xl">
                👑
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-white tracking-wide">AMIR STORE</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Vault
                </span>
              </div>
              <p className="text-xs text-admin-sand tracking-widest uppercase">
                Zamalek Flagship & Vault Command Center · مركز قيادة المتجر
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 rounded-xl bg-admin-card hover:bg-admin-border border border-admin-border text-xs text-admin-sand hover:text-white transition-all flex items-center gap-1.5"
            >
              <span>معاينة المتجر الحي</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/admin/products"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-admin-gold to-gold-400 text-obsidian-950 font-bold text-xs shadow-gold-glow flex items-center gap-1.5 hover:scale-105 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>إضافة قارورة عطر جديدة</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Command Center Workstation */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-10">
        {/* KPI Scoreboard (4 Luminous Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Realized Revenue */}
          <div className="p-6 rounded-2xl bg-admin-surface border border-admin-border relative overflow-hidden shadow-admin-card group hover:border-admin-gold transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-serif text-admin-sand uppercase tracking-wider">إجمالي الإيرادات المقدرة</span>
              <div className="w-8 h-8 rounded-lg bg-admin-card flex items-center justify-center text-admin-gold">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1">
              {totalRevenue.toLocaleString("ar-EG")} <span className="text-sm font-sans font-normal text-admin-gold">ج.م</span>
            </div>
            <p className="text-[11px] text-stone-400">من إجمالي {totalOrdersCount} طلب مسجل بالمنظومة</p>
          </div>

          {/* 2. Active Orders Awaiting */}
          <div className="p-6 rounded-2xl bg-admin-surface border border-admin-border relative overflow-hidden shadow-admin-card group hover:border-admin-gold transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-serif text-admin-sand uppercase tracking-wider">طلبات بانتظار الشحن</span>
              <div className="w-8 h-8 rounded-lg bg-admin-card flex items-center justify-center text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-300 mb-1">
              {newOrdersCount + processingOrdersCount} <span className="text-sm font-sans font-normal text-stone-400">طلبية</span>
            </div>
            <p className="text-[11px] text-stone-400">
              {newOrdersCount} جديد · {processingOrdersCount} قيد التجهيز · {deliveredOrdersCount} تم التسليم
            </p>
          </div>

          {/* 3. Catalog Vault Flacons */}
          <div className="p-6 rounded-2xl bg-admin-surface border border-admin-border relative overflow-hidden shadow-admin-card group hover:border-admin-gold transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-serif text-admin-sand uppercase tracking-wider">قوارير العطور بالمخزن</span>
              <div className="w-8 h-8 rounded-lg bg-admin-card flex items-center justify-center text-admin-gold">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1">
              {publishedProducts} <span className="text-sm font-sans font-normal text-stone-400">/ {totalProducts} معروض</span>
            </div>
            <p className="text-[11px] text-stone-400">عبر {categories.length} أقسام عطرية ملكية معتمدة</p>
          </div>

          {/* 4. Client Advisory Requests */}
          <div className="p-6 rounded-2xl bg-admin-surface border border-admin-border relative overflow-hidden shadow-admin-card group hover:border-admin-gold transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-serif text-admin-sand uppercase tracking-wider">استفسارات الكونسيرج</span>
              <div className="w-8 h-8 rounded-lg bg-admin-card flex items-center justify-center text-teal-400">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-teal-300 mb-1">
              {pendingRequestsCount} <span className="text-sm font-sans font-normal text-stone-400">معلق</span>
            </div>
            <p className="text-[11px] text-stone-400">إجمالي الوارد: {requests.length} رسالة واستشارة خاصة</p>
          </div>
        </div>

        {/* Navigation Modules (Pillar Hubs) */}
        <div>
          <h2 className="text-sm font-serif font-bold text-admin-sand uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-admin-gold" />
            أقسام الإدارة والتحكم السريع:
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              href="/admin/orders"
              className="p-4 rounded-xl bg-admin-surface border border-admin-border hover:border-admin-gold hover:bg-admin-card transition-all text-center group"
            >
              <ShoppingBag className="w-6 h-6 text-admin-gold mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white mb-0.5">الطلبات والشحن</div>
              <div className="text-[10px] text-stone-400">{orders.length} طلبية</div>
            </Link>

            <Link
              href="/admin/products"
              className="p-4 rounded-xl bg-admin-surface border border-admin-border hover:border-admin-gold hover:bg-admin-card transition-all text-center group"
            >
              <Package className="w-6 h-6 text-admin-gold mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white mb-0.5">كتالوج العطور</div>
              <div className="text-[10px] text-stone-400">{products.length} منتج</div>
            </Link>

            <Link
              href="/admin/categories"
              className="p-4 rounded-xl bg-admin-surface border border-admin-border hover:border-admin-gold hover:bg-admin-card transition-all text-center group"
            >
              <Layers className="w-6 h-6 text-admin-gold mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white mb-0.5">التصنيفات الملكية</div>
              <div className="text-[10px] text-stone-400">{categories.length} أقسام</div>
            </Link>

            <Link
              href="/admin/contact-requests"
              className="p-4 rounded-xl bg-admin-surface border border-admin-border hover:border-admin-gold hover:bg-admin-card transition-all text-center group"
            >
              <Inbox className="w-6 h-6 text-admin-gold mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white mb-0.5">الكونسيرج والرسائل</div>
              <div className="text-[10px] text-stone-400">{requests.length} محادثة</div>
            </Link>

            <Link
              href="/admin/reviews"
              className="p-4 rounded-xl bg-admin-surface border border-admin-border hover:border-admin-gold hover:bg-admin-card transition-all text-center group"
            >
              <Star className="w-6 h-6 text-admin-gold mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white mb-0.5">آراء النخبة</div>
              <div className="text-[10px] text-stone-400">إدارة التقييمات</div>
            </Link>

            <Link
              href="/admin/audit"
              className="p-4 rounded-xl bg-admin-surface border border-admin-border hover:border-admin-gold hover:bg-admin-card transition-all text-center group"
            >
              <ShieldCheck className="w-6 h-6 text-admin-gold mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white mb-0.5">سجل الأمان</div>
              <div className="text-[10px] text-stone-400">Audit Vault</div>
            </Link>
          </div>
        </div>

        {/* Live Orders Queue Table */}
        <div className="p-6 rounded-2xl bg-admin-surface border border-admin-border shadow-admin-card">
          <div className="flex items-center justify-between pb-4 border-b border-admin-border mb-6">
            <div>
              <h2 className="text-lg font-serif font-bold text-white">طابور الطلبات الواردة (Live Orders Queue)</h2>
              <p className="text-xs text-stone-400 mt-0.5">متابعة فورية للطلبات الواردة وإدارتها بنقرة واحدة</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-admin-gold hover:text-gold-200 flex items-center gap-1"
            >
              <span>عرض كافة الطلبات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-sm">
              لا توجد طلبات مسجلة حالياً في النظام.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-admin-border text-admin-sand text-[11px] uppercase tracking-wider">
                    <th className="pb-3 pr-2">رقم الطلب</th>
                    <th className="pb-3">العميل والمحافظة</th>
                    <th className="pb-3">المنتجات</th>
                    <th className="pb-3">الإجمالي</th>
                    <th className="pb-3">طريقة الدفع</th>
                    <th className="pb-3">الحالة</th>
                    <th className="pb-3 text-left pl-2">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border/50">
                  {orders.slice(0, 8).map((order) => (
                    <tr key={order.id} className="hover:bg-admin-card/50 transition-colors">
                      <td className="py-3.5 pr-2 font-mono font-bold text-admin-gold">{order.id}</td>
                      <td className="py-3.5">
                        <div className="font-bold text-white">{order.customerName}</div>
                        <div className="text-[11px] text-stone-400">
                          {order.governorate} · {order.phone}
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className="text-stone-300">
                          {order.items.length} قارورة (
                          {order.items.map((i) => i.name).slice(0, 2).join("، ")}
                          {order.items.length > 2 ? "..." : ""})
                        </span>
                      </td>
                      <td className="py-3.5 font-bold text-white">
                        {order.total.toLocaleString("ar-EG")} ج.م
                      </td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 rounded-full bg-admin-card border border-admin-border text-[11px] text-stone-300">
                          {order.paymentMethod === "COD" ? "الدفع عند الاستلام" : "طلب عبر واتساب"}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.status === "NEW"
                              ? "bg-amber-950 text-amber-300 border border-amber-600/40"
                              : order.status === "PROCESSING"
                              ? "bg-blue-950 text-blue-300 border border-blue-600/40"
                              : order.status === "DELIVERED"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-600/40"
                              : "bg-red-950 text-red-300 border border-red-600/40"
                          }`}
                        >
                          {order.status === "NEW"
                            ? "جديد"
                            : order.status === "PROCESSING"
                            ? "قيد التجهيز"
                            : order.status === "DELIVERED"
                            ? "تم التسليم"
                            : "ملغي"}
                        </span>
                      </td>
                      <td className="py-3.5 text-left pl-2">
                        <Link
                          href="/admin/orders"
                          className="px-3 py-1 rounded-lg bg-admin-card hover:bg-admin-gold hover:text-obsidian-950 text-stone-300 transition-colors text-[11px] font-semibold"
                        >
                          تعديل
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
