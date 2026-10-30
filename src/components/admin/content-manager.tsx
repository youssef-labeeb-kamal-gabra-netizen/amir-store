"use client";

import React, { useState } from "react";
import type { ContentBlocks } from "@/lib/content-store";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { FileText, Save, Sparkles } from "lucide-react";

export function ContentManager({ initialContent }: { initialContent: ContentBlocks }) {
  const [content, setContent] = useState<ContentBlocks>(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل حفظ المحتوى");

      setContent(data.content);
      setToastMessage({ type: "success", text: "تم تحديث وحفظ نصوص ومحتوى الموقع بنجاح" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ";
      setToastMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-start max-w-4xl">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="border-b border-brand-neutral-200 pb-5">
        <span className="text-xs font-bold text-brand-green-700 tracking-wider uppercase">
          إدارة المحتوى المكتوب
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-900 tracking-tight mt-0.5">
          تعديل نصوص ورسائل المنصة
        </h1>
        <p className="text-sm text-brand-neutral-500 mt-1">
          إدارة نصوص قسم الهيرو، نبذة الشركة، وتفاصيل المقر دون الحاجة لتعديل الكود المصدري.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section Copy (Task 174) */}
        <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-brand-neutral-900 border-b border-brand-neutral-100 pb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-gold-600" />
            نصوص قسم الاستقبال (Hero Section)
          </h2>

          <Input
            label="الشعار العلوي المصغر (Tagline Badge)"
            value={content.heroTagline}
            onChange={(e) => setContent({ ...content, heroTagline: e.target.value })}
          />

          <Input
            label="العنوان الرئيسي الأول (Heading)"
            value={content.heroHeading}
            onChange={(e) => setContent({ ...content, heroHeading: e.target.value })}
          />

          <Textarea
            label="الفقرة التوضيحية الرئيسية (Description)"
            rows={3}
            value={content.heroDescription}
            onChange={(e) => setContent({ ...content, heroDescription: e.target.value })}
          />
        </div>

        {/* About Section Copy (Task 175) */}
        <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-brand-neutral-900 border-b border-brand-neutral-100 pb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-green-700" />
            نبذة عن الشركة ومقر العمل
          </h2>

          <Textarea
            label="نص التعريف والرسالة (About Text)"
            rows={4}
            value={content.aboutText}
            onChange={(e) => setContent({ ...content, aboutText: e.target.value })}
          />

          <Input
            label="صيغة العنوان المعتمدة للمقر"
            value={content.locationPhrase}
            onChange={(e) => setContent({ ...content, locationPhrase: e.target.value })}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="font-bold gap-2 px-8">
            <Save className="h-4 w-4" />
            حفظ كافة التغييرات
          </Button>
        </div>
      </form>
    </div>
  );
}
