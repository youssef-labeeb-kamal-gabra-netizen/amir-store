import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "./button";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "تعذر تحميل البيانات",
  description = "حدث خطأ أثناء محاولة جلب المعلومات. يرجى التحقق من الاتصال بالإنترنت والمحاولة مجدداً.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-red-500/30 bg-red-950/20 backdrop-blur-md p-8 text-center text-white",
        className
      )}
    >
      <div className="mb-4 rounded-full bg-red-500/20 p-4 text-red-400 border border-red-500/30 shadow-sm">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-red-200 font-arabic mb-1">{title}</h3>
      <p className="text-sm text-slate-300 max-w-sm mb-6 leading-relaxed">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="border-red-500/40 text-red-300 hover:bg-red-500/20">
          <RefreshCcw className="h-4 w-4 ms-2" />
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}
