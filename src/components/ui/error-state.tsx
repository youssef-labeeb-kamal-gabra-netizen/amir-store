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
        "flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center",
        className
      )}
    >
      <div className="mb-4 rounded-full bg-red-100 p-4 text-red-600 shadow-sm">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-red-950 mb-1">{title}</h3>
      <p className="text-sm text-red-700 max-w-sm mb-6">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="bg-white border-red-300 text-red-700 hover:bg-red-50">
          <RefreshCcw className="h-4 w-4 ms-2" />
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}
