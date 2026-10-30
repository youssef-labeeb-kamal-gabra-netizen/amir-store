import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/data/catalog";
import { getProductsStore } from "@/lib/products-store";
import { getContactRequests } from "@/lib/contact-requests";
import { getReviewsStore } from "@/lib/reviews-store";
import { Tractor, Layers, Inbox, ArrowLeft, Star } from "lucide-react";

export default function AdminDashboardPage() {
  const products = getProductsStore();
  const categories = CATEGORIES;
  const requests = getContactRequests();
  const reviews = getReviewsStore();

  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.published).length;
  const newRequestsCount = requests.filter((r) => r.status === "NEW").length;
  const pendingReviewsCount = reviews.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-8 text-start">
      {/* Welcome & Context Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-900 tracking-tight">
          لوحة المتابعة وإدارة المنصة
        </h1>
        <p className="text-sm text-brand-neutral-500 mt-1">
          نظرة عامة على الكتالوج، الطلبات الواردة، وإحصائيات العمل الحقيقية.
        </p>
      </div>

      {/* Metrics Grid (Tasks 118, 119, 120 - Real Data, No Fake Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-brand-neutral-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-neutral-500">إجمالي المعدات بالكتالوج</span>
            <div className="p-2 rounded-lg bg-brand-green-100 text-brand-green-800">
              <Tractor className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-brand-neutral-900">{totalProducts}</p>
          <span className="text-xs text-brand-green-700 font-semibold">
            {publishedProducts} معدات معروضة للجمهور
          </span>
        </div>

        <div className="rounded-2xl border border-brand-neutral-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-neutral-500">الأقسام الزراعية</span>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-brand-neutral-900">{categories.length}</p>
          <span className="text-xs text-brand-neutral-500">رش، ري، ديزل، قطع غيار</span>
        </div>

        <div className="rounded-2xl border border-brand-neutral-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-neutral-500">طلبات الاستفسار الواردة</span>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
              <Inbox className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-brand-neutral-900">{requests.length}</p>
          <span className="text-xs text-amber-700 font-bold">
            {newRequestsCount} طلبات جديدة بحاجة للمتابعة
          </span>
        </div>

        <div className="rounded-2xl border border-brand-neutral-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-neutral-500">تقييمات وآراء العملاء</span>
            <div className="p-2 rounded-lg bg-brand-gold-100 text-brand-gold-800">
              <Star className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-brand-neutral-900">{reviews.length}</p>
          <Link
            href="/admin/reviews"
            className="text-xs text-brand-gold-700 font-bold hover:underline inline-block"
          >
            {pendingReviewsCount > 0
              ? `${pendingReviewsCount} تقييمات جديدة بانتظار المراجعة`
              : "جميع التقييمات مفحوصة ومعتمدة"}
          </Link>
        </div>
      </div>

      {/* Two-Column Section: Recent Requests & Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Contact Requests (Tasks 121, 154) */}
        <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-brand-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-brand-green-700" />
              <h2 className="text-base font-bold text-brand-neutral-900">
                أحدث طلبات الاستفسار الواردة
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
            {requests.slice(0, 4).map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-xl border border-brand-neutral-200 bg-brand-neutral-50 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-brand-neutral-900">{req.name}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      req.status === "NEW"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : "bg-brand-green-100 text-brand-green-800"
                    }`}
                  >
                    {req.status === "NEW" ? "جديد" : req.status}
                  </span>
                </div>
                <p className="text-xs text-brand-neutral-600 line-clamp-1">{req.message}</p>
                <div className="flex items-center justify-between text-[11px] text-brand-neutral-400 pt-1">
                  <span>هاتف: {req.phone}</span>
                  <span>{new Date(req.createdAt).toLocaleDateString("ar-EG")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Catalog Highlights (Task 122) */}
        <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-brand-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <Tractor className="h-5 w-5 text-brand-green-700" />
              <h2 className="text-base font-bold text-brand-neutral-900">
                أحدث الآلات والمعدات المسجلة
              </h2>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-brand-green-700 hover:underline flex items-center gap-1"
            >
              إدارة الكتالوج
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {products.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="p-3.5 rounded-xl border border-brand-neutral-200 bg-brand-neutral-50 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-brand-neutral-900 line-clamp-1">
                    {product.name}
                  </h4>
                  <span className="text-xs text-brand-neutral-500">
                    {product.categoryName} {product.model && `• ${product.model}`}
                  </span>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    product.published
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-brand-neutral-200 text-brand-neutral-700"
                  }`}
                >
                  {product.published ? "منشور" : "مسودة"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
