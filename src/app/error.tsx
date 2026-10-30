"use client";

import React, { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, log to an internal monitoring endpoint without exposing stack traces to the user
    console.error("Runtime application error:", error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center">
      <ErrorState
        title="عذراً، حدث خطأ غير متوقع"
        description="نواجه مشكلة مؤقتة في معالجة طلبك. تم تسجيل الخطأ داخلياً وجاري المتابعة."
        onRetry={reset}
      />
      <div className="mt-6 flex justify-center">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-brand-neutral-700">
            <Home className="h-4 w-4" />
            العودة للصفحة الرئيسية
          </Button>
        </Link>
      </div>
    </div>
  );
}
