"use client";

import React, { useState } from "react";
import type { AppUser } from "@/lib/users-store";
import { Toast } from "@/components/ui/toast";
import { ShieldCheck, UserCheck, Search } from "lucide-react";

export function UsersManager({ initialUsers }: { initialUsers: AppUser[] }) {
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filteredUsers = users.filter((u) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  const handleRoleToggle = async (user: AppUser) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل تغيير الصلاحية");

      setUsers(users.map((u) => (u.id === user.id ? data.user : u)));
      setToastMessage({
        type: "success",
        text: `تم تغيير رتبة ${user.name} إلى ${newRole === "ADMIN" ? "مدير (ADMIN)" : "مستخدم عادي (USER)"}`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ";
      setToastMessage({ type: "error", text: msg });
    }
  };

  return (
    <div className="space-y-6 text-start">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-neutral-200 pb-5">
        <div>
          <span className="text-xs font-bold text-brand-green-700 tracking-wider uppercase">
            إدارة الهويات والصلاحيات
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-900 tracking-tight mt-0.5">
            المستخدمين والحسابات المسجلة ({users.length})
          </h1>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute start-3 top-3.5 h-4 w-4 text-brand-neutral-400" />
        <input
          type="text"
          placeholder="البحث بالاسم أو البريد الإلكتروني..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-brand-neutral-300 bg-white ps-9 pe-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-600"
        />
      </div>

      <div className="rounded-2xl border border-brand-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="bg-brand-neutral-50 border-b border-brand-neutral-200 text-xs font-bold text-brand-neutral-600">
              <tr>
                <th className="py-3.5 px-4 text-start">المستخدم</th>
                <th className="py-3.5 px-4 text-start">البريد الإلكتروني</th>
                <th className="py-3.5 px-4 text-start">الرتبة الحالية</th>
                <th className="py-3.5 px-4 text-start">تاريخ التسجيل</th>
                <th className="py-3.5 px-4 text-end">تغيير الصلاحية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-neutral-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-brand-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-brand-neutral-900 flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-brand-green-100 text-brand-green-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-brand-neutral-600">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        u.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : "bg-brand-green-100 text-brand-green-800"
                      }`}
                    >
                      {u.role === "ADMIN" ? (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5 text-purple-700" /> مدير (ADMIN)
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-3.5 w-3.5 text-brand-green-700" /> عميل (USER)
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-brand-neutral-500">
                    {new Date(u.createdAt).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="py-3.5 px-4 text-end">
                    <button
                      type="button"
                      onClick={() => handleRoleToggle(u)}
                      className="text-xs font-bold text-brand-green-700 hover:underline px-2 py-1 rounded"
                    >
                      {u.role === "ADMIN" ? "تخفيض إلى مستخدم" : "ترقية إلى مدير"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
