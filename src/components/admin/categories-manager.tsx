"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Category, Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Toast } from "@/components/ui/toast";
import { Layers, Plus, Eye, Edit, Trash2, AlertTriangle } from "lucide-react";

interface CategoriesManagerProps {
  initialCategories: Category[];
  products: Product[];
}

export function CategoriesManager({ initialCategories, products }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleOpenAdd = () => {
    setFormName("");
    setFormDesc("");
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormDesc(cat.description || "");
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName.trim(), description: formDesc.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشلت الإضافة");

      setCategories([...categories, data.category]);
      setIsAddModalOpen(false);
      setToastMessage({ type: "success", text: "تمت إضافة القسم الزراعي بنجاح" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ";
      setToastMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !formName.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingCategory.id, name: formName.trim(), description: formDesc.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل التعديل");

      setCategories(categories.map((c) => (c.id === editingCategory.id ? data.category : c)));
      setEditingCategory(null);
      setToastMessage({ type: "success", text: "تم تحديث بيانات القسم بنجاح" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ";
      setToastMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/categories?id=${deletingCategory.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل الحذف");

      setCategories(categories.filter((c) => c.id !== deletingCategory.id));
      setDeletingCategory(null);
      setToastMessage({ type: "success", text: "تم حذف القسم بنجاح" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "تعذر الحذف";
      setToastMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
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
            هيكلة الكتالوج
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-900 tracking-tight mt-0.5">
            الأقسام والتصنيفات الزراعية ({categories.length})
          </h1>
        </div>

        <Button onClick={handleOpenAdd} variant="primary" size="sm" className="gap-2 font-bold shadow-sm">
          <Plus className="h-4 w-4" />
          إضافة قسم جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-sm space-y-4 text-start"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green-100 text-brand-green-800">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-brand-neutral-500 hover:text-blue-700 hover:bg-brand-neutral-100 rounded-lg transition-colors"
                    title="تعديل"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingCategory(cat)}
                    className="p-1.5 text-brand-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-brand-neutral-900">{cat.name}</h3>
                <p className="text-xs text-brand-neutral-500 font-mono mt-0.5">/products?category={cat.slug}</p>
                <p className="text-xs text-brand-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                  {cat.description || "لا يوجد وصف مدخل لهذا القسم."}
                </p>
              </div>

              <div className="pt-3 border-t border-brand-neutral-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-green-800 bg-brand-green-50 px-2.5 py-1 rounded-md">
                  {count} معدات مسجلة
                </span>
                <Link
                  href={`/products?category=${cat.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 font-bold text-brand-neutral-700 hover:text-brand-green-800"
                >
                  <Eye className="h-3.5 w-3.5" />
                  معاينة القسم
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isAddModalOpen || editingCategory !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? "تعديل بيانات القسم الزراعي" : "إضافة قسم زراعي جديد"}
      >
        <form onSubmit={editingCategory ? handleSubmitEdit : handleSubmitAdd} className="space-y-4">
          <Input
            label="اسم القسم"
            required
            placeholder="مثال: محركات الديزل الزراعية"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />

          <Textarea
            label="وصف القسم"
            rows={3}
            placeholder="وصف طبيعة المعدات المدرجة في هذا التصنيف..."
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
          />

          <div className="pt-4 flex justify-end gap-3 border-t border-brand-neutral-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingCategory(null);
              }}
            >
              إلغاء
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading} className="font-bold">
              {editingCategory ? "حفظ التعديلات" : "إضافة القسم"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deletingCategory !== null}
        onClose={() => setDeletingCategory(null)}
        title="تأكيد حذف القسم"
      >
        <div className="space-y-4 text-start">
          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
            <span>
              هل أنت متأكد من رغبتك في حذف قسم: <strong>{deletingCategory?.name}</strong>؟
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingCategory(null)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              size="sm"
              isLoading={isLoading}
              onClick={handleConfirmDelete}
              className="font-bold"
            >
              تأكيد الحذف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
