import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Home, LogIn } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6 text-white">
      <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-3xl bg-red-950/40 border border-red-500/30 text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.2)]">
        <ShieldAlert className="h-9 w-9" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-arabic">
          غير مصرح بالدخول (403)
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          هذا القسم مخصص لإدارة متجر أمير ستور فقط. الحساب الحالي ليس لديه الصلاحيات الكافية للوصول للوحة التحكم.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
        <Link href="/">
          <Button variant="outline" size="md" className="w-full sm:w-auto gap-2 font-bold">
            <Home className="h-4 w-4" />
            الرئيسية
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="primary" size="md" className="w-full sm:w-auto gap-2 font-black">
            <LogIn className="h-4 w-4" />
            تبديل الحساب
          </Button>
        </Link>
      </div>
    </div>
  );
}
