"use client";

import React, { useState } from "react";
import type { CustomerReview, ReviewStatus } from "@/data/reviews";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  MapPin,
  Wrench,
  Clock,
} from "lucide-react";

export function ReviewsManager({
  initialReviews,
}: {
  initialReviews: CustomerReview[];
}) {
  const [reviews, setReviews] = useState<CustomerReview[]>(initialReviews);
  const [statusFilter, setStatusFilter] = useState<"ALL" | ReviewStatus>("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleUpdateStatus = async (id: string, newStatus: ReviewStatus) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل تحديث حالة التقييم");

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      setToastMessage({
        type: "success",
        text: `تم تحديث حالة التقييم إلى "${newStatus === "APPROVED" ? "معتمد ومنشور" : newStatus === "REJECTED" ? "مرفوض" : "قيد المراجعة"}" بنجاح`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ";
      setToastMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا التقييم نهائياً؟")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل حذف التقييم");

      setReviews((prev) => prev.filter((r) => r.id !== id));
      setToastMessage({ type: "success", text: "تم حذف التقييم نهائياً بنجاح" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ";
      setToastMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter === "ALL") return true;
    return r.status === statusFilter;
  });

  const pendingCount = reviews.filter((r) => r.status === "PENDING").length;
  const approvedCount = reviews.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = reviews.filter((r) => r.status === "REJECTED").length;

  return (
    <div className="space-y-6 text-start">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-neutral-200 pb-5">
        <div>
          <span className="text-xs font-bold text-brand-gold-600 tracking-wider uppercase">
            مراجعة الرأي العام والجودة
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-900 tracking-tight mt-0.5">
            إدارة وتقييمات العملاء
          </h1>
          <p className="text-sm text-brand-neutral-500 mt-1">
            مراجعة تقييمات المزارعين وأصحاب الورش قبل نشرها للعامة، لضمان مصداقية البيانات وجودة المحتوى.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            <span>قيد المراجعة: {pendingCount}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>معتمد: {approvedCount}</span>
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            statusFilter === "ALL"
              ? "bg-brand-neutral-900 text-white shadow-xs"
              : "bg-white text-brand-neutral-600 border border-brand-neutral-200 hover:bg-brand-neutral-50"
          }`}
        >
          الكل ({reviews.length})
        </button>
        <button
          onClick={() => setStatusFilter("PENDING")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            statusFilter === "PENDING"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-white text-amber-800 border border-amber-200 hover:bg-amber-50"
          }`}
        >
          <span>قيد المراجعة</span>
          <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-md text-[11px] font-black">
            {pendingCount}
          </span>
        </button>
        <button
          onClick={() => setStatusFilter("APPROVED")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            statusFilter === "APPROVED"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50"
          }`}
        >
          المعتمدة والمنشورة ({approvedCount})
        </button>
        <button
          onClick={() => setStatusFilter("REJECTED")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            statusFilter === "REJECTED"
              ? "bg-rose-700 text-white shadow-xs"
              : "bg-white text-rose-800 border border-rose-200 hover:bg-rose-50"
          }`}
        >
          المرفوضة ({rejectedCount})
        </button>
      </div>

      {/* Reviews Cards List */}
      {filteredReviews.length === 0 ? (
        <div className="rounded-3xl border border-brand-neutral-200 bg-white p-12 text-center space-y-3">
          <Star className="h-10 w-10 text-brand-neutral-300 mx-auto" />
          <p className="text-base font-bold text-brand-neutral-700">لا توجد تقييمات مطابقة لهذا الفلتر</p>
          <p className="text-xs text-brand-neutral-400">أي تقييمات جديدة يسجلها العملاء ستظهر هنا لمراجعتها.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`rounded-2xl border p-5 sm:p-6 bg-white shadow-xs space-y-4 transition-all ${
                rev.status === "PENDING"
                  ? "border-amber-300 bg-amber-50/20"
                  : rev.status === "APPROVED"
                  ? "border-emerald-200"
                  : "border-rose-200 bg-rose-50/20 opacity-80"
              }`}
            >
              {/* Top Meta */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-brand-neutral-900 text-base">{rev.author}</h3>
                    {rev.status === "PENDING" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        قيد المراجعة
                      </span>
                    )}
                    {rev.status === "APPROVED" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        معتمد ومنشور
                      </span>
                    )}
                    {rev.status === "REJECTED" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                        مرفوض
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-brand-neutral-500 mt-1">
                    <span>{rev.role}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-brand-neutral-400" />
                      {rev.location}
                    </span>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-0.5 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < rev.rating
                          ? "text-amber-500 fill-amber-400"
                          : "text-brand-neutral-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Equipment Used tag */}
              {rev.equipmentUsed && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-neutral-100 text-brand-neutral-700 text-xs font-semibold">
                  <Wrench className="h-3 w-3 text-brand-neutral-500" />
                  <span>المعدة: {rev.equipmentUsed}</span>
                </div>
              )}

              {/* Comment text */}
              <p className="text-xs sm:text-sm text-brand-neutral-700 leading-relaxed bg-brand-neutral-50/70 p-3.5 rounded-xl border border-brand-neutral-100">
                &ldquo;{rev.comment}&rdquo;
              </p>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-brand-neutral-100 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-brand-neutral-400">{rev.date}</span>

                <div className="flex items-center gap-2">
                  {rev.status !== "APPROVED" && (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateStatus(rev.id, "APPROVED")}
                      disabled={isLoading}
                      className="bg-emerald-700 hover:bg-emerald-800 text-xs font-bold py-1 px-3"
                    >
                      <CheckCircle className="h-3.5 w-3.5 ms-1" />
                      اعتماد ونشر
                    </Button>
                  )}

                  {rev.status !== "REJECTED" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(rev.id, "REJECTED")}
                      disabled={isLoading}
                      className="text-rose-700 border-rose-200 hover:bg-rose-50 text-xs font-semibold py-1 px-3"
                    >
                      <XCircle className="h-3.5 w-3.5 ms-1" />
                      رفض
                    </Button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(rev.id)}
                    disabled={isLoading}
                    title="حذف نهائي"
                    className="p-1.5 text-brand-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
