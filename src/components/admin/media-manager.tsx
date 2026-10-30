"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";
import { Upload, Copy, Check, Trash2 } from "lucide-react";

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  alt: string;
  size: string;
  date: string;
  isCustomUpload?: boolean;
}

export function MediaManager({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [altText, setAltText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setToastMessage({ type: "error", text: "يرجى تحديد ملف صورة للرفع" });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("altText", altText.trim() || selectedFile.name);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل رفع الصورة");

      setMediaList([data.media, ...mediaList]);
      setSelectedFile(null);
      setAltText("");
      setToastMessage({ type: "success", text: "تم رفع وحفظ الصورة بنجاح في مجلد السيرفر وتجهيزها للاستخدام" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء الرفع";
      setToastMessage({ type: "error", text: msg });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!window.confirm(`هل أنت متأكد من حذف الصورة "${item.name}"؟`)) return;

    try {
      const res = await fetch(`/api/admin/media?name=${encodeURIComponent(item.name)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "تعذر حذف الصورة");

      setMediaList(mediaList.filter((m) => m.id !== item.id));
      setToastMessage({ type: "success", text: "تم حذف الصورة نهائياً من السيرفر" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء الحذف";
      setToastMessage({ type: "error", text: msg });
    }
  };

  const copyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8 text-start">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="border-b border-brand-neutral-200 pb-5">
        <span className="text-xs font-bold text-brand-green-700 tracking-wider uppercase">
          إدارة الأصول الرقمية وصور المعدات
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-900 tracking-tight mt-0.5">
          مكتبة وسائط وصور المعدات ({mediaList.length})
        </h1>
        <p className="text-sm text-brand-neutral-500 mt-1">
          رفع وحفظ صور المعدات فعلياً على الخادم مع فحص الامتدادات وحجم الملفات ونسخ روابطها لاستخدامها في الكتالوج.
        </p>
      </div>

      {/* Upload Box */}
      <form onSubmit={handleUpload} className="rounded-2xl border border-brand-neutral-200 bg-white p-6 shadow-sm space-y-4 max-w-xl">
        <h3 className="text-base font-bold text-brand-neutral-900 flex items-center gap-2">
          <Upload className="h-5 w-5 text-brand-green-700" />
          رفع صورة معدة زراعية جديدة
        </h3>

        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-semibold text-brand-neutral-700 mb-1">
              اختر ملف الصورة (JPG, PNG, WEBP — بحد أقصى 5MB)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-brand-neutral-500 file:ms-0 file:me-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-green-50 file:text-brand-green-800 hover:file:bg-brand-green-100 cursor-pointer border border-brand-neutral-200 rounded-xl p-1"
            />
          </div>

          <Input
            label="النص البديل (Alt Text) لوصف المعدة بمحركات البحث"
            placeholder="مثال: صورة تفصيلية لموتور رش زراعي 450 بار"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />

          <Button type="submit" variant="primary" size="sm" isLoading={isUploading} className="font-bold gap-2">
            <Upload className="h-4 w-4" />
            بدء فحص ورفع الصورة
          </Button>
        </div>
      </form>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaList.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-brand-neutral-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            {/* Real Image Preview */}
            <div className="relative aspect-[4/3] bg-brand-neutral-100 overflow-hidden border-b border-brand-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.url}
                alt={m.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback if image path error
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <div className="absolute top-2 end-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                {m.size}
              </div>
            </div>

            <div className="p-3 text-xs space-y-1.5">
              <p className="text-brand-neutral-800 font-bold truncate" title={m.name}>
                {m.name}
              </p>
              <p className="text-brand-neutral-500 line-clamp-1">{m.alt}</p>
              
              <div className="flex items-center gap-1 pt-1">
                <input
                  type="text"
                  readOnly
                  value={m.url}
                  className="text-[11px] font-mono bg-brand-neutral-50 border border-brand-neutral-200 rounded-lg px-2 py-1 w-full text-brand-neutral-600 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => copyUrl(m)}
                  className="p-1.5 rounded-lg border border-brand-neutral-200 hover:bg-brand-neutral-100 text-brand-neutral-700 shrink-0"
                  title="نسخ مسار الصورة"
                >
                  {copiedId === m.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-2.5 bg-brand-neutral-50 border-t border-brand-neutral-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-brand-neutral-400 font-mono">{m.date}</span>
              {m.isCustomUpload ? (
                <button
                  type="button"
                  onClick={() => handleDelete(m)}
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-bold p-1 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>حذف الملف</span>
                </button>
              ) : (
                <span className="text-[10px] bg-brand-neutral-200/70 text-brand-neutral-600 px-2 py-0.5 rounded font-semibold">
                  صورة أصلية
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
