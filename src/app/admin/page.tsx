import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/data/catalog";
import { getProductsStore } from "@/lib/products-store";
import { getContactRequests } from "@/lib/contact-requests";
import { getOrders } from "@/lib/orders-store";
import { Sparkles, Layers, Inbox, ArrowLeft, ShoppingBag, Truck } from "lucide-react";

export const metadata = {
  title: "لوحة المتابعة المركزية | أمير ستور",
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
  const totalRevenue = orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.status === "PROCESSING" || o.status === "SHIPPED"
  ).length;

  return (
    <div className="space-y-8 text-start">
      {/* Welcome & Context Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-900 tracking-tight">
          لوحة المتابعة وإدارة متجر أمير ستور
        </h1>
        <p className="text-sm text-brand-neutral-500 mt-1">
          نظرة عامة على طلبات العطور والشحن، الكتالوج، وإحصائيات المبيعات الحقيقية.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Orders Card (Most important for e-commerce) */}
        <Link
          href="/admin/orders"
          className="rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50/60 to-white p-5 shadow-sm space-y-2 hover:border-amber-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">طلبات العطور والشحن</span>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 group-hover:scale-110 transition-transform">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-950">{totalOrdersCount}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-800 font-extrabold">
              {newOrdersCount} طلبات جديدة
            </span>
            <span className="text-brand-neutral-400 group-hover:text-amber-800 flex items-center gap-0.5">
              <span>إدارة الطلبات</span>
              <ArrowLeft className="h-3 w-3" />
            </span>
          </div>
        </Link>

        {/* Catalog Products */}
        <div className="rounded-2xl border border-brand-neutral-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-neutral-500">عطور الكتالوج</span>
            <div className="p-2 rounded-lg bg-brand-green-100 text-brand-green-800">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-brand-neutral-900">{totalProducts}</p>
          <span className="text-xs text-brand-green-700 font-semibold">
            {publishedProducts} عطور معروضة للجمهور
          </span>
        </div>

        {/* Categories */}
        <div className="rounded-2xl border border-brand-neutral-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-neutral-500">أقسام المتجر</span>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-brand-neutral-900">{categories.length}</p>
          <span className="text-xs text-brand-neutral-500">دهن عود، شرقي، فرنسي، مسك</span>
        </div>

        {/* Delivered Revenue */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">إجمالي المبيعات المحصلة</span>
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-950">
            {totalRevenue.toLocaleString("ar-EG")} <span className="text-xs font-bold">ج.م</span>
          </p>
          <span className="text-xs text-emerald-700 font-semibold">
            {pendingOrdersCount} طلبات قيد الشحن مع المناديب
          </span>
        </div>
      </div>

      {/* Two-Column Section: Recent Orders & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Table */}
        <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-brand-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-amber-700" />
              <h2 className="text-base font-bold text-brand-neutral-900">
                أحدث طلبات العطور المسجلة
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-brand-green-700 hover:underline flex items-center gap-1"
            >
              عرض الكل ({orders.length})
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-xs text-brand-neutral-400 text-center py-6">
                لا توجد طلبات جديدة حتى الآن.
              </p>
            ) : (
              orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="p-3.5 rounded-xl border border-brand-neutral-200 bg-brand-neutral-50 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-green-950">{order.id}</span>
                      <span className="font-bold text-brand-neutral-800">• {order.customerName}</span>
                    </div>
                    <span className="text-[11px] text-brand-neutral-500 mt-0.5 block">
                      {order.governorate} • {order.items.length} منتجات
                    </span>
                  </div>
                  <div className="text-end">
                    <span className="font-bold text-brand-green-950 block">
                      {order.total.toLocaleString("ar-EG")} ج.م
                    </span>
                    <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                      {order.status === "NEW" ? "جديد" : order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Contact Inquiries */}
        <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-brand-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-brand-green-700" />
              <h2 className="text-base font-bold text-brand-neutral-900">
                استفسارات العملاء والطلبات الخاصة
              </h2>
            </div>
            <Link
              href="/admin/contact-requests"
              className="text-xs font-bold text-brand-green-700 hover:underline flex items-center gap-1"
            >
              عرض الكل ({requests.length})
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {requests.length === 0 ? (
              <p className="text-xs text-brand-neutral-400 text-center py-6">
                لا توجد استفسارات معلقة.
              </p>
            ) : (
              requests.slice(0, 4).map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl border border-brand-neutral-200 bg-brand-neutral-50 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-brand-neutral-900">{req.name}</span>
                    <span className="text-[10px] text-brand-neutral-400 font-mono">{req.phone}</span>
                  </div>
                  <p className="text-xs text-brand-neutral-600 line-clamp-1">{req.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
