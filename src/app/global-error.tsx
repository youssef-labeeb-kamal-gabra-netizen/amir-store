"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="flex min-h-screen items-center justify-center p-4 bg-[#FAF7EE] text-[#1c1917] font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 p-8 text-center space-y-6 shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <AlertCircle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
              عذراً، حدث خطأ غير متوقع
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              نواجه مشكلة فنية مؤقتة في تحميل الصفحة. فريقنا يعمل على معالجة المشكلة، يرجى إعادة المحاولة.
            </p>
            {error?.digest && (
              <p className="text-[11px] font-mono text-neutral-400">
                رمز الخطأ: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1c1917] text-white hover:bg-neutral-800 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <RefreshCw className="h-4 w-4" />
              <span>إعادة المحاولة</span>
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <Home className="h-4 w-4" />
              <span>الرئيسية</span>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
