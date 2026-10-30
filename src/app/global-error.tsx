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
      <body className="flex min-h-screen items-center justify-center p-4 bg-[#08090C] text-[#F8F9FA] font-sans">
        <div className="max-w-md w-full bg-[#0D0F14] rounded-3xl border border-amber-400/20 p-8 text-center space-y-6 shadow-[0_16px_50px_rgba(0,0,0,0.8)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
            <AlertCircle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-arabic">
              عذراً، حدث خطأ غير متوقع
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              نواجه مشكلة فنية مؤقتة في معالجة طلبك. فريقنا يعمل على معالجة المشكلة، يرجى إعادة المحاولة.
            </p>
            {error?.digest && (
              <p className="text-[11px] font-mono text-slate-500">
                رمز الخطأ: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black text-xs font-black transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <RefreshCw className="h-4 w-4" />
              <span>إعادة المحاولة</span>
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-amber-400/40 hover:bg-amber-400/10 text-amber-300 text-xs font-bold transition-all active:scale-95 cursor-pointer"
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
