import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Home, LogIn } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-sm">
        <ShieldAlert className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-900">
          غير مصرح بالدخول (403)
        </h1>
        <p className="text-sm text-brand-neutral-600 leading-relaxed">
          هذا القسم مخصص لإدارة شركة لبيب كمال فقط. الحساب الحالي ليس لديه الصلاحيات الكافية للوصول للوحة التحكم.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
        <Link href="/">
          <Button variant="outline" size="md" className="w-full sm:w-auto gap-2">
            <Home className="h-4 w-4" />
            الرئيسية
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="primary" size="md" className="w-full sm:w-auto gap-2">
            <LogIn className="h-4 w-4" />
            تبديل الحساب
          </Button>
        </Link>
      </div>
    </div>
  );
}
