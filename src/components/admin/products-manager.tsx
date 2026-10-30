"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product, Category, ProductSpecification } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Toast } from "@/components/ui/toast";
import {
  Tractor,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  AlertTriangle,
} from "lucide-react";

interface ProductsManagerProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ProductsManager({ initialProducts, categories }: ProductsManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState(categories[0]?.id || "");
  const [formModel, setFormModel] = useState("");
  const [formBrand, setFormBrand] = useState("LKL Equipment");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formSpecs, setFormSpecs] = useState<ProductSpecification[]>([
    { label: "نوع الوقود", value: "" },
    { label: "معدل التدفق / الضغط", value: "" },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory && p.categoryId !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchModel = (p.model || "").toLowerCase().includes(q);
      if (!matchName && !matchModel) return false;
    }
    return true;
  });

  const resetForm = () => {
    setFormName("");
    setFormCategory(categories[0]?.id || "");
    setFormModel("");
    setFormBrand("LKL Equipment");
    setFormShortDesc("");
    setFormDesc("");
    setFormFeatured(false);
    setFormSpecs([
      { label: "نوع الوقود", value: "" },
      { label: "معدل التدفق / الضغط", value: "" },
    ]);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.categoryId);
    setFormModel(product.model || "");
    setFormBrand(product.brand || "LKL Equipment");
    setFormShortDesc(product.shortDescription);
    setFormDesc(product.description);
    setFormFeatured(Boolean(product.featured));
    setFormSpecs(product.specifications.length > 0 ? [...product.specifications] : [{ label: "", value: "" }]);
  };

  const handleAddSpecRow = () => {
    setFormSpecs([...formSpecs, { label: "", value: "" }]);
  };

  const handleRemoveSpecRow = (idx: number) => {
    setFormSpecs(formSpecs.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx: number, field: "label" | "value", val: string) => {
    const updated = [...formSpecs];
    updated[idx][field] = val;
    setFormSpecs(updated);
  };

  // Submit Add
  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setToastMessage({ type: "error", text: "يرجى كتابة اسم المعدة" });
      return;
    }

    const catObj = categories.find((c) => c.id === formCategory) || categories[0];
    const cleanedSpecs = formSpecs.filter((s) => s.label.trim() && s.value.trim());

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          categoryId: catObj.id,
          categoryName: catObj.name,
          model: formModel.trim() || undefined,
          brand: formBrand.trim(),
          shortDescription: formShortDesc.trim() || formName.trim(),
          description: formDesc.trim() || formName.trim(),
          specifications: cleanedSpecs,
          featured: formFeatured,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "حدث خطأ أثناء الإضافة");

      setProducts([data.product, ...products]);
      setIsAddModalOpen(false);
      resetForm();
      setToastMessage({ type: "success", text: "تمت إضافة المعدة بنجاح إلى الكتالوج" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشلت عملية الإضافة";
      setToastMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Edit
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !formName.trim()) return;

    const catObj = categories.find((c) => c.id === formCategory) || categories[0];
    const cleanedSpecs = formSpecs.filter((s) => s.label.trim() && s.value.trim());

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProduct.id,
          name: formName.trim(),
          categoryId: catObj.id,
          categoryName: catObj.name,
          model: formModel.trim() || undefined,
          brand: formBrand.trim(),
          shortDescription: formShortDesc.trim() || formName.trim(),
          description: formDesc.trim() || formName.trim(),
          specifications: cleanedSpecs,
          featured: formFeatured,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "حدث خطأ أثناء التحديث");

      setProducts(products.map((p) => (p.id === editingProduct.id ? data.product : p)));
      setEditingProduct(null);
      setToastMessage({ type: "success", text: "تم تحديث بيانات المعدة بنجاح" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشلت عملية التعديل";
      setToastMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Delete
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/products?id=${deletingProduct.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل الحذف");

      setProducts(products.filter((p) => p.id !== deletingProduct.id));
      setDeletingProduct(null);
      setToastMessage({ type: "success", text: "تم حذف المعدة من الكتالوج بنجاح" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "تعذر إتمام عملية الحذف";
      setToastMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Publish
  const handleTogglePublish = async (id: string) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(products.map((p) => (p.id === id ? data.product : p)));
        setToastMessage({
          type: "success",
          text: data.product.published ? "تم نشر المعدة للجمهور" : "تم تحويل المعدة لمسودة غير منشورة",
        });
      }
    } catch {
      setToastMessage({ type: "error", text: "تعذر تحديث حالة النشر" });
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

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-neutral-200 pb-5">
        <div>
          <span className="text-xs font-bold text-brand-green-700 tracking-wider uppercase">
            إدارة الكتالوج
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-900 tracking-tight mt-0.5">
            الآلات والمعدات الزراعية ({products.length})
          </h1>
        </div>

        <Button onClick={handleOpenAdd} variant="primary" size="sm" className="gap-2 font-bold shadow-sm">
          <Plus className="h-4 w-4" />
          إضافة معدة جديدة
        </Button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-3.5 h-4 w-4 text-brand-neutral-400" />
          <input
            type="text"
            placeholder="البحث باسم المعدّة أو كود الموديل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-brand-neutral-300 bg-white ps-9 pe-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-600"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-brand-neutral-300 bg-white px-3 py-2 text-sm text-brand-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-green-600"
        >
          <option value="">جميع الأقسام ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-brand-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="bg-brand-neutral-50 border-b border-brand-neutral-200 text-xs font-bold text-brand-neutral-600">
              <tr>
                <th className="py-3.5 px-4 text-start">اسم المعدة / المنتج</th>
                <th className="py-3.5 px-4 text-start">القسم</th>
                <th className="py-3.5 px-4 text-start">الموديل / الماركة</th>
                <th className="py-3.5 px-4 text-start">حالة النشر</th>
                <th className="py-3.5 px-4 text-start">مميز بالرئيسية</th>
                <th className="py-3.5 px-4 text-end">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-neutral-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-brand-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-brand-neutral-900">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-brand-green-50 text-brand-green-700 flex items-center justify-center shrink-0">
                        <Tractor className="h-4 w-4" />
                      </div>
                      <span className="line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-brand-neutral-600">
                    <span className="rounded-md bg-brand-neutral-100 px-2 py-0.5 text-xs font-semibold">
                      {product.categoryName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-brand-neutral-600">
                    {product.model || "—"} ({product.brand || "LKL"})
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(product.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold cursor-pointer transition-opacity hover:opacity-80 ${
                        product.published
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-brand-neutral-200 text-brand-neutral-700"
                      }`}
                    >
                      {product.published ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> منشور
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" /> مسودة
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    {product.featured ? (
                      <span className="text-xs font-bold text-brand-gold-700">★ مميز</span>
                    ) : (
                      <span className="text-xs text-brand-neutral-400">عادي</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-end">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="rounded-lg p-1.5 text-brand-neutral-500 hover:bg-brand-neutral-100 hover:text-brand-green-700 transition-colors"
                        title="معاينة بالموقع العام"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(product)}
                        className="rounded-lg p-1.5 text-brand-neutral-500 hover:bg-brand-neutral-100 hover:text-blue-700 transition-colors"
                        title="تعديل المعدة"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingProduct(product)}
                        className="rounded-lg p-1.5 text-brand-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="حذف المعدة"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isAddModalOpen || editingProduct !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? "تعديل بيانات المعدّة الزراعية" : "إضافة معدّة زراعية جديدة للكتالوج"}
      >
        <form onSubmit={editingProduct ? handleSubmitEdit : handleSubmitAdd} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          <Input
            label="اسم المعدة بالكامل"
            required
            placeholder="مثال: موتور رش زراعي 450 بار"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-neutral-800 mb-1.5">
                القسم الزراعي <span className="text-red-500">*</span>
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full rounded-lg border border-brand-neutral-300 bg-white px-3 py-2 text-sm text-brand-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-green-600"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="كود الموديل (Model)"
              placeholder="مثال: SP-450"
              value={formModel}
              onChange={(e) => setFormModel(e.target.value)}
            />
          </div>

          <Input
            label="الماركة أو العلامة التجارية"
            placeholder="LKL Equipment"
            value={formBrand}
            onChange={(e) => setFormBrand(e.target.value)}
          />

          <Input
            label="الوصف المختصر"
            placeholder="موتور رش عالي الضغط مخصص للمزارع..."
            value={formShortDesc}
            onChange={(e) => setFormShortDesc(e.target.value)}
          />

          <Textarea
            label="الوصف المفصل"
            rows={3}
            placeholder="اكتب شرحاً وافياً عن طبيعة عمل المعدة واستخداماتها الميدانية..."
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
          />

          {/* Specifications Builder */}
          <div className="space-y-2 border-t border-brand-neutral-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-neutral-700">
                المواصفات والبيانات الفنية
              </span>
              <button
                type="button"
                onClick={handleAddSpecRow}
                className="text-xs font-bold text-brand-green-700 hover:underline"
              >
                + إضافة مواصفة
              </button>
            </div>

            {formSpecs.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="البند (مثال: نوع الوقود)"
                  value={spec.label}
                  onChange={(e) => handleSpecChange(idx, "label", e.target.value)}
                  className="flex-1 rounded-lg border border-brand-neutral-300 p-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="القيمة (مثال: بنزين رباعي الأشواط)"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                  className="flex-1 rounded-lg border border-brand-neutral-300 p-2 text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpecRow(idx)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="formFeatured"
              checked={formFeatured}
              onChange={(e) => setFormFeatured(e.target.checked)}
              className="h-4 w-4 rounded text-brand-green-600 focus:ring-brand-green-500"
            />
            <label htmlFor="formFeatured" className="text-sm font-semibold text-brand-neutral-800">
              تمييز هذه المعدة في الصفحة الرئيسية
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-brand-neutral-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingProduct(null);
              }}
            >
              إلغاء
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading} className="font-bold">
              {editingProduct ? "حفظ التعديلات" : "إضافة للكتالوج"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal (Task 127) */}
      <Modal
        isOpen={deletingProduct !== null}
        onClose={() => setDeletingProduct(null)}
        title="تأكيد حذف المعدّة"
      >
        <div className="space-y-4 text-start">
          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
            <span>
              هل أنت متأكد من رغبتك في حذف: <strong>{deletingProduct?.name}</strong>؟ هذا الإجراء لا يمكن التراجع عنه.
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingProduct(null)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              size="sm"
              isLoading={isLoading}
              onClick={handleConfirmDelete}
              className="font-bold"
            >
              تأكيد الحذف نهائياً
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
