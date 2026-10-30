"use client";

import React, { useState } from "react";
import type { ContactRequest, ContactRequestStatus } from "@/lib/contact-requests";
import { Inbox, Phone, MessageSquare, Calendar, Loader2, Trash2 } from "lucide-react";

interface ContactRequestsManagerProps {
  initialRequests: ContactRequest[];
}

const STATUS_LABELS: Record<ContactRequestStatus, { label: string; badgeClass: string }> = {
  NEW: { label: "جديد (لم يتم الرد)", badgeClass: "bg-amber-100 text-amber-800 border-amber-200" },
  CONTACTED: { label: "تم التواصل", badgeClass: "bg-blue-100 text-blue-800 border-blue-200" },
  IN_PROGRESS: { label: "محتاج متابعة", badgeClass: "bg-purple-100 text-purple-800 border-purple-200" },
  RESOLVED: { label: "منتهي ومحسوم", badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  ARCHIVED: { label: "مؤرشف", badgeClass: "bg-neutral-100 text-neutral-600 border-neutral-200" },
};

export function ContactRequestsManager({ initialRequests }: ContactRequestsManagerProps) {
  const [requests, setRequests] = useState<ContactRequest[]>(initialRequests);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  const handleStatusChange = async (id: string, newStatus: ContactRequestStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/contact-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.ok && data.request) {
        setRequests((prev) => prev.map((r) => (r.id === id ? data.request : r)));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الاستفسار نهائياً؟")) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/contact-requests?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete request:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = requests.filter((r) => {
    if (filter === "ALL") return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-brand-neutral-200">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === "ALL" ? "bg-brand-green-800 text-white" : "text-brand-neutral-600 hover:bg-brand-neutral-100"
          }`}
        >
          الكل ({requests.length})
        </button>
        {(["NEW", "CONTACTED", "IN_PROGRESS", "RESOLVED"] as ContactRequestStatus[]).map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === st ? "bg-brand-green-800 text-white" : "text-brand-neutral-600 hover:bg-brand-neutral-100"
            }`}
          >
            {STATUS_LABELS[st].label} ({requests.filter((r) => r.status === st).length})
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-brand-neutral-200">
            <Inbox className="h-10 w-10 text-brand-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-brand-neutral-700">لا توجد طلبات في هذا القسم حالياً</p>
          </div>
        ) : (
          filtered.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl border border-brand-neutral-200 bg-white p-5 sm:p-6 shadow-xs space-y-4 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-neutral-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                    <Inbox className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-brand-neutral-900">{req.name}</h3>
                    <span className="text-xs text-brand-neutral-500">
                      {req.email ? `البريد: ${req.email}` : "بدون بريد إلكتروني"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold border ${
                      STATUS_LABELS[req.status]?.badgeClass || "bg-neutral-100"
                    }`}
                  >
                    {STATUS_LABELS[req.status]?.label || req.status}
                  </span>
                  <span className="text-xs text-brand-neutral-400 flex items-center gap-1 font-mono">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(req.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                </div>
              </div>

              {/* Message Details */}
              <div className="bg-brand-neutral-50/80 p-4 rounded-xl border border-brand-neutral-100 space-y-1.5 text-sm">
                <span className="text-xs font-bold text-brand-neutral-600 block">تفاصيل استفسار العميل:</span>
                <p className="text-brand-neutral-800 leading-relaxed text-sm whitespace-pre-wrap">{req.message}</p>
                {req.product && (
                  <div className="pt-2 text-xs font-semibold text-brand-green-800">
                    الاستفسار بخصوص معدة: <span className="font-mono bg-emerald-50 px-2 py-0.5 rounded">{req.product}</span>
                  </div>
                )}
              </div>

              {/* Status Update Actions & Contacts */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
                {/* Contact Shortcuts */}
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`tel:${req.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-brand-neutral-300 bg-white px-3.5 py-2 text-xs font-bold text-brand-neutral-800 hover:bg-brand-neutral-50 active:scale-95 transition-all"
                  >
                    <Phone className="h-3.5 w-3.5 text-brand-green-700" />
                    <span dir="ltr">{req.phone}</span>
                  </a>

                  <a
                    href={`https://wa.me/${req.phone.replace(/[^0-9]/g, "").startsWith("0") ? `2${req.phone.replace(/[^0-9]/g, "")}` : req.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`أهلاً بك أ/ ${req.name}، بخصوص استفسارك لدى شركة لبيب كمال للآلات الزراعية:`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 transition-all px-3.5 py-2 text-xs font-bold text-white shadow-xs"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>مراسلة واتساب</span>
                  </a>

                  <button
                    onClick={() => handleDelete(req.id)}
                    disabled={updatingId === req.id}
                    className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors"
                    title="حذف الطلب"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Change Status Dropdown / Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-brand-neutral-500 font-bold shrink-0">تغيير الحالة:</span>
                  <select
                    value={req.status}
                    disabled={updatingId === req.id}
                    onChange={(e) => handleStatusChange(req.id, e.target.value as ContactRequestStatus)}
                    className="text-xs font-bold rounded-xl border border-brand-neutral-300 bg-white px-3 py-1.5 text-brand-neutral-800 focus:border-brand-green-700 focus:outline-hidden"
                  >
                    <option value="NEW">جديد (لم يتم الرد)</option>
                    <option value="CONTACTED">تم التواصل</option>
                    <option value="IN_PROGRESS">محتاج متابعة</option>
                    <option value="RESOLVED">منتهي ومحسوم</option>
                    <option value="ARCHIVED">أرشفة</option>
                  </select>
                  {updatingId === req.id && <Loader2 className="h-4 w-4 text-emerald-700 animate-spin" />}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
