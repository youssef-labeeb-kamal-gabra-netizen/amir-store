import React from "react";
import { Activity } from "lucide-react";

export default function AdminAuditPage() {
  const auditEvents = [
    {
      id: "aud-1",
      userEmail: "admin@lkl-egypt.com",
      action: "ADMIN_LOGIN_SUCCESS",
      entity: "AUTH",
      details: "تسجيل دخول ناجح للوحة الإدارة عبر جلسة مشفرة",
      time: "منذ قليل",
    },
    {
      id: "aud-2",
      userEmail: "system",
      action: "CATALOG_INITIALIZED",
      entity: "PRODUCTS",
      details: "تهيئة الكتالوج الأساسي لـ 6 منتجات زراعية معتمدة",
      time: "اليوم",
    },
    {
      id: "aud-3",
      userEmail: "client",
      action: "CONTACT_REQUEST_SUBMITTED",
      entity: "INQUIRY",
      details: "استلام طلب استفسار جديد عن موتور رش زراعي عالي الضغط",
      time: "اليوم",
    },
  ];

  return (
    <div className="space-y-6 text-start">
      <div className="border-b border-brand-neutral-200 pb-5">
        <span className="text-xs font-bold text-brand-green-700 tracking-wider uppercase">
          سجل الأمان والعمليات
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-900 tracking-tight mt-0.5">
          سجل التدقيق والمتابعة (Audit Logs)
        </h1>
        <p className="text-sm text-brand-neutral-500 mt-1">
          تسجيل لكافة العمليات الحساسة وإجراءات المديرين لتأمين النظام وحماية البيانات.
        </p>
      </div>

      <div className="rounded-2xl border border-brand-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="divide-y divide-brand-neutral-100">
          {auditEvents.map((evt) => (
            <div key={evt.id} className="p-4 sm:p-5 flex items-start gap-4 hover:bg-brand-neutral-50/50">
              <div className="p-2 rounded-xl bg-brand-green-50 text-brand-green-700 shrink-0 mt-0.5">
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs font-mono font-bold text-brand-green-800">
                    {evt.action}
                  </span>
                  <span className="text-xs text-brand-neutral-400">{evt.time}</span>
                </div>
                <p className="text-sm font-semibold text-brand-neutral-900">{evt.details}</p>
                <span className="text-xs text-brand-neutral-500 block">
                  المستخدم: {evt.userEmail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
