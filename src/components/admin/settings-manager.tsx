"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { ShieldCheck, Phone, Save } from "lucide-react";
import { env } from "@/lib/env";
import type { BusinessSettings } from "@/types/settings";

export function SettingsManager({ initialSettings }: { initialSettings: BusinessSettings }) {
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل حفظ الإعدادات");

      setSettings(data.settings);
      setToastMessage({ type: "success", text: "تم تحديث وحفظ بيانات التواصل والإعدادات بنجاح" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ";
      setToastMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-start max-w-3xl">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.text}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="border-b border-brand-neutral-200 pb-5">
        <span className="text-xs font-bold text-brand-green-700 tracking-wider uppercase">
          بيانات المنصة المركزية
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-900 tracking-tight mt-0.5">
          إعدادات وهوية شركة لبيب كمال
        </h1>
        <p className="text-sm text-brand-neutral-500 mt-1">
          إدارة أرقام التواصل الفوري، واتساب، ومواعيد العمل، والعنوان المعتمد الذي ينعكس مباشرة في الترويسة، التذييل، وصفحة تواصل معنا.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-brand-neutral-900 border-b border-brand-neutral-100 pb-3 flex items-center gap-2">
            <Phone className="h-5 w-5 text-brand-green-700" />
            أرقام وقنوات التواصل الرسمية
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="رقم الهاتف الأساسي"
              placeholder="01220792948"
              value={settings.phone || ""}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            />

            <Input
              label="رقم الهاتف الإضافي (الثاني)"
              placeholder="01114587917"
              value={settings.secondaryPhone || ""}
              onChange={(e) => setSettings({ ...settings, secondaryPhone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="رقم الواتساب (للاستفسارات المباشرة)"
              placeholder="01220792948"
              value={settings.whatsapp || ""}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
            />

            <Input
              label="مواعيد العمل الرسمية"
              placeholder="يومياً من 8:00 صباحاً حتى 9:00 مساءً"
              value={settings.workingHours || ""}
              onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
            />
          </div>

          <div className="pt-2 border-t border-brand-neutral-100 space-y-4">
            <Input
              label="صيغة عنوان المقر (Address Phrase)"
              placeholder="طريق بنها - الزقازيق (طريق مصر الزراعي)، قرية الجديدة، مركز منيا القمح"
              value={settings.addressPhrase || ""}
              onChange={(e) => setSettings({ ...settings, addressPhrase: e.target.value })}
            />

            <Input
              label="رابط الموقع على خرائط Google"
              placeholder="https://www.google.com/maps/..."
              value={settings.googleMapsUrl || ""}
              onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
            />

            <Input
              label="شعار المؤسسة (Slogan)"
              placeholder="الجودة • الثقة • الخدمة المتميزة"
              value={settings.slogan || ""}
              onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-brand-neutral-100">
            <Input
              label="رابط صفحة فيسبوك"
              placeholder="https://facebook.com/..."
              value={settings.facebook || ""}
              onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
            />

            <Input
              label="رابط قناة يوتيوب (اختياري)"
              placeholder="https://youtube.com/..."
              value={settings.youtube || ""}
              onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
            />
          </div>
        </div>

        {/* Permissions info */}
        <div className="rounded-2xl border border-brand-neutral-200 bg-white p-6 sm:p-8 space-y-3 shadow-sm">
          <h2 className="text-base font-bold text-brand-neutral-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-green-700" />
            صلاحيات إدارة النظام
          </h2>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 font-mono text-xs">
            {env.auth.adminEmails.length > 0
              ? env.auth.adminEmails.join(", ")
              : "yousseflabeeb256@gmail.com"}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="font-bold gap-2 px-8">
            <Save className="h-4 w-4" />
            حفظ الإعدادات
          </Button>
        </div>
      </form>
    </div>
  );
}
