"use client";

import React, { useState } from "react";
import { Order, OrderStatus } from "@/types/order";
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  MessageCircle,
  Search,
  MapPin,
  Calendar,
  ChevronDown,
  Mail,
} from "lucide-react";

interface OrdersManagerProps {
  initialOrders: Order[];
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; border: string; icon: React.ElementType }
> = {
  NEW: {
    label: "طلب جديد",
    color: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: Clock,
  },
  PROCESSING: {
    label: "قيد التجهيز",
    color: "text-blue-800",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: ShoppingBag,
  },
  SHIPPED: {
    label: "تم الشحن مع المندوب",
    color: "text-purple-800",
    bg: "bg-purple-50",
    border: "border-purple-200",
    icon: Truck,
  },
  DELIVERED: {
    label: "تم الاستلام والتحصيل",
    color: "text-emerald-800",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "ملغي",
    color: "text-red-800",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: XCircle,
  },
};

export function OrdersManager({ initialOrders }: OrdersManagerProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const totalOrders = orders.length;
  const newOrdersCount = orders.filter((o) => o.status === "NEW").length;
  const deliveredRevenue = orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter(
    (o) => o.status === "PROCESSING" || o.status === "SHIPPED"
  ).length;

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = activeFilter === "ALL" || order.status === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.phone.includes(q) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(q)) ||
      order.governorate.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) throw new Error("فشل تحديث الحالة");
      const data = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: data.order.status } : o))
      );
    } catch {
      alert("حدث خطأ أثناء تحديث حالة الطلب.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getCustomerWhatsAppUrl = (order: Order) => {
    const clean = order.phone.replace(/[^0-9]/g, "");
    const formatted = clean.startsWith("0") ? `2${clean}` : clean;
    const msg = encodeURIComponent(
      `مرحباً بك يا ${order.customerName} من متجر أمير ستور للعطور.\nبخصوص طلبك رقم (${order.id}) بإجمالي ${order.total.toLocaleString("ar-EG")} ج.م.\nنود إفادتك بأن حالة طلبك الآن هي: ${STATUS_CONFIG[order.status].label}. شكراً لاختيارك أمير ستور!`
    );
    return `https://wa.me/${formatted}?text=${msg}`;
  };

  return (
    <div className="space-y-8 text-start">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-900 tracking-tight">
          إدارة طلبات العطور (Orders Management)
        </h1>
        <p className="text-sm text-brand-neutral-500 mt-1">
          متابعة الطلبات الواردة، تحديث حالات الشحن، والتواصل المباشر مع العملاء.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-brand-neutral-200 bg-white p-5 shadow-sm space-y-1">
          <span className="text-xs font-bold text-brand-neutral-500">إجمالي الطلبات</span>
          <p className="text-3xl font-black text-brand-green-950">{totalOrders}</p>
          <span className="text-[11px] text-brand-neutral-400">كافة الأوردرات المسجلة</span>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm space-y-1">
          <span className="text-xs font-bold text-amber-800">طلبات جديدة بحاجة للمراجعة</span>
          <p className="text-3xl font-black text-amber-900">{newOrdersCount}</p>
          <span className="text-[11px] text-amber-700">بانتظار التأكيد والتجهيز</span>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-sm space-y-1">
          <span className="text-xs font-bold text-blue-800">جاري التجهيز والشحن</span>
          <p className="text-3xl font-black text-blue-900">{pendingCount}</p>
          <span className="text-[11px] text-blue-700">مع شركات الشحن أو بالمقر</span>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm space-y-1">
          <span className="text-xs font-bold text-emerald-800">إجمالي المحصل (تم التسليم)</span>
          <p className="text-3xl font-black text-emerald-900">
            {deliveredRevenue.toLocaleString("ar-EG")}{" "}
            <span className="text-xs font-bold">ج.م</span>
          </p>
          <span className="text-[11px] text-emerald-700">مبيعات فعلية مستلمة</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-brand-neutral-200 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث برقم الطلب، الاسم، أو الهاتف..."
            className="w-full ps-9 pe-3 py-2 rounded-xl border border-brand-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-green-700"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: "ALL", label: "الكل" },
            { id: "NEW", label: "جديد" },
            { id: "PROCESSING", label: "قيد التجهيز" },
            { id: "SHIPPED", label: "تم الشحن" },
            { id: "DELIVERED", label: "تم التسليم" },
            { id: "CANCELLED", label: "ملغي" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-brand-green-800 text-white shadow-2xs"
                  : "bg-brand-neutral-100 text-brand-neutral-700 hover:bg-brand-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-brand-neutral-200 bg-white p-12 text-center space-y-3">
            <ShoppingBag className="h-12 w-12 text-brand-neutral-300 mx-auto" />
            <h4 className="text-base font-bold text-brand-neutral-800">
              لا توجد طلبات تطابق الفلتر الحالي
            </h4>
            <p className="text-xs text-brand-neutral-500">
              عندما يقوم العملاء بطلب عطور من المتجر ستظهر جميع التفاصيل هنا لحظياً.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.NEW;
            const StatusIcon = config.icon;

            return (
              <div
                key={order.id}
                className="rounded-3xl border border-brand-neutral-200 bg-white p-5 sm:p-6 shadow-sm hover:border-brand-green-300 transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-brand-neutral-100">
                  <div className="flex items-center gap-3">
                    <span className="text-base sm:text-lg font-black text-brand-green-950 font-serif">
                      {order.id}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.bg} ${config.color} ${config.border}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      <span>{config.label}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-brand-neutral-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-brand-neutral-400" />
                      <span>{new Date(order.createdAt).toLocaleString("ar-EG")}</span>
                    </span>
                  </div>
                </div>

                {/* Customer Details & Items Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Customer Info */}
                  <div className="lg:col-span-5 space-y-2 text-xs bg-brand-neutral-50 p-4 rounded-2xl border border-brand-neutral-200/60">
                    <div className="font-extrabold text-sm text-brand-green-950">
                      {order.customerName}
                    </div>
                    <div className="flex items-center gap-2 text-brand-neutral-700">
                      <Phone className="h-3.5 w-3.5 text-brand-green-800 shrink-0" />
                      <a
                        href={`tel:${order.phone}`}
                        className="hover:underline font-mono font-bold"
                        dir="ltr"
                      >
                        {order.phone}
                      </a>
                    </div>
                    {order.customerEmail && (
                      <div className="flex items-center gap-2 text-brand-neutral-700">
                        <Mail className="h-3.5 w-3.5 text-brand-gold-600 shrink-0" />
                        <a
                          href={`mailto:${order.customerEmail}`}
                          className="hover:underline font-mono text-[11px]"
                          dir="ltr"
                        >
                          {order.customerEmail}
                        </a>
                      </div>
                    )}
                    <div className="flex items-start gap-2 text-brand-neutral-700">
                      <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>{order.governorate}:</strong> {order.address}
                      </span>
                    </div>
                    {order.notes && (
                      <div className="p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-[11px]">
                        <strong>ملاحظة العميل / الإهداء:</strong> {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="lg:col-span-7 space-y-2">
                    <span className="text-xs font-bold text-brand-neutral-500 block">
                      المنتجات المطلوبة ({order.items.reduce((s, i) => s + i.quantity, 0)} قطع):
                    </span>
                    <div className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-brand-neutral-200 bg-white text-xs"
                        >
                          <div>
                            <span className="font-bold text-brand-green-950">
                              {item.name}
                            </span>
                            {item.model && (
                              <span className="text-[10px] text-brand-neutral-500 ms-2">
                                ({item.model})
                              </span>
                            )}
                          </div>
                          <div className="font-mono font-bold text-brand-green-900">
                            {item.quantity} × {item.price.toLocaleString("ar-EG")} ={" "}
                            {(item.price * item.quantity).toLocaleString("ar-EG")} ج.م
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Summary */}
                    <div className="pt-2 flex items-center justify-between text-xs font-bold border-t border-brand-neutral-100">
                      <span className="text-brand-neutral-600">
                        الشحن: {order.shippingCost === 0 ? "مجاني" : `${order.shippingCost} ج.م`}
                      </span>
                      <span className="text-sm font-black text-brand-green-950">
                        الإجمالي المطلوب: {order.total.toLocaleString("ar-EG")} ج.م (دفع عند الاستلام)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Action Bar */}
                <div className="pt-3 border-t border-brand-neutral-100 flex flex-wrap items-center justify-between gap-3">
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-brand-neutral-700">
                      تغيير الحالة:
                    </label>
                    <div className="relative">
                      <select
                        disabled={updatingId === order.id}
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="appearance-none ps-3 pe-8 py-1.5 rounded-xl border border-brand-neutral-300 text-xs font-bold text-brand-green-950 bg-white focus:outline-none focus:ring-2 focus:ring-brand-green-700 cursor-pointer disabled:opacity-50"
                      >
                        <option value="NEW">طلب جديد</option>
                        <option value="PROCESSING">قيد التجهيز</option>
                        <option value="SHIPPED">تم الشحن مع المندوب</option>
                        <option value="DELIVERED">تم الاستلام والتحصيل</option>
                        <option value="CANCELLED">ملغي</option>
                      </select>
                      <ChevronDown className="absolute end-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-neutral-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Customer WhatsApp Action */}
                  <a
                    href={getCustomerWhatsAppUrl(order)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white font-bold text-xs shadow-2xs active:scale-95 transition-all"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>مراسلة العميل وتأكيد الشحن</span>
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
